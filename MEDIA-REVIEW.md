# Integración audiovisual · Park Aventura Lleida

Versión de prueba sobre `57fc799`. Producción y la rama `main` no se modifican.

## Fotografías de Drive

Se descargaron y revisaron visualmente los **36 JPG y 6 MP4** de la carpeta `19YtBhKDTGsH-1-miuMeZv9f1k8xRn1bE`. No se clasificaron por nombre. El inventario completo, observaciones, dimensiones, SHA-256, exclusiones y cortes de vídeo están en [media-audit.json](media-audit.json).

| Categoría | Fotos nuevas únicas |
| --- | ---: |
| Paintball | 4 |
| Laser Tag | 11 |
| Realidad virtual individual y simuladores | 6 |
| Battle Start: visores y mandos en juego libre | 3 |
| Humor Amarillo | 5 |
| Cumpleaños y sala | 3 |
| Photocall / El parque | 1 |
| **Total** | **33** |

La galería conserva además 14 fotografías originales únicas del repositorio. Las fotos de simuladores y Battle Start que ya existían, repetidas entre las nuevas, se muestran mediante la nueva copia optimizada. Se corrige la clasificación anterior de una foto de Battle Start que aparecía como VR individual. La galería completa contiene **47 fotos**, agrupadas por actividad, con filtros, navegación por botones y teclado, deslizamiento táctil y ampliación sin recorte.

### Humor Amarillo

Se sustituye la imagen principal por **`749d5aa7-18f2-4450-84cb-7643fed061e3.jpg`** de la carpeta autorizada: vista aérea amplia con los circuitos y obstáculos. La tarjeta utiliza `object-fit: contain`, sin ampliar ni cortar la fotografía, tanto en móvil como en escritorio. No se generaron imágenes con IA. Se conserva el título, los botones, la paleta, las tipografías y los efectos existentes.

### Sin material nuevo adecuado

- **Team Building:** no hay una foto inequívoca de una sesión específica de empresa. Se conserva su foto principal anterior por la instrucción de mantenerla cuando no haya sustitución adecuada. Esa imagen anterior muestra un grupo de Paintball; no se atribuyen nuevas fotos de otras actividades a Team Building. Las imágenes y vídeo de su galería se identifican como sala y pica-pica opcional, ya existentes.
- **Stress Room:** no se identifica foto ni vídeo de esta actividad entre los archivos nuevos. Conserva la imagen promocional anterior, sus precios y condiciones. «Ver experiencia» muestra esta imagen y la descripción, sin presentar un vídeo ajeno ni anunciar material inexistente.
- **Escape Rooms:** no se identifica contenido específico. Se conservan los textos, condiciones y accesos existentes; no se publican fotos de otras actividades bajo este nombre.
- El photocall se publica en «El parque», sin atribuirlo a una actividad.

## Relación de los seis vídeos originales

| Original | Contenido comprobado | Integración |
| --- | --- | --- |
| `db36f542-14a6-4692-a3c1-71d0059b0f1c.mp4` | Simuladores individuales VR | Realidad virtual: `vr-simuladores.mp4` |
| `6e9ee42c-ff56-4003-821c-5768ca06ee91.mp4` | Montaje de Paintball, toro mecánico, Laser Tag y simuladores VR | Extractos separados: Humor Amarillo `humor-toro`, Laser Tag `laser-partida`, VR `vr-moto-vuelo`. Las otras escenas de Paintball no se duplican en estos apartados. |
| `b486d2a4-f337-4410-90e4-28b750d6b97e.mp4` | Montaje de Laser Tag, Battle Start, Paintball, toro mecánico y simuladores VR | Extractos separados: `laser-recorrido`, `battle-grupo`, `paintball-accion`. No se reproduce el montaje mixto completo dentro de una actividad. |
| `ab7d9999-50c9-4763-83af-e5f0942f5f0d.mp4` | El mismo montaje que `b486d2a4…` | Una única publicación. Los contenedores tienen distinto SHA-256, pero el SHA-256 del vídeo decodificado coincide: `7c5c590a8d055c6c325e548c8e4c64ef69cb948d8297b414f1bd9b428e46eec8`. También se comprobaron visualmente las escenas y tiempos. |
| `8d020306-5333-4708-aa02-09d70ce2c5fd.mp4` | Paintball: participantes y campo exterior | Paintball: `paintball-campo`, sin la cartela final del editor |
| `8a1992a5-351c-44d1-a463-c87e50847c43.mp4` | Simulador de movimiento VR | Realidad virtual: `vr-movimiento.mp4` |

