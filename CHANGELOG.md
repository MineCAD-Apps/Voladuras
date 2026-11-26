# Cambios

## Roca sin detonar y volumen por línea (26 nov 2026)

- La roca sin detonar frena el material: no pasa del punto medio entre la última línea detonada y la siguiente; solo dentro de la obra inferior corre hacia ese lado y forma talud.
- La cantidad de fragmentos por línea sigue el volumen (ancho × alto de la sección × espaciamiento entre líneas).
- Las obras superior e inferior se tratan como huecos: no se genera material dentro de ellas (3D y 2D).

## Acumulación de material y daño por secuencia (25 nov 2026)

- Los fragmentos 3D se apilan en la obra inferior sin ocupar el mismo lugar (acomodo geométrico, no simulación física).
- Cada zona de daño aparece cuando inicia su barreno, en 3D y 2D. En 0 % se muestran todas como vista previa.

## Secuencia por barreno (25 nov 2026)

- La duración de la animación corresponde solo a las líneas visibles, con tiempo cero en la primera.
- Carga: cada barreno pasa de rojo a amarillo en su tiempo nominal, con resplandor inicial.
- Daño: zona cilíndrica con el «Radio de influencia» capturado en «Explosivo y carga» (charge.influenceM, 0.05–30 m).
- Fragmentos y prismas aparecen según el barreno de origen.
- Selector de velocidad (Auto o fija).

## 26 de noviembre de 2026

- Los modos Tiempo y Carga del visor muestran los datos capturados en «Tiempos y secuencia» y «Explosivo y carga» (3D con todos los anillos), con leyenda y procedencia. Sin datos: se conserva el dibujo y el aviso.
- El efecto decorativo 3D se reparte sobre los anillos mostrados o la sección elegida, en lugar de la zona central fija.
- Tiempo con rampa de color, escala y destello; carga de resultados externos (JSON) para Daño, Frag. y cantidad de Carga, con plantilla y procedencia visible.
- Nuevo adaptador de solo lectura `MineCADLayerData` y evento `minecad:datos`. No se añaden cálculos de carga, secuencia, daño ni fragmentación.

## Organización web del 25 de noviembre de 2026

- index.html en la raíz como entrada principal de la aplicación propia.
- Scripts, estilos y logo propios accesibles mediante rutas relativas.
- Biblioteca Three.js r181 y licencia en vendor/.
- Iframe y tema externo separados como alternativa en integraciones/.
- Eliminados del paquete web los archivos de instalación de AutoCAD, LISP, C# y DLL.
- Rótulo de la aplicación actualizado de AutoCAD a Web.
- Documentación y verificación adaptadas a la estructura web.
- Conservadas las funciones existentes, sin añadir cálculos operativos.

## Trabajo previo consolidado

Geometría de veta y niveles, adaptación a pantalla pequeña, vistas 2D/3D, referencia de la veta en la corona del nivel inferior, planta compacta con collares, selección compartida de secciones, controles ilustrativos y separación de la biblioteca Three.js.

Los reportes conservan sus fechas de revisión originales; no certifican cambios posteriores hechos por otras herramientas.
