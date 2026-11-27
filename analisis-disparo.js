/**
 * analisis-disparo.js
 * Módulo de análisis de riesgo del disparo para Voladuras.
 * Modelos: USBM (PPV), Holmberg-Persson (daño), Kuz-Ram (fragmentación),
 *          Monte Carlo (secuencia) y análisis de tiros quedados.
 *
 * IMPORTANTE: todos los parámetros K, beta, A, etc. son valores de referencia
 * genéricos. Deben calibrarse con datos de campo (sismógrafo, granulometría).
 */

// ─────────────────────────────────────────────────────────────
// 1. VIBRACIÓN — USBM
// ─────────────────────────────────────────────────────────────

/**
 * PPV (mm/s) según modelo USBM.
 * @param {number} cargaPorRetardo  kg de explosivo por retardo
 * @param {number} distancia        distancia al punto de medida (m)
 * @param {number} K                constante del sitio (def. 1140)
 * @param {number} beta             exponente de atenuación (def. 1.60)
 */
export function calcularPPV(cargaPorRetardo, distancia, K = 1140, beta = 1.60) {
  if (distancia <= 0) return Infinity;
  return K * Math.pow(Math.sqrt(cargaPorRetardo) / distancia, beta);
}

/**
 * Distancia (m) a la que el PPV iguala un límite dado.
 */
export function distanciaLimitePPV(cargaPorRetardo, ppvLimite, K = 1140, beta = 1.60) {
  return Math.sqrt(cargaPorRetardo) / Math.pow(ppvLimite / K, 1 / beta);
}

/**
 * Curva PPV vs. distancia para graficar.
 * @returns {Array<{distancia:number, ppv:number}>}
 */
export function curvaPPV(cargaPorRetardo, distancias, K = 1140, beta = 1.60) {
  return distancias.map(d => ({ distancia: d, ppv: calcularPPV(cargaPorRetardo, d, K, beta) }));
}

// ─────────────────────────────────────────────────────────────
// 2. DAÑO Y SOBREEXCAVACIÓN — Holmberg-Persson (simplificado 2D)
// ─────────────────────────────────────────────────────────────

/**
 * PPV inducido por una carga cilíndrica en un punto (x,y), integrando
 * a lo largo del barreno. Integración numérica con N segmentos.
 *
 * @param {object} barreno  { x, y, longitud, cargaLineal, angulo (rad) }
 * @param {object} punto    { x, y }
 * @param {number} K        constante del sitio (def. 700)
 * @param {number} beta     exponente (def. 1.6)
 * @param {number} N        segmentos de integración (def. 40)
 */
export function ppvHolmbergPersson(barreno, punto, K = 700, beta = 1.6, N = 40) {
  const { x, y, longitud, cargaLineal, angulo = 0 } = barreno;
  const dx = longitud / N;
  let integral = 0;
  for (let i = 0; i < N; i++) {
    const s = (i + 0.5) * dx;                     // posición a lo largo del barreno
    const bx = x + s * Math.sin(angulo);
    const by = y - s * Math.cos(angulo);
    const R = Math.hypot(punto.x - bx, punto.y - by);
    if (R < 0.05) continue;                        // evitar singularidad
    integral += (cargaLineal * dx) / Math.pow(R, beta);
  }
  return K * integral;
}

/**
 * Sobreexcavación estimada: evalúa el PPV en el perímetro del túnel
 * y compara contra umbrales de daño (900 mm/s) y rotura (2700 mm/s).
 *
 * @param {Array<object>} barrenos  lista de barrenos con {x,y,longitud,cargaLineal,angulo}
 * @param {object} seccion          { ancho, alto, centroX, centroY, radioEquivalente }
 * @param {object} params           { K, beta, umbralDano, umbralRotura, puntosPerimetro }
 * @returns {object} { media, maxima, puntos: [{x,y,ppv,danado}] }
 */
