/* Consulta estática de texto aportado por el usuario. No interpreta fórmulas. */
(() => {
    'use strict';
    const source = {
  "file": "Plantilla_diseno_voladura.xlsx",
  "sheet": "Documentación",
  "title": "Documentación de criterios de las fórmulas",
  "intro": "Explica cómo se implementó cada fórmula de la hoja Plantilla, qué es literal de la fuente (Manual de Konya, 8 capturas) y qué es una decisión de esta plantilla. Referencias de celda: columna D (Caso 1); E y F usan la misma fórmula.",
  "criteria": {
    "title": "1. Criterios por fórmula",
    "headers": {
      "formula": "Fórmula implementada (Caso 1)",
      "criterion": "Criterio adoptado",
      "origin": "Origen"
    },
    "entries": [
      {
        "number": "1",
        "label": "Burden calculado (B)",
        "formula": "=Parámetros!C6 * D6 * (D7/D8)^Parámetros!C7 * IF(Parámetros!C8=\"ft\", Parámetros!C9, 1)",
        "criterion": "Ecuación empírica B = 3.15 x De x (Dee/Der)^(1/3), con De en pulgadas y densidades en g/cc (la relación Dee/Der es adimensional). La fuente rotula B en metros, pero la constante 3.15 de Konya se publica para B en pies con De en pulgadas. Por eso, por defecto, el resultado se interpreta en pies y se convierte a metros (x 0.3048); un burden de decenas de metros con taladros de pulgadas no sería coherente. Si su manual usa el resultado directamente en metros, cambie Parámetros!C8 a «m». Verifique contra el original.",
        "origin": "Captura 1",
        "type": "Ambigüedad de unidades"
      },
      {
        "number": "2",
        "label": "Kr – número de filas",
        "formula": "=IF(D10>=Parámetros!C10, Parámetros!C30, Parámetros!C29)",
        "criterion": "La fuente dice «1 o cinco filas» y «5 o más filas», con solapamiento en 5. Se resuelve así: menos de 5 filas → 1.0; 5 o más → 0.9, porque la categoría «5 o más» es la explícita. El umbral (5) es editable en Parámetros!C10.",
        "origin": "Tabla 4.1, captura 2",
        "type": "Ambigüedad resuelta"
      },
      {
        "number": "3",
        "label": "Kd – depositación",
        "formula": "=INDEX(Parámetros!C31:C33, MATCH(D11, Parámetros!B31:B33, 0))",
        "criterion": "Búsqueda exacta del caso elegido en la lista desplegable: 1.18, 0.95 o 1.0. Los textos de la lista son abreviaturas; la descripción completa de la fuente está en Parámetros, columna E.",
        "origin": "Tabla 4.1, captura 2",
        "type": "Literal de la fuente"
      },
      {
        "number": "4",
        "label": "Ks – estructura geológica",
        "formula": "=INDEX(Parámetros!C34:C36, MATCH(D12, Parámetros!B34:B36, 0))",
        "criterion": "Misma lógica que Kd: 1.3, 1.1 o 0.95.",
        "origin": "Tabla 4.1, captura 2",
        "type": "Literal de la fuente"
      },
      {
        "number": "5",
        "label": "Burden corregido",
        "formula": "=D21*D22*D23*D24",
        "criterion": "B corregido = B calculado x Kr x Kd x Ks, aplicados en producto.",
        "origin": "Captura 2",
        "type": "Literal de la fuente"
      },
      {
        "number": "6",
        "label": "Burden de diseño",
        "formula": "=IF(D18=\"\", D25, D18)",
        "criterion": "La fuente no dice qué burden alimenta al espaciamiento, taco y retardos. Se usa el burden corregido, que es el que la fuente propone como resultado final. La celda D18 permite sustituirlo por un valor redondeado o decidido en campo; si está vacía se usa el corregido.",
        "origin": "Capturas 1, 4 y 7",
        "type": "Decisión de la plantilla"
      },
      {
        "number": "7",
        "label": "Relación de rigidez y clasificación",
        "formula": "=D9/D26 ; =IF(D28<Parámetros!C11, \"Banco corto\", \"Banco largo\")",
        "criterion": "HB/B < 4 → banco corto; en caso contrario → banco largo. La fuente no define HB/B = 4 (el texto dice 1 < HB/B < 4 y la tabla usa < 4 y > 4); se asigna a banco largo. La elección es de bajo impacto: en HB = 4B ambas ramas instantáneas dan 2B, y las retardadas dan 1.375B y 1.4B (1.8 % de diferencia). HB no está definida explícitamente en la fuente; por contexto es la altura de banco y se asume en metros, igual que B, porque HB/B exige la misma unidad. Si HB/B < 1 se muestra una alerta, pues queda fuera del rango citado.",
        "origin": "Capturas 3 y 4",
        "type": "Ambigüedad resuelta"
      },
      {
        "number": "8",
        "label": "Espaciamiento (E)",
        "formula": "=IF(D14=\"Instantánea\", IF(D28<4, (D9+2*D26)/3, 2*D26), IF(D28<4, (D9+7*D26)/8, 1.4*D26))  (las constantes se leen de Parámetros)",
        "criterion": "Cuatro casos: instantánea corto E = (HB + 2B)/3; instantánea largo E = 2B; retardada corto E = (HB + 7B)/8; retardada largo E = 1.4B. En la captura 4 el último caso se imprime «E=1.4X b» con b minúscula; se interpreta como el burden B (no hay otro símbolo b definido).",
        "origin": "Captura 4",
        "type": "Literal, con símbolo interpretado"
      },
      {
        "number": "9",
        "label": "Sobre-perforación (SP)",
        "formula": "=Parámetros!C19*D26",
        "criterion": "SP = 0.3 x B. La fuente no indica unidad; al ser múltiplo de B queda en metros.",
        "origin": "Captura 4",
        "type": "Literal de la fuente"
      },
      {
        "number": "10",
        "label": "Longitud de taco (T)",
        "formula": "mín: =IF(D15=\"Competente\", 0.7*D26, 1*D26) ; máx: =IF(D15=\"Competente\", 1.6*D26, 1*D26) ; adoptada: =IF(D15=\"Competente\", D16*D26, 1*D26)",
        "criterion": "Material competente: la fuente da un rango de 0.7 a 1.6 x B, por lo que se muestran ambos límites y el usuario elige el factor en D16 (validado dentro del rango; el 1.0 del ejemplo es ilustrativo). Material incompetente, con fisuras y fracturas abiertas: T = B, sin rango.",
        "origin": "Captura 4",
        "type": "Literal; factor elegido por el usuario"
      },
      {
        "number": "11",
        "label": "Retardo barreno a barreno (tH)",
        "formula": "=IF(D14=\"Instantánea\", \"N/A\", D37*D30)",
        "criterion": "tH = TH x S, con TH de la Tabla 4.2 (ms/m) y S = espaciamiento en metros, es decir E de la sección C. Solo aplica con iniciación retardada a lo largo de la fila; en instantánea devuelve N/A. Una alerta informativa avisa si tH < 8 ms (referencia del USBM citada en el texto de EXSA).",
        "origin": "Tabla 4.2, captura 6; captura 5",
        "type": "Literal, con S = E"
      },
      {
        "number": "12",
        "label": "Retardo entre filas (Tr)",
        "formula": "=D39*D26",
        "criterion": "Tr = Tt x B, con Tt de la Tabla 4.3 (ms/m) y B el burden de diseño. La alerta compara Tt con 8.5 ms/m (mínimo) y 16.5 ms/m (máximo normal) del texto. La tabla incluye 6.5 y 8.0 ms/m, por debajo del mínimo del texto; se conservan ambos contenidos y esas dos opciones activan la alerta en lugar de bloquearse.",
        "origin": "Tabla 4.3, capturas 7 y 8",
        "type": "Literal, con conflicto de la fuente señalado"
      },
      {
        "number": "13",
        "label": "Control de datos completos",
        "formula": "=IF(AND(COUNT(D6:D10)=5, COUNTA(D11:D15)=5, COUNTA(D17)=1, D8>0, D6>0, D10>=1), 1, 0)",
        "criterion": "Evita errores y resultados parciales: si falta un dato requerido, todas las fórmulas del caso quedan en blanco. El factor de taco (D16) y el burden adoptado (D18) son opcionales.",
        "origin": "–",
        "type": "Decisión de la plantilla"
      }
    ]
  },
  "conventions": {
    "title": "2. Convenciones de la plantilla",
    "entries": [
      {
        "label": "Colores",
        "text": "Azul sobre amarillo = dato de entrada. Azul sin relleno (Parámetros) = valor de la fuente o decisión editable. Negro sobre gris = fórmula."
      },
      {
        "label": "Unidades",
        "text": "De en pulgadas; Dee y Der en g/cc; HB, B, E, SP y T en metros; TH y Tt en ms/m; tH y Tr en ms. Se conservan las unidades impresas en la fuente salvo lo indicado en #1."
      },
      {
        "label": "Casos",
        "text": "Tres columnas independientes con fórmulas idénticas. Caso 1 contiene un ejemplo ilustrativo (no proviene de la fuente) para mostrar el formato esperado; limpie D6:D18 para empezar."
      },
      {
        "label": "Cambiar una tabla",
        "text": "Edite los valores en la hoja Parámetros; todas las fórmulas leen de ahí, no hay números fijos dentro de las fórmulas."
      }
    ]
  },
  "references": {
    "title": "3. Referencias del texto que no se calculan (solo orientativas)",
    "entries": [
      "Guía de EXSA (captura 5): retardo entre filas entre 10 ms/m (roca dura) y 30 ms/m (roca blanda); 15 ms/m del burden como guía general.",
      "Debe desplazarse 1/3 del burden antes de que inicie la segunda fila (EXSA, captura 5).",
      "En voladuras multilíneas (6 o más hileras) con control crítico de pared final o castblasting, los retardos pueden ampliarse hasta 40 ms por metro de bordo (captura 7); la plantilla usa solo los valores de la Tabla 4.3, editables en Parámetros."
    ]
  },
  "limits": {
    "title": "4. Alcance y limitaciones",
    "entries": [
      "Los valores se transcribieron de capturas y no han sido validados contra el manual original; revíselos antes de usar los resultados.",
      "La plantilla solo calcula la geometría y los tiempos definidos en la fuente (burden, espaciamiento, sobre-perforación, taco y retardos). No incluye cargas, factor de carga, vibraciones ni otros diseños.",
      "Es una herramienta de apoyo para cálculo y estudio; cualquier diseño real debe ser revisado por personal calificado conforme a la normativa aplicable."
    ]
  }
};
    const dialog = document.createElement('dialog');
    dialog.id = 'minecad-theory-dialog';
    dialog.setAttribute('aria-labelledby','minecad-theory-title');
    dialog.setAttribute('aria-describedby','minecad-theory-source');
    const element = (tag,className,text) => {
        const node = document.createElement(tag);
        if(className) node.className=className;
        if(text !== undefined) node.textContent=text;
        return node;
    };
    const header=element('header','mt-header'), heading=element('div');
    heading.append(element('span','mt-kicker','MINECAD · TEORÍA'),element('h2','',source.title));
    const x=element('button','mt-close','×');x.type='button';x.setAttribute('aria-label','Cerrar teoría');
    header.append(heading,x);
    const body=element('div','mt-body');
    const sourceLabel=element('p','mt-source',source.file+' · hoja '+source.sheet);
    sourceLabel.id='minecad-theory-source';
    body.append(sourceLabel,element('p','mt-intro',source.intro));
    const nav=element('nav','mt-nav');nav.setAttribute('aria-label','Apartados de teoría');
    const groups=[];
    const section = (id,title,shortLabel) => {
        const wrapper=element('section','mt-section');wrapper.id=id;
        const h=element('h3','',title);h.tabIndex=-1;wrapper.append(h);groups.push(wrapper);
        const button=element('button','',shortLabel);button.type='button';
        button.addEventListener('click',()=>{h.scrollIntoView({block:'start'});h.focus({preventScroll:true});});
        nav.append(button);return wrapper;
    };
    const criteria=section('mt-criteria',source.criteria.title,'Criterios');
    const tools=element('div','mt-tools');
    const expand=element('button','','Expandir criterios'),collapse=element('button','','Contraer criterios');
    expand.type=collapse.type='button';tools.append(expand,collapse);criteria.append(tools);
    for(const entry of source.criteria.entries) {
        const details=element('details','mt-criterion');
        const summary=element('summary');
        summary.append(element('span','mt-number',entry.number),element('span','mt-label',entry.label));
        if(entry.type) summary.append(element('span','mt-type',entry.type));
        const content=element('div','mt-detail');
        if(entry.formula) {
            content.append(element('h4','',source.criteria.headers.formula),element('pre','mt-formula',entry.formula));
        }
        if(entry.criterion) content.append(element('h4','',source.criteria.headers.criterion),element('p','',entry.criterion));
        if(entry.origin) {
            const origin=element('p','mt-origin');origin.append(element('strong','',source.criteria.headers.origin+': '),document.createTextNode(entry.origin));content.append(origin);
        }
        details.append(summary,content);criteria.append(details);
    }
    expand.addEventListener('click',()=>criteria.querySelectorAll('details').forEach(d=>d.open=true));
    collapse.addEventListener('click',()=>criteria.querySelectorAll('details').forEach(d=>d.open=false));
    const conventions=section('mt-conventions',source.conventions.title,'Convenciones');
    const dl=element('dl','mt-definitions');
    for(const entry of source.conventions.entries) dl.append(element('dt','',entry.label),element('dd','',entry.text));
    conventions.append(dl);
    const references=section('mt-references',source.references.title,'Referencias');
    const referenceList=element('ul');source.references.entries.forEach(text=>referenceList.append(element('li','',text)));references.append(referenceList);
    const limits=section('mt-limits',source.limits.title,'Alcance');
    const limitList=element('ul');source.limits.entries.forEach(text=>limitList.append(element('li','',text)));limits.append(limitList);
    body.append(nav,...groups);
    const footer=element('footer','mt-footer');
    footer.append(element('span','','Transcripción de la hoja aportada. No ejecuta las expresiones mostradas.'));
    const back=element('button','mt-back','Volver al cálculo');back.type='button';footer.append(back);
    dialog.append(header,body,footer);document.body.append(dialog);
    dialog.querySelector('h2').id='minecad-theory-title';
    let opener=null;
    const restoreFocus=()=>{if(opener?.isConnected && document.getElementById('spacing-capture-dialog')?.open)opener.focus();};
    const close=()=>{dialog.close();restoreFocus();};
    x.addEventListener('click',close);back.addEventListener('click',close);
    dialog.addEventListener('close',restoreFocus);
    dialog.addEventListener('keydown',event=>{
        if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();}
    });
    dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
    function mount() {
        const parent=document.getElementById('spacing-capture-dialog');
        if(!parent || parent.querySelector('#open-minecad-theory'))return;
        const target=parent.querySelector('.sc-actions') || parent.querySelector('.sc-body');
        if(!target)return;
        const button=element('button','sc-theory','Teoría de la plantilla');
        button.id='open-minecad-theory';button.type='button';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls',dialog.id);
        button.addEventListener('click',()=>{
            opener=button;
            if(!dialog.open){dialog.showModal();dialog.scrollTop=0;}
            x.focus();
        });
        target.append(button);
    }
    mount();document.addEventListener('minecad:datos',mount);
    document.addEventListener('DOMContentLoaded',mount);
})();
