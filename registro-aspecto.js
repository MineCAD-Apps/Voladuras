/* Apariencia ilustrativa: no lee cargas, espaciamientos ni tiempos del proyecto. */
(() => {
    'use strict';
    const listeners = new Set();
    let mode = 'tipo', progress = 0;
    const ns = 'http://www.w3.org/2000/svg';
    const color = () => {
        const p = progress / 100;
        return [225 + Math.round(30*p), 49 + Math.round(189*p), Math.round(49*(1-p))];
    };
    const hex = () => { const [r,g,b] = color(); return (r<<16)|(g<<8)|b; };
    const RED = '#e03131', YELLOW = '#ffee00';
    const clock = () => window.MineCADAnimation?.timeline?.(progress) ?? null;
    const radiusM = () => window.MineCADLayerData?.influenceRadius?.() ?? null;
    function render2D() {
        const svg = document.querySelector('#section');
        if (!svg) return;
        svg.querySelectorAll('[data-aesthetic-overlay]').forEach(e => e.remove());
        const lines = [...svg.querySelectorAll('[data-visual-hole]')], tl = clock();
        const keyOf = line => ['x1','y1','x2','y2'].map(a=>line.getAttribute(a)).join(',');
        // En la proyección X/Z se superponen barrenos de varios anillos: se combinan sus tiempos.
        const states = new Map();
        if (mode === 'carga' && tl) for (const line of lines) {
            const key = keyOf(line), state = states.get(key) ?? { fired: false, glow: 0 };
            for (const time of tl.seq.times.get(line.dataset.holeId) ?? []) {
                const age = tl.age(time);
                state.fired ||= age >= 0; state.glow = Math.max(state.glow, window.MineCADAnimation.glow(age));
            }
            states.set(key, state);
        }
        for (const line of lines) {
            line.dataset.baseStroke ??= line.getAttribute('stroke');
            line.dataset.baseWidth ??= line.getAttribute('stroke-width');
            const state = states.get(keyOf(line));
            line.setAttribute('stroke', mode !== 'carga' ? line.dataset.baseStroke : state ? (state.fired ? YELLOW : RED) : `rgb(${color().join(',')})`);
            line.setAttribute('stroke-width', mode === 'carga' ? '2.8' : line.dataset.baseWidth);
        }
        if (mode === 'carga') {
            const halo = document.createElementNS(ns, 'g');
            halo.setAttribute('data-aesthetic-overlay', ''); halo.setAttribute('pointer-events', 'none');
            const done = new Set();
            for (const line of lines) {
                const key = keyOf(line), state = states.get(key);
                if (done.has(key) || !state?.glow) continue;
                done.add(key);
                for (const [width, opacity] of [[26,.18],[15,.35],[8,.7]]) {
                    const copy = line.cloneNode(false);
                    copy.removeAttribute('data-visual-hole');
                    copy.setAttribute('stroke', '#fff36b'); copy.setAttribute('stroke-width', width);
                    copy.setAttribute('opacity', opacity * state.glow); copy.setAttribute('stroke-linecap', 'round');
                    halo.append(copy);
                }
            }
            if (lines[0]) svg.insertBefore(halo, lines[0]);
            return;
        }
        if (mode !== 'dano' && mode !== 'frag') return;
        const overlay = document.createElementNS(ns, 'g');
        overlay.setAttribute('data-aesthetic-overlay', '');
        overlay.setAttribute('pointer-events', 'none');
        if (mode === 'dano') {
            const radius = radiusM(), projections = new Set();
            if (!radius) return;
            // Grosor en metros del dibujo (diámetro = 2 × radio). La opacidad va en el grupo para no saturar traslapes.
            const zone = document.createElementNS(ns, 'g'); zone.setAttribute('opacity', '.3');
            for (const line of lines) {
                const key = keyOf(line);
                if (projections.has(key)) continue;
                projections.add(key);
                const copy = line.cloneNode(false);
                copy.removeAttribute('data-visual-hole'); copy.removeAttribute('vector-effect');
                copy.setAttribute('stroke', '#ff3030'); copy.setAttribute('stroke-width', 2 * radius);
                copy.setAttribute('stroke-linecap', 'round');
                zone.append(copy);
            }
            overlay.append(zone);
        } else {
            const vein = svg.querySelector('[data-visual-vein]');
            if (vein) {
                const box = vein.getBBox();
                const defs = document.createElementNS(ns,'defs'), clip = document.createElementNS(ns,'clipPath');
                clip.id = 'aesthetic-vein-clip'; clip.append(vein.cloneNode(false)); defs.append(clip); overlay.append(defs);
                const cells = document.createElementNS(ns,'g'); cells.setAttribute('clip-path','url(#aesthetic-vein-clip)');
                const step = Math.max(box.width/8, box.height/40, .01);
                let count = 0;
                const projected = lines.map(line => [line, ...['x1','y1','x2','y2'].map(a=>Number(line.getAttribute(a)))]);
                const nearestTime = (x, y) => {
                    let best = null, distance = Infinity;
                    for (const [line,x1,y1,x2,y2] of projected) {
                        const dx = x2-x1, dy = y2-y1;
                        const u = Math.max(0, Math.min(1, ((x-x1)*dx + (y-y1)*dy) / (dx*dx + dy*dy || 1))), d = Math.hypot(x-x1-u*dx, y-y1-u*dy);
                        if (d < distance - 1e-9) { distance = d; best = line; }
                    }
                    const times = best ? tl.seq.times.get(best.dataset.holeId) : null;
                    return times?.length ? times[count++ % times.length] : null;
                };
                for(let y=box.y;y<box.y+box.height;y+=step) for(let x=box.x;x<box.x+box.width;x+=step) {
                    // Durante la animación cada prisma aparece cuando inicia su barreno más cercano.
                    if (tl && progress > 0) { const time = nearestTime(x+step/2, y+step/2); if (time !== null && tl.age(time) < 0) continue; }
                    const rect = document.createElementNS(ns,'rect');
                    for(const [key,value] of Object.entries({x,y,width:step*.9,height:step*.9,fill:'#ddb77b',opacity:.7})) rect.setAttribute(key,value);
                    cells.append(rect);
                }
                overlay.append(cells);
            }
        }
        // Colocar detrás de los fragmentos, las anotaciones y los propios barrenos.
        const anchor = svg.querySelector('[data-visual-animation]') ?? lines[0];
        if (anchor) svg.insertBefore(overlay,anchor); else svg.append(overlay);
    }
    function create3D(viewer, types) {
        const {Vt,Pt,Jt,js} = types;
        let halos = [], blocks = [], selected = [], charges = null, shownHoles = [], baseRadius = .05, showRings = true;
        // Barrenos agrupados por instante de inicio: un tubo y tres capas de resplandor por grupo.
        function buildCharges(tl) {
            const groups = new Map();
            for (const hole of shownHoles) {
                const time = tl.seq.times.get(hole.id)?.[0];
                if (time === undefined) continue;
                if (!groups.has(time)) groups.set(time, []);
                groups.get(time).push([hole.collar, hole.toe].map(([x,y,z]) => [x,z,y]));
            }
            charges = [...groups].map(([time, segments]) => {
                const core = viewer.tubes(segments, 0xe03131, 1, baseRadius * 1.15);
                const layers = [[2.2,.85],[4,.5],[7,.24]].map(([factor, opacity]) => {
                    const mesh = viewer.tubes(segments, 0xfff36b, opacity, baseRadius * factor, 12);
                    mesh.material.blending = 2; // aditiva
                    mesh.material.depthWrite = false; mesh.material.emissive.setHex(0xffee33); mesh.visible = false;
                    return { mesh, opacity };
                });
                return { time, core, layers };
            });
        }
        function apply() {
            const charging = mode === 'carga', tl = clock(), timed = charging && !!tl && showRings && selected.length > 0;
            if (timed && !charges) buildCharges(tl);
            for (const mesh of selected) {
                if (charging) mesh.material.color.setHex(hex());
                mesh.visible = !timed;
            }
            for (const item of charges ?? []) {
                item.core.visible = timed;
                if (!timed) { for (const layer of item.layers) layer.mesh.visible = false; continue; }
                const age = tl.age(item.time), fired = age >= 0, strength = window.MineCADAnimation.glow(age);
                item.core.material.color.setHex(fired ? 0xffee00 : 0xe03131);
                item.core.material.emissive.setHex(fired ? 0xffdd00 : 0x000000);
                item.core.material.emissiveIntensity = fired ? .55 + .45 * strength : 0;
                for (const layer of item.layers) { layer.mesh.visible = strength > 0; layer.mesh.material.opacity = layer.opacity * strength; }
            }
            for (const mesh of halos) mesh.visible = mode === 'dano';
            for (const block of blocks) block.mesh.visible = mode === 'frag' && (!tl || progress <= 0 || block.time === null || tl.age(block.time) >= 0);
        }
        listeners.add(apply);
        return {
            configure(samples,length,segments,radius,meshes,allPositions,shownPositions,visibility,holes,influence) {
                halos = []; blocks = []; selected = meshes; charges = null;
                shownHoles = holes ?? []; baseRadius = radius; showRings = !!visibility.rings;
                // Zona cilíndrica con el radio capturado por el usuario (m); sin dato no se dibuja.
                if(visibility.rings && influence > 0) for(const [factor,opacity] of [[1,.11],[.6,.07],[.3,.08]]) {
                    const mesh = viewer.tubes(segments,0xff3030,opacity,influence*factor,28);
                    if(mesh) { mesh.userData.aesthetic = true; mesh.material.depthWrite = false; halos.push(mesh); }
                }
                if(visibility.vein && samples.length>1 && length>0) {
                    const groups=new Map(), seq=window.MineCADLayerData?.sequence?.(), counters=new Map();
                    let positions, indices;
                    // Instante del barreno más cercano al prisma, dentro de su anillo.
                    const timeAt = (x,y,z) => {
                        if (!seq?.available) return null;
                        let best=null, distance=Infinity;
                        for (const hole of shownHoles) {
                            if (Number(hole.collar[1]) !== z) continue;
                            const [x1,y1]=[hole.collar[0],hole.collar[2]], dx=hole.toe[0]-x1, dy=hole.toe[2]-y1;
                            const u=Math.max(0,Math.min(1,((x-x1)*dx+(y-y1)*dy)/(dx*dx+dy*dy||1))), d=Math.hypot(x-x1-u*dx,y-y1-u*dy);
                            if (d<distance) { distance=d; best=hole; }
                        }
                        return best ? seq.times.get(best.id)?.[0] ?? null : null;
                    };
                    const ymin=samples[0].z, ymax=samples[samples.length-1].z;
                    let cursor=0;
                    const sampleAt = y => {
                        while(cursor<samples.length-2 && samples[cursor+1].z<y) cursor++;
                        const a=samples[cursor], b=samples[cursor+1], p=(y-a.z)/Math.max(b.z-a.z,1e-9);
                        return {left:a.left+(b.left-a.left)*p,right:a.right+(b.right-a.right)*p};
                    };
                    const addBox=(x,y,z,w,h,d) => {
                        const base=positions.length/3;
                        positions.push(x,y,z,x+w,y,z,x+w,y+h,z,x,y+h,z,x,y,z+d,x+w,y,z+d,x+w,y+h,z+d,x,y+h,z+d);
                        for(const i of [0,2,1,0,3,2,4,5,6,4,6,7,0,1,5,0,5,4,3,7,6,3,6,2,0,4,7,0,7,3,1,2,6,1,6,5]) indices.push(base+i);
                    };
                    const nearest = z => allPositions.reduce((best,v)=>Math.abs(v-z)<Math.abs(best-z)?v:best,allPositions[0]);
                    for(let iy=0;iy<40;iy++) {
                        const h=(ymax-ymin)/40,y=ymin+iy*h,row=sampleAt(y+h/2),w=(row.right-row.left)/5;
                        for(let iz=0;iz<32;iz++) {
                            const d=length/32,z=iz*d;
                            if(allPositions.length && !shownPositions.includes(nearest(z+d/2))) continue;
                            for(let ix=0;ix<5;ix++) {
                                const time=allPositions.length ? timeAt(row.left+(ix+.5)*w,y+h/2,nearest(z+d/2)) : null;
                                if(!groups.has(time)) groups.set(time,{positions:[],indices:[]});
                                ({positions,indices}=groups.get(time));
                                addBox(row.left+ix*w+w*.06,y+h*.06,z+d*.06,w*.88,h*.88,d*.88);
                            }
                        }
                    }
                    for(const [time,data] of groups) {
                        const geometry=new Vt(); geometry.setAttribute('position',new Pt(data.positions,3)); geometry.setIndex(data.indices); geometry.computeVertexNormals();
                        const mesh=new Jt(geometry,new js({color:0xd6b779,transparent:true,opacity:.72,roughness:.9}));
                        mesh.userData.aesthetic=true; viewer.model.add(mesh); blocks.push({mesh,time});
                    }
                }
                apply();
            },
            apply,
            dispose() { listeners.delete(apply); halos=[]; blocks=[]; selected=[]; charges=null; shownHoles=[]; }
        };
    }
    window.MineCADAppearance=Object.freeze({
        setState(next,p) { mode=next; progress=Math.max(0,Math.min(100,Number(p)||0)); listeners.forEach(fn=>fn()); render2D(); },
        render2D,create3D
    });
    document.addEventListener('click',()=>requestAnimationFrame(render2D));
    document.addEventListener('input',()=>queueMicrotask(render2D));
})();
