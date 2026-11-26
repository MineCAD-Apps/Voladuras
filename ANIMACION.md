# Animación visual

Play comunica el porcentaje a una capa ilustrativa 2D y al visor 3D. La sección muestra un resplandor y textura de fragmentos; el 3D muestra piezas decorativas en descenso. Pausa, reinicio y el deslizador controlan un mismo progreso, que se conserva al alternar vistas.

El efecto es una ilustración gráfica de duración fija. No utiliza cargas, retardos, propiedades de explosivos ni modelos de fragmentación o movimiento de roca. No representa un resultado físico del diseño. Los modos de color sin datos vinculados continúan indicándolo.

Archivos de presentación: animacion-visual.js, registro-controles.js y registro-3d.js. index.html carga la capa de animación antes de iniciar la aplicación. La biblioteca Three.js no se modifica.

Pruebas: reproducción, cambio de vista conservando porcentaje, avance manual, reinicio y ausencia de errores de consola en la vista previa local.

Actualización de interfaz: ayudas por modo, foco visible de teclado, pausa con Escape y respeto a movimiento reducido (la barra manual sigue disponible). Estas adiciones se comprobaron con eventos simulados; su revisión visual en navegador queda pendiente.

## Enlace con los datos capturados (26 nov 2026)

Los modos Tiempo y Carga leen lo que el usuario ya ingresó en «Tiempos y secuencia» y «Explosivo y carga». No calculan ni validan nada.

- registro-app.js expone `window.MineCADLayerData.get(modo)` (solo lectura) con estado `disponible` / `sin_datos` / `error`, procedencia, leyenda y atributos de presentación, y emite el evento `minecad:datos` al cambiar la captura.
- registro-controles.js arma la capa y la entrega con `MineCADAnimation.setLayer()`; la barra de porcentaje se escala a los ms capturados en modo Tiempo.
- registro-3d.js dibuja un tubo por anillo (índice tomado del id «R<n>-<m>») y `applyLayer()` solo cambia color y opacidad; no reconstruye el visor.
- Carga: color por agente de columna capturado y leyenda con los valores. Son datos del diseño completo; no se asignan a barrenos individuales (toe y cuña solo aparecen en la leyenda).
- Tiempo: los anillos se resaltan según el inicio nominal que ya muestra la tabla de anillos (índice × retardo entre anillos). El retardo entre taladros se muestra como dato pero no se dibuja por barreno.
- Sin datos: se mantiene el dibujo original y el mensaje «sin datos». Con una capa activa se oculta el efecto decorativo.
- Daño y Frag. siguen sin datos.
- Limitación conocida: con una sección individual seleccionada el 3D usa el resaltado de sección existente y la capa no se aplica; en 2D todavía no se colorea nada por capa.

## Posición de las piezas decorativas (26 nov 2026)

El visor 3D entrega a la capa decorativa las posiciones longitudinales ya existentes de los anillos mostrados (todos, o solo la sección elegida) mediante `shownRingPositions()`. Las piezas se reparten sobre esos anillos en lugar de la zona central fija (35–57 % del bloque). Si no hay anillos que mostrar, se conserva la zona central de antes. Sigue siendo ilustración: todas las piezas siguen el mismo avance, sin orden de iniciación ni cálculo.

## Modos Tiempo, Carga, Daño y Frag. (26 nov 2026)

- **Tiempo:** color por inicio nominal capturado (rampa de 0 ms al máximo, con escala en la leyenda). Al avanzar la barra, los anillos alcanzados se encienden, los demás se atenúan y el recién alcanzado destella.
- **Carga:** color por agente de columna capturado. Si se carga un archivo externo de cantidades, se dibuja con rampa de valores.
- **Daño y Frag.:** sin datos hasta que se carguen resultados externos. La herramienta no los calcula.
- Botones «Cargar resultados (JSON)…», «Plantilla» (anillos actuales con valores vacíos) y «Quitar resultados».
- Formato: `{"layers":[{"schema":"minecad-capa/1","mode":"dano|frag|carga","label":"…","unit":"…","source":"…","rings":{"1":valor|null,"2":…}}]}`. `label`, `unit` y `source` son obligatorios; la procedencia queda visible en la leyenda. Los números de anillo van de 1 al total actual. `null` = sin dato (gris), no cero.
- Con resultados externos, el orden de aparición usa el inicio capturado si existe; si no, el orden numérico de las secciones, solo ilustrativo.
- Los resultados cargados viven en memoria: se pierden al recargar la página.
- Pendiente: la sección 2D todavía no se colorea por modo, y con una sección individual elegida el 3D conserva su resaltado de sección.

## Secuencia por barreno (25 nov 2026) — sustituye lo anterior donde difiera

- Tiempo de un barreno = (anillo − primer anillo visible) × retardo entre anillos + (n.º de barreno − 1) × retardo entre taladros. El orden dentro del anillo es la numeración R<n>-1, R<n>-2, …
- La duración es el último de esos tiempos entre las líneas visibles. Sin retardo entre taladros, el anillo inicia a la vez.
- Fuente única: `MineCADLayerData.sequence()`; reloj común: `MineCADAnimation.timeline()`.
- Velocidad Auto: el diseño completo dura unos 12 s y una selección parcial dura proporcionalmente menos, más una entrada y una cola fijas para el resplandor y la caída.
- Sin tiempos capturados se conserva el avance ilustrativo global de 8 s.
- El radio de influencia lo escribe el usuario; no se calcula. Resplandor, caída y fragmentos son ilustrativos.

## Acumulación y daño (25 nov 2026)

- Cada fragmento 3D se aproxima con una esfera y se apoya en el piso o sobre los anteriores; rueda si la pendiente supera unos 37°. No calcula volumen, esponjamiento ni forma real de la rezaga.
- Máximo aproximado de 4,000 fragmentos (mínimo 12 por línea). Con muchas líneas se reducen de tamaño para que la pila quepa en la obra inferior.
- Daño: cada zona aparece desde el inicio de su barreno.
