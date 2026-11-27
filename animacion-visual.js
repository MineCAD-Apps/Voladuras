/* Efectos gráficos ilustrativos. No consulta cargas, retardos ni modelos físicos.
   Solo retransmite al visor la capa de datos ya capturados (setLayer); no calcula nada. */
(() => {
    'use strict';
    const svgNS = 'http://www.w3.org/2000/svg';
    let progress = 0, section = null, source = null, overlay = null, cells = [], layer = null;
    const listeners = new Set();
    // Capa de datos suministrados (Carga/Tiempo capturados por el usuario). Cuando está activa se oculta el efecto decorativo.
    const layerActive = () => !!layer && layer.state === 'disponible' && (!!layer.all || !!layer.byRing);
    const clamp = x => Math.max(0, Math.min(1, x));
    /* Reloj común de la animación. Los tiempos en ms vienen de la secuencia capturada;
       las constantes siguientes son segundos de pantalla y solo afectan el aspecto. */
    const DENSITY_2D = 1.5; // fragmentos por m³ en la sección (ilustrativo)
    const LEAD = .35, GLOW = .9, FALL = 1.3, JITTER = .25, TAIL = 1.8, AUTO_SECONDS = 12;
    let speed = 'auto';
    function timeline(p = progress) {
        const seq = window.MineCADLayerData?.sequence?.();
        if (!seq?.available) return null;
        // rate = segundos de secuencia por segundo de pantalla.
        const rate = speed === 'auto' ? (seq.fullMs > 0 ? seq.fullMs / 1000 / AUTO_SECONDS : 1) : speed;
        const at = ms => LEAD + ms / 1000 / rate, durationS = at(seq.totalMs) + TAIL, tau = p / 100 * durationS;
        return { seq, rate, durationS, tau, ms: Math.max(0, Math.min(seq.totalMs, (tau - LEAD) * rate * 1000)), age: ms => tau - at(ms) };
    }
    // Intensidad del resplandor: máxima al iniciar el barreno y cero después de GLOW.
    const glow = age => age < 0 || age >= GLOW ? 0 : Math.pow(1 - age / GLOW, 1.5);
    let built = null;
    const seed = n => { const x = Math.sin(n * 127.1 + 37.7) * 43758.5453; return x - Math.floor(x); };
    // ---- Geometría común a 2D y 3D ----
    // Intervalos [x0, x1] donde la recta horizontal a la cota z corta un polígono [[x, z], …] (regla par-impar).
    function polyIntervals(points, z) {
        const cuts = [];
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const [xi, zi] = points[i], [xj, zj] = points[j];
            if ((zi > z) !== (zj > z)) cuts.push(xi + (z - zi) / (zj - zi) * (xj - xi));
        }
        cuts.sort((a, b) => a - b);
        const out = [];
        for (let i = 0; i + 1 < cuts.length; i += 2) out.push([cuts[i], cuts[i + 1]]);
        return out;
    }
    const inPoly = (points, x, z) => polyIntervals(points, z).some(([a, b]) => x >= a && x <= b);
    const parsePoints = text => String(text ?? '').trim().split(/\s+/).map(p => p.split(',').map(Number)).filter(p => p.length === 2 && p.every(Number.isFinite));
    // Ancho de la veta a la cota z, interpolado entre las muestras de la geometría.
    function interpRow(samples, z) {
        const first = samples[0], last = samples[samples.length - 1];
        if (z <= first.z) return first;
        if (z >= last.z) return last;
        let lo = 0, hi = samples.length - 1;
        while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (samples[mid].z <= z) lo = mid; else hi = mid; }
        const a = samples[lo], b = samples[hi], f = (z - a.z) / ((b.z - a.z) || 1);
        return { z, left: a.left + (b.left - a.left) * f, right: a.right + (b.right - a.right) * f };
    }
    // Tramos de la veta a la cota z que son roca: [left, right] menos los huecos de las obras.
    function solidIntervals(row, drifts, z) {
        let spans = [[row.left, row.right]];
        for (const drift of drifts)
            for (const [a, b] of polyIntervals(drift, z)) {
                const next = [];
                for (const [l, r] of spans) {
                    if (b <= l || a >= r) next.push([l, r]);
                    else { if (a > l) next.push([l, a]); if (b < r) next.push([b, r]); }
                }
                spans = next;
            }
        return spans.filter(([l, r]) => r - l > 1e-6);
    }
    function node(tag, attributes) {
        const e = document.createElementNS(svgNS, tag);
        for (const [key, value] of Object.entries(attributes)) e.setAttribute(key, value);
        return e;
    }
    function render2D() {
        const frame = document.querySelector('.scene-wrap');
        let caption = document.getElementById('illustration-caption');
        if (frame && !caption) {
            caption = document.createElement('span'); caption.id = 'illustration-caption';
            caption.style.cssText = 'position:absolute;right:10px;top:8px;z-index:4;pointer-events:none;padding:4px 8px;border:1px solid #a88840;border-radius:12px;background:#102234e8;color:#ffe2a0;font:11px Segoe UI,sans-serif';
            frame.append(caption);
        }
        if (caption) {
            if (layerActive()) { caption.hidden = !layer.caption; caption.textContent = layer.caption || ''; }
            else { const t = timeline(); caption.hidden = progress <= 0; caption.textContent = 'Animación ilustrativa · ' + (t ? Math.round(t.ms) + ' / ' + Math.round(t.seq.totalMs) + ' ms' : Math.floor(progress) + ' %'); }
        }
        const svg = document.querySelector('#section');
        const vein = svg?.querySelector('polygon[fill="#e5b66b65"]');
        if (!svg || !vein) { overlay?.remove(); source = null; return; }
        const tl = timeline(), seq = tl?.seq ?? null;
        if (section !== svg || source !== vein || built !== seq || !overlay?.isConnected) {
            overlay?.remove(); source = null; cells = [];
            const box = vein.getBBox();
            if (!box.width || !box.height) return; // sección oculta: se construye al mostrarla
            section = svg; source = vein; built = seq;
            overlay = node('g', { 'data-visual-animation': '', 'pointer-events': 'none', 'aria-hidden': 'true' });
            const points = vein.getAttribute('points');
            const defs = node('defs', {}), clip = node('clipPath', { id: 'minecad-illustration-clip' });
            clip.append(node('polygon', { points })); defs.append(clip); overlay.append(defs);
            // Las obras inferior y superior son huecos: la ilustración no los cubre.
            const veinPts = parsePoints(points), driftNodes = [...svg.querySelectorAll('polygon[data-drift]')];
            const drifts = driftNodes.map(d => parsePoints(d.getAttribute('points')));
            const pad = Math.max(box.width, box.height), mask = node('mask', { id: 'minecad-illustration-mask', maskUnits: 'userSpaceOnUse', x: box.x - pad, y: box.y - pad, width: box.width + 2 * pad, height: box.height + 2 * pad });
            mask.append(node('polygon', { points, fill: '#fff' }));
            for (const d of driftNodes) mask.append(node('polygon', { points: d.getAttribute('points'), fill: '#000' }));
            defs.append(mask);
            const solid = (x, y) => inPoly(veinPts, x, y) && !drifts.some(d => inPoly(d, x, y));
            // Cantidad de material según el volumen: área de la sección con roca × espaciamiento entre líneas × líneas mostradas.
            let area = 0; const GRID = 48;
            for (let a = 0; a < GRID; a++) for (let b = 0; b < GRID; b++) if (solid(box.x + box.width * (a + .5) / GRID, box.y + box.height * (b + .5) / GRID)) area += box.width * box.height / (GRID * GRID);
            const volume = area * (window.MineCADLayerData?.burden?.() ?? 1) * (seq?.rings?.length ?? 1);
            const total = Math.max(12, Math.min(700, Math.round(DENSITY_2D * volume)));
            const texture = node('g', { 'clip-path': 'url(#minecad-illustration-clip)' });
            const addRock = (i, x, y, time) => {
                const r = Math.max(box.height * .008, Math.min(box.width * .14, box.height * .022)) * (.65 + seed(i + 300));
                const rock = node('path', { d: `M${x-r},${y} l${r*.5},${-r} ${r*1.4},${r*.25} ${r*.4},${r} ${-r*.8},${r*.8} Z`, fill: ['#92704b','#b59261','#d2b077'][i % 3], stroke: '#5a4935', 'stroke-width': box.height * .0009 });
                texture.append(rock); cells.push({ node: rock, time, offset: seed(i + 601), travel: box.height * (.035 + seed(i + 900) * .055) });
            };
            // Con secuencia, cada fragmento nace sobre la proyección de su barreno de origen.
            const groups = new Map();
            if (seq) for (const line of svg.querySelectorAll('[data-visual-hole]')) {
                const xy = ['x1','y1','x2','y2'].map(a => Number(line.getAttribute(a))), key = xy.join(',');
                if (!groups.has(key)) groups.set(key, { xy, times: new Set() });
                for (const t of seq.times.get(line.dataset.holeId) ?? []) groups.get(key).times.add(t);
            }
            let n = 0;
            const lengths = [...groups.values()].reduce((a, g) => a + g.times.size, 0) || 1;
            for (const { xy: [x1, y1, x2, y2], times } of groups.values()) {
                const list = [...times].sort((a, b) => a - b);
                if (!list.length) continue;
                const inside = [], probe = svg.createSVGPoint();
                for (let k = 0; k <= 40; k++) {
                    probe.x = x1 + (x2 - x1) * k / 40; probe.y = y1 + (y2 - y1) * k / 40;
                    if (vein.isPointInFill(probe) && solid(probe.x, probe.y)) inside.push([probe.x, probe.y]);
                }
                if (!inside.length) continue;
                const count = Math.max(1, Math.round(total * list.length / lengths));
                for (let i = 0; i < count; i++, n++) {
                    const [x, y] = inside[Math.floor(seed(n + 1) * inside.length)];
                    const time = list[list.length > count ? Math.floor(i * list.length / count) : i % list.length];
                    addRock(n, x + (seed(n + 191) - .5) * box.width * .12, y + (seed(n + 77) - .5) * box.height * .025, time);
                }
            }
            if (!cells.length) for (let i = 0; i < total; i++) {
                let x = box.x + seed(i + 1) * box.width, y = box.y + seed(i + 191) * box.height;
                for (let t = 1; t < 16 && !solid(x, y); t++) { x = box.x + seed(i + 1 + t * 53) * box.width; y = box.y + seed(i + 191 + t * 71) * box.height; }
                addRock(i, x, y, null);
            }
            const flash = node('polygon', { points, fill: '#ffe4a0', 'data-animation-flash': '' });
            const body = node('g', { mask: 'url(#minecad-illustration-mask)' }); body.append(texture, flash); overlay.append(body);
            // Detrás de los barrenos, para que su color siga visible.
            const anchor = svg.querySelector('[data-visual-hole]');
            if (anchor) svg.insertBefore(overlay, anchor); else svg.append(overlay);
        }
        overlay.style.display = progress > 0 && !layerActive() ? '' : 'none';
        const p = progress / 100, flash = overlay.querySelector('[data-animation-flash]');
        flash.setAttribute('opacity', String(!tl && p < .2 ? Math.sin(p / .2 * Math.PI) * .5 : 0));
        for (const cell of cells) {
            let phase, opacity;
            if (tl && cell.time !== null) {
                const age = tl.age(cell.time) - cell.offset * JITTER;
                phase = clamp(age / FALL); opacity = age < 0 ? 0 : Math.min(.82, .35 + age * 3);
            }
            else { phase = clamp((p - .12 - cell.offset * .14) / .62); opacity = phase * .82; }
            cell.node.setAttribute('opacity', String(opacity));
            cell.node.setAttribute('transform', `translate(0 ${phase * phase * cell.travel})`);
        }
    }
    const veinAtSample = (samples, y) => samples.reduce((a, b) => Math.abs(b.z - y) < Math.abs(a.z - y) ? b : a);
    function create3D(viewer, types) {
        const { Pn, Vt, Pt, Jt, js } = types;
        const group = new Pn(); group.visible = false; viewer.scene.add(group);
        const geometry = new Vt();
        geometry.setAttribute('position', new Pt([-1,-.5,-.6, 1,-.5,-.6, 0,1,.1, 0,-.5,1], 3));
        geometry.setIndex([0,2,1, 0,1,3, 1,2,3, 2,0,3]); geometry.computeVertexNormals();
        const materials = [0x997649,0xc29a60,0xdfb979].map(color => new js({ color, roughness: .96, transparent: true, opacity: .93 }));
        /* Cantidad de fragmentos proporcional al volumen de cada línea: ancho × alto de la sección con roca
           (sin los huecos de las obras) × espesor de su losa (espaciamiento entre líneas). La densidad es
           ilustrativa; si el diseño pide más de MAX_PIECES se reduce igual para todas las líneas. */
        const MAX_PIECES = 15000, DENSITY = 12, FILL_ILUSTRATIVO = .55, MIN_PIECES = 4, rocks = [];
        /* Modelo de volumen del montón (ver «Abundamiento y contrapozo» en setGeometry).
           Las piezas se acomodan como esferas de radio sphereK·x (x = lado del bloque cúbico). Con SPHERE_K0 la esfera tiene el
           mismo volumen que el bloque; sphereK se calcula en cada geometría para que el montón ocupe S·V al acomodarse.
           PACK: fracción sólida que logra el acomodo de esferas de settle(); se calibra con la lectura «montón dibujado» de la
           etiqueta (PACK_nuevo = PACK · objetivo / dibujado). SPHERE_KMAX limita lo grandes que pueden verse las esferas.
           X_CORTES: lados (m) candidatos bajo los cuales el material se trata como finos que rellenan huecos y no se dibuja;
           se elige el menor con que quepa todo en MAX_PIECES. */
        const SPHERE_K0 = Math.cbrt(3 / (4 * Math.PI)), SPHERE_KMAX = .92, PACK = .385;
        const X_CORTES = [.03, .04, .05, .06, .08, .10, .125, .15, .20];
        let sphereK = SPHERE_K0, slotT = 0, labelBase = '', heapDirty = false;
        /* Tabla de tamaños por NÚMERO de piezas a partir de la curva de MASA pasante Rosin-Rammler (X50 en cm).
           Rosin-Rammler describe masa, no conteo: la densidad en número es ∝ (dP/dx)/x³, truncada en xMin.
           sizeAt(q): lado (m) del bloque en el cuantil q (0..1) de esa distribución en número.
           meanVol: E[x³] (m³) de las piezas dibujadas. massFines: fracción de masa bajo xMin (no dibujada). */
        function rrTable(X50cm, n, xMin) {
            const Xc = X50cm / Math.pow(Math.LN2, 1 / n) / 100;                       // m
            const P = x => 1 - Math.exp(-Math.pow(x / Xc, n));
            const xMax = Math.max(xMin * 2, Xc * Math.pow(-Math.log(1e-4), 1 / n));    // P = .9999
            const K = 600, lo = Math.log(xMin), step = (Math.log(xMax) - lo) / K;
            const edge = i => Math.exp(lo + step * i), cdf = [0];
            let count = 0, mass = 0;
            for (let i = 0; i < K; i++) {
                const xm = edge(i + .5), dm = P(edge(i + 1)) - P(edge(i));
                count += dm / (xm * xm * xm); mass += dm; cdf.push(count);
            }
            const sizeAt = q => {
                const target = Math.max(0, Math.min(1, q)) * count;
                let a = 0, b = K;
                while (b - a > 1) { const m = (a + b) >> 1; if (cdf[m] <= target) a = m; else b = m; }
                const f = cdf[b] > cdf[a] ? (target - cdf[a]) / (cdf[b] - cdf[a]) : 0;
                return Math.exp(lo + step * (a + f));
            };
            return { sizeAt, meanVol: mass / count, massFines: P(xMin), xMin };
        }
        let pile = null, settledRate = null, slabs = [], stats = null, lastArgs = null, lastKR = '';
        function resizePieces(count) {
            while (rocks.length > count) group.remove(rocks.pop().mesh);
            while (rocks.length < count) {
                const i = rocks.length;
                const mesh = new Jt(geometry, materials[i % materials.length]);
                mesh.visible = false; group.add(mesh);
                rocks.push({ mesh, x: 0, y: 0, z: 0, radius: .1, size: .1, rest: null, run: null, ring: 0, phase: seed(i + 700) });
            }
        }
        let ready = false;
        const krKey = (kr, muck) => (kr && kr.X50 > 0 && kr.n > .3 && kr.n < 6 ? kr.X50 + '|' + kr.n : '') + '#' + (muck ? muck.swellRaw + '|' + muck.slotDiameterM : '');
        const info = document.createElement('div');
        info.style.cssText = 'position:absolute;left:10px;bottom:8px;z-index:4;pointer-events:none;max-width:calc(100% - 20px);line-height:1.35;padding:3px 8px;border:1px solid #a88840;border-radius:12px;background:#102234e8;color:#ffe2a0;font:11px Segoe UI,sans-serif';
        info.hidden = true; viewer.el.appendChild(info);
        function veinAt(y) {
            const s = pile.samples, t = clamp((y - s[0].z) / (s[s.length - 1].z - s[0].z || 1)) * (s.length - 1);
            const i = Math.min(s.length - 2, Math.floor(t)), f = t - i, a = s[i], b = s[i + 1];
            return { left: a.left + (b.left - a.left) * f, right: a.right + (b.right - a.right) * f };
        }
        /* Acomodo geométrico (no es una simulación física): cada fragmento se trata como una esfera,
           se apoya en el piso o sobre los que llegaron antes y rueda mientras la pendiente supere el
           reposo ilustrativo. Se calcula una vez, así la barra puede avanzar y retroceder.
           Roca sin detonar: en la veta, el material de una línea no pasa del punto medio entre la última
           línea detonada y la siguiente sin detonar. Solo dentro del hueco de la obra inferior corre hacia
           ese lado y forma el talud. */
        function settle(tl) {
            settledRate = tl ? tl.rate : 0;
            const REPOSE = .75; // tangente del ángulo (unos 37°)
            const maxDrop = Math.max(1, pile.top - pile.floor);
            const sizes = rocks.map(r => r.size * sphereK), cell = Math.max(.1, 2 * sizes.reduce((a, b) => Math.max(a, b), 0));
            const grid = new Map(), keyOf = (i, k) => i * 100003 + k;
            const begin = rock => {
                const time = tl && rock.hole ? tl.seq.times.get(rock.hole)?.[0] : undefined;
                return time === undefined ? 0 : time / 1000 / tl.rate;
            };
            const arrival = rock => begin(rock) + rock.phase * JITTER + Math.sqrt(Math.max(0, rock.y - pile.floor) / maxDrop) * FALL;
            // Instante (s de pantalla) en que detona cada línea: su primer barreno. Sin secuencia, todas a la vez.
            const lineStart = slabs.map(s => {
                if (!tl) return 0;
                let t = Infinity;
                for (const id of s.holes) { const v = tl.seq.times.get(id)?.[0]; if (v !== undefined && v < t) t = v; }
                return Number.isFinite(t) ? t / 1000 / tl.rate : 0;
            });
            const touching = (a, b) => Math.abs(slabs[a].hi - slabs[b].lo) < 1e-3;
            // Tramo de roca ya abierta (contigua y detonada) que contiene la losa de la línea k en el instante T.
            const openRun = (k, T) => {
                let lo = slabs[k].lo, hi = slabs[k].hi;
                for (let m = k - 1; m >= 0 && touching(m, m + 1) && lineStart[m] <= T + 1e-9; m--) lo = slabs[m].lo;
                // Contrapozo/ranura ya ejecutado: hueco previo (espesor equivalente) pegado a la primera línea, abierto desde el inicio.
                if (slotT > 0 && lo <= slabs[0].lo + 1e-9) lo = slabs[0].lo - slotT;
                for (let m = k + 1; m < slabs.length && touching(m - 1, m) && lineStart[m] <= T + 1e-9; m++) hi = slabs[m].hi;
                return { lo, hi };
            };
            for (const rock of rocks) rock.run = openRun(rock.ring, begin(rock) + rock.phase * JITTER);
            const order = rocks.map((rock, i) => [arrival(rock), i]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            // Altura de apoyo en (x, z): x limitado a las paredes y z a la roca abierta, salvo dentro del hueco inferior.
            const support = (x, z, r, run) => {
                let y = pile.floor + r;
                for (let pass = 0; pass < 3; pass++) {
                    const vein = veinAt(y), inDrift = y < pile.crown;
                    const lo = (inDrift ? Math.min(pile.left, vein.left) : vein.left) + r, hi = (inDrift ? Math.max(pile.right, vein.right) : vein.right) - r;
                    const nx = lo > hi ? (lo + hi) / 2 : Math.max(lo, Math.min(hi, x));
                    const open = pile.hollow && inDrift && nx >= pile.left && nx <= pile.right;
                    const zlo = open ? r - slotT : run.lo + r, zhi = open ? pile.length - r : run.hi - r;
                    const nz = zlo > zhi ? (zlo + zhi) / 2 : Math.max(zlo, Math.min(zhi, z));
                    if (pass && Math.abs(nx - x) < 1e-4 && Math.abs(nz - z) < 1e-4) break;
                    x = nx; z = nz; y = pile.floor + r;
                    const ci = Math.floor(x / cell), ck = Math.floor(z / cell);
                    for (let i = ci - 1; i <= ci + 1; i++) for (let k = ck - 1; k <= ck + 1; k++)
                        for (const s of grid.get(keyOf(i, k)) ?? []) {
                            const reach = r + s.r, d2 = (x - s.x) ** 2 + (z - s.z) ** 2;
                            if (d2 < reach * reach) y = Math.max(y, s.y + Math.sqrt(reach * reach - d2));
                        }
                }
                return { x, y, z };
            };
            const directions = Array.from({ length: 8 }, (_, i) => [Math.cos(i * Math.PI / 4), Math.sin(i * Math.PI / 4)]);
            for (const [, index] of order) {
                const rock = rocks[index], r = sizes[index], run = rock.run;
                const base = veinAt(pile.floor + r);
                let best = support(base.left + (base.right - base.left) * rock.u, rock.z, r, run);
                // Sondeo a dos distancias: una corta no «ve» la caída desde la cima de otra pieza.
                for (let n = 0; n < 40; n++) {
                    let next = null, slope = REPOSE;
                    for (const distance of [r * 2.4, r * 5])
                        for (let d = 0; d < 8; d++) {
                            const [dx, dz] = directions[(d + index) % 8];
                            const candidate = support(best.x + dx * distance, best.z + dz * distance, r, run);
                            const found = (best.y - candidate.y) / distance;
                            if (found > slope) { slope = found; next = candidate; }
                        }
                    if (!next) break;
                    best = next;
                }
                rock.rest = { x: best.x, y: best.y, z: best.z, r };
                const key = keyOf(Math.floor(best.x / cell), Math.floor(best.z / cell));
                grid.has(key) || grid.set(key, []); grid.get(key).push(rock.rest);
            }
            heapDirty = true;
        }
        /* Volumen aparente del montón (m³): envolvente superior por celdas de c m sobre el piso. Solo para calibrar PACK. */
        function heapEnvelope(c = .25) {
            const top = new Map(), floor = pile ? pile.floor : 0;
            for (const r of rocks) {
                const s = r.rest; if (!s) continue;
                const key = Math.floor(s.x / c) + ',' + Math.floor(s.z / c), h = s.y + s.r - floor;
                if (h > (top.get(key) ?? 0)) top.set(key, h);
            }
            let v = 0; for (const h of top.values()) v += h * c * c;
            return v;
        }
        function refreshLabel() {
            let text = labelBase;
            if (stats && stats.heapM3 != null && stats.heapObjetivoM3 != null)
                text += ' · montón dibujado ≈ ' + stats.heapM3.toFixed(1) + ' m³ (objetivo ' + stats.heapObjetivoM3.toFixed(1) + ')';
            info.textContent = text;
        }
        const api = {
            // Posiciones finales calculadas y cantidades por línea (solo lectura, para comprobaciones).
            restPositions: () => rocks.map(r => r.rest),
            stats: () => stats,
            heapEnvelope,
            rockInfo: () => rocks.map(r => ({ ring: r.ring, run: r.run, rest: r.rest, hole: r.hole })),
            enclosure: () => pile && { floor: pile.floor, crown: pile.crown, left: pile.left, right: pile.right, length: pile.length },
            setGeometry(samples, lower, length, ringZ, holes, extra) {
                lastArgs = [samples, lower, length, ringZ, holes, extra];
                ready = Array.isArray(samples) && samples.length > 1;
                if (!ready) return;
                /* Volumen de la línea = alto del bloque × (ancho de veta + ELOS alto y bajo) × bordo entre anillos.
                   Se usa el ancho con ELOS en toda la geometría (área, origen de los fragmentos y acomodo);
                   las obras inferior y superior siguen restándose por ser huecos. */
                samples = samples.map(r => Number.isFinite(r.elosLeft) && Number.isFinite(r.elosRight) && r.elosRight > r.elosLeft
                    ? { ...r, left: r.elosLeft, right: r.elosRight } : r);
                extra = extra && typeof extra === 'object' ? extra : {};
                const zMin = samples[0].z, zMax = samples[samples.length - 1].z, height = zMax - zMin;
                const rings = Array.isArray(ringZ) ? ringZ.filter(Number.isFinite) : [];
                // Las obras inferior y superior son huecos: ahí no hay roca que fragmentar ni que mover.
                const hollow = extra.lowerExists !== false && Array.isArray(lower?.points);
                const drifts = [];
                if (hollow) drifts.push(lower.points);
                if (Array.isArray(extra.upper?.points)) drifts.push(extra.upper.points);
                // Área de la sección con roca (veta menos huecos).
                const SLICES = 240; let area = 0, widest = 0;
                for (let s = 0; s < SLICES; s++) {
                    const z = zMin + height * (s + .5) / SLICES, row = interpRow(samples, z);
                    const width = solidIntervals(row, drifts, z).reduce((a, [l, r]) => a + r - l, 0);
                    area += width * height / SLICES; widest = Math.max(widest, row.right - row.left);
                }
                // Barrenos por anillo y puntos de cada uno dentro de la roca (se calculan una sola vez).
                const holesByRing = new Map(), solidCache = new Map();
                for (const h of holes ?? []) {
                    const y = Number(h.collar[1]);
                    holesByRing.has(y) || holesByRing.set(y, []); holesByRing.get(y).push(h);
                }
                const solidAlong = hole => {
                    const key = hole.collar[0] + ',' + hole.collar[2] + ',' + hole.toe[0] + ',' + hole.toe[2];
                    if (!solidCache.has(key)) {
                        const points = [];
                        for (let k = 0; k <= 40; k++) {
                            const x = hole.collar[0] + (hole.toe[0] - hole.collar[0]) * k / 40, y = hole.collar[2] + (hole.toe[2] - hole.collar[2]) * k / 40;
                            if (y < zMin || y > zMax) continue;
                            const span = solidIntervals(interpRow(samples, y), drifts, y).find(([l, r]) => x >= l && x <= r);
                            if (span) points.push({ x, y, span });
                        }
                        solidCache.set(key, points);
                    }
                    return solidCache.get(key);
                };
                const randomSolid = n => {
                    for (let a = 0; a < 24; a++) {
                        const y = zMin + height * seed(n * 3 + a + 5), spans = solidIntervals(interpRow(samples, y), drifts, y);
                        if (spans.length) { const [l, r] = spans[Math.floor(seed(n + a + 11) * spans.length)]; return { x: l + (r - l) * (.15 + seed(n + a + 17) * .7), y }; }
                    }
                    const row = interpRow(samples, zMax); return { x: (row.left + row.right) / 2, y: zMax };
                };
                // Losa de cada línea: del punto medio con la anterior al punto medio con la siguiente (espaciamiento entre líneas).
                const sorted = [...new Set([...(Array.isArray(extra.allRings) ? extra.allRings.filter(Number.isFinite) : []), ...rings])].sort((a, b) => a - b);
                const burden = Number.isFinite(extra.burden) && extra.burden > 0 ? extra.burden : null;
                slabs = [];
                if (rings.length) for (const z of rings) {
                    const at = sorted.indexOf(z), prev = sorted[at - 1], next = sorted[at + 1];
                    const gp = prev === undefined ? null : z - prev, gn = next === undefined ? null : next - z;
                    slabs.push({ z, lo: Math.max(0, z - (gp ?? gn ?? burden ?? 1) / 2), hi: Math.min(length, z + (gn ?? gp ?? burden ?? 1) / 2), holes: (holesByRing.get(z) ?? []).map(h => h.id) });
                }
                else slabs.push({ z: length * .46, lo: length * .35, hi: length * .57, holes: [] });
                for (const s of slabs) s.volume = area * Math.max(0, s.hi - s.lo);
                const totalVolume = slabs.reduce((a, s) => a + s.volume, 0);
                /* Tamaño de los prismas según Kuz-Ram (panel «Analizar disparo»): cada prisma tiene el volumen de un bloque
                   cúbico del tamaño muestreado de la curva Rosin-Rammler (mediana = X50). La cantidad real de bloques
                   (≈ FILL·volumen / volumen medio) supera con mucho MAX_PIECES, así que se dibuja una muestra
                   proporcional; sin datos suficientes se conserva el aspecto ilustrativo anterior. */
                const kr = typeof window.MineCADFragmentacion === 'function' ? window.MineCADFragmentacion() : null;
                const muck = typeof window.MineCADMuck === 'function' ? window.MineCADMuck() : null;
                /* Abundamiento y contrapozo (datos capturados por el usuario; si faltan no se rellenan).
                   S = volumen suelto / volumen en banco (≥ 1, p. ej. 1.4). Contrapozo/ranura ya ejecutado: cara libre previa a la primera
                   línea, de Ø D y alto igual al de la sección; su volumen es hueco disponible desde el inicio. */
                const S = muck && Number.isFinite(muck.swell) ? muck.swell : null;
                const slotD = muck && muck.slotDiameterM > 0 ? muck.slotDiameterM : 0;
                const slotVolume = Math.PI / 4 * slotD * slotD * height;
                slotT = area > 0 ? slotVolume / area : 0;           // espesor equivalente del hueco previo
                const krValido = !!kr && kr.X50 > 0 && kr.n > .3 && kr.n < 6;
                const krOK = krValido && S != null;
                lastKR = krKey(kr, muck);
                let tab = null, coarse = 1;
                sphereK = SPHERE_K0;
                if (krOK) {
                    /* Se elige el corte de finos más bajo con que (a) las esferas necesarias para que el montón ocupe S·V no pasen de
                       SPHERE_KMAX y (b) todas las piezas quepan en MAX_PIECES; si ninguno cumple (b) se usa el último que cumple (a). */
                    const k3max = (SPHERE_KMAX / SPHERE_K0) ** 3;
                    for (const xc of X_CORTES) {
                        const cand = rrTable(kr.X50, kr.n, xc);
                        if (tab && S * PACK / (1 - cand.massFines) > k3max) break;
                        tab = cand;
                        if ((1 - cand.massFines) * totalVolume / cand.meanVol <= MAX_PIECES) break;
                    }
                    coarse = 1 - tab.massFines;                              // fracción de masa dibujada (≥ xMin)
                    sphereK = SPHERE_K0 * Math.cbrt(Math.min(k3max, S * PACK / coarse));
                }
                const naturalOf = s => krOK ? coarse * s.volume / tab.meanVol : DENSITY * s.volume;
                const scale = Math.min(1, MAX_PIECES / Math.max(1, slabs.reduce((a, s) => a + naturalOf(s), 0)));
                for (const s of slabs) s.pieces = Math.max(MIN_PIECES, Math.round(naturalOf(s) * scale));
                resizePieces(slabs.reduce((a, s) => a + s.pieces, 0));
                // Recinto donde se acumula el material: la obra inferior (hueca) y, por encima, la veta.
                const px = lower.points.map(q => q[0]), py = lower.points.map(q => q[1]);
                pile = { samples, length, hollow, floor: lower.floor, left: Math.min(...px), right: Math.max(...px), crown: Math.max(...py), top: samples[samples.length - 1].z };
                settledRate = null;
                let i = 0;
                slabs.forEach((slab, k) => {
                    const own = holesByRing.get(slab.z) ?? [], sd = n => seed(n + k * 7919);
                    const base = Math.cbrt(3 * FILL_ILUSTRATIVO * slab.volume / Math.max(1, slab.pieces) / (4 * Math.PI));
                    // Rango aleatorio (sin repetir) de cada pieza: la mediana de la muestra coincide con X50.
                    const perm = krOK ? [...Array(slab.pieces).keys()].sort((a, b) => sd(a + 90) - sd(b + 90)) : null;
                    for (let j = 0; j < slab.pieces; j++, i++) {
                        const rock = rocks[i];
                        const ky = .8 + seed(j + 450) * .35; // alargamiento vertical del prisma
                        // Volumen del prisma base = 0.8·r³·ky; se iguala al de un bloque de lado x.
                        const radius = krOK
                            ? Math.max(.01, Math.min(widest * .45, tab.sizeAt((perm[j] + .5) / slab.pieces) / Math.cbrt(.8 * ky)))
                            : Math.max(.03, Math.min(widest * .45, base * (.75 + sd(j + 90) * .5)));
                        // Origen: junto a su barreno, dentro de la roca; nunca dentro de un hueco.
                        const hole = own.length ? own[j % own.length] : null, points = hole ? solidAlong(hole) : [];
                        let x, y;
                        if (points.length) {
                            const pick = points[Math.floor(sd(j + 1) * points.length)], span = pick.span;
                            x = Math.max(span[0], Math.min(span[1], pick.x + (sd(j + 200) - .5) * Math.max(radius * 4, (span[1] - span[0]) * .2)));
                            y = pick.y + (sd(j + 520) - .5) * radius * 3;
                            if (y < zMin || y > zMax || !solidIntervals(interpRow(samples, y), drifts, y).some(([l, r]) => x >= l && x <= r)) { x = pick.x; y = pick.y; }
                        }
                        else ({ x, y } = randomSolid(i));
                        const at = veinAtSample(samples, y);
                        rock.hole = hole ? hole.id : null; rock.ring = k;
                        rock.x = x; rock.y = y; rock.z = slab.lo + (slab.hi - slab.lo) * (.08 + .84 * sd(j + 310));
                        rock.u = clamp((x - at.left) / (at.right - at.left || 1));
                        rock.radius = radius; rock.rest = null; rock.run = null;
                        rock.size = krOK ? radius * Math.cbrt(.8 * ky) : radius * .85 / sphereK;   // lado del bloque equivalente (m)
                        rock.mesh.scale.set(radius, radius * ky, radius);
                    }
                });
                const natural = slabs.reduce((a, s) => a + naturalOf(s), 0);
                // Balance de volumen por línea (analítico: no depende de la muestra dibujada). El hueco de la obra inferior no se cuenta.
                let acumulado = 0;
                const lines = slabs.map(s => {
                    acumulado += s.volume;
                    const hueco = slotVolume + acumulado, suelto = S == null ? null : S * acumulado;
                    return { z: s.z, from: s.lo, to: s.hi, thickness: s.hi - s.lo, volume: s.volume, pieces: s.pieces,
                             sueltoLinea: S == null ? null : S * s.volume, huecoAcumulado: hueco, sueltoAcumulado: suelto,
                             porExtraer: S == null ? null : Math.max(0, suelto - hueco) };
                });
                const f1 = v => v.toLocaleString('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                const parts = [];
                if (krOK) parts.push('Kuz-Ram X50 ' + kr.X50.toFixed(1) + ' cm · n ' + kr.n.toFixed(2) + ' · ' + rocks.length.toLocaleString('es-MX') + ' de ~' + Math.round(natural).toLocaleString('es-MX') + ' fragmentos ≥ ' + (tab.xMin * 100).toFixed(0) + ' cm (muestra ' + Math.round(scale * 100) + ' %)');
                else parts.push('Fragmentos ilustrativos (' + (krValido ? '' : 'faltan datos de Kuz-Ram') + (krValido || S != null ? '' : ' · ') + (S != null ? '' : muck && muck.swellRaw != null ? 'abundamiento «' + muck.swellRaw + '» no válido: use 1.0–2.0, p. ej. 1.4' : 'falta el factor de abundamiento (p. ej. 1.4)') + ')');
                if (S != null && lines.length) {
                    const last = lines[lines.length - 1], k0 = lines.findIndex(l => l.porExtraer > .05);
                    parts.push('abundamiento ' + S.toFixed(2));
                    if (slotVolume > 0) parts.push('contrapozo Ø' + slotD.toLocaleString('es-MX') + ' m = ' + f1(slotVolume) + ' m³');
                    parts.push('suelto ' + f1(last.sueltoAcumulado) + ' m³ vs hueco ' + f1(last.huecoAcumulado) + ' m³');
                    if (k0 >= 0) parts.push('⚠ no cabe desde la línea ' + (k0 + 1) + ': extraer ' + f1(last.porExtraer) + ' m³');
                }
                labelBase = parts.join(' · ');
                stats = { area, density: (krOK ? coarse / tab.meanVol : DENSITY) * scale,
                          kuzRam: krOK ? { X50: kr.X50, n: kr.n, muestra: rocks.length, natural, escala: scale, xCorte: tab.xMin, masaDibujada: coarse, esferaK: sphereK } : null,
                          abundamiento: S, contrapozo: { diametro: slotD, volumen: slotVolume, espesorEquivalente: slotT },
                          total: rocks.length, lines,
                          heapM3: null, heapObjetivoM3: krOK ? scale * totalVolume * coarse * (sphereK / SPHERE_K0) ** 3 / PACK : null };
                refreshLabel();
            },
            render() {
                const p = progress / 100; group.visible = ready && p > 0 && !layerActive();
                info.hidden = !group.visible;
                if (!group.visible) return;
                const tl = timeline();
                if (settledRate !== (tl ? tl.rate : 0)) settle(tl);
                if (heapDirty) { heapDirty = false; if (stats) { stats.heapM3 = heapEnvelope(); refreshLabel(); } }
                const maxDrop = Math.max(1, pile.top - pile.floor);
                for (let i = 0; i < rocks.length; i++) {
                    const rock = rocks[i], rest = rock.rest, time = tl && rock.hole ? tl.seq.times.get(rock.hole)?.[0] : undefined;
                    // Con secuencia: aparece al iniciar su barreno y empieza a caer. Sin ella, avance global.
                    const age = time === undefined ? (p - .12 - rock.phase * .18) / .7 * FALL : tl.age(time) - rock.phase * JITTER;
                    rock.mesh.visible = time === undefined ? age > 0 : age >= 0;
                    if (!rock.mesh.visible) continue;
                    // Misma aceleración para todos: lo que está más abajo llega primero.
                    const start = Math.max(rock.y, rest.y), y = Math.max(rest.y, start - maxDrop * (age / FALL) ** 2);
                    const f = start - rest.y > 1e-6 ? (start - y) / (start - rest.y) : Math.min(1, age / .2);
                    const row = veinAt(y), slide = row.left + (row.right - row.left) * rock.u, k = f ** 4;
                    // Sobre la corona la caída queda dentro de la roca abierta; el desvío hacia la roca sin detonar solo ocurre ya dentro del hueco inferior.
                    const linear = rock.z + (rest.z - rock.z) * f * f, run = rock.run;
                    let z = linear;
                    if (run) {
                        const inside = Math.max(run.lo, Math.min(run.hi, linear));
                        const g = pile.hollow && rest.y < pile.crown ? clamp((pile.crown - y) / Math.max(1e-6, pile.crown - rest.y)) : 0;
                        z = inside + (linear - inside) * g;
                    }
                    rock.mesh.position.set(slide + (rest.x - slide) * k, y, z);
                    rock.mesh.rotation.set(f * (i % 7), f * (i % 5), f * (i % 3));
                }
                for (const material of materials) {
                    material.emissive.setHex(0xffd481);
                    material.emissiveIntensity = !tl && p < .2 ? Math.sin(p / .2 * Math.PI) * .7 : 0;
                }
            },
            dispose() { document.removeEventListener('minecad:datos', onDatos); viewer.scene.remove(group); geometry.dispose(); materials.forEach(m => m.dispose()); group.clear(); }
        };
        /* Los datos de explosivo y carga no pasan por la geometría del visor: si cambia el resultado de
           Kuz-Ram se recalculan los fragmentos con la última geometría recibida. */
        const onDatos = () => {
            if (!lastArgs) return;
            const kr = typeof window.MineCADFragmentacion === 'function' ? window.MineCADFragmentacion() : null;
            const muck = typeof window.MineCADMuck === 'function' ? window.MineCADMuck() : null;
            if (krKey(kr, muck) !== lastKR) api.setGeometry(...lastArgs);
        };
        document.addEventListener('minecad:datos', onDatos);
        return api;
    }
    window.MineCADAnimation = Object.freeze({
        setProgress(value) { progress = Math.max(0, Math.min(100, Number(value) || 0)); render2D(); },
        getProgress() { return progress; },
        timeline, glow,
        setSpeed(value) { speed = value === 'auto' ? 'auto' : Number(value) > 0 ? Number(value) : 'auto'; },
        // Capa de datos: { mode, state:'disponible'|'sin_datos'|'error', all:{color,opacity}|null, byRing:Map|null, caption }.
        setLayer(value) { layer = value && typeof value === 'object' ? value : null; listeners.forEach(fn => fn(layer)); },
        getLayer() { return layer; },
        subscribeLayer(fn) { listeners.add(fn); return () => listeners.delete(fn); },
        create3D
    });
    // Redibujar la capa si la aplicación reemplaza la sección al editar o cambiar de vista.
    document.addEventListener('input', () => queueMicrotask(render2D));
    document.addEventListener('click', () => requestAnimationFrame(render2D));
})();