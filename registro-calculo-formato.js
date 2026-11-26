/* Ventana de captura y cálculo de bordo y espaciamiento.
   Fórmulas y parámetros según Plantilla_diseno_voladura.xlsx (Manual de Konya).
   No modifica los parámetros ni el JSON del diseño principal. */
(() => {
    'use strict';

    // ============================================================
    // 1. PARÁMETROS (hoja Parámetros del Excel)
    // ============================================================
    const P = {
        // Burden: B = kB × De × (Dee/Der)^n, con De en pulgadas
        kB: 3.15, n: 1/3,
        // Interpretación del resultado: 'ft' (Konya original) o 'm' (directo)
        unitMode: 'ft', ftToM: 0.3048,
        // Kr (corrección por número de filas)
        rowThreshold: 5, krBelow: 1.0, krAtOrAbove: 0.9,
        // Rigidez HB/B
        rigidityLimit: 4, rigidityMin: 1,
        // Espaciamiento
        instShortCoefB: 2, instShortDiv: 3,
        instLongFactor: 2,
        retShortCoefB: 7, retShortDiv: 8,
        retLongFactor: 1.4,
        // Sobre-perforación
        spFactor: 0.3,
        // Taco
        stemCompMin: 0.7, stemCompMax: 1.6, stemIncomp: 1.0,
        // Alertas de retardos
        ttMin: 8.5, ttMax: 16.5, tHUSBM: 8
    };

    const KD_MAP = { profundidad: 1.18, cara: 0.95, otros: 1.0 };
    const KS_MAP = { fracturada: 1.3, cementada: 1.1, masiva: 0.95 };
    const TH_MAP = { arenas: 6.5, calizas_esquistos: 5.5, calizas_compactas: 4.5, feldespatos: 3.5 };
    const TT_MAP = { violencia: 6.5, pila_alta: 8, pila_promedio: 11.5, pila_dispersa: 16.5 };

    const LISTS = {
        depositKey: [
            { value: 'profundidad', label: 'Estratificación en la profundidad del corte' },
            { value: 'cara', label: 'Estratificación en la cara del corte' },
            { value: 'otros', label: 'Otros casos de depositación' }
        ],
        structureKey: [
            { value: 'fracturada', label: 'Roca muy fracturada, cementación débil' },
            { value: 'cementada', label: 'Capas bien unidas y cementadas' },
            { value: 'masiva', label: 'Depósito masivo' }
        ],
        rockTypeKey: [
            { value: 'arenas', label: 'Arenas, margas, carbón' },
            { value: 'calizas_esquistos', label: 'Algunas calizas, esquistos' },
            { value: 'calizas_compactas', label: 'Calizas compactas, mármoles, granitos/basaltos, cuarcita, gneis' },
            { value: 'feldespatos', label: 'Feldespatos porfídicos, gneis compactos, mica, magnetitas' }
        ],
        initiationKey: [
            { value: 'instantanea', label: 'Instantánea' },
            { value: 'retardada', label: 'Retardada' }
        ],
        stemmingKey: [
            { value: 'competente', label: 'Competente (T = 0.7 a 1.6 × B)' },
            { value: 'incompetente', label: 'Incompetente (T = B)' }
        ],
        pileKey: [
            { value: 'violencia', label: 'Violencia, sobrepresión, rompimiento trasero' },
            { value: 'pila_alta', label: 'Pila alta cercana a la cara' },
            { value: 'pila_promedio', label: 'Pila promedio' },
            { value: 'pila_dispersa', label: 'Pila dispersa, rompimiento trasero mínimo' }
        ]
    };

    // ============================================================
    // 2. MOTOR DE CÁLCULO
    // ============================================================
    function isComplete(c) {
        return Number.isFinite(c.diameter) && c.diameter > 0
            && Number.isFinite(c.explosiveDensity) && c.explosiveDensity > 0
            && Number.isFinite(c.rockDensity) && c.rockDensity > 0
            && Number.isFinite(c.height) && c.height > 0
            && Number.isInteger(c.rows) && c.rows >= 1
            && KD_MAP[c.depositKey] !== undefined
            && KS_MAP[c.structureKey] !== undefined
            && TH_MAP[c.rockTypeKey] !== undefined
            && (c.initiationKey === 'instantanea' || c.initiationKey === 'retardada')
            && (c.stemmingKey === 'competente' || c.stemmingKey === 'incompetente')
            && TT_MAP[c.pileKey] !== undefined;
    }

    function computeCase(c) {
        if (!isComplete(c)) return null;
        const De_in = c.diameter / 25.4;
        const B_ft = P.kB * De_in * Math.pow(c.explosiveDensity / c.rockDensity, P.n);
        const B_calc = P.unitMode === 'ft' ? B_ft * P.ftToM : B_ft;

        const Kr = c.rows >= P.rowThreshold ? P.krAtOrAbove : P.krBelow;
        const Kd = KD_MAP[c.depositKey];
        const Ks = KS_MAP[c.structureKey];
        const B_corr = B_calc * Kr * Kd * Ks;
        const B = (Number.isFinite(c.adoptedBurden) && c.adoptedBurden > 0) ? c.adoptedBurden : B_corr;

        const rigidity = c.height / B;
        const bancoLargo = rigidity >= P.rigidityLimit;

        let E;
        if (c.initiationKey === 'instantanea') {
            E = bancoLargo ? P.instLongFactor * B : (c.height + P.instShortCoefB * B) / P.instShortDiv;
        } else {
            E = bancoLargo ? P.retLongFactor * B : (c.height + P.retShortCoefB * B) / P.retShortDiv;
        }

        const SP = P.spFactor * B;
        const competent = c.stemmingKey === 'competente';
        const T_min = (competent ? P.stemCompMin : P.stemIncomp) * B;
        const T_max = (competent ? P.stemCompMax : P.stemIncomp) * B;
        let T = null;
        if (competent) {
            if (Number.isFinite(c.stemmingFactor) && c.stemmingFactor > 0) T = c.stemmingFactor * B;
        } else {
            T = P.stemIncomp * B;
        }

        const TH = TH_MAP[c.rockTypeKey];
        const tH = c.initiationKey === 'instantanea' ? null : TH * E;
        const Tt = TT_MAP[c.pileKey];
        const Tr = Tt * B;

        const alerts = [];
        if (rigidity < P.rigidityMin) alerts.push('HB/B < 1: fuera del rango de la fuente.');
        if (Tt < P.ttMin) alerts.push(`Tt = ${Tt} ms/m bajo el mínimo del texto (${P.ttMin}).`);
        if (Tt > P.ttMax) alerts.push(`Tt = ${Tt} ms/m sobre el máximo normal (${P.ttMax}).`);
        if (tH !== null && tH < P.tHUSBM) alerts.push(`tH = ${tH.toFixed(1)} ms menor a ${P.tHUSBM} ms (referencia USBM).`);
        if (competent && (!Number.isFinite(c.stemmingFactor) || c.stemmingFactor < P.stemCompMin || c.stemmingFactor > P.stemCompMax)) {
            alerts.push(`Factor de taco fuera del rango ${P.stemCompMin}–${P.stemCompMax}.`);
        }

        return { B_calc, B_corr, B, Kr, Kd, Ks, rigidity, bancoLargo, E, SP, T_min, T_max, T, TH, tH, Tt, Tr, alerts };
    }

    // ============================================================
    // 3. ESQUEMA Y CLAVES
    // ============================================================
    const SCHEMA = 'minecad-captura/2';
    const STORAGE_KEY = 'minecad-captura-bordo-v2';
    const LEGACY_KEY = 'minecad-captura-bordo-v1';
    const LEGACY_SCHEMA = 'minecad-captura/1';

    const NUMERIC_KEYS = ['diameter', 'explosiveDensity', 'rockDensity', 'height', 'rows', 'stemmingFactor', 'adoptedBurden'];
    const ENUM_KEYS = Object.keys(LISTS);
    const CASE_KEYS = ['id', ...NUMERIC_KEYS, ...ENUM_KEYS];

    // ============================================================
    // 4. CAMPOS DEL FORMULARIO
    // ============================================================
    const fields = [
        { key: 'diameter',           label: 'Diámetro del barreno',             unit: 'mm',    type: 'number' },
        { key: 'explosiveDensity',   label: 'Densidad del explosivo',           unit: 'g/cm³', type: 'number' },
        { key: 'rockDensity',        label: 'Densidad de la roca',              unit: 'g/cm³', type: 'number' },
        { key: 'height',             label: 'Altura de banco',                  unit: 'm',     type: 'number' },
        { key: 'rows',               label: 'Número de filas',                  unit: 'filas', type: 'number', step: '1' },
        { key: 'depositKey',         label: 'Depositación de la roca (Kd)',     unit: '—',     type: 'select', list: 'depositKey' },
        { key: 'structureKey',       label: 'Estructura geológica (Ks)',        unit: '—',     type: 'select', list: 'structureKey' },
        { key: 'rockTypeKey',        label: 'Tipo de roca (TH)',                unit: 'ms/m',  type: 'select', list: 'rockTypeKey' },
        { key: 'initiationKey',      label: 'Iniciación en la fila',            unit: '—',     type: 'select', list: 'initiationKey' },
        { key: 'stemmingKey',        label: 'Material para el taco',            unit: '—',     type: 'select', list: 'stemmingKey' },
        { key: 'stemmingFactor',     label: 'Factor de taco (solo competente)', unit: 'x B',   type: 'number' },
        { key: 'pileKey',            label: 'Condición de pila (Tt)',           unit: 'ms/m',  type: 'select', list: 'pileKey' },
        { key: 'adoptedBurden',      label: 'Bordo adoptado (opcional)',        unit: 'm',     type: 'number' }
    ];

    // ============================================================
    // 5. CONSTRUCCIÓN DEL DIÁLOGO
    // ============================================================
    const dialog = document.createElement('dialog');
    dialog.id = 'spacing-capture-dialog';
    dialog.setAttribute('aria-labelledby', 'spacing-capture-title');
    dialog.setAttribute('aria-describedby', 'spacing-capture-description');

    const inputHTML = (field, n) => {
        const name = `case${n}.${field.key}`;
        const label = `${field.label}, caso ${n}`;
        if (field.type === 'select') {
            return `<select name="${name}" aria-label="${label}" aria-describedby="sc-validation-message" autocomplete="off">`
                + `<option value="">—</option>`
                + LISTS[field.list].map(o => `<option value="${o.value}">${o.label}</option>`).join('')
                + `</select>`;
        }
        return `<input type="number" min="0" step="${field.step || 'any'}" inputmode="decimal"`
            + ` name="${name}" aria-label="${label}" aria-describedby="sc-validation-message"`
            + ` autocomplete="off" placeholder="—">`;
    };

    dialog.innerHTML = `
        <form id="spacing-capture-form" method="dialog">
            <header class="sc-header">
                <div>
                    <span class="sc-kicker">MINECAD · CAPTURA Y CÁLCULO</span>
                    <h2 id="spacing-capture-title">Calcular bordo y espaciamiento</h2>
                </div>
                <button type="button" class="sc-close" aria-label="Cerrar ventana">×</button>
            </header>
            <div class="sc-body">
                <p id="spacing-capture-description">Compara hasta tres casos con las fórmulas del Manual de Konya (plantilla Excel). La captura se guarda en este navegador, de forma independiente al proyecto.</p>
                <p class="sc-notice">Los resultados son de apoyo al cálculo y estudio. No modifican los valores del diseño principal. Revísalos antes de usarlos.</p>
                <div class="sc-actions">
                    <button type="button" class="sc-prefill">Precargar Caso 1</button>
                    <button type="button" class="sc-export">Exportar captura</button>
                    <button type="button" class="sc-import">Importar captura</button>
                    <input class="sc-file" type="file" accept=".json,application/json" aria-label="Archivo de captura JSON" hidden>
                </div>
                <p class="sc-caption">La precarga copia solo el diámetro y la altura en campos vacíos del Caso 1.</p>
                <div class="sc-validation" role="alert" hidden></div>
                <section aria-labelledby="sc-inputs-title">
                    <h3 id="sc-inputs-title">A. Datos de entrada</h3>
                    <div class="sc-table-wrap" tabindex="0" role="region" aria-label="Tabla de captura de tres casos, desplazable horizontalmente">
                        <table class="sc-table">
                            <thead><tr><th scope="col">Concepto</th><th scope="col">Unidad</th>${[1,2,3].map(n=>`<th scope="col">Caso ${n}</th>`).join('')}</tr></thead>
                            <tbody>${fields.map(f => `<tr><th scope="row">${f.label}</th><td class="sc-unit">${f.unit}</td>${[1,2,3].map(n=>`<td>${inputHTML(f,n)}</td>`).join('')}</tr>`).join('')}</tbody>
                        </table>
                    </div>
                    <p class="sc-caption">Diámetro en milímetros. La fórmula de Konya usa pulgadas: la conversión es interna. Se requieren 11 datos por caso para calcular.</p>
                </section>
                <section aria-labelledby="sc-results-title">
                    <h3 id="sc-results-title">B. Bordo y espaciamiento</h3>
                    <div class="sc-results">${[1,2,3].map(n=>`<article class="sc-result-case" data-case="${n}"><h4>Caso ${n}</h4><p class="sc-incomplete">Captura los 11 datos requeridos para calcular.</p></article>`).join('')}</div>
                </section>
                <label class="sc-notes">Observaciones<textarea name="observations" rows="2" maxlength="2000" placeholder="Notas sobre los casos capturados"></textarea></label>
            </div>
            <footer class="sc-footer">
                <button type="reset">Limpiar campos</button>
                <span class="sc-status" role="status" aria-live="polite"></span>
                <button type="button" class="sc-done">Cerrar</button>
            </footer>
        </form>`;
    document.body.append(dialog);

    const form = dialog.querySelector('form');
    const status = dialog.querySelector('.sc-status');
    const validation = dialog.querySelector('.sc-validation');
    validation.id = 'sc-validation-message';

    let firstOpen = true, hasSavedCapture = false;
    const control = (id, key) => form.elements.namedItem(`case${id}.${key}`);

    function report(messages) {
        validation.hidden = messages.length === 0;
        validation.textContent = messages.join(' ');
    }

    // ============================================================
    // 6. LEER / VALIDAR / MIGRAR
    // ============================================================
    function readCapture() {
        const messages = [];
        const cases = [1, 2, 3].map(id => {
            const record = { id };
            for (const field of fields) {
                const el = control(id, field.key);
                let invalid = false;
                if (field.type === 'select') {
                    const v = el.value || null;
                    if (v !== null && !LISTS[field.list].some(o => o.value === v)) invalid = true;
                    record[field.key] = v;
                } else {
                    const raw = el.value.trim();
                    const value = raw === '' ? null : Number(raw);
                    invalid = el.validity.badInput
                        || (value !== null && (!Number.isFinite(value) || value < 0 || (field.key === 'rows' && !Number.isInteger(value))));
                    record[field.key] = value;
                }
                if (invalid) {
                    el.setAttribute('aria-invalid', 'true');
                    messages.push(`${field.label}, Caso ${id}: valor inválido.`);
                } else el.removeAttribute('aria-invalid');
            }
            return record;
        });
        const observations = form.elements.namedItem('observations').value;
        if (observations.length > 2000) messages.push('Observaciones: máximo 2000 caracteres.');
        return { capture: { schema: SCHEMA, cases, observations }, messages };
    }

    function validateV2(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('El archivo no es una captura compatible.');
        if (value.schema !== SCHEMA) throw Error(`Esquema no compatible: se esperaba ${SCHEMA}.`);
        if (Object.keys(value).some(k => !['schema', 'cases', 'observations'].includes(k))) throw Error('El archivo contiene campos no admitidos.');
        if (!Array.isArray(value.cases) || value.cases.length !== 3) throw Error('Debe contener exactamente tres casos.');
        if (typeof value.observations !== 'string' || value.observations.length > 2000) throw Error('Observaciones inválidas.');
        const ids = new Set();
        const cases = value.cases.map(record => {
            if (!record || typeof record !== 'object') throw Error('Registro de caso inválido.');
            if (![1, 2, 3].includes(record.id) || ids.has(record.id)) throw Error('Los casos deben identificarse una sola vez como 1, 2 y 3.');
            ids.add(record.id);
            if (Object.keys(record).some(k => k !== 'id' && !CASE_KEYS.includes(k))) throw Error('Un caso contiene campos no admitidos.');
            const clean = { id: record.id };
            for (const key of NUMERIC_KEYS) {
                const v = record[key];
                if (v !== null && v !== undefined) {
                    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || (key === 'rows' && !Number.isInteger(v))) {
                        throw Error(`Dato numérico inválido en ${key}, caso ${record.id}.`);
                    }
                    clean[key] = v;
                } else clean[key] = null;
            }
            for (const key of ENUM_KEYS) {
                const v = record[key];
                if (v !== null && v !== undefined) {
                    if (!LISTS[key].some(o => o.value === v)) throw Error(`Selección inválida en ${key}, caso ${record.id}.`);
                    clean[key] = v;
                } else clean[key] = null;
            }
            return clean;
        }).sort((a, b) => a.id - b.id);
        return { schema: SCHEMA, cases, observations: value.observations };
    }

    function migrateV1(value) {
        if (!value || value.schema !== LEGACY_SCHEMA) throw Error('No es un archivo v1.');
        if (!Array.isArray(value.cases) || value.cases.length !== 3) throw Error('v1 inválido.');
        const cases = value.cases.map(record => {
            const clean = { id: record.id };
            for (const key of NUMERIC_KEYS) {
                if (key === 'stemmingFactor') { clean[key] = null; continue; }
                clean[key] = (record[key] !== undefined && record[key] !== null) ? record[key] : null;
            }
            for (const key of ENUM_KEYS) clean[key] = null;
            return clean;
        });
        return { schema: SCHEMA, cases, observations: value.observations || '' };
    }

    function applyCapture(capture) {
        for (const record of capture.cases) {
            for (const field of fields) {
                const el = control(record.id, field.key);
                el.value = record[field.key] ?? '';
                el.removeAttribute('aria-invalid');
            }
        }
        form.elements.namedItem('observations').value = capture.observations;
        report([]);
    }

    // ============================================================
    // 7. PERSISTENCIA Y RESULTADOS
    // ============================================================
    function saveAndRender() {
        const { capture, messages } = readCapture();
        report(messages);
        renderResults(capture);
        if (messages.length === 0) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(capture));
                hasSavedCapture = true;
                status.textContent = 'Captura guardada en este navegador.';
            } catch {
                status.textContent = 'No se pudo guardar en el navegador. Puedes exportar la captura.';
            }
        } else {
            status.textContent = 'Sin guardar: revisa los campos indicados.';
        }
    }

    function fmt(v, d = 2) {
        if (v === null || v === undefined) return '—';
        if (typeof v === 'number') return Number.isFinite(v) ? v.toFixed(d) : '—';
        return String(v);
    }

    function renderResults(capture) {
        for (let n = 1; n <= 3; n++) {
            const c = capture.cases.find(x => x.id === n);
            const el = dialog.querySelector(`.sc-result-case[data-case="${n}"]`);
            if (!el || !c) continue;
            const r = computeCase(c);
            if (!r) {
                el.innerHTML = `<h4>Caso ${n}</h4><p class="sc-incomplete">Captura los 11 datos requeridos para calcular.</p>`;
                continue;
            }
            const tHText = r.tH === null ? 'N/A (instantánea)' : fmt(r.tH, 1) + ' ms';
            const tacoText = r.T === null ? '—' : fmt(r.T, 2) + ' m';
            const alertsHTML = r.alerts.length
                ? `<ul class="sc-alert">${r.alerts.map(a => `<li>${a}</li>`).join('')}</ul>`
                : '';
            el.innerHTML = `
                <h4>Caso ${n}</h4>
                <dl>
                    <div class="sc-primary"><dt>Bordo (B) <span>m</span></dt><dd>${fmt(r.B, 2)}</dd></div>
                    <div class="sc-primary"><dt>Espaciamiento (E) <span>m</span></dt><dd>${fmt(r.E, 2)}</dd></div>
                    <div><dt>Sobre-perforación (SP) <span>m</span></dt><dd>${fmt(r.SP, 2)}</dd></div>
                    <div><dt>Taco (T) <span>m</span></dt><dd>${tacoText}</dd></div>
                    <div><dt>Retardo taladro (tH) <span>ms</span></dt><dd>${tHText}</dd></div>
                    <div><dt>Retardo fila (Tr) <span>ms</span></dt><dd>${fmt(r.Tr, 1)}</dd></div>
                    <div><dt>Rigidez (HB/B)</dt><dd>${fmt(r.rigidity, 2)} · ${r.bancoLargo ? 'banco largo' : 'banco corto'}</dd></div>
                </dl>
                <p class="sc-diag">B calc. ${fmt(r.B_calc, 2)} m · Kr ${fmt(r.Kr, 2)} · Kd ${fmt(r.Kd, 2)} · Ks ${fmt(r.Ks, 2)} · B corr. ${fmt(r.B_corr, 2)} m</p>
                <p class="sc-diag">Taco mín/máx ${fmt(r.T_min, 2)} / ${fmt(r.T_max, 2)} m · TH ${fmt(r.TH, 1)} · Tt ${fmt(r.Tt, 1)} ms/m</p>
                ${alertsHTML}`;
        }
    }

    // ============================================================
    // 8. PRECARGA
    // ============================================================
    function prefill() {
        let copied = 0;
        for (const [key, path] of [['diameter', 'drilling.diameterMm'], ['height', 'block.height']]) {
            const el = control(1, key);
            const source = document.querySelector(`[data-path="${path}"]`);
            if (!el.value.trim() && source?.value.trim() && Number.isFinite(Number(source.value)) && Number(source.value) >= 0) {
                el.value = source.value;
                copied++;
            }
        }
        saveAndRender();
        if (!validation.hidden) return;
        status.textContent += copied
            ? ` Se precargaron ${copied} campos vacíos del Caso 1.`
            : ' No había campos vacíos con datos disponibles para precargar.';
    }

    // ============================================================
    // 9. CARGA INICIAL (v2 + migración v1)
    // ============================================================
    try {
        let stored = localStorage.getItem(STORAGE_KEY);
        if (stored === null) {
            const legacy = localStorage.getItem(LEGACY_KEY);
            if (legacy !== null) {
                try {
                    const migrated = migrateV1(JSON.parse(legacy));
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
                    stored = JSON.stringify(migrated);
                    status.textContent = 'Borrador v1 migrado a v2: verifica las selecciones.';
                } catch { /* v1 inválido, se ignora */ }
            }
        }
        if (stored !== null) {
            applyCapture(validateV2(JSON.parse(stored)));
            hasSavedCapture = true;
            if (!status.textContent) status.textContent = 'Captura recuperada del navegador.';
        }
    } catch {
        status.textContent = 'No se pudo recuperar la captura guardada. Puedes importar un respaldo JSON.';
    }

    // ============================================================
    // 10. EVENTOS
    // ============================================================
    let opener = null;
    const restoreFocus = () => {
        const btn = document.getElementById('open-spacing-capture') || opener;
        if (btn?.isConnected) btn.focus();
    };
    const close = () => { saveAndRender(); dialog.close(); };

    dialog.querySelector('.sc-close').addEventListener('click', close);
    dialog.querySelector('.sc-done').addEventListener('click', close);
    dialog.addEventListener('close', restoreFocus);
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    });

    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('input', saveAndRender);
    form.addEventListener('reset', () => queueMicrotask(() => {
        saveAndRender();
        status.textContent += ' Campos vacíos.';
    }));

    dialog.querySelector('.sc-prefill').addEventListener('click', prefill);

    dialog.querySelector('.sc-export').addEventListener('click', () => {
        const { capture, messages } = readCapture();
        report(messages);
        if (messages.length) { status.textContent = 'No se exportó: revisa los campos indicados.'; return; }
        const url = URL.createObjectURL(new Blob([JSON.stringify(capture, null, 2)], { type: 'application/json' }));
        const link = document.createElement('a');
        link.href = url; link.download = 'minecad-captura-bordo.json'; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        status.textContent = 'Captura exportada (esquema v2). Los resultados se recalculan al importar.';
    });

    const fileInput = dialog.querySelector('.sc-file');
    dialog.querySelector('.sc-import').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
        const file = fileInput.files?.[0];
        fileInput.value = '';
        if (!file) return;
        status.textContent = 'Leyendo archivo de captura…';
        report([]);
        try {
            if (file.size > 512000) throw Error('El archivo supera 500 KB.');
            const parsed = JSON.parse(await file.text());
            const capture = (parsed && parsed.schema === LEGACY_SCHEMA)
                ? migrateV1(parsed)
                : validateV2(parsed);
            applyCapture(capture);
            saveAndRender();
            status.textContent += parsed.schema === LEGACY_SCHEMA
                ? ' Captura v1 importada y migrada; revisa las selecciones.'
                : ' Captura importada.';
        } catch (error) {
            report(['No se importó: ' + error.message]);
            status.textContent = 'La captura actual se conserva.';
        }
    });

    // ============================================================
    // 11. MONTAJE DEL BOTÓN DE APERTURA
    // ============================================================
    function mount() {
        if (document.getElementById('open-spacing-capture')) return;
        const anchor = document.querySelector('[data-path="drilling.burdenM"]');
        const section = anchor?.closest('details');
        if (!section) return;
        const button = document.createElement('button');
        button.id = 'open-spacing-capture';
        button.type = 'button';
        button.textContent = 'Calcular bordo y espaciamiento';
        button.setAttribute('aria-haspopup', 'dialog');
        button.setAttribute('aria-controls', dialog.id);
        button.addEventListener('click', () => {
            opener = button;
            if (firstOpen) {
                if (!hasSavedCapture) prefill();
                firstOpen = false;
            }
            if (!dialog.open) {
                dialog.showModal();
                saveAndRender();
            }
            dialog.querySelector('.sc-close').focus();
        });
        section.querySelector('summary').insertAdjacentElement('afterend', button);
    }
    mount();
    document.addEventListener('minecad:datos', mount);
    document.addEventListener('input', () => queueMicrotask(mount));
    document.addEventListener('change', () => queueMicrotask(mount));
})();