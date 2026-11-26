# Cambios

## 26 de noviembre de 2026

- Los modos Tiempo y Carga del visor muestran los datos capturados en «Tiempos y secuencia» y «Explosivo y carga» (3D con todos los anillos), con leyenda y procedencia. Sin datos: se conserva el dibujo y el aviso.
- El efecto decorativo 3D se reparte sobre los anillos mostrados o la sección elegida, en lugar de la zona central fija.
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
