// Módulo exclusivamente visual. No captura ni evalúa parámetros del diseño.
const button = document.getElementById('btn-analizar-disparo');
const panel = document.getElementById('analisis-disparo');
const closeButton = document.getElementById('cerrar-analisis-disparo');
if (button && panel && closeButton) {
  const setOpen = open => {
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    (open ? closeButton : button).focus();
  };
  button.addEventListener('click', () => setOpen(panel.hidden));
  closeButton.addEventListener('click', () => setOpen(false));
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
  });
}
