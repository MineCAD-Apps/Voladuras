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
#visual-playback .vp-play{min-width:86px;border-color:#5081a3}#visual-playback [hidden]{display:none!important}
@media(max-width:650px){#visual-playback{gap:4px;padding:3px 5px}#visual-playback .vp-clock{min-width:180px}}
`;
    document.head.append(style);
    const bar = document.createElement('section');
    bar.id = 'visual-playback';
    bar.setAttribute('aria-label', 'Apariencia y animación ilustrativa');
    bar.innerHTML = `<div class="vp-modes" role="group" aria-label="Colorear visualización por">${['Tipo', 'Tiempo', 'Carga', 'Daño', 'Frag.'].map((x, i) => `<button type="button" data-vp-mode="${i}" aria-pressed="${i === 0}">${x}</button>`).join('')}</div><div class="vp-clock"><button type="button" class="vp-play" aria-label="Simular animación ilustrativa">▶ Simular</button><button type="button" class="vp-reset" aria-label="Reiniciar vista previa" title="Reiniciar">↺</button><input type="range" min="0" max="100" step="1" value="0" aria-label="Avance de la vista previa"><output>0 %</output></div><div class="vp-note" role="status" aria-live="polite">Tipo · colores actuales del visor. Simular: animación ilustrativa.</div>`;
    workspace.insertBefore(bar, scene);
    const play = bar.querySelector('.vp-play'), range = bar.querySelector('input'), output = bar.querySelector('output'), note = bar.querySelector('.vp-note');
    const notes = ['Tipo · colores actuales del visor.', 'Tiempo · sin datos de visualización temporal vinculados.', 'Carga · sin datos de coloración por carga vinculados.', 'Daño · sin capa de daño disponible.', 'Frag. · sin capa de fragmentación disponible.'];
    let frame = 0, progress = 0, last = 0, running = false, mode = 0;
    function show() { window.MineCADAnimation?.setProgress(progress); range.value = String(Math.floor(progress)); output.value = Math.floor(progress) + ' %'; range.setAttribute('aria-valuetext', Math.floor(progress) + ' por ciento, animación ilustrativa'); }
    function stop() { running = false; cancelAnimationFrame(frame); play.textContent = progress >= 100 ? '↻ Repetir' : progress > 0 ? '▶ Reanudar' : '▶ Simular'; play.setAttribute('aria-label', progress >= 100 ? 'Repetir animación ilustrativa' : progress > 0 ? 'Reanudar animación ilustrativa' : 'Simular animación ilustrativa'); }
    function tick(now) { if (!running)
        return; if (last)
        progress = Math.min(100, progress + (now - last) / 80); last = now; show(); if (progress >= 100) {
        stop();
        note.textContent = notes[mode] + ' Vista previa finalizada; no representa una secuencia física.';
    }
    else
        frame = requestAnimationFrame(tick); }
    play.addEventListener('click', () => { if (running) {
        stop();
        return;
    } if (progress >= 100)
        progress = 0; show(); running = true; last = 0; play.textContent = 'Ⅱ Pausar'; play.setAttribute('aria-label', 'Pausar animación ilustrativa'); note.textContent = notes[mode] + ' Animación visual de sección y fragmentos; sin predicción física.'; frame = requestAnimationFrame(tick); });
    bar.querySelector('.vp-reset').addEventListener('click', () => { progress = 0; stop(); show(); note.textContent = notes[mode] + ' Vista previa restablecida.'; });
    range.addEventListener('input', () => { progress = Number(range.value); last = 0; show(); if (!running)
        stop(); });
    bar.querySelectorAll('[data-vp-mode]').forEach(button => button.addEventListener('click', () => { mode = Number(button.dataset.vpMode); bar.querySelectorAll('[data-vp-mode]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); note.textContent = notes[mode] + (mode ? ' Selección de interfaz; el dibujo conserva sus colores.' : ' Simular: animación ilustrativa.'); }));
    document.addEventListener('click', e => { const tab = e.target.closest?.('[data-view]'); if (tab) {
        bar.hidden = tab.dataset.view === 'stability';
        if (bar.hidden)
            stop();
    } });
    document.addEventListener('visibilitychange', () => { if (document.hidden)
        stop(); });
    window.addEventListener('pagehide', stop);
    show();
})();