export function estimarSobreexcavacion(barrenos, seccion, params = {}) {
  const {
    K = 700,
    beta = 1.6,
    umbralDano = 900,
    umbralRotura = 2700,
    puntosPerimetro = 72
  } = params;

  const { centroX = 0, centroY = 0, ancho, alto } = seccion;
  const rx = ancho / 2, ry = alto / 2;
  const puntos = [];

  for (let i = 0; i < puntosPerimetro; i++) {
    const t = (i / puntosPerimetro) * 2 * Math.PI;
    const px = centroX + rx * Math.cos(t);
    const py = centroY + ry * Math.sin(t);
    let ppvTotal = 0;
    for (const b of barrenos) {
      ppvTotal += ppvHolmbergPersson(b, { x: px, y: py }, K, beta);
    }
    const exceso =
      ppvTotal > umbralRotura ? 'rotura' :
      ppvTotal > umbralDano   ? 'dano'   : 'ok';
    puntos.push({ x: px, y: py, ppv: ppvTotal, estado: exceso });
  }

  const ppvs = puntos.map(p => p.ppv).filter(v => isFinite(v));
  const media = ppvs.reduce((a, b) => a + b, 0) / ppvs.length;
  const maxima = Math.max(...ppvs);
  // Sobreexcavación aproximada en metros (empírica: 0.02·PPV/900)
  const sobreMedia = 0.02 * (media / umbralDano);
  const sobreMax   = 0.23 * (maxima / umbralRotura);

  return { media, maxima, sobreMedia, sobreMax, puntos };
}

// ─────────────────────────────────────────────────────────────
// 3. FRAGMENTACIÓN — Kuz-Ram
// ─────────────────────────────────────────────────────────────

/**
 * Factor de roca A a partir de RMR (Cunningham 1987).
 */
export function factorRocaDesdeRMR(RMR) {
  return 0.06 * RMR + 0.88;
}

/**
 * Estimación Kuz-Ram de fragmentación.
 *
 * @param {object} diseno {
 *   burden, espaciamiento, diametro (mm), alturaBanco,
 *   longitudCarga, desviacionPerforacion, volumenPorBarreno,
 *   masaExplosivoPorBarreno, potenciaRelativa (ANFO=100)
 * }
 * @param {number} A  factor de roca (def. 7 = medio)
 * @returns {object} { X50, P80, n, bolonesPct, curva: [{x,P}] }
 */
export function estimarFragmentacionKuzRam(diseno, A = 7) {
  const {
    burden, espaciamiento, diametro, alturaBanco,
    longitudCarga, desviacionPerforacion = 0.05,
    volumenPorBarreno, masaExplosivoPorBarreno, potenciaRelativa = 100
  } = diseno;

  // Kuznetsov: X50 en cm
  const X50 =
    A *
    Math.pow(volumenPorBarreno / masaExplosivoPorBarreno, 0.8) *
    Math.pow(masaExplosivoPorBarreno, 1 / 6) *
    Math.pow(115 / potenciaRelativa, 19 / 30);

  // Cunningham: uniformidad n
  const n =
    (2.2 - 14 * (burden / diametro)) *
    Math.pow((1 + espaciamiento / burden) / 2, 0.5) *
    (1 - desviacionPerforacion / burden) *
    (longitudCarga / alturaBanco);

  // Rosin-Rammler (x en cm)
  const P = (x) => 1 - Math.exp(-Math.pow(x / X50, n));
  const P80 = X50 * Math.pow(Math.log(5), 1 / n);           // cm
  const bolonesPct = (1 - P(50)) * 100;                     // >50 cm = 0.5 m

  const curva = [];
  const xMax = X50 * 6;
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * xMax;
    curva.push({ x, P: P(x) });
  }

  return { X50, P80, n, bolonesPct, curva };
}

// ─────────────────────────────────────────────────────────────
// 4. CONFIABILIDAD DE SECUENCIA — Monte Carlo
// ─────────────────────────────────────────────────────────────

/**
 * Box-Muller para normal estándar.
 */
