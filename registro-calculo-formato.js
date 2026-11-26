/* Formulario de captura. No contiene fórmulas ni modifica los parámetros del diseño. */
(() => {
    'use strict';
    const fields = [
        { key: 'diameter', label: 'Diámetro del barreno', unit: 'mm', type: 'number' },
        { key: 'explosiveDensity', label: 'Densidad del explosivo', unit: 'g/cm³', type: 'number' },
        { key: 'rockDensity', label: 'Densidad de la roca', unit: 'g/cm³', type: 'number' },
        { key: 'height', label: 'Altura de referencia', unit: 'm', type: 'number' },
        { key: 'rows', label: 'Número de filas', unit: 'filas', type: 'number', step: '1' },
        { key: 'deposit', label: 'Depositación de la roca', unit: 'texto', type: 'text' },
        { key: 'structure', label: 'Estructura geológica', unit: 'texto', type: 'text' },
        { key: 'competence', label: 'Competencia de la roca', unit: 'texto', type: 'text' },
        { key: 'adoptedBurden', label: 'Bordo adoptado, opcional', unit: 'm', type: 'number' }
    ];
    const dialog = document.createElement('dialog');
    dialog.id = 'spacing-capture-dialog';
    dialog.setAttribute('aria-labelledby', 'spacing-capture-title');
    dialog.setAttribute('aria-describedby', 'spacing-capture-description');
    dialog.innerHTML = `
        <form id="spacing-capture-form" method="dialog">
            <header class="sc-header">
                <div><span class="sc-kicker">MINECAD · CAPTURA</span><h2 id="spacing-capture-title">Calcular bordo y espaciamiento</h2></div>
                <button type="button" class="sc-close" aria-label="Cerrar ventana">×</button>
            </header>
            <div class="sc-body">
                <p id="spacing-capture-description">Compara hasta tres casos. La captura se guarda en este navegador, de forma independiente al proyecto.</p>
                <p class="sc-notice">Formato de captura · sin cálculo enlazado. No modifica los valores del diseño.</p>
                <div class="sc-actions"><button type="button" class="sc-prefill">Precargar Caso 1</button><button type="button" class="sc-export">Exportar captura</button><button type="button" class="sc-import">Importar captura</button><input class="sc-file" type="file" accept=".json,application/json" aria-label="Archivo de captura JSON" hidden></div>
                <p class="sc-caption">La precarga copia solo el diámetro y la altura en campos vacíos del Caso 1.</p>
                <div class="sc-validation" role="alert" hidden></div>
                <section aria-labelledby="sc-inputs-title">
                    <h3 id="sc-inputs-title">A. Datos de entrada</h3>
                    <div class="sc-table-wrap" tabindex="0" role="region" aria-label="Tabla de captura de tres casos, desplazable horizontalmente">
                        <table class="sc-table">
                            <thead><tr><th scope="col">Concepto</th><th scope="col">Unidad</th>${[1,2,3].map(n=>`<th scope="col">Caso ${n}</th>`).join('')}</tr></thead>
                            <tbody>${fields.map(field=>`<tr><th scope="row">${field.label}</th><td class="sc-unit">${field.unit}</td>${[1,2,3].map(n=>`<td><input type="${field.type}" ${field.type==='number' ? `min="0" step="${field.step || 'any'}" inputmode="decimal"` : 'maxlength="160"'} name="case${n}.${field.key}" aria-label="${field.label}, caso ${n}" aria-describedby="sc-validation-message" autocomplete="off" placeholder="${field.type==='number'?'—':'Sin capturar'}"></td>`).join('')}</tr>`).join('')}</tbody>
                        </table>
                    </div>
                    <p class="sc-caption">Diámetro en milímetros, como en MineCAD. Los datos del Excel no se importan automáticamente.</p>
                </section>
                <section aria-labelledby="sc-results-title">
                    <h3 id="sc-results-title">B. Bordo y espaciamiento</h3>
                    <div class="sc-results">${[1,2,3].map(n=>`<article><h4>Caso ${n}</h4><dl><div><dt>Bordo <span>m</span></dt><dd>—</dd></div><div><dt>Espaciamiento <span>m</span></dt><dd>—</dd></div></dl><p>Sin cálculo enlazado</p></article>`).join('')}</div>
                </section>
                <label class="sc-notes">Observaciones<textarea name="observations" rows="2" maxlength="2000" placeholder="Notas sobre los casos capturados"></textarea></label>
            </div>
            <footer class="sc-footer"><button type="reset">Limpiar campos</button><span class="sc-status" role="status" aria-live="polite"></span><button type="button" class="sc-done">Cerrar</button></footer>
        </form>`;
    document.body.append(dialog);
    const form = dialog.querySelector('form');
    const status = dialog.querySelector('.sc-status');
    const validation = dialog.querySelector('.sc-validation');
    validation.id = 'sc-validation-message';
    const storageKey = 'minecad-captura-bordo-v1';
    const schema = 'minecad-captura/1';
    let firstOpen = true, hasSavedCapture = false;
    const control = (id, key) => form.elements.namedItem(`case${id}.${key}`);
    const report = messages => {
        validation.hidden = messages.length === 0;
        validation.textContent = messages.join(' ');
    };
    function readCapture() {
        const messages = [];
        const cases = [1,2,3].map(id => {
            const record = { id };
            for (const field of fields) {
                const input = control(id,field.key), raw = input.value.trim();
                let invalid = false;
                if (field.type === 'number') {
                    const value = raw === '' ? null : Number(raw);
                    invalid = input.validity.badInput || (value !== null && (!Number.isFinite(value) || value < 0 || (field.key === 'rows' && !Number.isInteger(value))));
                    record[field.key] = value;
                } else {
                    invalid = raw.length > 160;
                    record[field.key] = raw;
                }
                if (invalid) {
                    input.setAttribute('aria-invalid','true');
                    messages.push(`${field.label}, Caso ${id}: ${field.type === 'number' ? (field.key === 'rows' ? 'usa un entero no negativo o deja vacío.' : 'usa un número finito no negativo o deja vacío.') : 'máximo 160 caracteres.'}`);
                } else input.removeAttribute('aria-invalid');
            }
            return record;
        });
        const observations = form.elements.namedItem('observations').value;
        if (observations.length > 2000) messages.push('Observaciones: máximo 2000 caracteres.');
        return { capture:{schema,cases,observations}, messages };
    }
    function validateCapture(value) {
        if (!value || typeof value !== 'object' || value.schema !== schema || !Array.isArray(value.cases) || value.cases.length !== 3 || typeof value.observations !== 'string' || value.observations.length > 2000) throw Error('El archivo no es una captura compatible.');
        if (Object.keys(value).some(key=>!['schema','cases','observations'].includes(key))) throw Error('El archivo contiene campos no admitidos.');
        const ids = new Set();
        const cases = value.cases.map(record=>{
            if (!record || typeof record !== 'object' || ![1,2,3].includes(record.id) || ids.has(record.id)) throw Error('Los casos deben identificarse una sola vez como 1, 2 y 3.');
            ids.add(record.id);
            if (Object.keys(record).some(key=>key !== 'id' && !fields.some(field=>field.key===key))) throw Error('Un caso contiene campos no admitidos.');
            const clean = {id:record.id};
            for (const field of fields) {
                const item = record[field.key];
                if (field.type === 'number') {
                    if (item !== null && (typeof item !== 'number' || !Number.isFinite(item) || item < 0 || (field.key === 'rows' && !Number.isInteger(item)))) throw Error(`Dato inválido en ${field.label}, Caso ${record.id}.`);
                } else if (typeof item !== 'string' || item.length > 160) throw Error(`Texto inválido en ${field.label}, Caso ${record.id}.`);
                clean[field.key] = item;
            }
            return clean;
        }).sort((a,b)=>a.id-b.id);
        return {schema,cases,observations:value.observations};
    }
    function applyCapture(capture) {
        for (const record of capture.cases) for (const field of fields) {
            const input = control(record.id,field.key);
            input.value = record[field.key] ?? '';
            input.removeAttribute('aria-invalid');
        }
        form.elements.namedItem('observations').value = capture.observations;
        report([]);
    }
    function saveCapture() {
        const {capture,messages} = readCapture();
        report(messages);
        if (messages.length) { status.textContent = 'Sin guardar: revisa los campos indicados.'; return false; }
        try {
            localStorage.setItem(storageKey,JSON.stringify(capture));
            hasSavedCapture = true;
            status.textContent = 'Captura guardada en este navegador.';
        } catch { status.textContent = 'No se pudo guardar en el navegador. Puedes exportar la captura.'; }
        return true;
    }
    function prefill() {
        let copied = 0;
        for (const [key,path] of [['diameter','drilling.diameterMm'],['height','block.height']]) {
            const input = control(1,key), source = document.querySelector(`[data-path="${path}"]`);
            if (!input.value.trim() && source?.value.trim() && Number.isFinite(Number(source.value)) && Number(source.value)>=0) { input.value = source.value; copied++; }
        }
        saveCapture();
        if (!validation.hidden) return;
        status.textContent += copied ? ` Se precargaron ${copied} campos vacíos del Caso 1.` : ' No había campos vacíos con datos disponibles para precargar.';
    }
    try {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) { applyCapture(validateCapture(JSON.parse(stored))); hasSavedCapture = true; status.textContent = 'Captura recuperada del navegador.'; }
    } catch { status.textContent = 'No se pudo recuperar la captura guardada. Puedes importar un respaldo JSON.'; }
    let opener = null;
    const restoreFocus = () => {
        const button = document.getElementById('open-spacing-capture') || opener;
        if (button?.isConnected) button.focus();
    };
    const close = () => { saveCapture(); dialog.close(); restoreFocus(); };
    dialog.querySelector('.sc-close').addEventListener('click', close);
    dialog.querySelector('.sc-done').addEventListener('click', close);
    dialog.addEventListener('close', restoreFocus);
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    });
    // Enter no dispara un cálculo ni envía datos del formulario.
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('input', saveCapture);
    form.addEventListener('reset', () => queueMicrotask(() => { saveCapture(); status.textContent += ' Campos vacíos.'; }));
    dialog.querySelector('.sc-prefill').addEventListener('click',prefill);
    dialog.querySelector('.sc-export').addEventListener('click',()=>{
        const {capture,messages} = readCapture(); report(messages);
        if (messages.length) { status.textContent = 'No se exportó: revisa los campos indicados.'; return; }
        const url = URL.createObjectURL(new Blob([JSON.stringify(capture,null,2)],{type:'application/json'}));
        const link = document.createElement('a'); link.href=url; link.download='minecad-captura-bordo.json'; link.click();
        setTimeout(()=>URL.revokeObjectURL(url),1000);
        status.textContent = 'Captura exportada. No contiene resultados calculados.';
    });
    const fileInput = dialog.querySelector('.sc-file');
    dialog.querySelector('.sc-import').addEventListener('click',()=>fileInput.click());
    fileInput.addEventListener('change',async()=>{
        const file=fileInput.files?.[0]; fileInput.value=''; if(!file) return;
        status.textContent = 'Leyendo archivo de captura…'; report([]);
        try {
            if(file.size>512000) throw Error('El archivo supera 500 KB.');
            const capture=validateCapture(JSON.parse(await file.text()));
            applyCapture(capture); saveCapture();
            status.textContent += ' Captura importada.';
        } catch(error) { report(['No se importó: '+error.message]); status.textContent='La captura actual se conserva.'; }
    });
    function mount() {
        if (document.getElementById('open-spacing-capture')) return;
        const anchor = document.querySelector('[data-path="drilling.burdenM"]');
        const section = anchor?.closest('details');
        if (!section) return;
        const button = document.createElement('button');
        button.id = 'open-spacing-capture'; button.type = 'button';
        button.textContent = 'Calcular bordo y espaciamiento';
        button.setAttribute('aria-haspopup','dialog');
        button.setAttribute('aria-controls',dialog.id);
        button.addEventListener('click', () => {
            opener = button;
            if (firstOpen) { if (!hasSavedCapture) prefill(); firstOpen = false; }
            if (!dialog.open) dialog.showModal();
            dialog.querySelector('.sc-close').focus();
        });
        section.querySelector('summary').insertAdjacentElement('afterend',button);
    }
    mount();
    document.addEventListener('minecad:datos',mount);
    document.addEventListener('input',()=>queueMicrotask(mount));
    document.addEventListener('change',()=>queueMicrotask(mount));
})();
