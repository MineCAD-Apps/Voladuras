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
                <p id="spacing-capture-description">Compara hasta tres casos. Los campos conservan tu captura mientras esta página permanezca abierta.</p>
                <p class="sc-notice">Formato de captura · sin cálculo enlazado. No modifica los valores del diseño.</p>
                <section aria-labelledby="sc-inputs-title">
                    <h3 id="sc-inputs-title">A. Datos de entrada</h3>
                    <div class="sc-table-wrap" tabindex="0" role="region" aria-label="Tabla de captura de tres casos, desplazable horizontalmente">
                        <table class="sc-table">
                            <thead><tr><th scope="col">Concepto</th><th scope="col">Unidad</th>${[1,2,3].map(n=>`<th scope="col">Caso ${n}</th>`).join('')}</tr></thead>
                            <tbody>${fields.map(field=>`<tr><th scope="row">${field.label}</th><td class="sc-unit">${field.unit}</td>${[1,2,3].map(n=>`<td><input type="${field.type}" ${field.type==='number' ? `step="${field.step || 'any'}" inputmode="decimal"` : 'maxlength="160"'} name="case${n}.${field.key}" aria-label="${field.label}, caso ${n}" autocomplete="off" placeholder="${field.type==='number'?'—':'Sin capturar'}"></td>`).join('')}</tr>`).join('')}</tbody>
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
    let opener = null;
    const restoreFocus = () => {
        const button = document.getElementById('open-spacing-capture') || opener;
        if (button?.isConnected) button.focus();
    };
    const close = () => { dialog.close(); restoreFocus(); };
    dialog.querySelector('.sc-close').addEventListener('click', close);
    dialog.querySelector('.sc-done').addEventListener('click', close);
    dialog.addEventListener('close', restoreFocus);
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    });
    // Enter no dispara un cálculo ni envía datos del formulario.
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('input', () => { status.textContent = 'Captura conservada en esta ventana.'; });
    form.addEventListener('reset', () => { status.textContent = 'Campos vacíos.'; });
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
