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
            for (const { xy: [x1, y1, x2, y2], times } of groups.values()) {
                const list = [...times].sort((a, b) => a - b);
                if (!list.length) continue;
                const inside = [], probe = svg.createSVGPoint();
                for (let k = 0; k <= 40; k++) {
                    probe.x = x1 + (x2 - x1) * k / 40; probe.y = y1 + (y2 - y1) * k / 40;
                    if (vein.isPointInFill(probe)) inside.push([probe.x, probe.y]);
                }
                if (!inside.length) continue;
                const count = Math.min(60, Math.max(18, list.length * 3));
                for (let i = 0; i < count; i++, n++) {
                    const [x, y] = inside[Math.floor(seed(n + 1) * inside.length)];
                    const time = list[list.length > count ? Math.floor(i * list.length / count) : i % list.length];
                    addRock(n, x + (seed(n + 191) - .5) * box.width * .12, y + (seed(n + 77) - .5) * box.height * .025, time);
                }
            }
            if (!cells.length) for (let i = 0; i < 90; i++) addRock(i, box.x + seed(i + 1) * box.width, box.y + seed(i + 191) * box.height, null);
            const flash = node('polygon', { points, fill: '#ffe4a0', 'data-animation-flash': '' });
            overlay.append(texture, flash);
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
    function create3D(viewer, types) {
        const { Pn, Vt, Pt, Jt, js } = types;
        const group = new Pn(); group.visible = false; viewer.scene.add(group);
        const geometry = new Vt();
        geometry.setAttribute('position', new Pt([-1,-.5,-.6, 1,-.5,-.6, 0,1,.1, 0,-.5,1], 3));
        geometry.setIndex([0,2,1, 0,1,3, 1,2,3, 2,0,3]); geometry.computeVertexNormals();
        const materials = [0x997649,0xc29a60,0xdfb979].map(color => new js({ color, roughness: .96, transparent: true, opacity: .93 }));
        // Cantidad artística fija por línea; no representa masa ni volumen.
        const piecesPerLine = 96, rocks = [];
        function resizePieces(count) {
            while (rocks.length > count) group.remove(rocks.pop().mesh);
            while (rocks.length < count) {
                const localIndex = rocks.length % piecesPerLine;
                const mesh = new Jt(geometry, materials[localIndex % materials.length]);
                mesh.visible = false; group.add(mesh);
                rocks.push({ mesh, x: 0, y: 0, z: 0, target: 0, phase: seed(localIndex + 700) });
            }
        }
        let ready = false;
        return {
            setGeometry(samples, lower, length, ringZ, holes) {
                ready = Array.isArray(samples) && samples.length > 1;
                if (!ready) return;
                const height = Math.max(...samples.map(s => s.z)) - Math.min(...samples.map(s => s.z));
                // Posiciones de los anillos mostrados (entregadas por la aplicación). Sin ellas, la zona central decorativa de siempre.
                const rings = Array.isArray(ringZ) ? ringZ.filter(Number.isFinite) : [];
                resizePieces(piecesPerLine * Math.max(1, rings.length));
                // Barrenos por anillo y puntos de cada uno dentro de la veta (se calculan una sola vez).
                const holesByRing = new Map(), insideCache = new Map();
                for (const h of holes ?? []) {
                    const y = Number(h.collar[1]);
                    holesByRing.has(y) || holesByRing.set(y, []); holesByRing.get(y).push(h);
                }
                const insideVein = hole => {
                    const key = hole.collar[0] + ',' + hole.collar[2] + ',' + hole.toe[0] + ',' + hole.toe[2];
                    if (!insideCache.has(key)) {
                        const points = [];
                        for (let k = 0; k <= 40; k++) {
                            const x = hole.collar[0] + (hole.toe[0] - hole.collar[0]) * k / 40, y = hole.collar[2] + (hole.toe[2] - hole.collar[2]) * k / 40;
                            const near = samples.reduce((a, b) => Math.abs(b.z - y) < Math.abs(a.z - y) ? b : a);
                            if (y >= samples[0].z && y <= samples[samples.length - 1].z && x >= near.left && x <= near.right) points.push({ x, y, row: near });
                        }
                        insideCache.set(key, points);
                    }
                    return insideCache.get(key);
                };
                let gap = Infinity; for (let k = 1; k < rings.length; k++) gap = Math.min(gap, rings[k] - rings[k - 1]);
                const spread = rings.length > 1 && gap > 0 ? gap * .4 : length * .03;
                for (let i = 0; i < rocks.length; i++) {
                    const j = i % piecesPerLine, lineIndex = Math.floor(i / piecesPerLine);
                    const rock = rocks[i], row = samples[Math.min(samples.length - 1, Math.floor(seed(j + 1) * samples.length))];
                    const radius = Math.max(.04, Math.min(height * .019, (row.right - row.left) * .16)) * (.6 + seed(j + 90));
                    rock.x = row.left + (row.right - row.left) * (.15 + seed(j + 200) * .7);
                    rock.y = row.z; rock.z = rings.length ? rings[lineIndex] + (seed(j + 310) - .5) * spread : length * (.35 + seed(j + 300) * .22);
                    // Barreno de origen: el fragmento nace junto a él, dentro de la veta.
                    const own = rings.length ? holesByRing.get(rings[lineIndex]) ?? [] : [];
                    rock.hole = null;
                    if (own.length) {
                        const hole = own[j % own.length], points = insideVein(hole);
                        const pick = points.length ? points[Math.floor(seed(j + 1) * points.length)] : { x: (hole.collar[0] + hole.toe[0]) / 2, y: (hole.collar[2] + hole.toe[2]) / 2, row: null };
                        const jitter = (seed(j + 200) - .5) * Math.max(radius * 4, pick.row ? (pick.row.right - pick.row.left) * .2 : 0);
                        rock.hole = hole.id;
                        rock.x = pick.row ? Math.max(pick.row.left, Math.min(pick.row.right, pick.x + jitter)) : pick.x + jitter;
                        rock.y = pick.y + (seed(j + 520) - .5) * radius * 3;
                    }
                    rock.target = Math.min(rock.y, lower.floor + Math.min(height * .1, .8) + seed(j + 400) * height * .03);
                    rock.mesh.scale.set(radius, radius * (.7 + seed(j + 450)), radius);
                }
            },
            render() {
                const p = progress / 100; group.visible = ready && p > 0 && !layerActive();
                if (!group.visible) return;
                const tl = timeline();
                for (let i = 0; i < rocks.length; i++) {
                    const rock = rocks[i], time = tl && rock.hole ? tl.seq.times.get(rock.hole)?.[0] : undefined;
                    const age = time === undefined ? null : tl.age(time) - rock.phase * JITTER;
                    // Con secuencia: aparece al iniciar su barreno y empieza a caer. Sin ella, avance global.
                    const phase = age === null ? clamp((p - .12 - rock.phase * .18) / .7) : clamp(age / FALL);
                    rock.mesh.visible = age === null ? phase > 0 : age >= 0;
                    if (!rock.mesh.visible) continue;
                    rock.mesh.position.set(rock.x + Math.sin(i * 2.1) * phase * .16, rock.y + (rock.target - rock.y) * phase * phase, rock.z + Math.cos(i) * phase * .12);
                    rock.mesh.rotation.set(phase * (i % 7), phase * (i % 5), phase * (i % 3));
                }
                for (const material of materials) {
                    material.emissive.setHex(0xffd481);
                    material.emissiveIntensity = !tl && p < .2 ? Math.sin(p / .2 * Math.PI) * .7 : 0;
                }
            },
            dispose() { viewer.scene.remove(group); geometry.dispose(); materials.forEach(m => m.dispose()); group.clear(); }
        };
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
