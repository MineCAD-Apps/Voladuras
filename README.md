# MineCAD Voladuras

Aplicación web estática de MineCAD, organizada para ejecutarse directamente en el navegador. Consolidación del trabajo vigente al 25 de noviembre de 2026.

## Estructura

```text
index.html                  Entrada de la aplicación
registro-app.js             Aplicación, formularios y representación 2D
registro-3d.js              Visor 3D propio de MineCAD
registro-controles.js       Controles visuales de reproducción
registro.css                Estilos
logo-minecad.png            Logo
vendor/                     Three.js r181 y su licencia
integraciones/              Iframe y tema de la herramienta externa
docs/                     Documentación y capturas
tools/                      Comprobación de archivos
```

## Publicar en GitHub Pages

1. Sube los archivos y carpetas a la raíz de este repositorio, conservando la estructura.
2. En Settings → Pages, selecciona Deploy from a branch, rama main y carpeta / (root).
3. GitHub mostrará la dirección al completar el despliegue. Con el nombre actual, la dirección prevista es https://minecad-apps.github.io/Voladuras/.

No requiere npm, compilación, servidor propio, AutoCAD, LISP ni DLL. Todos los recursos de la aplicación propia se cargan mediante rutas relativas. La biblioteca Three.js es local, sin CDN.

## Abrir durante el desarrollo

Usa un servidor estático local y abre index.html. Por ejemplo, con Python disponible:

```sh
python -m http.server 8080
```

Para verificar sintaxis, rutas e integridad, con Node.js:

```sh
node tools/verify.mjs
```

## Qué incluye la versión actual

- Geometría de veta y niveles, registro, visualización 2D/3D, planta compacta de collares y selección compartida de secciones.
- Formularios locales existentes de carga y tiempos.
- Controles de simulación visual: el avance añadido es una vista previa de interfaz; no se presenta como un motor físico validado.
- Reportes descriptivos de la herramienta de referencia.

Se conserva la lógica previa del módulo, con cambios de rutas y presentación para la web. Esta reorganización no añade ni valida cálculos operativos.

La aplicación propia es la entrada principal. [El panel externo](integraciones/panel-externo.html) es una integración alternativa, con alojamiento y datos independientes. No importa sus cálculos a la aplicación propia.

## Datos

Los diseños se guardan en el navegador y origen donde se abre la aplicación. No se sincronizan automáticamente con GitHub ni con otras instalaciones. Usa Guardar JSON para exportar respaldos y Abrir JSON para importarlos. El cambio de dirección web no traslada automáticamente el almacenamiento de una dirección anterior.

## Documentación

- [Mapa de archivos](docs/ARCHIVOS.md)
- [Uso y publicación web](docs/WEB.md)
- [Dependencias y atribución](docs/DEPENDENCIAS.md)
- [Inventario funcional de referencia](docs/referencia/Inventario-funcional.txt)
- [Historial de cambios](CHANGELOG.md)

La [herramienta externa de JR Cognitive Projects](https://extraordinary-jelly-d2ae56.netlify.app/) conserva su autoría; su código no se copia aquí. Se mantiene la licencia MIT de Three.js junto a la dependencia. No se asigna por ello una licencia general al resto del proyecto.

No se incluyen credenciales, datos personales de diseños, node_modules ni versiones antiguas reemplazadas. Algunas referencias históricas mencionan el módulo de AutoCAD del que procede esta interfaz; no son instrucciones de instalación de esta versión web.

## Vista web revisada

![Aplicación web directa con visor 3D](docs/capturas/vista-web.jpg)
