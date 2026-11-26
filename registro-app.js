try {
    (() => {
        var yc = { oreDensity: { title: "Densidad de mineral \xB7 sulfuros y \xF3xidos", body: "Valores de referencia del mineral puro, en t/m\xB3 (= g/cm\xB3). No representan autom\xE1ticamente la densidad aparente de una mena con ganga, poros o mezclas.", table: [["Galena \xB7 PbS", "7.58", "https://www.handbookofmineralogy.org/pdfs/galena.pdf"], ["Argentita / acantita \xB7 Ag\u2082S\xB9", "7.20\u20137.22\xB9", "https://www.handbookofmineralogy.org/pdfs/acanthite.pdf"], ["Esfalerita \xB7 (Zn,Fe)S", "3.9\u20134.1", "https://www.handbookofmineralogy.org/pdfs/sphalerite.pdf"], ["Calcopirita \xB7 CuFeS\u2082", "4.1\u20134.3", "https://www.handbookofmineralogy.org/pdfs/chalcopyrite.pdf"], ["Bornita \xB7 Cu\u2085FeS\u2084", "5.06\u20135.08", "https://www.handbookofmineralogy.org/pdfs/bornite.pdf"], ["Pirrotita \xB7 Fe\u2081\u208B\u2093S", "4.58\u20134.65", "https://www.handbookofmineralogy.org/pdfs/pyrrhotite.pdf"], ["Hematita \xB7 Fe\u2082O\u2083 (\xF3xido)", "5.26", "https://www.handbookofmineralogy.org/pdfs/hematite.pdf"], ["Magnetita \xB7 Fe\u2083O\u2084 (\xF3xido)", "5.175", "https://www.handbookofmineralogy.org/pdfs/magnetite.pdf"]], reference: "\xB9 El valor corresponde a acantita, fase de Ag\u2082S estable a temperatura ambiente; la fase c\xFAbica de alta temperatura es argentita. Usa la densidad medida representativa de tu mineralizaci\xF3n. Cada nombre enlaza su ficha.", url: "https://www.handbookofmineralogy.org/", source: "Handbook of Mineralogy \xB7 fichas de propiedades f\xEDsicas" }, rmr: { title: "RMR \xB7 Rock Mass Rating (Bieniawski)", body: "\xCDndice de calidad del macizo, de 0 a 100. Considera resistencia de la roca intacta, RQD, espaciamiento y condici\xF3n de discontinuidades y agua; el sistema contempla un ajuste por su orientaci\xF3n.", reference: "Clases: I muy buena 81\u2013100; II buena 61\u201380; III regular 41\u201360; IV mala 21\u201340; V muy mala 0\u201320. Rango permitido en esta pantalla: 0\u2013100.", url: "https://minedocs.com/12/CanTung_TechReport_09192014.pdf", source: "Informe Cantung 2014 \xB7 tabla 16.7" }, ucs: { title: "UCS \xB7 Resistencia a la compresi\xF3n uniaxial", body: "Esfuerzo de compresi\xF3n que resiste una probeta de roca intacta antes de fallar, sin confinamiento lateral. Se expresa en MPa y no representa por s\xED solo la resistencia del macizo fracturado.", reference: "Referencia Deere\u2013Miller: muy baja 1\u201325; baja 25\u201350; media 50\u2013100; alta 100\u2013200; muy alta >200 MPa. Captura permitida aqu\xED: 0.01\u20131000 MPa; vac\xEDo = pendiente. Estos l\xEDmites de captura no definen una clase geol\xF3gica.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8111601/", source: "Estudio experimental de resistencia de rocas \xB7 2021" }, density: { title: "Densidad \xB7 material y valor de referencia", body: "El campo usa t/m\xB3, num\xE9ricamente igual a g/cm\xB3. 1 t/m\xB3 = 1000 kg/m\xB3. No se utilizan kg/cm\xB3.", table: [["Calcita \xB7 matriz mineral", "2.71"], ["Cuarzo \xB7 matriz mineral", "2.65"], ["Dolomita \xB7 matriz mineral", "2.85"], ["Granito \xB7 roca, referencia USGS", "2.67"], ["Arenisca saturada \xB7 porosidad 10 %", "2.5"], ["Arenisca saturada \xB7 porosidad 20 %", "2.3"]], reference: "Valores en t/m\xB3 (= g/cm\xB3). La densidad de matriz no sustituye la densidad aparente de la roca o de la mena. Porosidad, saturaci\xF3n y composici\xF3n cambian el valor; confirma el dato representativo de tu mina.", url: "https://pubs.usgs.gov/of/1988/0441/report.pdf", source: "USGS 1988 \xB7 tabla 11 (rocas)", extraUrl: "https://www.pnnl.gov/main/publications/external/technical_reports/PNNL-18844.pdf", extraSource: "PNNL 2009 \xB7 tabla A.4 (minerales)" }, structure: { title: "Estructuras del macizo", body: "Registro cualitativo del fracturamiento observado: masivo, moderadamente fracturado o muy fracturado/con fallas. Complementa la descripci\xF3n de familias, orientaci\xF3n, espaciamiento y condici\xF3n de discontinuidades.", reference: "Las familias medidas se capturan por separado. Esta selecci\xF3n queda documentada en el dise\xF1o." }, water: { title: "Agua en barrenos", body: "Condici\xF3n observada durante el levantamiento: seco, h\xFAmedo/goteo o con agua. Registra las condiciones de inspecci\xF3n; pueden cambiar con el tiempo.", reference: "En el panel Q\u2032, el agua se conserva como dato documental. Q\u2032 excluye los t\xE9rminos de agua y esfuerzo." } };
        var Mc = { q: { label: "NGI \xB7 Q-handbook 2025, \xA72.4", url: "https://www.ngi.no/globalassets/bilder/forskning-og-radgivning/bygg-og-anlegg/q-handbook_2025_english_final.pdf" }, n: { label: "Bewick y Kaiser 2009, ecuaci\xF3n 1 y p.2", url: "https://geogroup.utoronto.ca/wp-content/uploads/RockEng09/PDF/Session10/3996%20PAPER.pdf" }, a: { label: "Hoek, Kaiser y Bawden \xB7 cap\xEDtulo 14, ecuaci\xF3n 14.2", url: "https://www.rocscience.com/assets/resources/learning/hoek/Support-of-Underground-Excavations-in-Hard-Rock.pdf" }, c: { label: "Army et al. 2026, ecuaci\xF3n 17 (componente Cs)", url: "https://hrcak.srce.hr/en/345672" } }, An = i => i * Math.PI / 180, Io = i => i * 180 / Math.PI, Po = (i, e, t) => Math.min(t, Math.max(e, i));
        function Lo() { return { schema: "minecad-geometria/1", name: "Nuevo dise\xF1o", place: "", author: "", block: { height: 15, length: 30, grade: 0, gradeUnit: "g/t", sectionAzimuth: null }, lower: { exists: true, width: 3, height: 3, offset: 0 }, upper: { exists: true, width: 3, height: 3, offset: 0 }, vein: { direction: "derecha", bottom: { thickness: 1.5, dip: 80 }, middle: { thickness: 1.5, dip: 80 }, top: { thickness: 1.5, dip: 80 }, minMining: 1.5 }, rock: { oreDensity: null, highDensity: null, lowDensity: null, rmr: null, ucs: null, structure: "moderada", water: "seco" }, elos: { high: .3, low: .2 }, drilling: Sc(), rings: wc(), joints: [{ name: "J1", dip: null, azimuth: null }, { name: "J2", dip: null, azimuth: null }, { name: "J3", dip: null, azimuth: null }], stability: { rqd: null, jn: null, jr: null, ja: null, stress: null, A: null, refA: "", useAAnchors: !1, faces: { high: Ro(), low: Ro(), crown: Ro() } }, notes: "" }; }
        function Sc() { return { pattern: "sin_capturar", origin: "sin_capturar", diameterMm: null, lengthM: null, burdenM: null, spacingM: null, docTrebolillo: !1 }; }
        var ri = ["#ff8f6b", "#c792ff", "#e6f26b"], ms = ["A", "B", "C"], Yu = 5e3, $u = () => ({ count: null });
        function wc() { return { startY: null, group: [$u()] }; }
        var Di = i => Math.round(i * 1e9) / 1e9;
        function Zu(i) { let e = i.drilling; if (e.origin === "sin_capturar" || e.pattern === "sin_capturar")
            return null; let t = i.block.height, n = i.lower.height, s = e.origin === "inferior", r = s ? n : t, a = s ? t : n; if (Math.abs(a - r) < 1e-6)
            return null; let o = Bn(i, r), l = Bn(i, a), c = e.pattern === "abanico" ? zn(i, s ? "lower" : "upper").centre : o.centre, h = l.centre - c, u = a - r, d = (Io(Math.atan2(u, h)) + 360) % 360, p = Math.hypot(h, u), x = e.pattern === "abanico" ? l.mineRight - l.mineLeft : o.mineRight - o.mineLeft; return { x: c, z: r, angle: d, length: Math.min(e.lengthM ?? p, p), perp: x * Math.abs(Math.sin(An(d))) }; }
        function yr(i, e) { let t = Zu(i); if (!t)
            return []; let n = i.drilling.spacingM, s = i.drilling.pattern, r = e.count ?? (n > 0 ? Math.min(50, Math.floor(t.perp / n + 1e-9) + 1) : 1); if (r > 1 && !(n > 0))
            return []; let a = t.length, o = An(t.angle), l = Math.cos(o), c = Math.sin(o), h = []; for (let u = 0; u < r; u++) {
            let d = u - (r - 1) / 2, p = t.x, x = t.z, _ = o;
            if (r > 1)
                if (s === "abanico")
                    _ = o + d * 2 * Math.asin(Math.min(1, n / (2 * a)));
                else {
                    let m = Math.abs(c) >= Math.abs(l), f = n / Math.abs(m ? c : l);
                    m ? p += d * f : x += d * f;
                }
            h.push({ collar: [Di(p), Di(x)], toe: [Di(p + a * Math.cos(_)), Di(x + a * Math.sin(_))] });
        } return h; }
        function Do(i) { let e = i.rings, t = i.drilling.burdenM, n = i.block.length, s = e.startY ?? 0; if (t === null || t < .1 || s > n)
            return []; let r = Math.floor((n - s) / t + 1e-9) + 1; return Array.from({ length: r }, (a, o) => ({ index: o, y: s + o * t, template: o % e.group.length })); }
        function vr(i) { return i.rings.group.flatMap((e, t) => yr(i, e).map((n, s) => ({ id: ms[t] + "\xB7" + (s + 1), template: t, collar: [n.collar[0], 0, n.collar[1]], toe: [n.toe[0], 0, n.toe[1]] }))); }
        function br(i) { let e = i.rings.group.map(t => yr(i, t)); return Do(i).flatMap(t => e[t.template].map((n, s) => ({ id: "R" + (t.index + 1) + "-" + (s + 1), template: t.template, collar: [n.collar[0], Di(t.y), n.collar[1]], toe: [n.toe[0], Di(t.y), n.toe[1]] }))); }
        function Ac(i) { let e = i.rings.group.map(t => yr(i, t).length); return Do(i).reduce((t, n) => t + e[n.template], 0); }
        function Mr(i) { if (!vr(i).length)
            return ""; let e = Do(i).length; return "secuencia " + i.rings.group.map((t, n) => ms[n] + "(" + yr(i, t).length + ")").join("\u2013") + (e ? " \xB7 " + e + " anillos \xB7 " + Ac(i) + " barrenos" : " \xB7 falta bordo entre anillos"); }
        var Ju = i => i === null ? null : i / 25.4;
        function Ec(i) { if (i === null)
            return "\u2014"; let e = Ju(i), t = Math.round(e * 64); if (Math.abs(e - t / 64) > 1e-7)
            return e.toFixed(3) + " in"; let n = Math.floor(t / 64), s = t % 64, r = 64; for (; s && s % 2 === 0;)
            s /= 2, r /= 2; return ([n ? String(n) : "", s ? s + "/" + r : ""].filter(Boolean).join(" ") || "0") + " in"; }
        function Tc(i) { let e = i.drilling, t = { sin_capturar: "disposici\xF3n pendiente", paralelas: "filas paralelas", abanico: "abanico" }[e.pattern], n = { sin_capturar: "origen pendiente", inferior: "nivel inferior", superior: "nivel superior" }[e.origin]; return t + " \xB7 " + n + " \xB7 \xD8 " + (e.diameterMm === null ? "\u2014" : e.diameterMm.toFixed(2)) + " mm \xB7 L " + (e.lengthM === null ? "\u2014" : e.lengthM.toFixed(2)) + " m"; }
        function Ro() { return { overrideQ: !1, rqd: null, jn: null, jr: null, ja: null, ucs: null, stress: null, A: null, B: null, C: null, family: 0, ref: "" }; }
        var yt = (i, e, t) => typeof i == "number" && Number.isFinite(i) && i >= e && i <= t, He = (i, e) => { if (!i)
            throw Error(e); };
        function ai(i) { He(i && i.schema === "minecad-geometria/1", "El archivo no corresponde a Geometr\xEDa MineCAD."); for (let r of ["name", "place", "author", "notes"])
            He(typeof i[r] == "string" && i[r].length < 1e4, "Texto inv\xE1lido."); i.drilling === void 0 && (i.drilling = Sc()); let e = i.drilling; e && e.docTrebolillo === void 0 && (e.docTrebolillo = !1); He(!e || typeof e.docTrebolillo === "boolean", "Marca documental inválida."); He(e && ["sin_capturar", "paralelas", "abanico"].includes(e.pattern) && ["sin_capturar", "inferior", "superior"].includes(e.origin), "Registro de anillos inv\xE1lido."), He(e.diameterMm === null || yt(e.diameterMm, 1, 500), "Di\xE1metro registrado fuera de rango."), He(e.lengthM === null || yt(e.lengthM, .1, 200), "Longitud registrada fuera de rango."); for (let r of ["burdenM", "spacingM"])
            e[r] === void 0 && (e[r] = null), He(e[r] === null || yt(e[r], 0, 1e6), "Dato documental de distancia inv\xE1lido."); for (let [r, a, o] of [["height", 2, 300], ["length", 1, 1e3], ["grade", 0, 1e6]])
            He(yt(i.block?.[r], a, o), "Dimensi\xF3n de bloque fuera de rango."); He(["g/t", "%"].includes(i.block.gradeUnit), "Unidad de ley inv\xE1lida."), He(i.block.sectionAzimuth === null || yt(i.block.sectionAzimuth, 0, 360), "Azimut inv\xE1lido."); for (let r of ["lower", "upper"]) {
            He(i[r], "Falta la referencia de una obra.");
            i[r].exists === undefined && (i[r].exists = true);
            He(typeof i[r].exists === "boolean", "La existencia de cada nivel debe ser sí o no.");
            for (let a of ["width", "height"])
                He(yt(i[r][a], .5, 30), "Dimensi\xF3n de obra fuera de rango.");
            He(yt(i[r].offset, -100, 100), "Desplazamiento fuera de rango.");
        } He(["derecha", "izquierda"].includes(i.vein?.direction), "Direcci\xF3n de buzamiento inv\xE1lida."); for (let r of ["bottom", "middle", "top"])
            He(yt(i.vein[r]?.thickness, .1, 50) && yt(i.vein[r]?.dip, 10, 90), "Potencia o echado fuera de rango."); He(yt(i.vein.minMining, .1, 50), "Ancho m\xEDnimo inv\xE1lido."); for (let r of ["oreDensity", "highDensity", "lowDensity"])
            He(i.rock?.[r] === null || yt(i.rock?.[r], .1, 20), "Densidad inv\xE1lida."); He(i.rock.rmr === null || yt(i.rock.rmr, 0, 100), "RMR inv\xE1lido."), He(i.rock.ucs === null || yt(i.rock.ucs, .01, 1e3), "UCS inv\xE1lida."), He(["masiva", "moderada", "fracturada"].includes(i.rock.structure) && ["seco", "humedo", "agua"].includes(i.rock.water), "Registro de macizo inv\xE1lido."); for (let r of ["high", "low"])
            He(yt(i.elos?.[r], 0, 10), "ELOS fuera de rango."); He(Array.isArray(i.joints) && i.joints.length === 3, "Se requieren tres filas de familias (pueden quedar pendientes)."); for (let r of i.joints)
            He(typeof r.name == "string" && r.name.length <= 100, "Nombre de familia inv\xE1lido."), He(r.dip === null || yt(r.dip, 0, 90), "Echado de estructura inv\xE1lido."), He(r.azimuth === null || yt(r.azimuth, 0, 360), "Azimut de estructura inv\xE1lido."); let t = i.stability; He(t && typeof t.useAAnchors == "boolean" && typeof t.refA == "string", "Configuraci\xF3n de estabilidad inv\xE1lida."), vc(t); for (let r of ["A", "stress"])
            He(t[r] === null || yt(t[r], r === "A" ? .01 : .001, r === "A" ? 1 : 2e3), "A o esfuerzo inv\xE1lido."); for (let r of ["high", "low", "crown"]) {
            let a = t.faces?.[r];
            He(a && typeof a.overrideQ == "boolean" && typeof a.ref == "string", "Cara inv\xE1lida."), vc(a);
            for (let o of ["ucs", "stress", "A", "B", "C"])
                He(a[o] === null || yt(a[o], .001, ["A", "B"].includes(o) ? 1 : o === "C" ? 10 : 2e3), "Factor de cara inv\xE1lido.");
            He(Number.isInteger(a.family) && a.family >= 0 && a.family < 3, "Familia inv\xE1lida.");
        } delete i.holes; i.rings === void 0 && (i.rings = wc()); let s = i.rings; He(s && Array.isArray(s.group) && s.group.length >= 1 && s.group.length <= 3, "Secuencia de anillos inv\xE1lida (1 a 3 anillos)."), s.stepY !== void 0 && (i.drilling.burdenM === null && s.stepY !== null && (i.drilling.burdenM = s.stepY), delete s.stepY), s.startY === void 0 && (s.startY = null), s.group = s.group.map(r => ({ count: r && r.count !== void 0 ? r.count : null })), He(s.startY === null || yt(s.startY, 0, 1e6), "Y del primer anillo fuera de rango."); for (let r of s.group)
            He(r.count === null || Number.isInteger(r.count) && r.count >= 1 && r.count <= 50, "N\xFAmero de barrenos del anillo: entero de 1 a 50."); return He(Ac(i) <= Yu, "La secuencia genera m\xE1s de 5,000 barrenos; aumenta el bordo entre anillos."), i; }
        function vc(i) { for (let [e, t, n] of [["rqd", 0, 100], ["jn", .01, 100], ["jr", .01, 100], ["ja", .01, 100]])
            He(i[e] === null || yt(i[e], t, n), "Par\xE1metro Q\u2032 inv\xE1lido."); }
        function Uo(i) { return ["rqd", "jn", "jr", "ja"].some(e => i[e] === null) ? null : i.rqd / i.jn * i.jr / i.ja; }
        function Cc(i, e) { let t = i.block.height, n = Po(e / t, 0, 1), s = n <= .5 ? ["bottom", "middle"] : ["middle", "top"], r = n <= .5 ? n * 2 : (n - .5) * 2, a = i.vein[s[0]], o = i.vein[s[1]]; return { dip: a.dip + (o.dip - a.dip) * r, thickness: a.thickness + (o.thickness - a.thickness) * r }; }
        function Ku(i, e) { let t = i.block.height, n = Po(e, 0, t), s = 80, r = 0; for (let a = 0; a < s; a++) {
            let o = n * (a + .5) / s;
            r += 1 / Math.tan(An(Cc(i, o).dip)) * n / s;
        } return e < 0 && (r += e / Math.tan(An(i.vein.bottom.dip))), e > t && (r += (e - t) / Math.tan(An(i.vein.top.dip))), r; }
        function Bn(i, e) { let t = Cc(i, e), n = i.vein.direction === "derecha" ? 1 : -1, s = -n * (Ku(i, e) - Ku(i, i.lower.height)), r = Math.sin(An(t.dip)), a = t.thickness / (2 * r), o = Math.max(i.vein.minMining, t.thickness) / (2 * r); return { z: e, centre: s, dip: t.dip, thickness: t.thickness, left: s - a, right: s + a, mineLeft: s - o, mineRight: s + o, elosLeft: s - o - i.elos[n === 1 ? "low" : "high"] / r, elosRight: s + o + i.elos[n === 1 ? "high" : "low"] / r }; }
        function xs(i, e = 40) { return Array.from({ length: e + 1 }, (t, n) => Bn(i, i.block.height * n / e)); }
        function zn(i, e) { let t = i[e], n = e === "lower" ? 0 : i.block.height, s = Bn(i, e === "lower" ? t.height : n).centre + t.offset, r = Math.min(t.width / 2, t.height * .45), a = t.height - r, o = [[s - t.width / 2, n], [s + t.width / 2, n], [s + t.width / 2, n + a]]; for (let l = 1; l <= 24; l++) {
            let c = Math.PI * l / 24;
            o.push([s + t.width / 2 * Math.cos(c), n + a + r * Math.sin(c)]);
        } return o.push([s - t.width / 2, n]), { centre: s, floor: n, points: o }; }
        function ju(i, e) { return i * e / (2 * (i + e)); }
        function bc(i, e) { let t = An(i), n = An(e); return [Math.sin(t) * Math.sin(n), Math.sin(t) * Math.cos(n), Math.cos(t)]; }
        function Qu(i, e) { let t = Po(Math.abs(i.reduce((n, s, r) => n + s * e[r], 0)), 0, 1); return t > 1 - 1e-12 ? 0 : t < 1e-12 ? 90 : Io(Math.acos(t)); }
        function ed(i) { return i === null ? null : i <= 2 ? .1 : i >= 10 ? 1 : null; }
        function td(i) { return i === null ? null : Math.abs(i) < 1e-8 ? .3 : i >= 10 - 1e-8 && i <= 30 + 1e-8 ? .2 : Math.abs(i - 90) < 1e-8 ? 1 : null; }
        function No(i) { let e = xs(i), t = i.block.length, n = i.block.height, s = i.vein.direction === "derecha" ? 1 : -1; return ["high", "low", "crown"].map(r => { let a = i.stability.faces[r], o = r === "high" ? s === 1 ? "mineRight" : "mineLeft" : s === 1 ? "mineLeft" : "mineRight", l, c, h; if (r === "crown") {
            let O = e.at(-1);
            l = O.mineRight - O.mineLeft, c = 0, h = 0;
        }
        else {
            l = e.slice(1).reduce((w, v, E) => w + Math.hypot(v[o] - e[E][o], v.z - e[E].z), 0);
            let O = e.at(-1)[o] - e[0][o];
            c = Io(Math.atan2(n, Math.abs(O))), h = O <= 0 ? 0 : 180;
        } let u = Uo(a.overrideQ ? a : i.stability), d = a.ucs ?? i.rock.ucs, p = a.stress ?? i.stability.stress, x = d !== null && p !== null && p > 0 ? d / p : null, _ = a.A ?? i.stability.A ?? (i.stability.useAAnchors ? ed(x) : null), m = a.A !== null ? "capturado por cara" : i.stability.A !== null ? "capturado com\xFAn" : _ !== null ? "ancla publicada" : "pendiente", f = i.joints[a.family], C = i.block.sectionAzimuth, b = f.dip !== null && f.azimuth !== null && (r === "crown" || C !== null) ? Qu(bc(c, r === "crown" ? 0 : (C + h) % 360), bc(f.dip, f.azimuth)) : null, M = a.B ?? td(b), I = a.B !== null ? "capturado" : M !== null ? "ancla publicada" : "sin ancla; capturar B", T = a.C ?? 8 - 7 * Math.cos(An(c)), P = u === null || _ === null || M === null ? null : u * _ * M * T; return { id: r, label: r === "high" ? "Respaldo alto" : r === "low" ? "Respaldo bajo" : "Corona", size: l, length: t, dip: c, HR: ju(l, t), Q: u, A: _, Aorigin: m, B: M, Borigin: I, C: T, beta: b, N: P, ratio: x, joint: f.name, source: a.ref, approximate: r !== "crown" && (i.vein.bottom.dip !== i.vein.top.dip || i.vein.bottom.dip !== i.vein.middle.dip || i.vein.bottom.thickness !== i.vein.top.thickness || i.vein.bottom.thickness !== i.vein.middle.thickness) }; }); }
        function Rc(i) { let e = []; if ((i.drilling.origin === "inferior" && !i.lower.exists) || (i.drilling.origin === "superior" && !i.upper.exists)) e.push("El nivel de origen está marcado como inexistente; revisa la selección de origen."); i.lower.exists && i.upper.exists && i.lower.height >= i.block.height && e.push("La obra inferior alcanza o supera el piso del nivel superior."), i.block.gradeUnit === "%" && i.block.grade > 100 && e.push("La ley capturada supera 100 %."), i.block.sectionAzimuth === null && e.push("Sin azimut de secci\xF3n: \u03B2 de los respaldos queda pendiente."); let t = i.rings, n = i.drilling; if ([n.pattern !== "sin_capturar", n.origin !== "sin_capturar", n.lengthM !== null, n.burdenM !== null, n.spacingM !== null].some(Boolean) || t.group.some(s => s.count !== null)) {
            let s = [n.pattern === "sin_capturar" ? "configuraci\xF3n (paralelas/abanico)" : null, n.origin === "sin_capturar" ? "nivel de origen" : null, n.burdenM === null || n.burdenM < .1 ? "bordo entre anillos (m\xEDn. 0.1 m)" : null, n.spacingM === null || n.spacingM <= 0 ? "espaciamiento (necesario con m\xE1s de un barreno)" : null].filter(Boolean);
            s.length && e.push("Barrenos autom\xE1ticos pendientes: " + s.join(", ") + ".");
        } return n.pattern === "abanico" && n.spacingM > 0 && n.lengthM !== null && n.spacingM > 2 * n.lengthM && e.push("El espaciamiento supera el doble del largo de los barrenos."), t.startY !== null && t.startY > i.block.length && e.push("El primer anillo queda fuera del largo del bloque."), e; }
        /* Biblioteca y visor en archivos externos; funciones existentes conservadas. */
        var wo = window.MineCADCreateViewer3D({ xs, zn, br, ri, __sectionActive, Bn, getSection: () => __minecadSection });
        var __minecadSection = 0;
        var __minecadCount = 1;
        var Ve = i => document.querySelector(i), bt = i => String(i ?? "").replace(/[&<>"']/g, e => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e]), Je = (i, e = 2) => i == null ? "\u2014" : Number(i).toLocaleString("es-MX", { maximumFractionDigits: e, minimumFractionDigits: e }), fr = "minecad-geometria-paleta-v1", ae = Lo(), wn = "section", Ii = null, At = { vein: !0, works: !0, mining: !0, elos: !0, rings: !0, annotations: !0 }, pr = 1, mr = [0, 0], lc = !0;
        try {
            let i = localStorage.getItem(fr);
            i && (ae = ai(JSON.parse(i)));
        }
        catch {
            setTimeout(() => ni("El guardado de geometr\xEDa no se pudo abrir. Importa un respaldo v\xE1lido."), 0);
        }
        function ti(i) { return i.split(".").reduce((e, t) => e[t], ae); }
        function Pu(i, e) { let t = i.split("."), n = t.pop(), s = t.reduce((r, a) => r[a], ae); s[n] = e; }
        function ni(i) { Ve("#status").textContent = i; }
        function xr() { try {
            ai(ae), localStorage.setItem(fr, JSON.stringify(ae)), lc = !0, ni("Guardado local \xB7 Geometr\xEDa 1.9");
        }
        catch (i) {
            lc = !1, ni(i.message);
        } }
        function Nu(i, e) { return `<span class="help-label" tabindex="0" data-help="${e}" aria-describedby="help-popover">${i}<span class="help-icon" aria-hidden="true">i</span></span>`; }
        function _t(i, e, { min: t = 0, max: n = 1e6, step: s = .1, unit: r = "", optional: a = !1, tip: o = "" } = {}) { let l = e.startsWith("rock.") ? { "rock.rmr": "rmr", "rock.ucs": "ucs", "rock.oreDensity": "oreDensity", "rock.highDensity": "density", "rock.lowDensity": "density" }[e] : null; return `<label class="field" title="${l ? "" : bt(o)}"><span>${l ? Nu(i, l) : i}${r ? ` <small>${r}</small>` : ""}</span><input type="number" data-path="${e}" value="${ti(e) ?? ""}" min="${t}" max="${n}" step="any" ${a ? "" : "required"} aria-label="${i}"></label>`; }
        function on(i, e, t, n, s, r = "", a = "") { return `<div class="slider-field" title="${bt(a)}"><label for="n-${e}">${i} <small>${r}</small></label><input id="n-${e}" type="number" data-path="${e}" value="${ti(e)}" min="${t}" max="${n}" step="any" required aria-label="${i}"><input type="range" data-path="${e}" value="${ti(e)}" min="${t}" max="${n}" step="${s}" aria-label="Ajustar ${i}"></div>`; }
        function Lu(i, e, t, n, s, r) { return on(i, e, t, n, s, r).replace(`value="${ti(e)}"`, `value="${ti(e) ?? ""}"`).replace("required aria-label=", "aria-label=").replace(`type="range" data-path="${e}" value="null"`, `type="range" data-path="${e}" value="${t}"`); }
        function fs(i, e) { return `<label class="field"><span>${i}</span><input data-path="${e}" value="${bt(ti(e))}" maxlength="300" aria-label="${i}"></label>`; }
        function Ri(i, e, t) { let n = e === "rock.structure" ? "structure" : e === "rock.water" ? "water" : null; return `<label class="field"><span>${n ? Nu(i, n) : i}</span><select data-path="${e}" aria-label="${i}">${t.map(([s, r]) => `<option value="${s}" ${String(ti(e)) === String(s) ? "selected" : ""}>${r}</option>`).join("")}</select></label>`; }
        function Ft(i, e, t = !1) { return `<details class="group" ${t ? "open" : ""}><summary>${i}</summary><div class="group-body">${e}</div></details>`; }
        function Ao(i) { let e = Mc[i]; return `<a href="${e.url}" target="_blank" rel="noopener noreferrer">${bt(e.label)}</a>`; }
        function mg() { document.body.innerHTML = `<header><div class="brand"><img src="./logo-minecad.png" alt="MINECAD"><div><strong>MINECAD</strong><span>Geometr\xEDa de veta \xB7 Web</span></div></div><div class="toolbar"><button id="toggle-controls">Par\xE1metros</button><button id="export">Guardar JSON</button><button id="import">Abrir JSON</button><button id="font-down" aria-label="Reducir texto">A\u2212</button><button id="font-up" aria-label="Aumentar texto">A+</button></div></header><main><aside id="inspector" aria-label="Par\xE1metros de geometr\xEDa"><div class="inspector-top"><strong>SETUP \xB7 GEOMETR\xCDA</strong><button id="close-controls" aria-label="Cerrar par\xE1metros">Cerrar</button></div><div id="inputs"></div></aside><section class="workspace"><div class="view-tabs" role="tablist" aria-label="Vistas"><button role="tab" data-view="section" aria-selected="true">Secci\xF3n 2D</button><button role="tab" data-view="model" aria-selected="false">Modelo 3D</button><button role="tab" data-view="stability" aria-selected="false">Estabilidad</button><button id="fit">Ajustar vista</button></div><div id="metrics" class="metrics"></div><div class="scene-wrap"><div id="section-view" class="stage"><div class="cross-section"><svg id="section" aria-label="Secci\xF3n transversal de veta y obras" role="img"></svg><div class="scene-label">SECCI\xD3N TRANSVERSAL \xB7 X / Z \xB7 m</div></div><section class="plan-pane" aria-label="Planta de collares de anillos"><div class="plan-title"><strong>PLANTA \xB7 COLLARES DE ANILLOS</strong><span id="plan-count"></span></div><svg id="plan" role="img" aria-label="Proyecci\xF3n en planta de los collares de anillos"></svg></section></div><div id="model-view" class="stage" hidden><div id="three"></div><div class="scene-label">MODELO 3D \xB7 arrastra para orbitar \xB7 rueda para acercar</div></div><div id="stability-view" class="results" hidden></div></div><div id="section-selector" class="section-strip" aria-label="Sección visible"></div><div id="layers" class="layers">${[["vein", "Veta"], ["works", "Obras"], ["mining", "M\xEDnimo minado"], ["elos", "ELOS supuesto"], ["rings", "Anillos configurados"], ["annotations", "Anotaciones"]].map(([i, e]) => `<label><input type="checkbox" data-layer="${i}" ${At[i] ? "checked" : ""}>${e}</label>`).join("")}</div><div id="warnings" class="warnings"></div></section></main><footer><span id="status" role="status" aria-live="polite">Geometr\xEDa 1.9 \xB7 guardado local</span><span>Valores iniciales ilustrativos \xB7 sin clasificaci\xF3n autom\xE1tica de estabilidad</span></footer><div id="help-popover" role="tooltip" hidden></div><input id="json-file" type="file" accept=".json,application/json" hidden>`, cc(), vg(), bg(), Pi(); }
        function cc() {
            let i = e => Ft("Nivel " + (e === "lower" ? "inferior" : "superior"),
                '<label class="check"><input type="checkbox" data-path="' + e + '.exists" ' + (ae[e].exists ? 'checked' : '') + '>Existe este nivel</label>' +
                '<fieldset class="work-dimensions" ' + (ae[e].exists ? '' : 'disabled') + '>' +
                on("Ancho de obra", e + ".width", .5, 30, .1, "m") + on("Alto de obra", e + ".height", .5, 30, .1, "m") +
                on("Posición respecto a veta", e + ".offset", -100, 100, .1, "m", e === "lower" ? "Desplazamiento del centro de la corona respecto a la veta." : "Desplazamiento del centro del piso respecto a la veta.") + '</fieldset>' +
                '<p class="hint">' + (ae[e].exists ? 'Perfil de obra con bóveda superior.' : 'Nivel inexistente: no se dibuja la obra. Sus cotas se conservan como referencias del bloque.') + '</p>');
            Ve("#inputs").innerHTML = `<div class="identity">${fs("Nombre del dise\xF1o", "name")}${fs("Lugar / Obra", "place")}${fs("Responsable", "author")}</div>` + Ft("Bloque y niveles", on(ae.lower.exists && ae.upper.exists ? "Alto entre niveles · piso a piso" : "Alto de referencia del bloque", "block.height", 2, 300, .1, "m") + on("Largo del bloque", "block.length", 1, 1e3, .5, "m") + on("Ley de la veta", "block.grade", 0, ae.block.gradeUnit === "%" ? 100 : 1e3, .01, ae.block.gradeUnit) + Ri("Unidad de ley", "block.gradeUnit", [["g/t", "g/t"], ["%", "%"]]) + i("lower") + i("upper"), !0) + Ft("Veta y Macizo Rocoso", Ri("Hacia d\xF3nde buza la veta", "vein.direction", [["derecha", "Derecha \xB7 vista transversal"], ["izquierda", "Izquierda \xB7 vista transversal"]]) + ["bottom", "middle", "top"].map((e, t) => Ft(["Nivel inferior", "Media altura", "Nivel superior"][t], on("Potencia " + ["inferior", "media", "superior"][t], `vein.${e}.thickness`, .1, 50, .05, "m") + on("Echado " + ["inferior", "medio", "superior"][t], `vein.${e}.dip`, 10, 90, .5, "\xB0"))).join("") + on("Ancho m\xEDnimo de minado", "vein.minMining", .1, 50, .05, "m") + '<p class="hint">Potencias y ancho m\xEDnimo normales a la veta. El visor convierte a ancho horizontal. El buzamiento es hacia abajo.</p>' + Ft("Densidades", _t("Mineral", "rock.oreDensity", { min: .1, max: 20, step: .01, unit: "t/m\xB3", optional: !0, tip: "Ejemplos de materiales: mineralizaci\xF3n cuarzosa, carbonatada o sulfurada. Captura densidad aparente medida; no se asigna la densidad de un mineral puro a toda la mena." }) + _t("Roca encajonante \xB7 alto", "rock.highDensity", { min: .1, max: 20, step: .01, unit: "t/m\xB3", optional: !0, tip: "Ejemplos: andesita, diorita, granito, caliza o m\xE1rmol. Usa la densidad aparente representativa de tu encajonante." }) + _t("Roca encajonante \xB7 bajo", "rock.lowDensity", { min: .1, max: 20, step: .01, unit: "t/m\xB3", optional: !0, tip: "Ejemplos: andesita, diorita, granito, caliza o m\xE1rmol. Alto y bajo se registran por separado." })) + Ft("Macizo rocoso", _t("RMR \xB7 Rock Mass Rating", "rock.rmr", { max: 100, step: 1, optional: !0 }) + _t("UCS \xB7 resistencia uniaxial", "rock.ucs", { min: .01, max: 1e3, step: 1, unit: "MPa", optional: !0 }) + Ri("Estructuras", "rock.structure", [["masiva", "Masiva \xB7 pocas discontinuidades"], ["moderada", "Moderadamente fracturada"], ["fracturada", "Muy fracturada / fallas"]]) + Ri("Agua en barrenos", "rock.water", [["seco", "Seco"], ["humedo", "H\xFAmedo / goteo"], ["agua", "Con agua en barrenos"]]) + '<p class="hint">RMR, estructuras y agua se documentan; no se convierten autom\xE1ticamente a Q\u2032 ni UCS.</p>') + Ft("Diluci\xF3n no planeada \xB7 ELOS supuesto", on("ELOS del alto", "elos.high", 0, 10, .01, "m") + on("ELOS del bajo", "elos.low", 0, 10, .01, "m") + '<p class="hint">Iniciales: 0.30 m alto y 0.20 m bajo. Son supuestos editables, no predicciones. La envolvente es aproximada y no descuenta las obras.</p>')) + Ft("Estructuras medidas \xB7 familias", _t("Azimut de X+ de la secci\xF3n", "block.sectionAzimuth", { max: 360, step: 1, unit: "\xB0", optional: !0, tip: "Azimut geogr\xE1fico de la derecha de la secci\xF3n. Necesario para comparar las estructuras con los respaldos." }) + ae.joints.map((e, t) => Ft("Familia " + (t + 1), fs("Nombre de familia " + (t + 1), `joints.${t}.name`) + _t("Azimut de buzamiento J" + (t + 1), `joints.${t}.azimuth`, { max: 360, step: 1, unit: "\xB0", optional: !0 }) + _t("Echado J" + (t + 1), `joints.${t}.dip`, { max: 90, step: .5, unit: "\xB0", optional: !0 }))).join("") + '<p class="hint">\u03B2 es el \xE1ngulo agudo entre planos a partir de sus normales. Captura las familias disponibles; selecciona la cr\xEDtica por cara en Estabilidad.</p>') + Ft("Estabilidad \xB7 Q\u2032 y esfuerzo", Fu("stability") + '<p class="formula">Q\u2032 = (RQD / Jn) \xB7 (Jr / Ja)</p><div id="q-output"></div><p class="hint">Jw = SRF = 1. Jn, Jr y Ja se capturan desde tu tabla de Barton. No se incluyen tablas de memoria.</p>' + _t("\u03C3 inducido \xB7 compresi\xF3n", "stability.stress", { min: .001, max: 2e3, step: .1, unit: "MPa", optional: !0 }) + _t("A le\xEDdo del gr\xE1fico", "stability.A", { min: .01, max: 1, step: .01, optional: !0 }) + fs("Referencia de A / modelo de esfuerzo", "stability.refA") + `<label class="check"><input type="checkbox" data-path="stability.useAAnchors" ${ae.stability.useAAnchors ? "checked" : ""}>Usar solo mesetas publicadas de A</label><p class="hint">Si se activa: \u03C3c/\u03C3I \u2264 2 \u2192 A = 0.1; \u2265 10 \u2192 A = 1. Entre ambos queda pendiente. \u03C3I no se estima en esta pantalla.</p><button id="show-stability">Ver caras expuestas y N\u2032</button>`) + Ft("Perforaci\xF3n \xB7 registro de anillos", Ri("Configuraci\xF3n registrada", "drilling.pattern", [["sin_capturar", "Sin capturar"], ["paralelas", "Filas paralelas"], ["abanico", "Abanico"]]) + Ri("Nivel de origen registrado", "drilling.origin", [["sin_capturar", "Sin capturar"], ["inferior", "Nivel inferior"], ["superior", "Nivel superior"]]) + `<label class="check"><input type="checkbox" data-path="drilling.docTrebolillo" ${ae.drilling.docTrebolillo ? "checked" : ""}>Trebolillo · solo registro</label><p class="hint">Marca documental; no inserta barrenos ni cambia sus posiciones.</p>` + Lu("Di\xE1metro del barreno", "drilling.diameterMm", 1, 500, .1, "mm") + '<p id="diameter-label" class="unit-support"></p>' + Lu("Longitud del barreno", "drilling.lengthM", .1, 200, .1, "m") + '<p id="length-label" class="unit-support"></p>' + _t("Bordo entre anillos", "drilling.burdenM", { min: 0, max: 1e6, unit: "m", optional: !0, tip: "Distancia entre secciones transversales (anillos) a lo largo del rumbo." }) + _t("Espaciamiento", "drilling.spacingM", { min: 0, max: 1e6, unit: "m", optional: !0, tip: "Separaci\xF3n entre barrenos de una misma secci\xF3n. En abanico: distancia entre los extremos (toe)." }) + '<p class="hint">Con configuraci\xF3n, origen, bordo y espaciamiento capturados, los barrenos se dibujan autom\xE1ticamente en 2D, planta y 3D. Largo vac\xEDo: llega al nivel opuesto. Sin valor: pendiente de captura.</p>') + Ft("Anillos \xB7 secuencia y copiado", xg()) + Ft("Notas", `<label class="field"><span>Notas del dise\xF1o</span><textarea data-path="notes" rows="4">${bt(ae.notes)}</textarea></label>`), Ou(Ve("#inputs")), Ve("#inputs").querySelectorAll("[data-ring-act]").forEach(e => e.onclick = () => _g(e.dataset.ringAct, Number(e.dataset.ring))), Ve("#show-stability").onclick = () => hc("stability");
            const originSelect = Ve('[data-path="drilling.origin"]');
            originSelect.querySelector('option[value="inferior"]').disabled = !ae.lower.exists;
            originSelect.querySelector('option[value="superior"]').disabled = !ae.upper.exists;
        }
        function xg() { let i = ae.rings.group, e = ms; return '<p class="hint">Los barrenos se dibujan solos a partir de Perforaci\xF3n (configuraci\xF3n, origen, largo, bordo y espaciamiento). Aqu\xED solo se define la secuencia: cada anillo (A, B, C) puede llevar un n\xFAmero fijo de barrenos o, vac\xEDo, el que quepa seg\xFAn el ancho de veta y el espaciamiento. Un anillo se copia igual en todos; dos o tres se intercalan (tresbolillo: A con 2 barrenos y B con 1).</p>' + i.map((t, n) => Ft("Anillo " + e[n], _t("Barrenos \xB7 vac\xEDo = autom\xE1tico", `rings.group.${n}.count`, { min: 1, max: 50, step: 1, optional: !0 }) + `<div class="ring-actions"><button data-ring-act="copy-ring" data-ring="${n}" ${i.length >= 3 ? "disabled" : ""}>Copiar como anillo siguiente</button>${i.length > 1 ? `<button data-ring-act="del-ring" data-ring="${n}">Quitar anillo ${e[n]}</button>` : ""}</div>`, n === 0)).join("") + '<p id="ring-summary" class="hint"></p>'; }
        function Du(i) { let e = []; for (let t = i; t; t = t.parentElement?.closest("details"))
            e.push(t.querySelector(":scope>summary").textContent); return e.join(">"); }
        function gg() { let i = Ve("#inspector"), e = i.scrollTop, t = new Map([...document.querySelectorAll("#inputs details")].map(n => [Du(n), n.open])); cc(), document.querySelectorAll("#inputs details").forEach(n => { let s = Du(n); t.has(s) && (n.open = t.get(s)); }), i.scrollTop = e; }
        function _g(i, e) { let t = ae.rings, n = structuredClone(t); i === "copy-ring" && t.group.length < 3 ? t.group.splice(e + 1, 0, structuredClone(t.group[e])) : i === "del-ring" && t.group.length > 1 && t.group.splice(e, 1); try {
            ai(ae);
        }
        catch (s) {
            ae.rings = n, ni(s.message);
            return;
        } xr(), gg(), i === "copy-ring" && document.querySelectorAll("#inputs details>summary").forEach(s => { s.textContent === "Anillo " + ms[e + 1] && (s.parentElement.open = !0); }), Pi(); }
        function Fu(i) { return `<div class="fields-2">${_t("RQD", i + ".rqd", { max: 100, step: 1, unit: "%", optional: !0 })}${_t("Jn \xB7 familias", i + ".jn", { min: .01, max: 100, step: .1, optional: !0 })}${_t("Jr \xB7 rugosidad", i + ".jr", { min: .01, max: 100, step: .1, optional: !0 })}${_t("Ja \xB7 alteraci\xF3n", i + ".ja", { min: .01, max: 100, step: .1, optional: !0 })}</div>`; }
        function Ou(i) { i.querySelectorAll("[data-path]").forEach(e => { e.addEventListener(e.tagName === "SELECT" || e.type === "checkbox" ? "change" : "input", () => { let t = e.dataset.path, n = ti(t), s = e.type === "range" || e.type === "number", r = e.type === "checkbox" ? e.checked : s ? e.value === "" ? null : Number(e.value) : e.value; if (s && !e.validity.valid) {
            e.setAttribute("aria-invalid", "true");
            return;
        } Pu(t, t.endsWith(".family") ? Number(r) : r); try {
            ai(ae), e.removeAttribute("aria-invalid");
        }
        catch (a) {
            Pu(t, n), e.setAttribute("aria-invalid", "true"), ni(a.message);
            return;
        } if (i.querySelectorAll("[data-path]").forEach(a => { a !== e && a.dataset.path === t && (a.value = r ?? ""); }), xr(), (t === "drilling.docTrebolillo" || t === "lower.exists" || t === "upper.exists" || yg()), t === "block.gradeUnit") {
            let a = Ve('[data-path="block.grade"]').closest(".slider-field");
            a.querySelector("small").textContent = r, a.querySelector("input[type=range]").max = r === "%" ? "100" : "1000", a.querySelector("input[type=number]").max = r === "%" ? "100" : "1000";
        } if (t === "lower.exists" || t === "upper.exists") { gg(); Pi(); } t.endsWith(".overrideQ") && uc(); }); }); }
        var oc = !1;
        function yg() { oc || (oc = !0, requestAnimationFrame(() => { oc = !1, Pi(); })); }
        function Pi() { let i = No(ae); Ve("#metrics").innerHTML = `<div><span>${ae.lower.exists && ae.upper.exists ? "PISO A PISO" : "ALTO DEL BLOQUE"}</span><strong>${Je(ae.block.height, 1)} m</strong></div><div><span>LARGO DEL BLOQUE</span><strong>${Je(ae.block.length, 1)} m</strong></div><div><span>HR \xB7 RESPALDO ALTO</span><strong>${Je(i[0].HR)} m</strong></div>`, Ve("#warnings").textContent = Rc(ae).join(" \xB7 "), Ve("#q-output").textContent = "Q\u2032 = " + Je(Uo(ae.stability), 3); let e = Ve("#ring-summary"); e && (e.textContent = Mr(ae) || "Sin barrenos completos en los anillos."); let t = Ve("#ring-ref"); if (t) {
            let n = zn(ae, "lower"), s = zn(ae, "upper");
            t.textContent = ['lower','upper'].map(side => {
                const info=ae[side], g=side==='lower'?n:s;
                return 'Obra '+(side==='lower'?'inferior':'superior')+': '+(info.exists ? 'centro X '+Je(g.centre)+', piso Z '+Je(g.floor)+', corona Z '+Je(g.floor+info.height) : 'inexistente; cotas de referencia conservadas');
            }).join(' · ');
        } Ve("#diameter-label").textContent = "= " + Ec(ae.drilling.diameterMm), Ve("#length-label").textContent = ae.drilling.lengthM === null ? "\u2014 ft" : "\u2248 " + Je(ae.drilling.lengthM / .3048) + " ft", Eo(), zu(), Ii && Ii.update(ae, At), wn === "stability" && uc(!1); }
        function hc(i) { if (wn = i, document.querySelectorAll("[data-view]").forEach(e => e.setAttribute("aria-selected", e.dataset.view === wn)), Ve("#section-view").hidden = wn !== "section", Ve("#model-view").hidden = wn !== "model", Ve("#stability-view").hidden = wn !== "stability", Ve("#layers").hidden = wn === "stability", Ve("#fit").hidden = wn === "stability", document.body.classList.remove("controls-open"), wn === "model")
            try {
                Ii || (Ii = new wo(Ve("#three"))), Ii.update(ae, At), Ii.resize();
            }
            catch (e) {
                ni("3D no disponible en este equipo; usa la secci\xF3n 2D. " + e.message), hc("section");
            } wn === "stability" && uc(); }
        function vg() { document.querySelectorAll("[data-view]").forEach(s => s.onclick = () => hc(s.dataset.view)), Ve("#fit").onclick = () => { pr = 1, mr = [0, 0], Eo(), Ii?.fit(); }, Ve("#toggle-controls").onclick = () => document.body.classList.toggle("controls-open"), Ve("#close-controls").onclick = () => document.body.classList.remove("controls-open"), Ve("#export").onclick = () => Bu("minecad-geometria.json", JSON.stringify(ae, null, 2), "application/json"), Ve("#import").onclick = () => Ve("#json-file").click(), Ve("#json-file").onchange = async (s) => { let r = s.target.files[0]; if (r)
            try {
                if (r.size > 8e6)
                    throw Error("El archivo supera 8 MB.");
                let a = ai(JSON.parse(await r.text()));
                confirm("\xBFAbrir este dise\xF1o y reemplazar el actual? Guarda JSON si necesitas conservar el actual.") && (ae = a, xr(), cc(), Pi());
            }
            catch (a) {
                ni(a.message);
            }
            finally {
                s.target.value = "";
            } }, document.querySelectorAll("[data-layer]").forEach(s => s.onchange = () => { At[s.dataset.layer] = s.checked, Pi(); }); let i = Number(localStorage.getItem(fr + "-font-v2") ?? Math.max(10, Number(localStorage.getItem(fr + "-font") ?? 12) - 1)); function e(s) { i = Math.max(10, Math.min(16, s)), document.documentElement.style.fontSize = i + "px"; try {
            localStorage.setItem(fr + "-font-v2", String(i));
        }
        catch { } } e(i), Ve("#font-down").onclick = () => e(i - 1), Ve("#font-up").onclick = () => e(i + 1); let t = Ve("#section"); t.addEventListener("wheel", s => { s.preventDefault(), pr = Math.max(.35, Math.min(8, pr * (s.deltaY < 0 ? 1.12 : .9))), Eo(); }, { passive: !1 }); let n = null; t.addEventListener("pointerdown", s => { n = [s.clientX, s.clientY, ...mr], t.setPointerCapture(s.pointerId); }), t.addEventListener("pointermove", s => { if (!n)
            return; let r = t.getBoundingClientRect(); mr = [n[2] - (s.clientX - n[0]) * t.viewBox.baseVal.width / r.width, n[3] - (s.clientY - n[1]) * t.viewBox.baseVal.height / r.height], Eo(); }), t.addEventListener("pointerup", () => n = null), t.addEventListener("pointercancel", () => n = null); }
        function Bu(i, e, t) { let n = URL.createObjectURL(new Blob([e], { type: t })), s = document.createElement("a"); s.href = n, s.download = i, s.click(), setTimeout(() => URL.revokeObjectURL(n), 3e3); }
        function Eo() { let i = Ve("#section"), e = xs(ae), t = ["lower", "upper"].map(E => zn(ae, E)), n = e.flatMap(E => [[E.elosLeft, E.z], [E.elosRight, E.z]]).concat(t.flatMap((E,F) => ae[F ? "upper" : "lower"].exists ? E.points : [])); if (At.rings)
            for (let E of __sectionHoles(ae))
                n.push([E.collar[0], E.collar[2]], [E.toe[0], E.toe[2]]); let s = Math.min(...n.map(E => E[0])), r = Math.max(...n.map(E => E[0])), a = Math.min(-1, ...n.map(E => E[1])), o = Math.max(...n.map(E => E[1])), l = Math.max(r - s, o - a, 5), c = l * .12, h = s - (At.annotations ? l * .35 : c), u = r + (At.annotations ? l * .7 : c), d = a - c, p = o + c, x = (u - h) / pr, _ = (p - d) / pr, m = (h + u) / 2 + mr[0], f = -(d + p) / 2 + mr[1]; i.setAttribute("viewBox", `${m - x / 2} ${f - _ / 2} ${x} ${_}`); let C = i.getBoundingClientRect(), b = 9 * Math.max(x / Math.max(C.width, 300), _ / Math.max(C.height, 160)), M = E => E.map(([F, B]) => `${F},${-B}`).join(" "), I = (E, F) => M([...e.map(B => [B[E], B.z]), ...e.slice().reverse().map(B => [B[F], B.z])]), T = l > 100 ? 10 : l > 30 ? 5 : 1, P = ""; for (let E = Math.floor(h / T) * T; E <= u; E += T)
            P += `<line x1="${E}" y1="${-p}" x2="${E}" y2="${-d}"/>`; for (let E = Math.floor(d / T) * T; E <= p; E += T)
            P += `<line x1="${h}" y1="${-E}" x2="${u}" y2="${-E}"/>`; let O = (E, F, B, q, H = "start") => `<text x="${E}" y="${-F}" fill="${q}" font-size="${b}" text-anchor="${H}" paint-order="stroke" stroke="#0c1a29" stroke-width="${b * .18}">${B.map((V, K) => `<tspan x="${E}" dy="${K ? b * 1.35 : 0}">${bt(V)}</tspan>`).join("")}</text>`, w = ""; if (At.annotations) {
            let E = r + l * .09;
            for (let [H, V] of [0, ae.block.height / 2, ae.block.height].entries()) {
                let K = Bn(ae, V);
                w += `<line x1="${K.right}" y1="${-V}" x2="${E - b * .6}" y2="${-V}" stroke="#cde37b" stroke-dasharray="3 4"/>` + O(E, V + b * .7, [[ae.lower.exists ? "NIVEL INFERIOR" : "REFERENCIA INFERIOR", "MEDIA ALTURA", ae.upper.exists ? "NIVEL SUPERIOR" : "REFERENCIA SUPERIOR"][H], `Pot. ${Je(K.thickness)} m \xB7 ${Je(K.dip, 1)}\xB0`], "#c9e879");
            }
            for (let [H, V] of t.entries()) {
                let K = ae[H ? "upper" : "lower"]; if (!K.exists) continue; let W = V.floor + K.height * .65;
                w += `<line x1="${V.centre + K.width / 2}" y1="${-W}" x2="${E - b * .6}" y2="${-W}" stroke="${H ? "#64d5ba" : "#59aff3"}"/>` + O(E, W + b * .6, [H ? "OBRA SUPERIOR" : "OBRA INFERIOR", `${Je(K.width, 1)} \xD7 ${Je(K.height, 1)} m \xB7 \u0394X ${Je(K.offset, 1)} m`], H ? "#64d5ba" : "#65baff");
            }
            let F = s - l * .13;
            w += `<g stroke="#9eb6ca"><line x1="${F}" y1="0" x2="${F}" y2="${-ae.block.height}"/><line x1="${F - b * .5}" y1="0" x2="${F + b * .5}" y2="0"/><line x1="${F - b * .5}" y1="${-ae.block.height}" x2="${F + b * .5}" y2="${-ae.block.height}"/></g><text x="${F - b * .7}" y="${-ae.block.height / 2}" transform="rotate(-90 ${F - b * .7} ${-ae.block.height / 2})" fill="#aecade" font-size="${b}" text-anchor="middle">${Je(ae.block.height, 1)} m · ${ae.lower.exists && ae.upper.exists ? "piso a piso" : "alto de referencia"}</text>`;
            let B = Bn(ae, ae.block.height * .32), q = ae.vein.direction === "derecha";
            if (w += O(B.centre + (q ? 1 : -1) * l * .15, ae.block.height * .32, ["ALTO"], "#d6ab77", q ? "start" : "end") + O(B.centre + (q ? -1 : 1) * l * .15, ae.block.height * .32, ["BAJO"], "#d6ab77", q ? "end" : "start"), ae.drilling.origin !== "sin_capturar" && ae[ae.drilling.origin === "superior" ? "upper" : "lower"].exists) {
                let H = ae.drilling.origin === "superior" ? 1 : 0, V = t[H], originZ = V.floor + (H === 0 ? ae.lower.height : 0);
                w += `<circle cx="${V.centre}" cy="${-originZ}" r="${b * .45}" fill="#f09bcb"/>` + O(V.centre - b, originZ - b * 1.4, ["ORIGEN REGISTRADO"], "#f09bcb", "end");
            }
        } i.innerHTML = `<g stroke="#20364a" stroke-width=".6">${P}</g>${At.elos ? `<polygon points="${I("elosLeft", "elosRight")}" fill="#d76d722b" stroke="#e27f83" stroke-dasharray="5 4"><title>ELOS supuesto \xB7 no predicci\xF3n de rotura</title></polygon>` : ""}${At.mining ? `<polygon points="${I("mineLeft", "mineRight")}" fill="#5cc2fa0c" stroke="#5cc2fa" stroke-dasharray="5 3"/>` : ""}${At.vein ? `<polygon data-visual-vein points="${I("left", "right")}" fill="#e5b66b65" stroke="#e5b66b"/>` : ""}<polyline points="${M(e.map(E => [E.centre, E.z]))}" stroke="#f3ce9377" fill="none" stroke-dasharray="3 4"/>${At.works ? t.map((E, F) => !ae[F ? "upper" : "lower"].exists ? "" : `<polygon data-work-side="${F ? "upper" : "lower"}" points="${M(E.points)}" fill="${F ? "#65d6b955" : "#59aff355"}" stroke="${F ? "#65d6b9" : "#59aff3"}"/>`).join("") : ""}${At.rings ? __sectionHoles(ae).map(E => `<line data-visual-hole data-hole-id="${bt(E.id)}" x1="${E.collar[0]}" y1="${-E.collar[2]}" x2="${E.toe[0]}" y2="${-E.toe[2]}" stroke="${ri[E.template]}" stroke-width="1.8"><title>${bt(E.id)} \xB7 plantilla de anillo \xB7 proyecci\xF3n X/Z</title></line><circle cx="${E.collar[0]}" cy="${-E.collar[2]}" r="${b * .3}" fill="${ri[E.template]}"/>`).join("") : ""}${t.map((E, F) => ae[F ? "upper" : "lower"].exists ? `<polygon data-drift="${F ? "upper" : "lower"}" points="${M(E.points)}" fill="none" stroke="none" pointer-events="none"/>` : "").join("")}${w}`, i.querySelectorAll("polygon,polyline,line,circle").forEach(E => { E.setAttribute("vector-effect", "non-scaling-stroke"), E.hasAttribute("stroke-width") || E.setAttribute("stroke-width", "1.2"); }); let v = Ve("#section-meta"); v || (v = document.createElement("div"), v.id = "section-meta", v.className = "section-meta", Ve(".cross-section").append(v)), v.textContent = Tc(ae) + " \xB7 rumbo " + Je(ae.block.length, 1) + " m" + (Mr(ae) ? " \xB7 " + Mr(ae) : ""); }
        function uc(i = !0) { let e = Ve("#stability-view"), t = No(ae); if (!i && e.querySelector("[data-face-values]")) {
            for (let r of t)
                e.querySelector("[data-face-values=" + r.id + "]").innerHTML = Uu(r, ae.stability.faces[r.id]);
            let s = e.querySelector("[data-elos-note]");
            s && (s.textContent = "ELOS supuesto: alto " + Je(ae.elos.high) + " m y bajo " + Je(ae.elos.low) + " m. Sin predicci\xF3n desde N\u2032/HR ni dictamen de estabilidad.");
            return;
        } let n = [...e.querySelectorAll(".face-card details")].map(s => s.open); e.innerHTML = `<div class="result-intro"><h1>Estabilidad \xB7 caras expuestas</h1><p>N\u2032 = Q\u2032 \xB7 A \xB7 B \xB7 C \xB7 Radio hidr\xE1ulico = \xE1rea / per\xEDmetro</p><p>Se calcula lo respaldado por ecuaciones o anclas documentadas. No se interpreta el gr\xE1fico de estabilidad ni se predice ELOS.</p></div><div class="face-grid">${t.map(s => { let r = "stability.faces." + s.id, a = ae.stability.faces[s.id]; return `<article class="face-card"><h2>${s.label}</h2><p>${Je(s.size)} m ${s.id === "crown" ? "de claro horizontal" : "sobre el perfil"} \xD7 ${Je(s.length)} m de rumbo</p><div data-face-values="${s.id}">${Uu(s, a)}</div><details><summary>Datos y factores de esta cara</summary><div class="face-inputs">${Ri("Familia cr\xEDtica", r + ".family", ae.joints.map((o, l) => [String(l), bt(o.name)]))}${_t("A de esta cara", r + ".A", { min: .001, max: 1, step: .01, optional: !0 })}${_t("B le\xEDdo de gr\xE1fico", r + ".B", { min: .001, max: 1, step: .01, optional: !0 })}${_t("C directo \xB7 opcional", r + ".C", { min: .001, max: 10, step: .01, optional: !0 })}${_t("\u03C3 inducido de esta cara", r + ".stress", { min: .001, max: 2e3, step: .1, unit: "MPa", optional: !0 })}${_t("UCS de esta cara", r + ".ucs", { min: .001, max: 2e3, step: 1, unit: "MPa", optional: !0 })}<label class="check"><input type="checkbox" data-path="${r}.overrideQ" ${a.overrideQ ? "checked" : ""}>Q\u2032 espec\xEDfico por cara</label>${a.overrideQ ? Fu(r) : '<p class="hint">Se usa el Q\u2032 com\xFAn. Activa la opci\xF3n para materiales o juntas distintos.</p>'}${fs("Referencia de factores / gr\xE1fico", r + ".ref")}</div></details></article>`; }).join("")}</div><section class="method-card"><h2>Alcance y trazabilidad</h2><p>Las caras alta y baja no se fuerzan a tener el mismo N\u2032: solo coinciden cuando geometr\xEDa y factores coinciden. Q\u2032 puede depender de la familia cr\xEDtica y del material. Los niveles se toman piso a piso; estas superficies de referencia no descuentan vac\xEDos de galer\xEDas.</p><p>Las anclas de B implementadas son \u03B2 = 0\xB0 \u2192 0.3; 10\xB0 a 30\xB0 \u2192 0.2; \u03B2 = 90\xB0 \u2192 1.0. Fuera de esos casos se solicita B directo, sin interpolaci\xF3n. A directo tiene prioridad sobre las mesetas. C es solo el componente por inclinaci\xF3n seleccionado; no eval\xFAa deslizamiento sobre juntas ni sostenimiento.</p><p data-elos-note>ELOS actual supuesto: alto ${Je(ae.elos.high)} m y bajo ${Je(ae.elos.low)} m. No se convierte N\u2032/HR a ELOS, ni se emite un dictamen estable/inestable. El gr\xE1fico de Clark y Pakalnis queda pendiente de una fuente y calibraci\xF3n aprobadas.</p><ul><li>Q\u2032: ${Ao("q")}</li><li>N\u2032 y anclas B: ${Ao("n")}</li><li>Mesetas A: ${Ao("a")}</li><li>C seleccionado: ${Ao("c")}</li></ul><p class="hint">El consolidado de 2021 mencionado no se identific\xF3 con certeza. Esta versi\xF3n muestra las fuentes efectivamente consultadas.</p></section>`, e.querySelectorAll(".face-card details").forEach((s, r) => s.open = n[r] ?? !1), Ou(e); }
        window.addEventListener("beforeunload", i => { lc || (i.preventDefault(), i.returnValue = ""); });
        mg();
        function Uu(i, e) { return `<dl><dt>Radio hidr\xE1ulico</dt><dd>${Je(i.HR)} m</dd><dt>Buzamiento equivalente</dt><dd>${Je(i.dip, 1)}\xB0</dd><dt>Q\u2032</dt><dd>${Je(i.Q, 3)}</dd><dt>\u03C3c / \u03C3I</dt><dd>${Je(i.ratio, 3)}</dd><dt>A \xB7 ${i.Aorigin}</dt><dd>${Je(i.A, 3)}</dd><dt>\u03B2 \xB7 ${bt(i.joint)}</dt><dd>${Je(i.beta, 1)}${i.beta === null ? "" : "\xB0"}</dd><dt>B \xB7 ${i.Borigin}</dt><dd>${Je(i.B, 3)}</dd><dt>C ${e.C === null ? "= 8 \u2212 7\xB7cos(buz)" : "capturado"}</dt><dd>${Je(i.C, 3)}</dd><dt class="total">N\u2032</dt><dd class="total">${Je(i.N, 3)}</dd></dl>${i.approximate ? '<p class="notice">Perfil variable: HR sobre superficie extruida y buzamiento equivalente entre extremos. La representaci\xF3n por una sola cara es una aproximaci\xF3n.</p>' : ""}${i.N === null ? `<p class="notice">Falta: ${[i.Q === null ? "Q\u2032" : null, i.A === null ? "A" : null, i.B === null ? "B (sin ancla o captura)" : null].filter(Boolean).join(" \xB7 ")}.</p>` : ""}`; }
        function zu() {
            const svg = Ve('#plan'), count = Ve('#plan-count'), heading = document.querySelector('.plan-title strong'), origin = ae.drilling.origin;
            if (origin !== 'inferior' && origin !== 'superior') {
                heading.textContent = 'PLANTA · ORIGEN PENDIENTE';
                svg.setAttribute('viewBox', '0 0 500 45');
                svg.innerHTML = '<text x="250" y="25" text-anchor="middle" fill="#a6bfd0" font-size="10">Selecciona el nivel de origen en el registro de anillos</text>';
                count.textContent = '';
                __renderSectionButtons();
                return;
            }
            const side = origin === 'superior' ? 'upper' : 'lower', work = ae[side], outline = zn(ae, side);
            if (!work.exists) {
                heading.textContent = 'PLANTA · NIVEL INEXISTENTE';
                svg.setAttribute('viewBox','0 0 500 45');
                svg.innerHTML = '<text x="250" y="25" text-anchor="middle" fill="#a6bfd0" font-size="10">El nivel de origen no existe. Revisa el origen registrado.</text>';
                count.textContent = ''; __renderSectionButtons(); return;
            }
            const all = At.rings ? br(ae) : [];
            const xs = [outline.centre - work.width / 2, outline.centre + work.width / 2, ...all.map(h => h.collar[0])], ys = [0, ae.block.length, ...all.map(h => h.collar[1])], xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys), span = Math.max(ymax - ymin, 1), padding = span * .055, width = span + padding * 2, height = Math.max((xmax - xmin) / .74, width * .075), centre = (xmin + xmax) / 2;
            svg.setAttribute('viewBox', [ymin - padding, -centre - height / 2, width, height].join(' '));
            svg.setAttribute('aria-label', 'Planta de collares: Y rumbo, X transversal, metros');
            const scale = Math.max(width / Math.max(svg.clientWidth, 300), height / Math.max(svg.clientHeight, 20)), radius = 3.4 * scale;
            heading.textContent = 'PLANTA · NIVEL ' + (origin === 'superior' ? 'SUPERIOR' : 'INFERIOR');
            const rectangle = At.works ? '<rect x="0" y="' + (-(outline.centre + work.width / 2)) + '" width="' + ae.block.length + '" height="' + work.width + '" fill="#48759155" stroke="#729bb6" vector-effect="non-scaling-stroke" stroke-width="1"/>' : '';
            const marker = h => '<circle cx="' + h.collar[1] + '" cy="' + (-h.collar[0]) + '" r="' + radius + '" fill="' + (__minecadSection !== null && __sectionActive(h) ? '#ffda63' : ri[h.template]) + '" opacity="' + (__minecadSection === null || __sectionActive(h) ? 1 : .42) + '" vector-effect="non-scaling-stroke"><title>' + bt(h.id) + ' · X ' + Je(h.collar[0]) + ' · Y ' + Je(h.collar[1]) + ' · Z ' + Je(h.collar[2]) + ' m</title></circle>';
            svg.innerHTML = rectangle + all.map(marker).join('') + (all.length ? '' : '<text x="' + ((ymin + ymax) / 2) + '" y="' + (-centre) + '" text-anchor="middle" fill="#c8d9e5" font-size="' + (8 * scale) + '">Sin collares visibles en el nivel de origen</text>');
            count.textContent = all.length + ' puntos · X/Y';
            __renderSectionButtons();
        }
        function bg() { let i = Ve("#help-popover"), e = null, t = null; function n() { i.hidden = !0, t = null; } function s(r) { clearTimeout(e); let a = yc[r.dataset.help]; if (!a)
            return; t = r, i.innerHTML = "<strong>" + bt(a.title) + "</strong><p>" + bt(a.body) + "</p>" + (a.table ? "<table>" + a.table.map(([c, h, u]) => "<tr><td>" + (u ? '<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + bt(c) + "</a>" : bt(c)) + "</td><td>" + bt(h) + "</td></tr>").join("") + "</table>" : "") + '<p class="reference">' + bt(a.reference) + "</p>" + (a.url ? '<a href="' + a.url + '" target="_blank" rel="noopener noreferrer">' + bt(a.source) + "</a>" : "") + (a.extraUrl ? '<br><a href="' + a.extraUrl + '" target="_blank" rel="noopener noreferrer">' + bt(a.extraSource) + "</a>" : ""), i.hidden = !1; let o = r.getBoundingClientRect(), l = Math.min(350, innerWidth - 16); i.style.width = l + "px", i.style.left = Math.max(8, Math.min(o.right + 10, innerWidth - l - 8)) + "px", i.style.top = Math.max(8, Math.min(o.top, innerHeight - i.offsetHeight - 8)) + "px"; } document.addEventListener("pointerover", r => { let a = r.target.closest?.("[data-help]"); a && s(a); }), document.addEventListener("pointerout", r => { r.target.closest?.("[data-help]") && (e = setTimeout(n, 180)); }), document.addEventListener("focusin", r => { let a = r.target.closest?.("[data-help]"); a && s(a); }), document.addEventListener("click", r => { let a = r.target.closest?.("[data-help]"); a ? (r.preventDefault(), s(a)) : i.contains(r.target) || n(); }), document.addEventListener("keydown", r => { r.key === "Escape" && n(); }), document.addEventListener("focusout", r => { r.target.closest?.("[data-help]") && (e = setTimeout(n, 180)); }), i.onpointerenter = () => clearTimeout(e), i.onpointerleave = () => e = setTimeout(n, 180), Ve("#inspector").addEventListener("scroll", n), window.addEventListener("resize", () => { n(), zu(); }); }
        function __sectionActive(h) {
            if (__minecadSection === null) return true;
            const match = /^R(\d+)-/.exec(String(h.id)), index = match ? Number(match[1])-1 : -1;
            return index >= __minecadSection && index < __minecadSection + __minecadCount;
        }
        function __sectionHoles(project) { return __minecadSection === null ? vr(project) : br(project).filter(__sectionActive); }
        var __selectionKey = '';
        function __renderSectionButtons() {
            queueMicrotask(() => { const key = __minecadSection + '|' + __minecadCount; if (key === __selectionKey) return; __selectionKey = key; document.dispatchEvent(new CustomEvent('minecad:seleccion')); });
            const root = Ve('#section-selector');
            if (!root)
                return;
            root.hidden = wn === 'stability';
            const sections = Do(ae);
            if (__minecadSection !== null && __minecadSection >= sections.length)
                __minecadSection = Math.max(0, sections.length - 1);
            __minecadCount = Math.max(1, Math.min(__minecadCount, sections.length || 1));
            if (__minecadSection !== null) __minecadSection = Math.min(__minecadSection, Math.max(0, sections.length-__minecadCount));
            root.innerHTML = '<span>Sección</span><div class="section-options"><button type="button" data-section="all" aria-pressed="' + (__minecadSection === null) + '">Todas</button>' + sections.map(s => '<button type="button" data-section="' + s.index + '" aria-label="Ver sección ' + (s.index + 1) + '" aria-pressed="' + (__minecadSection === s.index) + '">' + (s.index + 1) + '</button>').join('') + '</div><span class="section-display-note">' + (sections.length ? (__minecadSection === null ? 'Vista general' : (__minecadSection + 1) + ' / ' + sections.length) : 'Sin secciones disponibles') + '</span>';
            const counter = document.createElement('label');
            counter.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:11px';
            counter.innerHTML = 'Líneas visibles <input type="number" min="1" max="' + Math.max(1,sections.length) + '" value="' + (__minecadSection === null ? Math.max(1,sections.length) : __minecadCount) + '" aria-label="Cantidad de líneas visibles" style="width:58px;padding:3px"' + (sections.length ? '' : ' disabled') + '>';
            root.append(counter);
            counter.querySelector('input').onchange = event => {
                const value = Number(event.target.value);
                __minecadCount = Math.max(1,Math.min(sections.length || 1,Math.round(Number.isFinite(value) ? value : 1)));
                __minecadSection = Math.min(__minecadSection ?? 0,Math.max(0,sections.length-__minecadCount));
                Eo(); zu(); if(Ii) Ii.update(ae,At);
            };
            const start = __minecadSection ?? 0, count = __minecadSection === null ? sections.length : __minecadCount;
            root.querySelector('.section-display-note').textContent = sections.length ? 'Mostrando ' + count + ' · desde ' + (start+1) + ' hasta ' + Math.min(sections.length,start+count) : 'Sin secciones disponibles';
            root.querySelectorAll('[data-section]').forEach(button => {
                if(button.dataset.section !== 'all') button.setAttribute('aria-pressed',String(Number(button.dataset.section)>=start && Number(button.dataset.section)<start+count));
            });
            root.querySelectorAll('[data-section]').forEach(button => button.onclick = () => { if(__minecadSection === null && button.dataset.section !== 'all') __minecadCount = 1; __minecadSection = button.dataset.section === 'all' ? null : Number(button.dataset.section); __minecadSection === null || (__minecadSection = Math.min(__minecadSection,Math.max(0,sections.length-__minecadCount))); Eo(); zu(); if (Ii)
                Ii.update(ae, At); });
            let label = Ve('#section-3d-title');
            if (!label) {
                label = document.createElement('div');
                label.id = 'section-3d-title';
                Ve('#model-view').append(label);
            }
            label.textContent = sections.length ? 'VISTA · ' + count + ' LÍNEAS · ' + (start+1) + '–' + Math.min(sections.length,start+count) : 'SIN SECCIONES DISPONIBLES';
        }
        document.addEventListener('click', event => { if (event.target.closest('[data-view]'))
            __renderSectionButtons(); });
        {
            /* ===== Módulos Explosivo y carga · Tiempos y secuencia (captura documental) ===== */
            const CAT = [['sin_capturar', 'Pendiente de captura'], ['anfo', 'ANFO'], ['emulsion_granel', 'Emulsión a granel'], ['emulsion_cartucho', 'Emulsión encartuchada'], ['hidrogel', 'Hidrogel / slurry'], ['mezcla', 'Mezcla emulsión / ANFO'], ['otro', 'Otro (catálogo propio)']], TOE = [CAT[0], ['ninguno', 'Sin carga de fondo'], ...CAT.slice(1)], SYS = [['sin_capturar', 'Pendiente de captura'], ['electronico', 'Electrónico'], ['no_electrico', 'No eléctrico (tubo de choque)'], ['electrico', 'Eléctrico'], ['cordon', 'Cordón detonante']], lab = (o, v) => (o.find(x => x[0] === v) || [0, '—'])[1];
            const mkC = () => ({ column: 'sin_capturar', density: null, coupling: null, toe: 'sin_capturar', wedgeShare: !0, wedge: 'sin_capturar', wedgeLoads: null, influenceM: null }), mkT = () => ({ system: 'sin_capturar', ringMs: null, holeMs: null });
            function ens(p) { if (p && typeof p === 'object') {
                p.charge ??= mkC();
                p.timing ??= mkT();
                if (p.charge.influenceM === undefined) p.charge.influenceM = null;
            } return p; }
            function vmods(p) {
                const c = p.charge, t = p.timing;
                He(c && t, 'Faltan datos de explosivo o tiempos.');
                for (const k of ['column', 'toe', 'wedge'])
                    He(typeof c[k] === 'string' && c[k].length < 60, 'Selección de explosivo inválida.');
                He(c.density === null || yt(c.density, .3, 2.5), 'Densidad fuera de rango (0.3–2.5 g/cc).');
                He(c.coupling === null || yt(c.coupling, 0, 100), 'Acoplamiento fuera de rango (0–100 %).');
                He(c.wedgeLoads === null || (Number.isInteger(c.wedgeLoads) && yt(c.wedgeLoads, 1, 20)), 'Cargas por barreno de la cuña: entero de 1 a 20.');
                He(typeof c.wedgeShare === 'boolean', 'Marca de cuña inválida.');
                He(c.influenceM === null || yt(c.influenceM, .05, 30), 'Radio de influencia fuera de rango (0.05–30 m).');
                He(typeof t.system === 'string' && t.system.length < 60, 'Sistema de iniciación inválido.');
                He(t.ringMs === null || yt(t.ringMs, 0, 5e3), 'Retardo entre anillos fuera de rango (0–5000 ms).');
                He(t.holeMs === null || yt(t.holeMs, 0, 1e3), 'Retardo entre taladros fuera de rango (0–1000 ms).');
            }
            {
                const _ai = ai;
                ai = function (i) { if (i && i.schema === 'minecad-geometria/1')
                    ens(i); const r = _ai.apply(this, arguments); vmods(r); return r; };
                const _Lo = Lo;
                Lo = function () { return ens(_Lo.apply(this, arguments)); };
                const _cc = cc;
                cc = function () { _cc.apply(this, arguments); mountMods(); };
                const _Pi = Pi;
                Pi = function () { _Pi.apply(this, arguments); refreshMods(); };
            }
            const H = (k, t, b) => yc[k] = { title: t, body: b, reference: 'Dato de captura del diseño; no es una recomendación de uso ni un cálculo.' };
            H('mcol', 'Agente de columna', 'Producto registrado para la columna de los barrenos. Todos los artículos reciben el mismo tratamiento.');
            H('mden', 'Densidad', 'Densidad registrada del agente, en g/cc. Vacío = pendiente de captura.');
            H('macop', 'Acoplamiento', 'Acoplamiento registrado, en %. No se usa para calcular cargas.');
            H('mtoe', 'Carga en el toe', 'Selección independiente para el fondo del barreno; puede indicarse que no lleva carga de fondo.');
            H('mcun', 'Explosivo de la cuña', 'Selección independiente para la cuña, o la misma de los anillos si se activa la casilla.');
            H('mncar', 'Cargas por barreno de la cuña', 'Número de cargas registradas por barreno de la cuña.');
            H('mrad', 'Radio de influencia', 'Radio, en metros, de la zona cilíndrica roja que se dibuja alrededor de cada barreno en la vista Daño. Lo define el usuario.');
            H('msis', 'Sistema de iniciación', 'Sistema registrado para el diseño. Solo documental.');
            H('mret', 'Retardo entre anillos', 'Tiempo nominal capturado entre anillos consecutivos, en ms.');
            H('mtal', 'Retardo entre taladros', 'Tiempo nominal capturado entre taladros de un mismo anillo, en ms.');
            const sl = (l, p, mn, mx, st, u, h) => `<div class="slider-field"><label for="n-${p}">${Nu(l, h)} <small>${u}</small></label><input id="n-${p}" type="number" data-path="${p}" value="${ti(p) ?? ''}" min="${mn}" max="${mx}" step="any" aria-label="${l}"><input type="range" data-path="${p}" value="${ti(p) ?? mn}" min="${mn}" max="${mx}" step="${st}" aria-label="Ajustar ${l}"></div>`, se = (l, p, o, h, d) => `<label class="field"><span>${Nu(l, h)}</span><select data-path="${p}" aria-label="${l}"${d ? ' disabled' : ''}>${o.map(([v, t]) => `<option value="${v}"${ti(p) === v ? ' selected' : ''}>${t}</option>`).join('')}</select></label>`, hint = t => `<p class="hint">${t}</p>`;
            function modsHtml() {
                const c = ae.charge;
                return Ft('Explosivo y carga', se('Agente de columna', 'charge.column', CAT, 'mcol') + sl('Densidad', 'charge.density', .3, 2.5, .01, 'g/cc', 'mden') + sl('Acoplamiento', 'charge.coupling', 0, 100, 1, '%', 'macop') + se('Carga en el toe', 'charge.toe', TOE, 'mtoe') + `<label class="field mod-chk"><input type="checkbox" data-path="charge.wedgeShare"${c.wedgeShare ? ' checked' : ''}><span>Cuña con el mismo explosivo de los anillos</span></label>` + se('Explosivo de la cuña', 'charge.wedge', CAT, 'mcun', c.wedgeShare) + sl('Cargas por barreno de la cuña', 'charge.wedgeLoads', 1, 20, 1, '', 'mncar') + sl('Radio de influencia', 'charge.influenceM', .05, 30, .05, 'm', 'mrad') + hint('Datos de captura del diseño. No se calcula carga, energía ni fragmentación. El radio de influencia solo define el dibujo de la vista Daño.'))
                    + Ft('Tiempos y secuencia', se('Sistema de iniciación', 'timing.system', SYS, 'msis') + sl('Retardo entre anillos', 'timing.ringMs', 0, 5e3, 1, 'ms', 'mret') + sl('Retardo entre taladros', 'timing.holeMs', 0, 1e3, 1, 'ms', 'mtal') + hint('Tiempos nominales capturados; no validan una secuencia de iniciación.') + '<div id="mod-seq"></div>');
            }
            function mountMods() {
                const box = Ve('#inputs');
                if (!box)
                    return;
                ens(ae);
                const t = document.createElement('div');
                t.innerHTML = modsHtml();
                Ou(t);
                const nt = [...box.children].find(d => d.tagName === 'DETAILS' && d.querySelector(':scope>summary').textContent === 'Notas');
                [...t.children].forEach(d => nt ? box.insertBefore(d, nt) : box.append(d));
                refreshMods();
            }
            function refreshMods() {
                const c = ae.charge, t = ae.timing;
                if (!c || !t)
                    return;
                const S = (n, x) => { const s = [...document.querySelectorAll('#inputs>details>summary')].find(y => y.textContent === n); if (s)
                    s.dataset.resumen = x; };
                S('Explosivo y carga', c.column === 'sin_capturar' && c.density === null ? 'pendiente' : [lab(CAT, c.column), c.density === null ? '' : Je(c.density) + ' g/cc'].filter(Boolean).join(' · '));
                S('Tiempos y secuencia', t.system === 'sin_capturar' && t.ringMs === null && t.holeMs === null ? 'pendiente' : [lab(SYS, t.system), t.ringMs === null ? '' : Je(t.ringMs, 0) + ' ms/anillo'].filter(Boolean).join(' · '));
                const w = Ve('select[data-path="charge.wedge"]');
                if (w)
                    w.disabled = c.wedgeShare;
                const q = Ve('#mod-seq');
                if (!q)
                    return;
                const secs = Do(ae), g = ae.rings.group;
                let tot = 0;
                const rows = secs.map(s => {
                    const n = yr(ae, g[s.template]).length;
                    tot += n;
                    const a = t.ringMs === null ? null : s.index * t.ringMs, d = t.holeMs === null || n < 1 ? null : (n - 1) * t.holeMs;
                    return `<tr data-seq="${s.index}"${__minecadSection === s.index ? ' class="on"' : ''}><td>${s.index + 1}</td><td>${ms[s.template]}</td><td>${n}</td><td>${a === null ? 'sin dato' : Je(a, 0)}</td><td>${d === null ? 'sin dato' : Je(d, 0)}</td></tr>`;
                }).join('');
                q.innerHTML = secs.length ? `<div class="seq-wrap"><table class="seq"><thead><tr><th>Anillo</th><th>Grupo</th><th>Barrenos</th><th>Inicio ms</th><th>Cadena ms</th></tr></thead><tbody>${rows}</tbody></table></div>` + hint(secs.length + ' anillos · ' + tot + ' barrenos · valores nominales de captura (ilustrativos). Clic en una fila: ver esa sección en 2D y 3D.') : hint('Sin anillos: captura bordo y perforación para ver la tabla.');
            }
            document.addEventListener('click', e => {
                const r = e.target.closest?.('tr[data-seq]');
                if (r) {
                    __minecadSection = Number(r.dataset.seq);
                    Eo();
                    zu();
                    Ii && Ii.update(ae, At);
                    __renderSectionButtons();
                    refreshMods();
                }
                else if (e.target.closest?.('[data-section]'))
                    refreshMods();
            });
            {
                const st = document.createElement('style');
                st.textContent = 'summary[data-resumen]::after{content:" · " attr(data-resumen);font-weight:400;font-size:.86em;color:#9bb4c8}.mod-chk{flex-direction:row;align-items:center;gap:6px}.seq-wrap{max-height:170px;overflow:auto;border:1px solid #294158;border-radius:4px;margin:6px 0}.seq{width:100%;border-collapse:collapse;font-size:.9rem}.seq th,.seq td{padding:3px 5px;text-align:right;border-bottom:1px solid #1d3347;white-space:nowrap}.seq th{position:sticky;top:0;background:#19334a;color:#a2bed2}.seq tbody tr{cursor:pointer}.seq tbody tr:hover{background:#1b3348}.seq tr.on{background:#3b3a1c;color:#ffda63}';
                document.head.append(st);
            }
            /* ===== Adaptador de datos para el visor (solo lectura de lo capturado) =====
               Entrega al visor lo que el usuario ya ingresó en «Explosivo y carga» y «Tiempos y secuencia».
               No calcula cargas, retardos ni secuencias; reutiliza los valores nominales que muestra la tabla de anillos. */
            {
                const SRC = 'Ingresado por el usuario (sin cálculo ni validación)';
                const CARGA_COLOR = { anfo: 0xe8a33d, emulsion_granel: 0x4cc9f0, emulsion_cartucho: 0x4895ef, hidrogel: 0x7bd88f, mezcla: 0xc792ff, otro: 0xb0b8c0 };
                const nodata = (message) => ({ state: 'sin_datos', source: SRC, message });
                // Secuencia nominal de los anillos visibles, con el tiempo cero en el primero de ellos.
            // Barreno = (anillo - primer anillo visible) × retardo entre anillos + (n.º de barreno - 1) × retardo entre taladros.
            let seqKey = '', seqValue = null;
            function buildSequence() {
                const t = ae.timing, all = Do(ae);
                const visible = __minecadSection === null ? all : all.filter(s => s.index >= __minecadSection && s.index < __minecadSection + __minecadCount);
                if (!t || !visible.length) return { available: false, message: 'sin anillos: captura bordo y perforación' };
                if (t.ringMs === null && (visible.length > 1 || t.holeMs === null)) return { available: false, message: 'captura el retardo entre anillos en «Tiempos y secuencia»' };
                const ring = t.ringMs ?? 0, hole = t.holeMs ?? 0, first = visible[0].index, counts = ae.rings.group.map(g => yr(ae, g).length);
                const times = new Map(), add = (key, value) => { times.has(key) || times.set(key, []); times.get(key).push(value); };
                let totalMs = 0, holeCount = 0;
                for (const s of visible)
                    for (let m = 0; m < counts[s.template]; m++) {
                        const value = (s.index - first) * ring + m * hole;
                        add('R' + (s.index + 1) + '-' + (m + 1), value); // 3D y secciones elegidas
                        add(ms[s.template] + '\u00b7' + (m + 1), value); // proyección 2D «Todas»
                        totalMs = Math.max(totalMs, value); holeCount++;
                    }
                if (!holeCount) return { available: false, message: 'sin barrenos en los anillos visibles' };
                // Duración del diseño completo: solo fija la velocidad automática, igual para cualquier selección.
                const fullMs = t.ringMs === null ? totalMs : Math.max(...all.map(s => s.index * ring + Math.max(0, counts[s.template] - 1) * hole));
                return { available: true, times, totalMs, fullMs, holeCount, holeMissing: t.holeMs === null, rings: visible.map(s => ({ index: s.index, startMs: (s.index - first) * ring })) };
            }
            function sequence() {
                try {
                    const key = JSON.stringify([ae.block, ae.lower, ae.upper, ae.vein, ae.drilling, ae.rings, ae.timing, __minecadSection, __minecadCount]);
                    if (key !== seqKey) { seqValue = buildSequence(); seqKey = key; }
                    return seqValue;
                }
                catch (error) { return { available: false, message: error.message }; }
            }
            function layerData(mode) {
                    try {
                        const c = ae.charge, t = ae.timing;
                        if (mode === 'carga') {
                            if (!c || c.column === 'sin_capturar') return nodata('Carga · sin agente de columna capturado en «Explosivo y carga».');
                            const legend = [['Columna', lab(CAT, c.column)]];
                            if (c.density !== null) legend.push(['Densidad', Je(c.density) + ' g/cc']);
                            if (c.coupling !== null) legend.push(['Acoplamiento', Je(c.coupling, 0) + ' %']);
                            legend.push(['Toe', c.toe === 'sin_capturar' ? 'sin datos' : lab(TOE, c.toe)]);
                            legend.push(['Cuña', c.wedgeShare ? 'igual que los anillos' : (c.wedge === 'sin_capturar' ? 'sin datos' : lab(CAT, c.wedge))]);
                            if (c.wedgeLoads !== null) legend.push(['Cargas por barreno de la cuña', String(c.wedgeLoads)]);
                            return { state: 'disponible', source: SRC, color: CARGA_COLOR[c.column] ?? 0xb0b8c0, legend };
                        }
                        if (mode === 'tiempo') {
                            if (!t || t.ringMs === null) return nodata('Tiempo · sin retardo entre anillos capturado en «Tiempos y secuencia».');
                            const secs = Do(ae);
                            if (!secs.length) return nodata('Tiempo · sin anillos: captura bordo y perforación.');
                            // Solo los anillos visibles; el tiempo cero es el inicio del primero.
                            const seq = sequence();
                            if (!seq.available) return nodata('Tiempo · ' + seq.message + '.');
                            const rings = seq.rings;
                            const legend = [['Sistema', lab(SYS, t.system)], ['Entre anillos', Je(t.ringMs, 0) + ' ms'], ['Entre taladros', t.holeMs === null ? 'sin datos' : Je(t.holeMs, 0) + ' ms']];
                            return { state: 'disponible', source: SRC, unit: 'ms', rings, maxMs: seq.totalMs, legend };
                        }
                        return nodata(mode === 'dano' ? 'Daño · sin capa de daño disponible.' : 'Frag. · sin capa de fragmentación disponible.');
                    }
                    catch (error) { return { state: 'error', source: SRC, message: 'No se pudieron leer los datos capturados: ' + error.message }; }
                }
                window.MineCADLayerData = Object.freeze({ get: layerData, sequence, influenceRadius: () => ae.charge?.influenceM ?? null, burden: () => { const b = ae.drilling?.burdenM; return Number.isFinite(b) && b > 0 ? b : null; }, rings() { try { return Do(ae).map(x => x.index); } catch { return []; } } });
                const _rm = refreshMods;
                refreshMods = function () { _rm.apply(this, arguments); document.dispatchEvent(new CustomEvent('minecad:datos')); };
            }
            ens(ae);
            cc();
            Pi();
        }
    })();
}
catch (error) {
    document.body.textContent = 'No se pudo iniciar Geometría MineCAD: ' + error.message;
}
