(() => {
    'use strict';
    const workspace = document.querySelector('.workspace'), scene = document.querySelector('.scene-wrap');
    if (!workspace || !scene || document.getElementById('visual-playback'))
        return;
    const style = document.createElement('style');
    style.textContent = `
#visual-playback{flex:none;border-top:1px solid #294158;border-bottom:1px solid #294158;background:#102234;padding:4px 7px;display:flex;flex-wrap:wrap;align-items:center;gap:5px 10px;font-size:.82rem}
#visual-playback .vp-modes{display:flex;gap:3px;flex-wrap:wrap}#visual-playback button{padding:4px 7px;font-size:inherit}
#visual-playback button[aria-pressed=true]{background:#185b7a;border-color:#68c8f3;color:#e8f8ff}
#visual-playback .vp-clock{display:flex;align-items:center;gap:6px;flex:1;min-width:220px}
#visual-playback input{min-width:60px;width:100%;height:14px;accent-color:#60bdf2;cursor:pointer}
#visual-playback output{min-width:32px;text-align:right;font-variant-numeric:tabular-nums;color:#c7e8fb}
#visual-playback .vp-note{width:100%;color:#93acc0;font-size:.9em;line-height:1.2;min-height:1.2em}
#visual-playback .vp-legend{width:100%;display:flex;flex-wrap:wrap;gap:2px 14px;color:#b9d3e4;font-size:.88em;line-height:1.25}#visual-playback .vp-legend[hidden]{display:none}#visual-playback .vp-legend b{font-weight:600;color:#e3f3fc}#visual-playback .vp-legend i{display:inline-block;width:.8em;height:.8em;border-radius:2px;margin-right:5px;vertical-align:-1px;border:1px solid #ffffff55}#visual-playback .vp-scale{display:inline-flex;align-items:center;gap:6px}#visual-playback .vp-legend i.vp-ramp{width:120px;height:.7em;margin:0;border-radius:3px;vertical-align:middle}#visual-playback .vp-data{width:100%;display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px}#visual-playback .vp-data[hidden]{display:none}#visual-playback .vp-readout{color:#ffda8a;font-variant-numeric:tabular-nums;white-space:nowrap}
#visual-playback .vp-speed{display:flex;align-items:center;gap:4px;color:#93acc0;white-space:nowrap}#visual-playback .vp-speed select{width:auto;padding:2px 4px}
#visual-playback .vp-play{min-width:86px;border-color:#5081a3}#visual-playback [hidden]{display:none!important}
#visual-playback button:focus-visible,#visual-playback input:focus-visible{outline:2px solid #88dcff;outline-offset:2px}
@media(max-width:650px){#visual-playback{gap:4px;padding:3px 5px}#visual-playback .vp-clock{min-width:180px}}
`;
    document.head.append(style);
    const bar = document.createElement('section');
    bar.id = 'visual-playback';
    bar.setAttribute('aria-label', 'Apariencia y animación ilustrativa');
    bar.innerHTML = `<div class="vp-modes" role="group" aria-label="Colorear visualización por">${['Tipo', 'Tiempo', 'Carga', 'Daño', 'Frag.'].map((x, i) => `<button type="button" data-vp-mode="${i}" aria-pressed="${i === 0}">${x}</button>`).join('')}</div><div class="vp-clock"><button type="button" class="vp-play" aria-label="Simular animación ilustrativa">▶ Simular</button><button type="button" class="vp-reset" aria-label="Reiniciar vista previa" title="Reiniciar">↺</button><input type="range" min="0" max="100" step="0.1" value="0" aria-label="Avance de la vista previa"><output>0 %</output><span class="vp-readout" hidden></span><label class="vp-speed" hidden>Velocidad <select aria-label="Velocidad de reproducción"><option value="auto">Auto</option><option value="1">1× real</option><option value="0.5">0.5×</option><option value="0.25">0.25×</option><option value="0.1">0.1×</option><option value="0.05">0.05×</option><option value="0.01">0.01×</option></select></label></div><div class="vp-note" role="status" aria-live="polite">Tipo · colores actuales del visor. Simular: animación ilustrativa.</div><div class="vp-legend" hidden></div><div class="vp-data" hidden><button type="button" class="vp-load">Cargar resultados (JSON)…</button><button type="button" class="vp-tpl">Plantilla</button><button type="button" class="vp-clear" hidden>Quitar resultados</button><input type="file" accept=".json,application/json" hidden aria-label="Archivo de resultados externos"></div>`;
    workspace.insertBefore(bar, scene);
    const play = bar.querySelector('.vp-play'), range = bar.querySelector('input'), output = bar.querySelector('output'), note = bar.querySelector('.vp-note'), readout = bar.querySelector('.vp-readout'), legend = bar.querySelector('.vp-legend'), dataRow = bar.querySelector('.vp-data'), fileInput = dataRow.querySelector('input[type=file]'), speedBox = bar.querySelector('.vp-speed'), speedSelect = speedBox.querySelector('select'), clearBtn = dataRow.querySelector('.vp-clear');
    const keys = ['tipo', 'tiempo', 'carga', 'dano', 'frag'];
    const baseNotes = ['Tipo · colores actuales del visor.', 'Tiempo · sin datos de visualización temporal vinculados.', 'Carga · sin datos de coloración por carga vinculados.', 'Daño · sin capa de daño disponible.', 'Frag. · sin capa de fragmentación disponible.'];
    const notes = baseNotes.slice();
    const hex = n => '#' + Number(n).toString(16).padStart(6, '0');
    const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    // Resultados externos (Daño, Frag., o cantidad de Carga) cargados desde un archivo JSON. Solo se dibujan; no se calculan ni se modifican.
    const external = {};
    const RAMP = [0x440154, 0x3b528b, 0x21918c, 0x5ec962, 0xfde725], NODATA = { color: 0x7a8793, opacity: .5 }, FLASH = 0xfff2c2;
    const ramp = t => { t = Math.max(0, Math.min(1, t)); const x = t * (RAMP.length - 1), i = Math.min(RAMP.length - 2, Math.floor(x)), f = x - i, a = RAMP[i], b = RAMP[i + 1], ch = sh => Math.round(((a >> sh) & 255) + (((b >> sh) & 255) - ((a >> sh) & 255)) * f); return (ch(16) << 16) | (ch(8) << 8) | ch(0); };
    const rampCss = 'linear-gradient(90deg,' + RAMP.map(hex).join(',') + ')';
    const ringList = () => window.MineCADLayerData?.rings?.() ?? [];
    const fmt = v => Number.isInteger(v) ? String(v) : Number(v.toPrecision(4)).toString();
    // Estado de la capa del modo actual: captura del usuario o archivo externo.
    function data() {
        if (mode < 1 || !window.MineCADLayerData) return null;
        const k = keys[mode], e = external[k];
        if (e) {
            const list = ringList(), vals = list.map(i => e.values.get(i)).filter(v => typeof v === 'number');
            if (!vals.length) return { state: 'sin_datos', message: e.label + ' · el archivo no trae valores para los anillos actuales.' };
            return { state: 'disponible', kind: 'valor', label: e.label, unit: e.unit, source: 'Archivo externo · ' + e.source, min: Math.min(...vals), max: Math.max(...vals), values: e.values, list, missing: list.length - vals.length };
        }
        const d = window.MineCADLayerData.get(k);
        if (d.state === 'disponible') return { ...d, kind: k === 'tiempo' ? 'tiempo' : 'agente' };
        return d;
    }
    const clockNow = () => window.MineCADAnimation?.timeline?.(progress) ?? null;
    // Sin animación en curso (0 %) se ve el mapa completo; al avanzar, lo alcanzado se enciende y lo demás se atenúa.
    const reveal = (base, p, tn) => p <= 0 ? base : p + 1e-9 < tn ? { color: base.color, opacity: .3 } : p - tn < .06 ? { color: FLASH, opacity: 1 } : base;
    function layer() {
        const d = data();
        if (!d || d.state !== 'disponible') return null;
        const p = progress / 100, byRing = new Map();
        if (d.kind === 'agente') return { mode: 'carga', state: 'disponible', all: { color: d.color, opacity: .95 }, byRing: null, caption: 'Carga capturada · ' + d.legend[0][1] };
        if (d.kind === 'tiempo') {
            const tl = clockNow();
            for (const r of d.rings) {
                const base = { color: ramp(d.maxMs > 0 ? r.startMs / d.maxMs : 0), opacity: 1 }, age = tl ? tl.age(r.startMs) : 0;
                byRing.set(r.index, progress <= 0 ? base : age < 0 ? { color: base.color, opacity: .3 } : age < .35 ? { color: FLASH, opacity: 1 } : base);
            }
            const tMs = tl ? tl.ms : 0;
            return { mode: 'tiempo', state: 'disponible', all: null, byRing, caption: 'Tiempo capturado · ' + Math.round(tMs) + ' ms', tMs, maxMs: d.maxMs };
        }
        // Valores externos: el orden de aparición usa el inicio capturado si existe; si no, el orden numérico de las secciones (solo ilustrativo).
        const tm = window.MineCADLayerData.get('tiempo'), start = new Map();
        if (tm.state === 'disponible' && tm.maxMs > 0) tm.rings.forEach(r => start.set(r.index, r.startMs / tm.maxMs));
        d.list.forEach((idx, pos) => {
            const v = d.values.get(idx), tn = start.has(idx) ? start.get(idx) : (d.list.length > 1 ? pos / (d.list.length - 1) : 0);
            byRing.set(idx, reveal(typeof v === 'number' ? { color: ramp(d.max > d.min ? (v - d.min) / (d.max - d.min) : .5), opacity: 1 } : NODATA, p, tn));
        });
        return { mode: keys[mode], state: 'disponible', all: null, byRing, caption: d.label + ' · archivo externo' };
    }
    function refreshData() {
        if (mode >= 2) {
            const seq = window.MineCADLayerData?.sequence?.(), radius = window.MineCADLayerData?.influenceRadius?.() ?? null;
            const timed = !!seq?.available, why = seq?.message ?? 'sin secuencia';
            const scope = timed ? seq.rings.length + (seq.rings.length === 1 ? ' línea' : ' líneas') + ' · ' + seq.holeCount + ' barrenos' + (seq.holeMissing ? ' · sin retardo entre taladros: cada anillo inicia a la vez' : '') : '';
            notes[2] = timed ? 'Carga · cada barreno pasa de rojo a amarillo en su tiempo nominal (' + scope + ').' : 'Carga · transición global de rojo a amarillo; para usar la secuencia, ' + why + '.';
            notes[3] = radius ? 'Daño · zona cilíndrica con el radio de influencia capturado (' + radius + ' m)' + (timed ? '; cada zona aparece al iniciar su barreno' : '') + '. No es un resultado calculado.' : 'Daño · captura el «Radio de influencia» en «Explosivo y carga» para dibujar las zonas.';
            notes[4] = timed ? 'Frag. · prismas y fragmentos ilustrativos que aparecen según el barreno de origen; sin tamaño de fragmentación calculado.' : 'Frag. · prismas decorativos; para usar la secuencia, ' + why + '.';
            note.textContent = notes[mode];
            dataRow.hidden = true; clearBtn.hidden = true; legend.hidden = false;
            legend.innerHTML = mode === 2 ? '<span><i style="background:#e03131"></i>Sin iniciar</span><span><i style="background:#ffee00;box-shadow:0 0 7px 2px #fff36b"></i>Iniciando</span><span><i style="background:#ffee00"></i>Iniciado</span>' : mode === 3 ? '<span><i style="background:#ff303088"></i>' + (radius ? 'Radio de influencia ' + esc(radius) + ' m' : 'Sin radio capturado') + '</span>' : '<span><i style="background:#d6b779"></i>Prismas decorativos de la veta</span>';
            bar.querySelectorAll('[data-vp-mode]').forEach(b => b.title = notes[Number(b.dataset.vpMode)]);
            return;
        }
        const d = data(), k = keys[mode];
        notes[1] = baseNotes[1]; notes[2] = baseNotes[2]; notes[3] = baseNotes[3]; notes[4] = baseNotes[4];
        if (d && (d.state === 'sin_datos' || d.state === 'error')) notes[mode] = d.message + (mode >= 2 ? ' Puedes cargar resultados externos (JSON): esta herramienta no los calcula.' : '');
        if (d && d.state === 'disponible') notes[mode] = d.kind === 'tiempo' ? 'Tiempo · color por inicio nominal de los anillos visibles; al avanzar se encienden los anillos alcanzados. No valida una secuencia de iniciación.' : d.kind === 'agente' ? 'Carga · color por agente de columna capturado; son datos del diseño completo, no valores por barreno.' : d.label + ' · valores de un archivo externo, dibujados tal cual (' + (d.missing ? d.missing + (d.missing === 1 ? ' anillo sin dato, en gris)' : ' anillos sin dato, en gris)') : 'sin cálculo ni validación)') + '.';
        bar.querySelectorAll('[data-vp-mode]').forEach(b => { b.title = notes[Number(b.dataset.vpMode)]; });
        dataRow.hidden = mode < 2;
        clearBtn.hidden = !external[k];
        if (d && d.state === 'disponible') {
            legend.hidden = false;
            let head;
            if (d.kind === 'agente') head = `<span><i style="background:${hex(d.color)}"></i>Tubos de anillo</span>`;
            else if (d.kind === 'tiempo') head = `<span class="vp-scale"><b>0 ms</b><i class="vp-ramp" style="background:${rampCss}"></i><b>${esc(fmt(d.maxMs))} ms</b></span><span>Flash = anillo que acaba de alcanzarse</span>`;
            else head = `<span class="vp-scale"><b>${esc(fmt(d.min))} ${esc(d.unit)}</b><i class="vp-ramp" style="background:${rampCss}"></i><b>${esc(fmt(d.max))} ${esc(d.unit)}</b></span>` + (d.missing ? `<span><i style="background:${hex(NODATA.color)}"></i>Sin dato (${d.missing})</span>` : '');
            const items = d.legend ? d.legend.map(([a, b]) => `<span><b>${esc(a)}</b> ${esc(b)}</span>`).join('') : `<span><b>${esc(d.label)}</b></span>`;
            legend.innerHTML = head + items + `<span>${esc(d.source)}</span>`;
        }
        else { legend.hidden = true; legend.textContent = ''; }
        note.textContent = notes[mode] + (mode ? '' : ' Simular: animación ilustrativa.');
    }
    // Carga de resultados externos: {"schema":"minecad-capa/1","mode":"dano|frag|carga","label","unit","source","rings":{"1":valor|null,...}} (o {"layers":[...]})
    function loadLayers(text) {
        const j = JSON.parse(text), list = Array.isArray(j.layers) ? j.layers : [j], count = ringList().length, out = {};
        if (!count) throw new Error('el proyecto no tiene anillos; captura bordo y perforación primero.');
        for (const L of list) {
            if (!L || !['carga', 'dano', 'frag'].includes(L.mode)) throw new Error('«mode» debe ser carga, dano o frag.');
            for (const f of ['label', 'unit', 'source']) if (typeof L[f] !== 'string' || !L[f].trim() || L[f].length > 120) throw new Error('«' + f + '» es obligatorio (texto de hasta 120 caracteres); la procedencia debe quedar a la vista.');
            if (!L.rings || typeof L.rings !== 'object') throw new Error('falta «rings».');
            const values = new Map();
            for (const [key, v] of Object.entries(L.rings)) {
                const n = Number(key);
                if (!Number.isInteger(n) || n < 1 || n > count) throw new Error('el anillo «' + key + '» no existe (hay ' + count + ').');
                if (v !== null && !(typeof v === 'number' && Number.isFinite(v))) throw new Error('valor no numérico en el anillo ' + key + '.');
                values.set(n - 1, v);
            }
            out[L.mode] = { label: L.label.trim(), unit: L.unit.trim(), source: L.source.trim(), values };
        }
        Object.assign(external, out);
    }
    function templateJson() {
        const rings = Object.fromEntries(ringList().map(i => [String(i + 1), null]));
        return JSON.stringify({ layers: ['dano', 'frag', 'carga'].map(m => ({ schema: 'minecad-capa/1', mode: m, label: '', unit: '', source: '', rings: { ...rings } })) }, null, 2);
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    range.setAttribute('aria-label', 'Avance ilustrativo en porcentaje; no representa tiempo físico');
    bar.querySelectorAll('[data-vp-mode]').forEach(button => {
        button.title = notes[Number(button.dataset.vpMode)];
        button.setAttribute('aria-describedby', 'visual-playback-note');
    });
    note.id = 'visual-playback-note';
    let frame = 0, progress = 0, last = 0, running = false, mode = 0;
    function show() { const l = mode >= 2 ? null : layer(); window.MineCADAnimation?.setLayer?.(l); window.MineCADAnimation?.setProgress(progress); window.MineCADAppearance?.setState(keys[mode],progress); const tl = clockNow(); speedBox.hidden = !tl; readout.hidden = !tl; if (tl) { readout.textContent = Math.round(tl.ms) + ' / ' + Math.round(tl.seq.totalMs) + ' ms'; readout.title = 'Reproducción a ' + Number(tl.rate.toPrecision(2)) + '× del tiempo nominal'; } range.value = progress.toFixed(1); output.value = Math.floor(progress) + ' %'; range.setAttribute('aria-valuetext', Math.floor(progress) + ' por ciento, animación ilustrativa'); }
    function stop() { running = false; cancelAnimationFrame(frame); play.textContent = progress >= 100 ? '↻ Repetir' : progress > 0 ? '▶ Reanudar' : '▶ Simular'; play.setAttribute('aria-label', progress >= 100 ? 'Repetir animación ilustrativa' : progress > 0 ? 'Reanudar animación ilustrativa' : 'Simular animación ilustrativa'); }
    function tick(now) { if (!running)
        return; if (last)
        // Con secuencia la duración depende de las líneas visibles; sin ella, 8 s como antes.
        progress = Math.min(100, progress + (now - last) * (100 / ((clockNow()?.durationS ?? 8) * 1000))); last = now; show(); if (progress >= 100) {
        stop();
        note.textContent = notes[mode] + (mode < 2 && layer() ? ' Recorrido finalizado.' : ' Vista previa finalizada; no representa una secuencia física.');
    }
    else
        frame = requestAnimationFrame(tick); }
    play.addEventListener('click', () => { if (running) {
        stop();
        return;
    } if (reducedMotion.matches) {
        note.textContent = 'Movimiento reducido activo. Usa la barra de avance para revisar la ilustración sin reproducción automática.';
        return;
    } if (progress >= 100)
        progress = 0; show(); running = true; last = 0; play.textContent = 'Ⅱ Pausar'; play.setAttribute('aria-label', 'Pausar animación ilustrativa'); note.textContent = notes[mode] + (clockNow() ? ' La barra recorre la secuencia capturada de las líneas visibles; no es una predicción.' : ' Animación visual de sección y fragmentos; sin predicción física.'); frame = requestAnimationFrame(tick); });
    bar.querySelector('.vp-reset').addEventListener('click', () => { progress = 0; stop(); show(); note.textContent = notes[mode] + ' Vista previa restablecida.'; });
    range.addEventListener('input', () => { progress = Number(range.value); last = 0; show(); if (!running)
        stop(); });
    bar.querySelectorAll('[data-vp-mode]').forEach(button => button.addEventListener('click', () => { mode = Number(button.dataset.vpMode); bar.querySelectorAll('[data-vp-mode]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); refreshData(); show(); const d = mode === 1 ? data() : null; if (mode === 1 && !(d && d.state === 'disponible')) note.textContent = notes[mode] + ' Selección de interfaz; el dibujo conserva sus colores.'; }));
    speedSelect.addEventListener('change', () => { window.MineCADAnimation?.setSpeed(speedSelect.value); show(); });
    // Al cambiar las líneas visibles cambia la duración: la animación vuelve al inicio.
    document.addEventListener('minecad:seleccion', () => { progress = 0; stop(); refreshData(); show(); });
    // Los módulos de captura avisan cuando cambian los datos; no hay observadores sobre la propia animación.
    document.addEventListener('minecad:datos', () => { refreshData(); show(); });
    document.addEventListener('click', e => { const tab = e.target.closest?.('[data-view]'); if (tab) {
        bar.hidden = tab.dataset.view === 'stability';
        if (bar.hidden)
            stop();
    } });
    document.addEventListener('visibilitychange', () => { if (document.hidden)
        stop(); });
    window.addEventListener('pagehide', stop);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && running) { stop(); note.textContent = notes[mode] + ' Animación pausada.'; }
    });
    reducedMotion.addEventListener('change', e => {
        if (e.matches) { stop(); note.textContent = 'Movimiento reducido activo. Usa la barra de avance.'; }
    });
    dataRow.querySelector('.vp-load').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
        const file = fileInput.files?.[0]; fileInput.value = '';
        if (!file) return;
        try { loadLayers(await file.text()); refreshData(); show(); note.textContent = notes[mode] + ' Resultados cargados desde «' + file.name + '».'; }
        catch (error) { note.textContent = 'No se cargó el archivo: ' + error.message; }
    });
    dataRow.querySelector('.vp-tpl').addEventListener('click', () => {
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([templateJson()], { type: 'application/json' })); a.download = 'plantilla-resultados-externos.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    clearBtn.addEventListener('click', () => { delete external[keys[mode]]; refreshData(); show(); });
    refreshData();
    show();
})();
