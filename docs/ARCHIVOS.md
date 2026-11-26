# Mapa de la aplicación web

| Archivo | Responsabilidad |
| --- | --- |
| index.html | Entrada de la aplicación y orden de carga de los recursos |
| registro-app.js | Aplicación existente, formularios, geometría, dibujo 2D y persistencia |
| registro-3d.js | Cámara, materiales, etiquetas y representación 3D |
| registro-controles.js | Controles de apariencia y avance ilustrativo |
| registro.css | Estilos |
| logo-minecad.png | Logo |
| vendor/three-vendor.js | Three.js 0.181.0 y OrbitControls |
| vendor/THREE-LICENSE.txt | Licencia de la dependencia |

Los nombres de los scripts propios se conservan para facilitar la continuidad del trabajo; no significan que dependan de AutoCAD. El visor recibe funciones existentes de la aplicación mediante dependencias. Mantener el orden de scripts de index.html.

El HTML no es autónomo. Para ejecutar la aplicación se necesitan todos sus recursos; para revisar una parte de la interfaz suele bastar el archivo correspondiente y su contexto. No hace falta editar la biblioteca de Three.js para cambiar formularios o estilos.

Los nombres internos breves del compilado se conservaron; el formateo no recupera los nombres descriptivos de fuentes antiguas. No reconstruir esta versión desde el build obsoleto que generaba un HTML autónomo.

## Carpetas auxiliares

- integraciones/: contenedor de la página original y tema local; alternativa independiente de la aplicación principal.
- docs/referencia/: inventario funcional y observaciones de animaciones, con sus fechas originales.
- docs/capturas/: evidencia histórica de presentación; no resultados de una ejecución actual.
- tools/: comprobación de sintaxis, referencias e integridad.

El manifiesto documenta los bytes del paquete vigente. Si se edita un archivo, actualizar su entrada del manifiesto antes de exigir la comprobación de integridad.
