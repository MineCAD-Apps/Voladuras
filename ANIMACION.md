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
