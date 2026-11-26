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
#visual-playback .vp-legend{width:100%;display:flex;flex-wrap:wrap;gap:2px 14px;color:#b9d3e4;font-size:.88em;line-height:1.25}#visual-playback .vp-legend[hidden]{display:none}#visual-playback .vp-legend b{font-weight:600;color:#e3f3fc}#visual-playback .vp-legend i{display:inline-block;width:.8em;height:.8em;border-radius:2px;margin-right:5px;vertical-align:-1px;border:1px solid #ffffff55}#visual-playback .vp-readout{color:#ffda8a;font-variant-numeric:tabular-nums;white-space:nowrap}
#visual-playback .vp-play{min-width:86px;border-color:#5081a3}#visual-playback [hidden]{display:none!important}
#visual-playback button:focus-visible,#visual-playback input:focus-visible{outline:2px solid #88dcff;outline-offset:2px}
@media(max-width:650px){#visual-playback{gap:4px;padding:3px 5px}#visual-playback .vp-clock{min-width:180px}}
`;
    document.head.append(style);
    const bar = document.createElement('section');
    bar.id = 'visual-playback';
    bar.setAttribute('aria-label', 'Apariencia y animación ilustrativa');
    bar.innerHTML = `<div class="vp-modes" role="group" aria-label="Colorear visualización por">${['Tipo', 'Tiempo', 'Carga', 'Daño', 'Frag.'].map((x, i) => `<button type="button" data-vp-mode="${i}" aria-pressed="${i === 0}">${x}</button>`).join('')}</div><div class="vp-clock"><button type="button" class="vp-play" aria-label="Simular animación ilustrativa">▶ Simular</button><button type="button" class="vp-reset" aria-label="Reiniciar vista previa" title="Reiniciar">↺</button><input type="range" min="0" max="100" step="1" value="0" aria-label="Avance de la vista previa"><output>0 %</output><span class="vp-readout" hidden></span></div><div class="vp-note" role="status" aria-live="polite">Tipo · colores actuales del visor. Simular: animación ilustrativa.</div><div class="vp-legend" hidden></div>`;
    workspace.insertBefore(bar, scene);
    const play = bar.querySelector('.vp-play'), range = bar.querySelector('input'), output = bar.querySelector('output'), note = bar.querySelector('.vp-note'), readout = bar.querySelector('.vp-readout'), legend = bar.querySelector('.vp-legend');
    const keys = ['tipo', 'tiempo', 'carga', 'dano', 'frag'];
    const baseNotes = ['Tipo · colores actuales del visor.', 'Tiempo · sin datos de visualización temporal vinculados.', 'Carga · sin datos de coloración por carga vinculados.', 'Daño · sin capa de daño disponible.', 'Frag. · sin capa de fragmentación disponible.'];
    const notes = baseNotes.slice();
    const hex = n => '#' + Number(n).toString(16).padStart(6, '0');
    const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const DIM = { color: 0x4b6074, opacity: .45 }, LIT = { color: 0xffd966, opacity: 1 };
    // Datos capturados por el usuario (adaptador de registro-app.js). Sin datos: se conserva el dibujo original.
    function data() { return mode >= 1 && mode <= 2 && window.MineCADLayerData ? window.MineCADLayerData.get(keys[mode]) : null; }
    function layer() {
        const d = data();
        if (!d || d.state !== 'disponible') return null;
        if (keys[mode] === 'carga') return { mode: 'carga', state: 'disponible', all: { color: d.color, opacity: .95 }, byRing: null, caption: 'Carga capturada · ' + d.legend[0][1] };
        const tMs = progress / 100 * d.maxMs, byRing = new Map();
        for (const r of d.rings) byRing.set(r.index, progress > 0 && (d.maxMs <= 0 || r.startMs <= tMs + 1e-9) ? LIT : DIM);
        return { mode: 'tiempo', state: 'disponible', all: null, byRing, caption: 'Tiempo capturado · ' + Math.round(progress > 0 ? tMs : 0) + ' ms', tMs, maxMs: d.maxMs };
    }
    function refreshData() {
        const d = data(), k = keys[mode];
        notes[1] = baseNotes[1]; notes[2] = baseNotes[2];
        if (d && d.state === 'sin_datos') notes[mode] = d.message;
        if (d && d.state === 'error') notes[mode] = d.message;
        if (d && d.state === 'disponible') notes[mode] = k === 'tiempo' ? 'Tiempo · anillos resaltados según el retardo entre anillos capturado (valores nominales; no validan una secuencia de iniciación).' : 'Carga · color por agente de columna capturado; son datos del diseño completo, no valores por barreno.';
        if (d && d.state === 'sin_datos') notes[mode] = d.message;
        if (!d && mode !== 0) notes[mode] = baseNotes[mode];
        bar.querySelectorAll('[data-vp-mode]').forEach(b => { b.title = notes[Number(b.dataset.vpMode)]; });
        if (d && d.state === 'disponible') {
            legend.hidden = false;
            legend.innerHTML = (k === 'carga' ? `<span><i style="background:${hex(d.color)}"></i>Tubos de anillo</span>` : `<span><i style="background:${hex(LIT.color)}"></i>Ya iniciado (según captura)</span><span><i style="background:${hex(DIM.color)}"></i>Aún no</span>`) + d.legend.map(([a, b]) => `<span><b>${esc(a)}</b> ${esc(b)}</span>`).join('') + `<span>${esc(d.source)}</span>`;
        }
        else { legend.hidden = true; legend.textContent = ''; }
        note.textContent = notes[mode] + (mode ? '' : ' Simular: animación ilustrativa.');
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    range.setAttribute('aria-label', 'Avance ilustrativo en porcentaje; no representa tiempo físico');
    bar.querySelectorAll('[data-vp-mode]').forEach(button => {
        button.title = notes[Number(button.dataset.vpMode)];
        button.setAttribute('aria-describedby', 'visual-playback-note');
    });
    note.id = 'visual-playback-note';
    let frame = 0, progress = 0, last = 0, running = false, mode = 0;
    function show() { const l = layer(); window.MineCADAnimation?.setLayer?.(l); window.MineCADAnimation?.setProgress(progress); if (l && l.mode === 'tiempo') { readout.hidden = false; readout.textContent = Math.round(progress > 0 ? l.tMs : 0) + ' / ' + Math.round(l.maxMs) + ' ms'; } else readout.hidden = true; range.value = String(Math.floor(progress)); output.value = Math.floor(progress) + ' %'; range.setAttribute('aria-valuetext', Math.floor(progress) + ' por ciento, animación ilustrativa'); }
    function stop() { running = false; cancelAnimationFrame(frame); play.textContent = progress >= 100 ? '↻ Repetir' : progress > 0 ? '▶ Reanudar' : '▶ Simular'; play.setAttribute('aria-label', progress >= 100 ? 'Repetir animación ilustrativa' : progress > 0 ? 'Reanudar animación ilustrativa' : 'Simular animación ilustrativa'); }
    function tick(now) { if (!running)
        return; if (last)
        progress = Math.min(100, progress + (now - last) / 80); last = now; show(); if (progress >= 100) {
        stop();
        note.textContent = notes[mode] + (layer() ? ' Recorrido finalizado.' : ' Vista previa finalizada; no representa una secuencia física.');
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
        progress = 0; show(); running = true; last = 0; play.textContent = 'Ⅱ Pausar'; play.setAttribute('aria-label', 'Pausar animación ilustrativa'); note.textContent = notes[mode] + (layer() ? ' La barra recorre los datos capturados; no es una predicción.' : ' Animación visual de sección y fragmentos; sin predicción física.'); frame = requestAnimationFrame(tick); });
    bar.querySelector('.vp-reset').addEventListener('click', () => { progress = 0; stop(); show(); note.textContent = notes[mode] + ' Vista previa restablecida.'; });
    range.addEventListener('input', () => { progress = Number(range.value); last = 0; show(); if (!running)
        stop(); });
    bar.querySelectorAll('[data-vp-mode]').forEach(button => button.addEventListener('click', () => { mode = Number(button.dataset.vpMode); bar.querySelectorAll('[data-vp-mode]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); refreshData(); show(); const d = data(); if (mode && !(d && d.state === 'disponible')) note.textContent = notes[mode] + ' Selección de interfaz; el dibujo conserva sus colores.'; }));
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
    refreshData();
    show();
})();
