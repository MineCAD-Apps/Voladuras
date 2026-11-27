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

export function renderDashboard(contenedor, resultado) {
  const { vibracion, dano, fragmentacion, secuencia, tiros, arranque } = resultado;

  const html = `
    <div class="analisis-grid">

      <section class="card">
        <h4>🚨 Mapa de riesgos</h4>
        ${barraRiesgo('Vibración a 30 m (PPV)', vibracion.a30m, vibracion.limite, 'mm/s')}
        ${barraRiesgo('Arranque — avance/alivio', arranque.ratio, 1.7, '', true)}
        ${barraRiesgo('Barrenos sin cara libre', tiros.totalCongelados, 1, '')}
        ${barraRiesgo('Sobreexcavación media', dano?.sobreMedia ?? 0, 0.02, 'm')}
        ${barraRiesgo('Secuencia fuera de orden', secuencia.fueraSecuenciaPct, 5, '%')}
        ${barraRiesgo('Bolones (>0.5 m)', fragmentacion.bolonesPct, 5, '%')}
      </section>

      <section class="card">
        <h4>📉 Vibración vs. distancia</h4>
        <canvas id="grafico-ppv" width="360" height="220"></canvas>
        <p class="nota">
          PPV a 30 m: <b>${vibracion.a30m.toFixed(1)} mm/s</b> ·
          Distancia que cumple ${vibracion.limite} mm/s: <b>${vibracion.distanciaCumple.toFixed(1)} m</b>
        </p>
      </section>

      <section class="card">
        <h4>💥 Daño y sobreexcavación</h4>
        <table class="tabla-riesgo">
          ${filaTabla('PPV medio perímetro', dano ? dano.media.toFixed(0) + ' mm/s' : '—')}
          ${filaTabla('PPV máximo perímetro', dano ? dano.maxima.toFixed(0) + ' mm/s' : '—')}
          ${filaTabla('Sobreexcavación media', dano ? dano.sobreMedia.toFixed(3) + ' m' : '—')}
          ${filaTabla('Sobreexcavación máxima', dano ? dano.sobreMax.toFixed(3) + ' m' : '—')}
        </table>
      </section>

      <section class="card">
        <h4>🪨 Fragmentación (Kuz-Ram)</h4>
        <table class="tabla-riesgo">
          ${filaTabla('X50 (tamaño medio)', fragmentacion.X50.toFixed(1) + ' cm')}
          ${filaTabla('P80', (fragmentacion.P80).toFixed(1) + ' cm')}
          ${filaTabla('Uniformidad n', fragmentacion.n.toFixed(2))}
          ${filaTabla('Bolones (>0.5 m)', fragmentacion.bolonesPct.toFixed(1) + ' %')}
        </table>
        <canvas id="grafico-fragmentacion" width="360" height="180"></canvas>
      </section>

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
          ${filaTabla('Barrenos congelados', tiros.totalCongelados,
                      tiros.totalCongelados > 0 ? 'advertencia' : 'ok')}
          ${filaTabla('Peor caso — barreno', tiros.peorCaso.id)}
          ${filaTabla('Explosivo sin detonar', tiros.peorCaso.explosivoSinDetonar.toFixed(1) + ' kg')}
          ${filaTabla('Roca sin romper', tiros.peorCaso.rocaSinRomper.toFixed(1) + ' t')}
        </table>
      </section>

    </div>
    <p class="nota-pie">
      ⚠️ Estimaciones de referencia sin calibrar. Confirmar con sismógrafo y granulometría de campo.
    </p>`;

  contenedor.innerHTML = html;
  dibujarCurvaPPV(contenedor.querySelector('#grafico-ppv'), vibracion);
  dibujarCurvaFragmentacion(contenedor.querySelector('#grafico-fragmentacion'), fragmentacion);
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
  ctx.fillStyle = '#475569';
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

  ctx.fillStyle = '#475569';
  ctx.font = '11px system-ui';
  ctx.fillText('Pasa (%)', 2, pad.t + 10);
  ctx.fillText('Tamaño (cm)', W - 70, H - 8);
  ctx.fillText('50 cm', sx(50) - 12, H - 8);
}

/**
 * Punto de entrada: lee datos de tu diseño y actualiza el panel.
 * Llama a esta función desde un botón o al cambiar inputs.
 */
export function actualizarAnalisis(contenedorId, datosDisparo) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) {
    console.warn(`[analisis-disparo] No existe #${contenedorId}`);
    return null;
  }
  const resultado = evaluarRiesgos(datosDisparo);
  renderDashboard(contenedor, resultado);
  return resultado;
}