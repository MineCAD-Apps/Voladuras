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
            else { caption.hidden = progress <= 0; caption.textContent = 'Animación ilustrativa · ' + Math.floor(progress) + ' %'; }
        }
        const svg = document.querySelector('#section');
        const vein = svg?.querySelector('polygon[fill="#e5b66b65"]');
        if (!svg || !vein) { overlay?.remove(); source = null; return; }
        if (section !== svg || source !== vein || !overlay?.isConnected) {
            overlay?.remove(); section = svg; source = vein; cells = [];
            overlay = node('g', { 'data-visual-animation': '', 'pointer-events': 'none', 'aria-hidden': 'true' });
            const points = vein.getAttribute('points');
            const defs = node('defs', {}), clip = node('clipPath', { id: 'minecad-illustration-clip' });
            clip.append(node('polygon', { points })); defs.append(clip); overlay.append(defs);
            const texture = node('g', { 'clip-path': 'url(#minecad-illustration-clip)' });
            const box = vein.getBBox();
            for (let i = 0; i < 90; i++) {
                const x = box.x + seed(i + 1) * box.width, y = box.y + seed(i + 191) * box.height;
                const r = Math.max(box.height * .008, Math.min(box.width * .14, box.height * .022)) * (.65 + seed(i + 300));
                const rock = node('path', { d: `M${x-r},${y} l${r*.5},${-r} ${r*1.4},${r*.25} ${r*.4},${r} ${-r*.8},${r*.8} Z`, fill: ['#92704b','#b59261','#d2b077'][i % 3], stroke: '#5a4935', 'stroke-width': box.height * .0009 });
                texture.append(rock); cells.push({ node: rock, offset: seed(i + 601), travel: box.height * (.035 + seed(i + 900) * .055) });
            }
            const flash = node('polygon', { points, fill: '#ffe4a0', 'data-animation-flash': '' });
            overlay.append(texture, flash); svg.append(overlay);
        }
        overlay.style.display = progress > 0 && !layerActive() ? '' : 'none';
        const p = progress / 100, flash = overlay.querySelector('[data-animation-flash]');
        flash.setAttribute('opacity', String(p < .2 ? Math.sin(p / .2 * Math.PI) * .5 : 0));
        for (const cell of cells) {
            const phase = clamp((p - .12 - cell.offset * .14) / .62);
            cell.node.setAttribute('opacity', String(phase * .82));
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
        const rocks = Array.from({ length: 96 }, (_, i) => {
            const mesh = new Jt(geometry, materials[i % materials.length]); group.add(mesh);
            return { mesh, x: 0, y: 0, z: 0, target: 0, phase: seed(i + 700) };
        });
        let ready = false;
        return {
            setGeometry(samples, lower, length, ringZ) {
                ready = Array.isArray(samples) && samples.length > 1;
                if (!ready) return;
                const height = Math.max(...samples.map(s => s.z)) - Math.min(...samples.map(s => s.z));
                // Posiciones de los anillos mostrados (entregadas por la aplicación). Sin ellas, la zona central decorativa de siempre.
                const rings = Array.isArray(ringZ) ? ringZ.filter(Number.isFinite) : [];
                let gap = Infinity; for (let k = 1; k < rings.length; k++) gap = Math.min(gap, rings[k] - rings[k - 1]);
                const spread = rings.length > 1 && gap > 0 ? gap * .4 : length * .03;
                for (let i = 0; i < rocks.length; i++) {
                    const rock = rocks[i], row = samples[Math.min(samples.length - 1, Math.floor(seed(i + 1) * samples.length))];
                    const radius = Math.max(.04, Math.min(height * .019, (row.right - row.left) * .16)) * (.6 + seed(i + 90));
                    rock.x = row.left + (row.right - row.left) * (.15 + seed(i + 200) * .7);
                    rock.y = row.z; rock.z = rings.length ? rings[i % rings.length] + (seed(i + 310) - .5) * spread : length * (.35 + seed(i + 300) * .22);
                    rock.target = Math.min(rock.y, lower.floor + Math.min(height * .1, .8) + seed(i + 400) * height * .03);
                    rock.mesh.scale.set(radius, radius * (.7 + seed(i + 450)), radius);
                }
            },
            render() {
                const p = progress / 100; group.visible = ready && p > 0 && !layerActive();
                if (!group.visible) return;
                for (let i = 0; i < rocks.length; i++) {
                    const rock = rocks[i], phase = clamp((p - .12 - rock.phase * .18) / .7);
                    // No mostrar piezas durante la espera decorativa previa al movimiento.
                    rock.mesh.visible = phase > 0;
                    if (!rock.mesh.visible) continue;
                    rock.mesh.position.set(rock.x + Math.sin(i * 2.1) * phase * .16, rock.y + (rock.target - rock.y) * phase * phase, rock.z + Math.cos(i) * phase * .12);
                    rock.mesh.rotation.set(phase * (i % 7), phase * (i % 5), phase * (i % 3));
                }
                for (const material of materials) {
                    material.emissive.setHex(0xffd481);
                    material.emissiveIntensity = p < .2 ? Math.sin(p / .2 * Math.PI) * .7 : 0;
                }
            },
            dispose() { viewer.scene.remove(group); geometry.dispose(); materials.forEach(m => m.dispose()); group.clear(); }
        };
    }
    window.MineCADAnimation = Object.freeze({
        setProgress(value) { progress = Math.max(0, Math.min(100, Number(value) || 0)); render2D(); },
        getProgress() { return progress; },
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
