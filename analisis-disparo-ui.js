/**
 * analisis-disparo-ui.js
 * Renderizado del panel "Análisis del disparo — qué puede salir mal".
 * Depende de analisis-disparo.js
 */

import { evaluarRiesgos } from './analisis-disparo.js';

const COLOR = {
  ok: '#22c55e',
  advertencia: '#f59e0b',
  critico: '#ef4444'
};

function colorPorUmbral(valor, limite) {
  const r = valor / limite;
  if (r < 0.4) return 'ok';
  if (r < 0.7) return 'advertencia';
  return 'critico';
}

function barraRiesgo(nombre, valor, limite, unidad = '', invertido = false) {
  const ratio = invertido ? limite / valor : valor / limite;
  const estado = colorPorUmbral(ratio, 1);
  return `
    <div class="riesgo-item">
      <div class="riesgo-cabecera">
        <span class="riesgo-nombre">${nombre}</span>
        <span class="riesgo-valor" style="color:${COLOR[estado]}">
          ${valor.toFixed(2)} ${unidad}
        </span>
      </div>
      <div class="riesgo-barra">
        <div class="riesgo-barra-fill"
             style="width:${Math.min(ratio * 100, 100)}%; background:${COLOR[estado]}"></div>
      </div>
      <span class="riesgo-limite">Límite ref.: ${limite} ${unidad}</span>
    </div>`;
}

function filaTabla(nombre, valor, estado = 'ok') {
  return `<tr>
    <td>${nombre}</td>
    <td style="color:${COLOR[estado]}; font-weight:600">${valor}</td>
  </tr>`;
}