Nueve clips nuevos, con portada extraída del propio vídeo, H.264/AAC, `yuv420p` y `faststart`. Los extractos de toro y Battle Start son breves porque los originales son montajes con cambios rápidos. Todos los intervalos están documentados en el inventario. La sala/merienda mantiene el vídeo que ya existía en el proyecto, rotulado como tal.

Un único reproductor de experiencias, controles nativos, `playsinline`, `preload="none"`, sonido desactivado al abrir y sin reproducción automática. Al cambiar de vídeo o cerrar se pausa y libera la fuente anterior. No se descargan los nuevos MP4 durante la carga inicial. Al reproducir un vídeo se pausan los demás, incluida la animación de vídeo de portada ya existente. Las preferencias de movimiento reducido se respetan.

## Archivos sin publicar y conservación

- `IMG_0818.JPG`: misma fotografía que `IMG_0819.JPG`, otra exportación.
- `897de2ab-929f-443a-912f-36bd39e26e4b.jpg`: misma fotografía que `IMG_0800.JPG`.
- `c99522ae-6d39-40bc-af77-cc2eb0cf23a7.jpg`: misma fotografía que `IMG_0810.JPG`.
- `ab7d9999-50c9-4763-83af-e5f0942f5f0d.mp4`: montaje duplicado; se publica una sola copia.
- Los montajes completos se conservan sin publicarlos dentro de una actividad, para evitar mezclar escenas. Solo se usan sus extractos correspondientes.

**No quedan archivos sin clasificar a nivel de contenido visual.** Identificar una actividad en una imagen no certifica la fecha, procedencia de la toma ni que se trate de una sesión comercial específica de Team Building o Escape Room; esas atribuciones se han evitado.

No se elimina ningún original del proyecto ni se cambia ningún archivo de Drive. Los 42 originales descargados se conservan en `/workspace/media-originals/drive`; las copias web se encuentran en `assets/experiences`. Los originales de Drive no se añaden a la carga pública de la web. Las fotografías se sirven en WebP a varios tamaños y se cargan de forma diferida.

## Alcance y comprobaciones

Se mantienen precios, condiciones, teléfono, WhatsApp, formulario y lógica de reservas, portada principal, administrador, base de datos y configuración de servicios. La galería sigue usando la misma consulta de solo lectura para incorporar fotos ya publicadas desde el administrador, con recuperación mediante las fotos locales si falla el servicio. No se escriben datos en Supabase.

El proyecto es HTML/CSS/JavaScript estático: no tiene `package.json` ni comando de compilación. Se comprueba la sintaxis de los módulos con `node --check` y el formato con `git diff --check`.

Pruebas automatizadas disponibles:

```sh
python -m http.server 4173 --bind 0.0.0.0
python tests/verify_interactions.py
python tests/verify_planner.py
python tests/verify_motion.py
python tests/verify_media.py
```

Las pruebas no envían mensajes ni escriben en servicios externos. Las capturas se guardan en `/tmp/park-media-*` y `/tmp/park-experience-*`. Se revisa Chromium a 1440, 768, 390 y 320 px, con modo táctil en los tamaños móviles; esto es emulación, no una prueba en un iPhone físico ni en Safari. WebKit no está instalado en el entorno.

Se actualizan las expectativas antiguas de número de fotos y botones, los nombres de archivos optimizados y una comparación del título que dependía de saltos de línea. La prueba del ticker aparta el cursor: el efecto existente se pausa intencionadamente al pasar el ratón.

### Resultado local

- `node --check` en los módulos nuevos: correcto. `git diff --check`: correcto.
- `verify_interactions.py`: correcto a 1440, 768 y 390 px, incluidos precios, selección de packs, reserva interceptada, navegación, galerías sin servicio y visibilidad con animaciones activas.
- `verify_planner.py`: correcto a 1440 y 390 px.
- `verify_motion.py`: correcto a 1440, 390 y 320 px, con movimiento normal y reducido.
- `verify_media.py`: correcto a 1440, 768, 390 y 320 px. Cero errores JavaScript y cero solicitudes de MP4 nuevos durante la carga inicial.
- Los nueve MP4 nuevos se decodifican íntegramente con FFmpeg y se reproducen en Chromium. Las 47 fotos de la galería cargan correctamente.
- Revisión visual de capturas en móvil y escritorio: encuadre aéreo completo, controles accesibles, títulos y botones sin desbordamiento. Se ajusta el encuadre de Battle Start para conservar los rostros del grupo.

Limitaciones: la base de datos y el administrador no se modificaron ni se probaron con escrituras. Las pruebas simulan la indisponibilidad del servicio para comprobar la recuperación local. No se ha probado hardware iPhone ni Safari. La página principal conserva su vídeo decorativo preexistente; la prueba de carga diferida se refiere a los MP4 incorporados a las experiencias.