function randNormal() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Simula la secuencia de disparo con dispersión pirotécnica.
 * Cada barreno tiene un `retardo` nominal (ms) y opcionalmente un `dependeDe`
 * (id del barreno que le da cara libre). Si el retardo real del dependiente
 * no es posterior al de su matriz, cuenta como fuera de secuencia.
 *
 * @param {Array<object>} barrenos  [{id, retardo, dependeDe, masaExplosivo}]
 * @param {number} dispersionPct   dispersión 3σ (def. 3.0 %)
 * @param {number} corridas        número de simulaciones (def. 400)
 * @returns {object} { fueraSecuenciaPct, kgP50, kgP95, corridas }
 */
export function simularSecuencia(barrenos, dispersionPct = 3.0, corridas = 400) {
  let corridasConFalla = 0;
  const kgPorRetardo = [];

  for (let c = 0; c < corridas; c++) {
    const tiempos = new Map();
    let falla = false;

    for (const b of barrenos) {
      const sigma = (dispersionPct / 3 / 100) * b.retardo;
      const t = b.retardo + sigma * randNormal();
      tiempos.set(b.id, t);

      if (b.dependeDe != null) {
        const tMatriz = tiempos.get(b.dependeDe);
        if (tMatriz !== undefined && t <= tMatriz) falla = true;
      }
    }

    // kg por retardo único (agrupando por retardo nominal redondeado)
    const grupos = new Map();
    for (const b of barrenos) {
      const key = Math.round(b.retardo);
      grupos.set(key, (grupos.get(key) || 0) + b.masaExplosivo);
    }
    const maxKg = Math.max(...grupos.values());
    kgPorRetardo.push(maxKg);

    if (falla) corridasConFalla++;
  }

  kgPorRetardo.sort((a, b) => a - b);
  const pct = (p) => kgPorRetardo[Math.floor(p * (kgPorRetardo.length - 1))];

  return {
    fueraSecuenciaPct: (corridasConFalla / corridas) * 100,
    kgP50: pct(0.50),
    kgP95: pct(0.95),
    corridas
  };
}

// ─────────────────────────────────────────────────────────────
// 5. TIROS QUEDADOS Y BARRENOS CONGELADOS
// ─────────────────────────────────────────────────────────────

/**
 * Evalúa cada barreno:
 *  - ¿está "congelado" por diseño? (burden / Øequiv > umbral)
 *  - si no detona, ¿cuánto explosivo y roca quedan sin romper?
 *
 * @param {Array<object>} barrenos  [{id, burden, diametroEquivalente, masaExplosivo, tonelaje}]
 * @param {object} params { umbralCongelado = 2.1 }
 * @returns {object} { congelados, tirosQuedados }
 */
export function analizarTirosQuedados(barrenos, params = {}) {
  const { umbralCongelado = 2.1 } = params;

  const congelados = barrenos
    .filter(b => (b.burden / b.diametroEquivalente) > umbralCongelado)
    .map(b => ({ id: b.id, ratio: b.burden / b.diametroEquivalente }));

  // Peor caso: no detona el barreno con más carga
  const peor = barrenos.reduce(
    (acc, b) => (b.masaExplosivo > acc.masaExplosivo ? b : acc),
    barrenos[0]
  );

  return {
    congelados,
    totalCongelados: congelados.length,
    peorCaso: {
      id: peor.id,
      explosivoSinDetonar: peor.masaExplosivo,
      rocaSinRomper: peor.tonelaje,
      rocaSinRomperPct: (peor.tonelaje / barrenos.reduce((s, b) => s + b.tonelaje, 0)) * 100
    }
  };
}

// ─────────────────────────────────────────────────────────────
// 6. ORQUESTADOR — devuelve el dashboard completo
// ─────────────────────────────────────────────────────────────

/**
 * Ejecuta todos los análisis y devuelve un objeto con los indicadores
 * listos para pintar en el dashboard de riesgo.
 *
 * @param {object} datos  ver estructura en docs de integración
 * @returns {object} dashboard
 */
