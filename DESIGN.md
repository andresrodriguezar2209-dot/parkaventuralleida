# Park Aventura Lleida — modelo editorial

Tipo: place. Actividades, cumpleaños y grupos en un parque real; reserva por WhatsApp.
Sistema: papel #f5f2e9, tinta oliva #20231d, naranja de marca #c23d12. Barlow Condensed y DM Sans, conservando la voz deportiva del parque. El naranja y el logotipo existentes tienen prioridad sobre las paletas de demostración de Taste.

## Material y contenido

Se mantienen las siete actividades, ocho packs, precios, condiciones, límites de edad y grupo, horarios, dirección, teléfono, email, vídeos y galerías existentes. No se inventan tarifas, testimonios ni fotografías. Las imágenes son archivos del propio repositorio, convertidos a WebP; los originales siguen disponibles. Las fuentes se sirven localmente con sus licencias OFL.

## Composición

- Portada editorial dividida: nombre del parque, presentación y acción de reserva a la izquierda; fotografía real del grupo a la derecha. En móvil, texto y acción antes de la foto. Entrada única con el módulo de movimiento de Taste.
- Índice de ocasiones para cumpleaños, amigos y empresas.
- Catálogo con dos fotografías grandes, una fila de tres experiencias y dos fichas compactas. Información y precios accesibles mediante el diálogo existente.
- Packs sobre una superficie cálida: cumpleaños, combinados, empresas y tarifas individuales. La fotografía de la celebración usa el momento `picture-develops` de Taste.
- Galería y vídeos reales, enlace a reseñas, ubicación y solicitud con presupuesto orientativo.
- Cierre tipográfico con `word-highlight`; menú móvil, foco visible y movimiento reducido.

## Decisiones específicas del encargo

Conservar toda la información exige secciones de altura natural: no se recorta el catálogo para forzar pantallas de altura fija ni un límite de palabras. La portada dividida y el cierre naranja siguen la dirección deportiva de la marca. Dirección, teléfono, email, mapa y tarifas son reales y se conservan aunque las comprobaciones de Taste para ejemplos ficticios recomienden ocultarlos. La galería conserva fotografías repetidas del catálogo porque el usuario pidió la misma información y las categorías deben seguir siendo utilizables.

Las integraciones de reservas y la galería remota no cambian. Las pruebas interceptan WhatsApp y bloquean la galería remota para comprobar la recuperación mediante fotos locales sin enviar mensajes ni modificar datos externos.

## Copia y recuperación

Estado de partida: dd14116b565627c5a33aeacc46dd74649eeef883.
Rama de respaldo: backup/antes-taste-2026-11-12.
Rama de trabajo: mejora/taste-skill.
Además existe un bundle completo local en /workspace/parkaventuralleida-antes-taste-2026-11-12.bundle.

La vista previa de esta rama es independiente de producción. No se fusiona en main ni se promociona a producción.

El naranja se oscurece ligeramente para garantizar el contraste del texto blanco en botones y cierre. El acceso flotante se retira porque podía tapar información; WhatsApp sigue disponible en ubicación y en la solicitud.

Las seis fuentes WOFF2 locales suman 143.492 bytes. Las comprobaciones específicas de diseño, interacciones y presupuesto están descritas en tests/README.md. El informe de Taste se conserva en docs/taste-validation.md.

Las fotografías tienen variantes responsivas de 600 px y tamaños explícitos. La página completa transfiere aproximadamente 2,23 MiB en escritorio y 1,38 MiB en móvil en la comprobación local; el detalle y los límites están en docs/taste-validation.md.