export function renderDashboard(contenedor, resultado, omitidos = [], avisos = []) {
  const { vibracion, dano, fragmentacion, secuencia, tiros, arranque } = resultado;

  const barras = [
    barraRiesgo('Vibración a 30 m (PPV)', vibracion.a30m, vibracion.limite, 'mm/s'),
    arranque ? barraRiesgo('Arranque — avance/alivio', arranque.ratio, 1.7, '', true) : '',
    tiros.aplicaCongelados ? barraRiesgo('Barrenos sin cara libre', tiros.totalCongelados, 1, '') : '',
    dano ? barraRiesgo('Sobreexcavación media', dano.sobreMedia, 0.02, 'm') : '',
    barraRiesgo('Secuencia fuera de orden', secuencia.fueraSecuenciaPct, 5, '%'),
    fragmentacion ? barraRiesgo('Bolones (>0.5 m)', fragmentacion.bolonesPct, 5, '%') : ''
  ].join('');

  const tarjetaDano = !dano ? '' : `
      <section class="card">
        <h4>💥 Daño y sobreexcavación</h4>
        <table class="tabla-riesgo">
          ${filaTabla('PPV medio perímetro', dano.media.toFixed(0) + ' mm/s')}
          ${filaTabla('PPV máximo perímetro', dano.maxima.toFixed(0) + ' mm/s')}
          ${filaTabla('Sobreexcavación media', dano.sobreMedia.toFixed(3) + ' m')}
          ${filaTabla('Sobreexcavación máxima', dano.sobreMax.toFixed(3) + ' m')}
        </table>
      </section>`;

  const tarjetaFrag = !fragmentacion ? '' : `
      <section class="card">
        <h4>🪨 Fragmentación (Kuz-Ram)</h4>
        <table class="tabla-riesgo">
          ${filaTabla('X50 (tamaño medio)', fragmentacion.X50.toFixed(1) + ' cm')}
          ${filaTabla('P80', fragmentacion.P80.toFixed(1) + ' cm')}
          ${filaTabla('Uniformidad n', fragmentacion.n.toFixed(2))}
          ${filaTabla('Bolones (>0.5 m)', fragmentacion.bolonesPct.toFixed(1) + ' %')}
        </table>
        <canvas id="grafico-fragmentacion" width="360" height="180"></canvas>
      </section>`;

  const filaCongelados = !tiros.aplicaCongelados ? '' :
    filaTabla('Barrenos congelados', tiros.totalCongelados, tiros.totalCongelados > 0 ? 'advertencia' : 'ok');
  const num = (v, d, u) => Number.isFinite(v) ? v.toFixed(d) + ' ' + u : '—';

  const html = `
    <div class="analisis-grid">

      <section class="card">
        <h4>🚨 Mapa de riesgos</h4>
        ${barras}
      </section>

      <section class="card">
        <h4>📉 Vibración vs. distancia</h4>
        <canvas id="grafico-ppv" width="360" height="220"></canvas>
        <p class="nota">
          PPV a 30 m: <b>${vibracion.a30m.toFixed(1)} mm/s</b> ·
          Distancia que cumple ${vibracion.limite} mm/s: <b>${vibracion.distanciaCumple.toFixed(1)} m</b>
        </p>
      </section>

      ${tarjetaDano}
      ${tarjetaFrag}

      <section class="card">
        <h4>⏱️ Confiabilidad de secuencia</h4>
        <table class="tabla-riesgo">
          ${filaTabla('Corridas fuera de orden', secuencia.fueraSecuenciaPct.toFixed(2) + ' %',
                      colorPorUmbral(secuencia.fueraSecuenciaPct, 5))}
          ${filaTabla('kg/retardo P50', secuencia.kgP50.toFixed(1) + ' kg')}
          ${filaTabla('kg/retardo P95', secuencia.kgP95.toFixed(1) + ' kg')}
          ${filaTabla('Corridas simuladas', secuencia.corridas)}
        </table>
      </section>

      <section class="card">
        <h4>🧨 Tiros quedados</h4>
        <table class="tabla-riesgo">
          ${filaCongelados}
          ${filaTabla('Peor caso — barreno', tiros.peorCaso.id)}
          ${filaTabla('Explosivo sin detonar', num(tiros.peorCaso.explosivoSinDetonar, 1, 'kg'))}
          ${filaTabla('Roca sin romper', num(tiros.peorCaso.rocaSinRomper, 1, 't'))}
        </table>
      </section>

    </div>
    ${avisos.length ? `<p class="nota-pie">${avisos.join(' · ')}</p>` : ''}
    ${omitidos.length ? `<p class="nota-pie">No evaluado: ${omitidos.map(o => `${o.analisis} (${o.motivo})`).join(' · ')}.</p>` : ''}
    <p class="nota-pie">
      ⚠️ Estimaciones de referencia sin calibrar. Confirmar con sismógrafo y granulometría de campo.
    </p>`;

  contenedor.innerHTML = html;
  dibujarCurvaPPV(contenedor.querySelector('#grafico-ppv'), vibracion);
  if (fragmentacion) dibujarCurvaFragmentacion(contenedor.querySelector('#grafico-fragmentacion'), fragmentacion);
}

