/* Apariencia ilustrativa: no lee cargas, espaciamientos ni tiempos del proyecto. */
(() => {
    'use strict';
    const listeners = new Set();
    let mode = 'tipo', progress = 0;
    const ns = 'http://www.w3.org/2000/svg';
    const color = () => {
        const p = progress / 100;
        return [225 + Math.round(30*p), 66 + Math.round(168*p), 66 + Math.round(100*p)];
    };
    const hex = () => { const [r,g,b] = color(); return (r<<16)|(g<<8)|b; };
    function render2D() {
        const svg = document.querySelector('#section');
        if (!svg) return;
        svg.querySelector('[data-aesthetic-overlay]')?.remove();
        const lines = [...svg.querySelectorAll('[data-visual-hole]')];
        for (const line of lines) {
            line.dataset.baseStroke ??= line.getAttribute('stroke');
            line.setAttribute('stroke', mode === 'carga' ? `rgb(${color().join(',')})` : line.dataset.baseStroke);
        }
        if (mode !== 'dano' && mode !== 'frag') return;
        const overlay = document.createElementNS(ns, 'g');
        overlay.setAttribute('data-aesthetic-overlay', '');
        overlay.setAttribute('pointer-events', 'none');
        if (mode === 'dano') {
            const projections = new Set();
            for (const line of lines) {
                const key = ['x1','y1','x2','y2'].map(a=>line.getAttribute(a)).join(',');
                if(projections.has(key)) continue;
                projections.add(key);
                for (const [width,opacity] of [[28,.035],[20,.055],[12,.1],[5,.2]]) {
                const copy = line.cloneNode(false);
                copy.removeAttribute('data-visual-hole');
                copy.setAttribute('stroke', '#ff4545'); copy.setAttribute('stroke-width', width);
                copy.setAttribute('opacity', opacity); copy.setAttribute('stroke-linecap', 'round');
                overlay.append(copy);
                }
            }
        } else {
            const vein = svg.querySelector('[data-visual-vein]');
            if (vein) {
                const box = vein.getBBox();
                const defs = document.createElementNS(ns,'defs'), clip = document.createElementNS(ns,'clipPath');
                clip.id = 'aesthetic-vein-clip'; clip.append(vein.cloneNode(false)); defs.append(clip); overlay.append(defs);
                const cells = document.createElementNS(ns,'g'); cells.setAttribute('clip-path','url(#aesthetic-vein-clip)');
                const step = Math.max(box.width/8, box.height/40, .01);
                for(let y=box.y;y<box.y+box.height;y+=step) for(let x=box.x;x<box.x+box.width;x+=step) {
                    const rect = document.createElementNS(ns,'rect');
                    for(const [key,value] of Object.entries({x,y,width:step*.9,height:step*.9,fill:'#ddb77b',opacity:.7})) rect.setAttribute(key,value);
                    cells.append(rect);
                }
                overlay.append(cells);
            }
        }
        // Colocar detrás de las anotaciones y de los propios barrenos.
        const anchor = lines[0];
        if (anchor) svg.insertBefore(overlay,anchor); else svg.append(overlay);
    }
    function create3D(viewer, types) {
        const {Vt,Pt,Jt,js} = types;
        let halos = [], blocks = null, selected = [];
        function apply() {
            for(const mesh of selected) if(mode === 'carga') mesh.material.color.setHex(hex());
            for(const mesh of halos) mesh.visible = mode === 'dano';
            if(blocks) blocks.visible = mode === 'frag';
        }
        listeners.add(apply);
        return {
            configure(samples,length,segments,radius,meshes,allPositions,shownPositions,visibility) {
                halos = []; blocks = null; selected = meshes;
                if(visibility.rings) for(const [factor,opacity] of [[7,.035],[5,.055],[3,.1],[1.6,.2]]) {
                    const mesh = viewer.tubes(segments,0xff4545,opacity,radius*factor);
                    if(mesh) { mesh.userData.aesthetic = true; halos.push(mesh); }
                }
                if(visibility.vein && samples.length>1 && length>0) {
                    const positions=[], indices=[];
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
                            for(let ix=0;ix<5;ix++) addBox(row.left+ix*w+w*.06,y+h*.06,z+d*.06,w*.88,h*.88,d*.88);
                        }
                    }
                    if(positions.length) {
                        const geometry=new Vt(); geometry.setAttribute('position',new Pt(positions,3)); geometry.setIndex(indices); geometry.computeVertexNormals();
                        blocks=new Jt(geometry,new js({color:0xd6b779,transparent:true,opacity:.72,roughness:.9}));
                        blocks.userData.aesthetic=true; viewer.model.add(blocks);
                    }
                }
                apply();
            },
            apply,
            dispose() { listeners.delete(apply); halos=[]; blocks=null; selected=[]; }
        };
    }
    window.MineCADAppearance=Object.freeze({
        setState(next,p) { mode=next; progress=Math.max(0,Math.min(100,Number(p)||0)); listeners.forEach(fn=>fn()); render2D(); },
        render2D,create3D
    });
    document.addEventListener('click',()=>requestAnimationFrame(render2D));
    document.addEventListener('input',()=>queueMicrotask(render2D));
})();