export function evaluarRiesgos(datos) {
  const {
    barrenos, seccion, roca = {}, explosivo = {},
    alivio = {}, diseno = {}, parametros = {}
  } = datos;

  // Carga máxima por retardo (para PPV)
  const gruposKg = new Map();
  for (const b of barrenos) {
    const k = Math.round(b.retardo);
    gruposKg.set(k, (gruposKg.get(k) || 0) + b.masaExplosivo);
  }
  const cargaMaxRetardo = Math.max(...gruposKg.values());
  const distRef = parametros.distRef ?? 30;
  const ppvRef = calcularPPV(cargaMaxRetardo, distRef, parametros.K, parametros.beta);

  // Vibración
  const ppv = {
    a30m: ppvRef,
    limite: parametros.ppvLimite ?? 100,
    distanciaCumple: distanciaLimitePPV(
      cargaMaxRetardo,
      parametros.ppvLimite ?? 100,
      parametros.K, parametros.beta
    ),
    curva: curvaPPV(
      cargaMaxRetardo,
      Array.from({ length: 50 }, (_, i) => (i + 1) * 2),
      parametros.K, parametros.beta
    )
  };

  // Sobreexcavación
  const sobre = estandarizarBarrenos(barrenos, seccion);
  const dano = estandarizarBarrenos ? estimarSobreexcavacion(sobre, seccion, parametros) : null;

  // Fragmentación
  const frag = estimarFragmentacionKuzRam(
    {
      burden: diseno.burden ?? 1.0,
      espaciamiento: diseno.espaciamiento ?? 1.1,
      diametro: diseno.diametro ?? 140,
      alturaBanco: diseno.alturaBanco ?? 4.0,
      longitudCarga: diseno.longitudCarga ?? 3.0,
      desviacionPerforacion: diseno.desviacionPerforacion ?? 0.05,
      volumenPorBarreno: diseno.volumenPorBarreno ?? 4.0,
      masaExplosivoPorBarreno: diseno.masaExplosivoPorBarreno ?? 25,
      potenciaRelativa: explosivo.potenciaRelativa ?? 100
    },
    roca.A ?? factorRocaDesdeRMR(roca.RMR ?? 60)
  );

  // Secuencia
  const secuencia = simularSecuencia(
    barrenos.map(b => ({
      id: b.id,
      retardo: b.retardo,
      dependeDe: b.dependeDe,
      masaExplosivo: b.masaExplosivo
    })),
    parametros.dispersionPct ?? 3.0,
    parametros.corridasMonteCarlo ?? 400
  );

  // Tiros quedados
  const tiros = analizarTirosQuedados(
    barrenos.map(b => ({
      id: b.id,
      burden: b.burden ?? diseno.burden ?? 1.0,
      diametroEquivalente: b.diametroEquivalente ?? alivio.diametroEquivalente ?? 0.144,
      masaExplosivo: b.masaExplosivo,
      tonelaje: b.tonelaje ?? 20
    })),
    parametros
  );

  // Arranque: avance vs. alivio
  const avanceRatio = (alivio.longitud ?? 4.0) / (alivio.profundidadEfectiva ?? 2.4);

  return {
    vibracion: ppv,
    dano,
    fragmentacion: frag,
    secuencia,
    tiros,
    arranque: {
      ratio: avanceRatio,
      estado: avanceRatio <= 1.7 ? 'ok' : avanceRatio <= 2.1 ? 'advertencia' : 'critico'
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Normaliza barrenos a {x,y,longitud,cargaLineal,angulo} para H-P.
 */
function estandarizarBarrenos(barrenos, seccion) {
  const cx = seccion.centroX ?? 0;
  const cy = seccion.centroY ?? 0;
  return barrenos.map(b => {
    const dx = (b.x ?? cx) - cx;
    const dy = (b.y ?? cy) - cy;
    return {
      x: b.x ?? cx,
      y: b.y ?? cy,
      longitud: b.longitud ?? 4.0,
      cargaLineal: b.cargaLineal ?? 1.75,
      angulo: Math.atan2(dx, -dy)  // apunta hacia afuera
    };
  });
}