function dibujarCurvaPPV(canvas, vibracion) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const { width: W, height: H } = canvas;
  const pad = { l: 45, r: 15, t: 15, b: 30 };
  const maxD = Math.max(...vibracion.curva.map(p => p.distancia));
  const maxY = Math.max(...vibracion.curva.map(p => p.ppv));
  const sx = d => pad.l + (d / maxD) * (W - pad.l - pad.r);
  const sy = v => H - pad.b - (v / maxY) * (H - pad.t - pad.b);

  ctx.clearRect(0, 0, W, H);

  // Ejes
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.l, pad.t);
  ctx.lineTo(pad.l, H - pad.b);
  ctx.lineTo(W - pad.r, H - pad.b);
  ctx.stroke();

  // Línea límite
  ctx.strokeStyle = COLOR.critico;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(pad.l, sy(vibracion.limite));
  ctx.lineTo(W - pad.r, sy(vibracion.limite));
  ctx.stroke();
  ctx.setLineDash([]);

  // Curva
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  vibracion.curva.forEach((p, i) => {
    const x = sx(p.distancia), y = sy(p.ppv);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Punto a 30 m
  const p30 = vibracion.curva.find(p => p.distancia === 30);
  if (p30) {
    ctx.fillStyle = COLOR.critico;
    ctx.beginPath();
    ctx.arc(sx(30), sy(p30.ppv), 4, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Etiquetas
  ctx.fillStyle = '#a6bfd0';
  ctx.font = '11px system-ui';
  ctx.fillText('PPV (mm/s)', 4, pad.t + 10);
  ctx.fillText('Distancia (m)', W - 70, H - 8);
}

function dibujarCurvaFragmentacion(canvas, frag) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const { width: W, height: H } = canvas;
  const pad = { l: 40, r: 10, t: 10, b: 25 };
  const maxX = frag.curva[frag.curva.length - 1].x;
  const sx = x => pad.l + (x / maxX) * (W - pad.l - pad.r);
  const sy = p => H - pad.b - p * (H - pad.t - pad.b);

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(pad.l, pad.t);
  ctx.lineTo(pad.l, H - pad.b);
  ctx.lineTo(W - pad.r, H - pad.b);
  ctx.stroke();

  // Marca en 50 cm (bolones)
  ctx.strokeStyle = COLOR.advertencia;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(sx(50), pad.t);
  ctx.lineTo(sx(50), H - pad.b);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  frag.curva.forEach((p, i) => {
    const x = sx(p.x), y = sy(p.P);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = '#a6bfd0';
  ctx.font = '11px system-ui';
  ctx.fillText('Pasa (%)', 2, pad.t + 10);
  ctx.fillText('Tamaño (cm)', W - 70, H - 8);
  ctx.fillText('50 cm', sx(50) - 12, H - 8);
}

/**
 * Convierte lo capturado en la app (MineCADLayerData.disparo()) al formato de evaluarRiesgos().
 * Solo usa datos capturados; lo que falta se reporta en `omitidos`, no se rellena.
 * Supuestos: masa por barreno = π/4·Ø²·densidad·(acoplamiento)²·(largo − taco); si el taco no está
 * capturado se carga todo el largo (sobreestima);
 * tonelaje por barreno = bordo·espaciamiento·largo·densidad del mineral; cada barreno depende
 * del mismo número de barreno del anillo anterior (su cara libre).
 */
export function datosDesdeDiseno(snap) {
  if (!snap || snap.ok === false) return { error: snap?.motivo || 'No hay diseño disponible.' };
  const { barrenos, perforacion: p, carga: c, tiempos: t, roca: r } = snap;
  const falta = [];
  if (!(p.diameterMm > 0)) falta.push('diámetro de barreno');
  if (!(p.burdenM > 0)) falta.push('bordo entre anillos');
  if (!(p.spacingM > 0)) falta.push('espaciamiento');
  if (!(c.density > 0)) falta.push('densidad del explosivo');
  if (t.ringMs === null) falta.push('retardo entre anillos');
  if (falta.length) return { error: 'Falta capturar: ' + falta.join(', ') + '.' };
  if (!barrenos.length) return { error: 'El diseño no genera barrenos.' };

  const d = p.diameterMm / 1000;
  const acopl = c.coupling == null ? 1 : Math.pow(c.coupling / 100, 2);
  const rho = r?.oreDensity > 0 ? r.oreDensity : null;
  const ringMs = t.ringMs, holeMs = t.holeMs ?? 0;
  const primero = snap.anillos[0]?.index ?? 0;

  const lista = barrenos.map(b => {
    const [, , m] = /^R(\d+)-(\d+)$/.exec(b.id) || [];
    const anillo = Number(/^R(\d+)-/.exec(b.id)?.[1]) - 1;
    const largo = Math.hypot(b.toe[0] - b.collar[0], b.toe[2] - b.collar[2]);
    const num = Number(m);
    const largoCarga = Math.max(0, largo - (c.stemmingM ?? 0));
    return {
      id: b.id, anillo, num, largo, largoCarga,
      retardo: (anillo - primero) * ringMs + (num - 1) * holeMs,
      dependeDe: anillo > primero ? `R${anillo}-${num}` : null,
      masaExplosivo: Math.PI / 4 * d * d * c.density * 1000 * acopl * largoCarga,
      tonelaje: rho ? p.burdenM * p.spacingM * largo * rho : undefined
    };
  });
  const ids = new Set(lista.map(b => b.id));
  for (const b of lista) if (b.dependeDe && !ids.has(b.dependeDe)) b.dependeDe = null;

  const prom = k => lista.reduce((s, b) => s + b[k], 0) / lista.length;
  const largoMed = prom('largo'), cargaMed = prom('largoCarga'), masaMed = prom('masaExplosivo');

  const omitidos = [
    { analisis: 'Daño y sobreexcavación', motivo: 'requiere sección de túnel; no aplica a anillos' },
    { analisis: 'Arranque avance/alivio', motivo: 'no hay barrenos de alivio capturados' },
    { analisis: 'Barrenos congelados', motivo: 'requiere Ø equivalente de alivio' }
  ];
  if (!rho) omitidos.push({ analisis: 'Roca sin romper', motivo: 'falta densidad del mineral' });
  if (!(r?.rmr >= 0)) omitidos.push({ analisis: 'Fragmentación', motivo: 'falta RMR' });

  const avisos = c.stemmingM == null
    ? ['Taco no capturado: se asume carga en todo el largo del barreno (masa sobreestimada). Captúralo en «Explosivo y carga».']
    : [];
  return {
    omitidos, avisos,
    datos: {
      barrenos: lista,
      roca: { RMR: r?.rmr ?? undefined },
      diseno: {
        burden: p.burdenM, espaciamiento: p.spacingM, diametro: p.diameterMm,
        alturaBanco: largoMed, longitudCarga: cargaMed,
        volumenPorBarreno: rho ? p.burdenM * p.spacingM * largoMed : undefined,
        masaExplosivoPorBarreno: masaMed
      },
      parametros: { distRef: 30 }
    }
  };
}

/**
 * Punto de entrada: evalúa y pinta el panel. Acepta datos ya normalizados.
 */
export function actualizarAnalisis(contenedorId, datosDisparo, omitidos = [], avisos = []) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) {
    console.warn(`[analisis-disparo] No existe #${contenedorId}`);
    return null;
  }
  const resultado = evaluarRiesgos(datosDisparo);
  renderDashboard(contenedor, resultado, omitidos, avisos);
  return resultado;
}

// ─────────────────────────────────────────────────────────────
// Conexión del botón «Analizar disparo» con el diseño de la app
// ─────────────────────────────────────────────────────────────

function analizarDiseno() {
  const cont = document.getElementById('dashboard-riesgos');
  if (!cont) return;
  const mensaje = txt => { cont.innerHTML = `<p class="analisis-disparo-vacio" role="status">${txt}</p>`; };
  try {
    const api = window.MineCADLayerData;
    if (!api?.disparo) return mensaje('La app aún no expone los datos del disparo.');
    const r = datosDesdeDiseno(api.disparo());
    if (r.error) return mensaje(r.error);
    actualizarAnalisis('dashboard-riesgos', r.datos, r.omitidos, r.avisos);
  } catch (e) {
    console.error('[analisis-disparo]', e);
    mensaje('No se pudo analizar el disparo: ' + e.message);
  }
}

function conectarPanel() {
  const btn = document.getElementById('btn-analizar-disparo');
  const panel = document.getElementById('analisis-disparo');
  if (!btn || !panel || btn.dataset.analisisConectado) return;
  btn.dataset.analisisConectado = '1';

  // Si otro script ya abre/cierra el panel, no se duplica: solo se completa lo que falte.
  let estabaOculto = true;
  btn.addEventListener('click', () => { estabaOculto = panel.hidden; }, true);
  btn.addEventListener('click', () => setTimeout(() => {
    if (panel.hidden === estabaOculto) {            // nadie alternó el panel
      panel.hidden = !estabaOculto;
      btn.setAttribute('aria-expanded', String(!panel.hidden));
    }
    if (!panel.hidden) analizarDiseno();
  }, 0));

  const cerrar = document.getElementById('cerrar-analisis-disparo');
  cerrar?.addEventListener('click', () => setTimeout(() => {
    if (!panel.hidden) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
  }, 0));

  // Mientras está abierto, se refresca al cambiar el diseño (con espera por el Monte Carlo).
  let tmr = null;
  document.addEventListener('minecad:datos', () => {
    if (panel.hidden) return;
    clearTimeout(tmr);
    tmr = setTimeout(analizarDiseno, 400);
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', conectarPanel);
else conectarPanel();
