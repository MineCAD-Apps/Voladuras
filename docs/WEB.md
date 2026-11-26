# Uso y publicación web

## Aplicación principal

La raíz contiene index.html y los scripts y estilos de MineCAD. Three.js se carga desde vendor/. No existe una carpeta de instalación de AutoCAD ni se utilizan archivos LISP, proyectos C# o DLL.

Para alojar esta versión en GitHub Pages, publica la rama main y / (root) desde Settings → Pages. GitHub proporciona la dirección al completar su despliegue; no se habilita Pages únicamente por subir archivos.

En desarrollo, usa un servidor estático local. Conserva las rutas relativas y las mayúsculas exactas de los nombres, especialmente en alojamientos con distinción entre mayúsculas y minúsculas.

Los diseños se guardan en el almacenamiento local del navegador. Para trasladarlos entre dominios o perfiles usa exportación e importación JSON. No se incluyen diseños personales en el repositorio.

## Integración alternativa

integraciones/panel-externo.html abre un iframe de la herramienta original. Su botón Volver al proyecto regresa a ../index.html. integraciones/minecad-tema.user.js es un tema local de Tampermonkey.

Para aplicar ese tema, instala Tampermonkey desde https://www.tampermonkey.net/, crea un script con el contenido completo del archivo, guarda y recarga. El script se limita al dominio de la página original y también se aplica dentro de frames. Subirlo al repositorio no lo instala en los navegadores.

El padre MineCAD no puede modificar directamente el CSS de otro dominio. Sin extensión se conserva la apariencia original del contenido. Una apariencia uniforme sin extensión requeriría cambios autorizados en el código de origen.

La integración depende de la conexión, de la disponibilidad y de las restricciones del sitio externo. Abrir aparte permite acceder directamente a él. Su almacenamiento, resultados y exportaciones son independientes de la aplicación principal y no se sincronizan por el iframe.

## Alcance de la verificación

Comprobación local de la entrada web, recursos, vistas y selección de secciones. Los reportes de referencia no certifican exactitud física ni matemática. La barra de simulación añadida continúa siendo ilustrativa. La reorganización web conserva las funciones anteriores y no añade cálculos operativos.
