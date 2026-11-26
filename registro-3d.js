/* Visor 3D de MineCAD. Biblioteca externa: three-vendor.js. */
window.MineCADCreateViewer3D = function (dependencies) {
    const { Bs, Ze, yo, It, So, tr, ir, Pn, Vt, L, ns, _i, Pt, js, Jt, ss, Js, rn, yn, zs } = window.MineCADThree;
    const { xs, zn, br, ri, __sectionActive, Bn } = dependencies;
    var wo = class {
        constructor(e) { this.el = e, this.scene = new Bs, this.scene.background = new Ze("#0c1a29"), this.renderer = new yo({ antialias: !0, alpha: !1 }), this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2)), e.append(this.renderer.domElement), this.camera = new It(45, 1, .01, 1e4), this.controls = new So(this.camera, this.renderer.domElement), this.controls.enableDamping = !0, this.scene.add(new tr(13625599, 2571080, 2.3)); let t = new ir(16777215, 2.4); t.position.set(20, 40, 30), this.scene.add(t), this.model = new Pn, this.scene.add(this.model), this.observer = new ResizeObserver(() => this.resize()), this.observer.observe(e), this.labelLayer = document.createElement("div"), this.labelLayer.className = "scene-object-labels", this.el.append(this.labelLayer), this.visualLabels = [], this.ringMeshes = new Map, this.aesthetic = window.MineCADAppearance?.create3D(this,window.MineCADThree), this.visualPlayback = window.MineCADAnimation?.create3D(this, window.MineCADThree), this.unsubscribeLayer = window.MineCADAnimation?.subscribeLayer?.(layer => this.applyLayer(layer)), this.running = !0, this.animate(); }
        resize() { let e = this.el.clientWidth, t = this.el.clientHeight; !e || !t || (this.camera.aspect = e / t, this.camera.updateProjectionMatrix(), this.renderer.setSize(e, t, !1)); }
        animate() { this.running && (requestAnimationFrame(() => this.animate()), this.controls.update(), this.positionLabels(), this.visualPlayback?.render(), this.renderer.render(this.scene, this.camera)); }
        clear() { this.model.traverse(e => { if (e.geometry?.dispose(), e.material)
            for (let t of Array.isArray(e.material) ? e.material : [e.material])
                t.dispose(); }), this.model.clear(); }
        line(e, t, n = 1) { let s = new Vt().setFromPoints(e.map(a => new L(...a))), r = new ns(s, new _i({ color: t, transparent: !0, opacity: n })); this.model.add(r); }
        tubes(segments, color, opacity, radius, sides = 8) {
            const positions = [], indices = [];
            for (const [start, end] of segments) {
                const a = new L(...start), b = new L(...end), direction = b.clone().sub(a);
                if (direction.lengthSq() < 1e-12)
                    continue;
                direction.normalize();
                const reference = Math.abs(direction.y) < .9 ? new L(0, 1, 0) : new L(1, 0, 0), u = new L().crossVectors(direction, reference).normalize(), v = new L().crossVectors(direction, u).normalize(), base = positions.length / 3;
                for (const point of [a, b])
                    for (let j = 0; j < sides; j++) {
                        const angle = j / sides * Math.PI * 2, offset = u.clone().multiplyScalar(Math.cos(angle) * radius).addScaledVector(v, Math.sin(angle) * radius);
                        positions.push(point.x + offset.x, point.y + offset.y, point.z + offset.z);
                    }
                for (let j = 0; j < sides; j++) {
                    const next = (j + 1) % sides;
                    indices.push(base + j, base + next, base + sides + j, base + next, base + sides + next, base + sides + j);
                }
                for (let j = 1; j < sides - 1; j++)
                    indices.push(base, base + j + 1, base + j, base + sides, base + sides + j, base + sides + j + 1);
            }
            if (!positions.length)
                return;
            const geometry = new Vt();
            geometry.setAttribute('position', new Pt(positions, 3));
            geometry.setIndex(indices);
            geometry.computeVertexNormals();
            const material = new js({ color, transparent: true, opacity, depthWrite: opacity > .6, roughness: .75 });
            const mesh = new Jt(geometry, material);
            mesh.userData.base = { color: material.color.getHex(), opacity };
            this.model.add(mesh);
            return mesh;
        }
        solid(e, t, n, s) { let r = new ss; e.forEach(([o, l], c) => c ? r.lineTo(o, l) : r.moveTo(o, l)), r.closePath(); let a = new Js(r, { depth: t, bevelEnabled: !1, steps: 1 }); this.model.add(new Jt(a, new js({ color: n, transparent: !0, opacity: s, side: rn, depthWrite: !1, roughness: .8 }))); for (let o of [0, t])
            this.line([...e, e[0]].map(([l, c]) => [l, c, o]), n, .9); for (let o of [0, Math.floor(e.length / 2)]) {
            let [l, c] = e[o];
            this.line([[l, c, 0], [l, c, t]], n, .7);
        } }
        update(e, t) { this.clear(); this.ringMeshes = new Map; let n = xs(e), s = e.block.length, r = (h, u) => [...n.map(d => [d[h], d.z]), ...n.slice().reverse().map(d => [d[u], d.z])]; if (t.elos && this.solid(r("elosLeft", "elosRight"), s, 13658989, .045), t.mining && this.solid(r("mineLeft", "mineRight"), s, 6079226, .035), t.vein && this.solid(r("left", "right"), s, 0xadb97b, .17), t.works)
            for (let h of ["lower", "upper"])
                if (e[h].exists !== false) this.solid(zn(e, h).points, s, h === "lower" ? 5877747 : 6608314, .16); if (t.rings) {
            const all = br(e), asSegments = rows => rows.map(h => [h.collar, h.toe].map(([x, y, z]) => [x, z, y])), radius = Math.max(.025, Math.min(.25, Math.max(e.block.height, e.block.length) * .0035));
            const byRing = new Map();
            for (const h of all) {
                const m = /^R(\d+)-/.exec(String(h.id)), key = m ? Number(m[1])-1 : 't'+h.template;
                if(!byRing.has(key)) byRing.set(key,[]); byRing.get(key).push(h);
            }
            for(const [key,rows] of byRing) {
                const active = __sectionActive(rows[0]);
                const mesh = this.tubes(asSegments(rows),active ? ri[rows[0].template] : 0x95a8b8,active ? .8 : .16,active ? radius : radius*.45);
                if(mesh && typeof key === 'number') {mesh.userData.visualSelected=active;this.ringMeshes.set(key,mesh);}
            }
        } let a = new yn().setFromObject(this.model); a.isEmpty() && (a.min.set(-3, 0, 0), a.max.set(3, e.block.height, s)), this.box = a; let o = a.getSize(new L), l = a.getCenter(new L), c = Math.max(o.x, o.y, o.z, 1); this.camera.far = c * 100, this.camera.updateProjectionMatrix(), this.fitted || (this.fit(), this.fitted = !0), this.resize(), this.setVisualLabels(e), this.addFloorGrid(), this.visualPlayback?.setGeometry(n, zn(e, "lower"), s, this.shownRingPositions(e), br(e).filter(__sectionActive), { allRings: [...new Set(br(e).map(h => Number(h.collar[1])).filter(Number.isFinite))].sort((a, b) => a - b), lowerExists: e.lower.exists !== false, upper: e.upper.exists !== false ? zn(e, "upper") : null, burden: e.drilling?.burdenM ?? null }), this.applyLayer(); this.configureAesthetic(e,t,n,s); }
        configureAesthetic(project,visibility,samples,length) {
            const all=br(project), shown=all.filter(__sectionActive);
            const coords=rows=>[...new Set(rows.map(h=>Number(h.collar[1])).filter(Number.isFinite))].sort((a,b)=>a-b);
            const segments=shown.map(h=>[h.collar,h.toe].map(([x,y,z])=>[x,z,y]));
            const radius=Math.max(.025,Math.min(.25,Math.max(project.block.height,length)*.0035));
            this.aesthetic?.configure(samples,length,segments,radius,[...this.ringMeshes.values()].filter(m=>m.userData.visualSelected),coords(all),coords(shown),visibility,shown,project.charge?.influenceM??null);
        }
        // Posiciones longitudinales (ya existentes) de los anillos que se están mostrando: todos, o solo la sección elegida. Solo lectura.
        shownRingPositions(project) {
            try {
                const rows = br(project), shown = dependencies.getSection() === null ? rows : rows.filter(__sectionActive);
                return [...new Set(shown.map(h => Number(h.collar[1])).filter(Number.isFinite))].sort((a, b) => a - b);
            }
            catch { return []; }
        }
        // Colorea los tubos de anillo con la capa de datos suministrada (o restaura el color original). No calcula ni asigna valores.
        applyLayer(layer) {
            layer = layer === undefined ? window.MineCADAnimation?.getLayer?.() : layer;
            const on = !!layer && layer.state === 'disponible';
            for (const [index, mesh] of this.ringMeshes) {
                // La capa de color no debe volver a mostrar líneas fuera de la selección.
                mesh.visible = mesh.userData.visualSelected !== false;
                const base = mesh.userData.base, style = on ? (layer.byRing?.get(index) ?? layer.all ?? null) : null;
                mesh.material.color.setHex(style ? style.color : base.color);
                mesh.material.opacity = style ? style.opacity : base.opacity;
            }
        }
        setVisualLabels(project) {
            this.labelLayer.replaceChildren();
            this.visualLabels = [];
            const add = (text, position, color) => { const node = document.createElement('div'); node.className = 'scene-object-label'; node.textContent = text; node.style.color = color; this.labelLayer.append(node); this.visualLabels.push({ node, point: new L(...position) }); };
            for (const side of ['lower', 'upper']) {
                if (project[side].exists === false) continue;
                const info = project[side], g = zn(project, side);
                add((side === 'lower' ? 'NIVEL INFERIOR' : 'NIVEL SUPERIOR') + ' · ' + info.width.toFixed(1) + ' × ' + info.height.toFixed(1) + ' m', [g.centre + info.width * .7, g.floor + info.height * .8, project.block.length * .65], side === 'lower' ? '#91cafa' : '#8bddcf');
            }
            const top = Bn(project, project.block.height);
            add('VETA · ' + project.vein.middle.thickness.toFixed(2) + ' m · ' + project.vein.middle.dip.toFixed(1) + '°', [top.centre, project.block.height + (project.upper.exists === false ? 0 : project.upper.height * .9), project.block.length * .2], '#c9dc91');
            this.positionLabels();
        }
        positionLabels() {
            if (!this.visualLabels)
                return;
            const width = this.el.clientWidth, height = this.el.clientHeight;
            this.camera.updateMatrixWorld();
            for (const label of this.visualLabels) {
                const point = label.point.clone().project(this.camera);
                label.node.hidden = point.z > 1 || point.z < -1 || Math.abs(point.x) > 1.15 || Math.abs(point.y) > 1.15;
                label.node.style.left = ((point.x + 1) * width / 2) + 'px';
                label.node.style.top = ((-point.y + 1) * height / 2) + 'px';
            }
        }
        addFloorGrid() {
            const box = this.box, size = box.getSize(new L), span = Math.max(size.x, size.z, 5), xmin = box.min.x - span * .35, xmax = box.max.x + span * .35, zmin = box.min.z - span * .15, zmax = box.max.z + span * .15, y = box.min.y - .08, points = [];
            for (let k = 0; k <= 16; k++) {
                const x = xmin + (xmax - xmin) * k / 16, z = zmin + (zmax - zmin) * k / 16;
                points.push(x, y, zmin, x, y, zmax, xmin, y, z, xmax, y, z);
            }
            const geometry = new Vt();
            geometry.setAttribute('position', new Pt(points, 3));
            this.model.add(new zs(geometry, new _i({ color: 0x416179, transparent: true, opacity: .3 })));
        }
        fit() {
            if (!this.box)
                return;
            this.resize();
            const size = this.box.getSize(new L), centre = this.box.getCenter(new L), direction = new L(.7, .4, 1).normalize(), radius = Math.max(size.length() / 2, 2), corners = [];
            for (const x of [this.box.min.x, this.box.max.x])
                for (const y of [this.box.min.y, this.box.max.y])
                    for (const z of [this.box.min.z, this.box.max.z])
                        corners.push(new L(x, y, z));
            this.controls.target.copy(centre);
            let low = radius * 1.05, high = radius * 20;
            for (let k = 0; k < 18; k++) {
                const distance = (low + high) / 2;
                this.camera.position.copy(centre).addScaledVector(direction, distance);
                this.camera.lookAt(centre);
                this.camera.updateMatrixWorld(true);
                const extent = Math.max(...corners.map(p => { const q = p.clone().project(this.camera); return Math.max(Math.abs(q.x), Math.abs(q.y)); }));
                if (extent > .82)
                    low = distance;
                else
                    high = distance;
            }
            this.camera.position.copy(centre).addScaledVector(direction, high);
            this.controls.update();
        }
        dispose() { this.unsubscribeLayer?.(); this.aesthetic?.dispose(); this.visualPlayback?.dispose(); this.running = !1, this.observer.disconnect(), this.controls.dispose(), this.clear(), this.renderer.dispose(), this.el.replaceChildren(); }
    };
    return wo;
};
