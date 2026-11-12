GATE: OPEN 79 (rounds used up)

# Verificación del nuevo modelo

Esta es una propuesta independiente en `mejora/taste-skill`. La web de producción y `main` no se modifican. La versión anterior está en `backup/antes-taste-2026-11-12`, además del bundle local completo.

## Resultado funcional y visual

- Pruebas de interacciones: pasan a 1440, 768 y 390 px, incluidos siete diálogos, ocho packs, vídeos reales, filtros, ampliación, teclado, menú móvil, enlaces y preparación de WhatsApp.
- Pruebas del planificador: pasan a 1440 y 390 px. Se verifican edades, límites, modalidades, tarifas por día, importes desconocidos, cambios de selección y validación antes de preparar el mensaje.
- Prueba del rediseño: pasa a 1440, 1024, 820, 768, 390 y 320 px. Sin desbordamiento horizontal; acción de portada visible; fotografías de actividades cargadas; dos momentos de Taste montados sin errores; cierre legible con movimiento reducido.
- Revisión visual de portada, opiniones, ubicación, buscador, reserva y cierre, en escritorio y móvil. Las capturas de referencia están en este directorio.
- El catálogo de condiciones y precios, las fuentes de vídeo, `activity-catalog.js`, `booking-planner.js`, `adventure-finder.js`, `interactive.js`, `supabase-config.js` y `admin.html` coinciden con la copia original. Los envíos se interceptan: no se manda ningún WhatsApp ni se escriben datos externos.
- Fuentes locales WOFF2: seis archivos, 143.492 bytes en total. Fotografías locales WebP y carga diferida fuera de la portada.

## Aplicación de Taste

Tipo `place`. Papel claro, tinta oliva y naranja del parque ajustado para el contraste. Barlow Condensed y DM Sans. Portada editorial dividida, momento `picture-develops` en cumpleaños y `word-highlight` en el cierre; sin efectos WebGL, partículas, radar, parallax ni revelados de todas las tarjetas.

Voz: directa, deportiva y descriptiva. Se mantienen los nombres reales de las actividades y los términos que ya utiliza el parque.

No se inventan fotografías, precios, contactos, testimonios ni datos. No hay imágenes de stock ni generadas, nombres ficticios ni formularios de demostración. Las piezas promocionales de Humor Amarillo y Stress Room ya pertenecían al repositorio. No se añaden nuevas suposiciones.

## Límites del validador estricto

El resultado del gate no es PASS y no se presenta como tal. No se han modificado los scripts de Taste ni aplicado exenciones para ocultar resultados. El registro completo se conserva abajo.

Se mantiene la información solicitada y se usa altura natural para el catálogo completo, los ocho packs y sus condiciones. Por ello quedan observaciones sobre longitud, alturas exactas de una pantalla, secciones vecinas y repeticiones entre fotografías de actividades, vídeos y galería. Las reseñas, preguntas y reserva conservan su presentación de texto y formulario, sin añadir imágenes de relleno. Los bordes de listas y el nombre del parque en dos líneas son decisiones del diseño.

Los contactos y enlaces a mapas son los reales de la web original. Las alertas sobre números de teléfono, dirección, código postal y WhatsApp corresponden a reglas de Taste para ejemplos ficticios y no justifican borrar datos de este negocio. El checker también interpreta varios encabezados en español y sus palabras en naranja como si fueran frases genéricas o partes de frases en gris.

Se conserva el contraste AA del cierre naranja con texto blanco. Algunas reglas del checker exigen 7:1 para todo texto corrido. Se corrigió el texto blanco sobre blanco y se oscurecieron el naranja de las acciones, las etiquetas y los párrafos.

La importación remota de la galería desde `esm.sh` falla con `ERR_CERT_AUTHORITY_INVALID` en Chromium de este entorno. Las fotos locales y sus filtros se han probado con ese servicio bloqueado. No se verifica una consulta real a la galería remota ni el inicio de sesión del administrador. La integración existente no se cambia.

Copy-lint: cero FAIL. Se conservan dos WARN: la puntuación de una reseña original citada literalmente y las etiquetas que organizan el catálogo largo.

La vista previa de Vercel conserva la protección de acceso del proyecto. No se cambia el dominio de producción ni se fusiona la propuesta.


## Rendimiento de la versión final

Medición local de una carga por anchura (no es una medición de usuarios reales): 2.279 KiB de transferencia total en escritorio y 1.409 KiB en móvil, incluidos todos los bloques después de recorrer la página. Las imágenes aportan 2.035 y 1.186 KiB, respectivamente. Cero imágenes sin dimensiones, cero imágenes sobredimensionadas según el checker, cero cambios de diseño medidos (CLS 0), cero contextos WebGL y cero módulos sin montar.

Quedan dos FAIL de rendimiento: la misma importación externa de Supabase bloqueada por el certificado del entorno, una vez en cada anchura. WARN: transferencia e imágenes de la página larga en escritorio y seis archivos de fuentes en ambas anchuras. No se afirma un PASS de rendimiento completo.

Después de la tercera ronda del gate se completó la optimización de fotografías y se añadieron `srcset`, `sizes`, anchuras y alturas, sin cambiar la composición. Se repitieron las tres pruebas funcionales y la medición de rendimiento. El resultado de maquetación que sigue es la última ronda disponible del gate, no una certificación completa del HTML posterior.

## Registro íntegro del gate

```text
gate: checking index.html (place); this takes a few minutes on a CPU Chrome
gate: rounds used up; 79 FAIL open
  FAIL assets           (the page)  [1440]
       the script https://esm.sh/@supabase/supabase-js@2 did not load (ERR_CERT_AUTHORITY_INVALID)
       fix: fix the path, or remove the reference
  FAIL nav              header.nav > div.wrap.navin > a.brand.header-brand "PARK AVENTURA. LLEIDA"  [1440, 390]
       nav link wraps to a second line
       fix: make the nav one bar from the content's left edge to its right edge, with every link and action inside it
  FAIL no-visual        section#reservar "VUESTRO PLAN EMPIEZA AQUÍ."  [1440, 390]
       no picture, effect or mock in this section; a feature section needs a visual
       fix: give the section a visual: a UI fragment on a ground, real icons, or a photograph that fits
  FAIL text-only        section#resenas "OPINIONES DEL PARQUE."  [1440, 390]
       the quote section is only text: no picture, icon, mock or effect in it (2 sections like it at this width)
       fix: give the section a visual: a photograph that fits, the real icons, or a UI fragment on a ground
  FAIL text-only        main > section.section.faq "ANTES DE VENIR."  [1440, 390]
       the section is only text: no picture, icon, mock or effect in it (2 sections like it at this width)
       fix: give the section a visual: a photograph that fits, the real icons, or a UI fragment on a ground
  FAIL card-layout      div#homeGalleryGrid  [1440, 390]
       9 of 9 cards drawn one way (one panel, ground, placement and fragment): copies of one card
       fix: a card layout at most twice on a page: build the other sections another way
  FAIL copy-headings    div.wrap.mission-layout > div.section-heading > div > h2 "SIETE FORMAS DE JUGAR."  [1440]
       "SIETE FORMAS DE JUGAR." names no product, part, place or section (15 headings like it; at most one brand line per page) (and 14 more like it: "PAINTBALL", "REALIDAD VIRTUAL", "HUMOR AMARILLO", "BATTLE START", ...)
       fix: name the thing in every heading: the product, a part, the place or a section noun
  FAIL stagger          section#ubicacion > div.wrap.location-grid > div.location-copy > div.contact "⌖ Dirección   [1440, 390]
       5 rows start at 2 different left offsets (+5, +7, +4, +0, +0px)
       fix: start every row of the list on one left edge
  FAIL off-grid         div.wrap.hero-grid > div.hero-text > div.hero-facts > span:nth-of-type(1) "Parking gratuit  [1440]
       left edge at 71px, 15px off the page margin at 56px (76 elements, like a.btn.primary)
       fix: move it onto the page margin, or the column edge its section uses
  FAIL off-grid         div#packs-cumple > div.packs > article.pack:nth-of-type(2) "Viernes a domingo PACK COMPLET  [1440]
       left edge at 730px, 22px off a common edge of its section at 752px (4 elements); 2 more in this section off the grid too (article.pack:nth-of-type(3) at 954.5px, article.pack:nth-of-type(3) at 954.5px)
       fix: move it onto the page margin, or the column edge its section uses
  FAIL off-grid         div.location-copy > div.contact > div.contact-row:nth-of-type(1) > span.contact-icon "⌖"  [1440, 390]
       left edge at 63px, 7px off the page margin at 56px (76 elements, like p); 2 more in this section off the grid too (span.contact-icon at 65px, span.contact-icon at 62px)
       fix: move it onto the page margin, or the column edge its section uses
  FAIL text-contrast    section.final-cta.mo-wh > div.wrap.final-cta-inner > div.closing-action > p "Paintball, lá  [1440]
       body text in #ffffff on #c23d12 reads 5.29:1 (needs 7:1)
       fix: body text in the ink at 7:1 or more; grey (4.5:1 or more) only for captions and labels
  FAIL street-number    div.contact > div.contact-row:nth-of-type(1) > div > a.address-link "Av. Alcalde Rovira Ro  [1440]
       a street with its house number: "Av. Alcalde Rovira Roure, 214"; a real door, which the brief does not give (and 5 more like it: section#resenas > div.wrap > div.reviews-actions > a.btn.primary, again here, section#ubica
       fix: print the street and the district only ("Weserstraße, Berlin-Neukölln"): no house number, unless the brief gives the address
  FAIL postcode         div.contact > div.contact-row:nth-of-type(1) > div > a.address-link "25198 Lleida"  [1440]
       a postcode with its town: "25198 Lleida"; with the street it points at one building, which the brief does not give (and 4 more like it: again here, section#ubicacion > div.wrap.location-grid > div.map-wrap > a.location-p
       fix: drop the postcode: the street and the district say where it is (copy.md, Address)
  FAIL phone-number     div.contact > div.contact-row:nth-of-type(4) > div > a "722 146 640"  [1440]
       a phone number after its label: "722 146 640"; a visitor can dial it and reach a stranger
       fix: drop the number and its tel: link (a "Request a call" form may stand in), unless the brief gives the number
  FAIL phone-number     div#packs-actividades > div.pricebox > a.btn.primary "https://wa.me/34722146640"  [1440]
       a WhatsApp link calls a number in a real dialable format: "https://wa.me/34722146640"; a visitor can dial it and reach a stranger (and 2 more like it: div.contact > div.contact-row:nth-of-type(4) > div > a, div.wrap.loca
       fix: drop the number and its tel: link (a "Request a call" form may stand in), unless the brief gives the number
  FAIL section-tile     section#misiones "SIETE FORMAS DE JUGAR."  [1440]
       the section is 2464px tall (2.74 screens at 1440x900), not one screen or two: the screen 2 screens on from its top (scroll 2796px) shows 576px of it and 236px of the next section, its heading "PACKS PARA VUESTRO GRUPO." 
       fix: set every section after the hero to one screen or two (height: calc(var(--h,1) * 100vh)) and fit its content above --padb
  FAIL map-link         div.wrap.location-grid > div.map-wrap:nth-of-type(2) > div.map-actions > a.btn.primary:nth  [1440]
       "Cómo llegar con Google Maps" promises directions but its search ("Av. Alcalde Rovira Roure, 214, 25198 Lleida") holds no street: a map of a district or a town shows nobody the door (and 3 more links with the same search
       fix: with a street from the brief, "Get directions" to its search; a district only: "See the area"; a town only: no map link
  FAIL run-on           div.wrap.mission-layout > div.section-heading:nth-of-type(1) > div > h2 "SIETE FORMASDE JU  [1440]
       "DE | JUGAR.": the heading runs its first sentence into the grey second one with no stop
       fix: end the heading's first sentence with a full stop before its grey second one ("Rooms and prices. Breakfast included.")
  FAIL run-on           div.wrap > div.celebration-photo:nth-of-type(3) > div > h3 "CUMPLEAÑOSCON PARTIDA."  [1440]
       "CON | PARTIDA.": the heading runs its first sentence into the grey second one with no stop
       fix: end the heading's first sentence with a full stop before its grey second one ("Rooms and prices. Breakfast included.")
  FAIL run-on           div#packs-cumple > h3 "PACKS CUMPLEAÑOS"  [1440]
       "PACKS | CUMPLEAÑOS": the heading runs its first sentence into the grey second one with no stop
       fix: end the heading's first sentence with a full stop before its grey second one ("Rooms and prices. Breakfast included.")
  FAIL run-on           div#packs-combinados > h3 "PACKS COMBINADOS"  [1440]
       "PACKS | COMBINADOS": the heading runs its first sentence into the grey second one with no stop
       fix: end the heading's first sentence with a full stop before its grey second one ("Rooms and prices. Breakfast included.")
  FAIL hero-screen      section#inicio > div.wrap.hero-grid > div.hero__media  [1440]
       a strip docked in the hero is 718px tall: at most 96px on a desktop (SR-1)
       fix: keep the hero's content between the nav and 24px above the fold (and the action bar): shorten the picture or the text; a docked strip 96px at most
  FAIL section-height (screen-height) section#packs "02 / Más de un motivo para venirPACKS PA"  [1440, 390]
       the scene's section is 3895px tall (4.3 screens), 2095px over two screens (1800px): every section after the hero is one screen or two, 2px either way; a pinned scene is (hold + 1) screens tall, so write data-big-scene-op
       fix: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit
  FAIL section-height   main > nav.plan-shortcuts.wrap "¿QUÉ CELEBRAMOS? 01 Un cumpleaños 02 Un "  [1440]
       the section is 96px tall (0.1 screens), 804px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
       fix: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit
  FAIL section-height   footer.footer "PARK AVENTURALLEIDA · EXPERIENCIAS© 2026"  [1440]
       the section is 118px tall (0.1 screens), 782px short of one screen (900px): every section after the hero is one screen or two, 2px either way (and 7 more like it: "01 / Las experienciasSIE", "Antes de venirANTESDE VE", "
       fix: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit
  FAIL section-height (screen-height) section#ubicacion "Tu punto de partidaNOS VEMOSEN LLEIDA.Es"  [1440]
       the section starts at 10274px, 374px below the screen grid (11 x 900px): sections start on whole screens (and 8 more like it: "04 / Hablemos de vuestro", "Park Aventura LleidaEL M", "Antes de venirANTESDE VE") (SR-2)
       fix: make every section above it exactly one or two screens tall, so this one starts on a whole screen
  FAIL section-height   main  [1440]
       the page is 14.6 screens long (13120px on a 900px screen): a place page runs 3 to 6 screens (over 7 FAIL) (SR-2)
       fix: keep a place page at 3 to 6 screens: merge a short block into the section above, or cut a section
  FAIL section-air      section#misiones > div.wrap.mission-layout > details.finder-disclosure "¿No sabéis cuál el  [1440]
       a top border across 100% of the container, between the section's content: sections and their parts are told apart by air and ground, not lines (SR-3)
       fix: take the rule out: sections and their parts are parted by their ground and the air between them
  FAIL section-air      div#packs-actividades > div.pricebox "RIÑONERA DE PAINTBALL · MÁS BOLAS, MÁS D"  [1440]
       a top border across 100% of the container, between the section's content: sections and their parts are told apart by air and ground, not lines (SR-3)
       fix: take the rule out: sections and their parts are parted by their ground and the air between them
  FAIL one-section      section#galeria "03 / Así se vive aquíFOTOS DELPARQUE. Pa"  [1440]
       the screen at scroll 9900px (stride 11) shows 286px of section 6 and the content of 2 sections, over 24px each beside section 7: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
       fix: make each section exactly one screen or two, so a screen shows one section and no neighbour peeks
  FAIL one-section (neighbour) section#ubicacion "Tu punto de partidaNOS VEMOSEN LLEIDA.Es"  [1440, 390]
       the screen at scroll 10800px (stride 12) shows 281px of section 7 and the content of 2 sections, over 24px each beside section 8: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
       fix: make each section exactly one screen or two, so a screen shows one section and no neighbour peeks
  FAIL one-section      main > section.section.faq "Antes de venirANTESDE VENIR.¿Tengo que r"  [1440]
       the screen at scroll 11169px (the top of section 8) shows 209px of section 9 and the content of 2 sections, over 24px each beside section 8: a screen shows one section (another may peek 8px, 24px WARN) (and 6 more like i
       fix: make each section exactly one screen or two, so a screen shows one section and no neighbour peeks
  FAIL one-section      main > nav.plan-shortcuts.wrap "¿QUÉ CELEBRAMOS? 01 Un cumpleaños 02 Un "  [1440]
       a <nav> sits directly in <main>: every part of <main> is a <section> (SR-4)
       fix: put every block of <main> in a <section>, and give a band its own section instead of a ground inside one
  FAIL container-edges  header.nav "PARK AVENTURA.LLEIDA ☰ ActividadesCumple"  [1440]
       the nav's content runs 56px from the left and 56px from the right: the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (SR-6)
       fix: use one container on every section and the nav (.wrap): one margin left and right, 64-120px on a desktop, 16-24px on a phone
  FAIL container-edges  section#inicio "LLEIDA · 7 ACTIVIDADES Y CELEBRACIONES P"  [1440]
       the content of section 1 runs 56px from the left and 56px from the right: the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (SR-6)
       fix: use one container on every section and the nav (.wrap): one margin left and right, 64-120px on a desktop, 16-24px on a phone
  FAIL container-edges  main > nav.plan-shortcuts.wrap "¿QUÉ CELEBRAMOS? 01 Un cumpleaños 02 Un "  [1440]
       the content of section 2 runs 56px from the left and 56px from the right (read from its outermost blocks: no .wrap): the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (and 9 more like it: "0
       fix: use one container on every section and the nav (.wrap): one margin left and right, 64-120px on a desktop, 16-24px on a phone
  FAIL container-edges  a.skip-link "Saltar al contenido"  [1440]
       a <a> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
       fix: build the page as header.nav, a main of sections (each one in-flow .wrap plus background layers) and footer.closing
  FAIL container-edges  footer.footer "PARK AVENTURALLEIDA · EXPERIENCIAS© 2026"  [1440]
       a <footer> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
       fix: build the page as header.nav, a main of sections (each one in-flow .wrap plus background layers) and footer.closing
  FAIL container-edges  div.wrap > div.celebration-photo > div > span.eyebrow "También hay tiempo para celebrar"  [1440]
       3 text blocks start on a left line at x 752, 696px from the container's left: text starts on the container's left, or on one split line (x 619, 732, 845) (also "CUMPLEAÑOSCON PARTIDA.", "Descubre los packs con actividad"
       fix: start the text on the container's left, or on the one split line every split shares
  FAIL container-edges  form#bookingForm > div.field:nth-of-type(1) > label "Tu nombre"  [1440]
       4 text blocks start on a left line at x 698, 642px from the container's left: text starts on the container's left, or on one split line (x 619, 732, 845) (also "¿Cuántas personas sois? (opciona", "Calculamos el total al 
       fix: start the text on the container's left, or on the one split line every split shares
  FAIL row-lines        form#bookingForm "Tu nombre Actividad o packSelecciona una"  [1440]
       a row of 2 items: its first item starts at 698px, the container's left line at 56px (2px either way) (SR-7)
       fix: start the row's first item on the container's left line and end its last on the right line, every item one height
  FAIL split-pair       section#packs > div.wrap > div.celebration-photo "También hay tiempo para celebrarCUMPLEAÑ  [1440]
       the two columns of the split start 83px apart at the top (centred on each other): a split's columns are top-aligned, 8px either way (SR-8)
       fix: top-align both columns of the split (align-items: start)
  FAIL split-pair       section#ubicacion > div.wrap.location-grid "Tu punto de partidaNOS VEMOSEN LLEIDA.Es"  [1440]
       the two columns of the split start 39px apart at the top (centred on each other): a split's columns are top-aligned, 8px either way (SR-8)
       fix: top-align both columns of the split (align-items: start)
  FAIL split-pair       section#inicio > div.wrap.hero-grid "LLEIDA · 7 ACTIVIDADES Y CELEBRACIONES P"  [1440]
       the two columns of the split start 11px apart at the top: a split's columns are top-aligned, 8px either way (SR-8)
       fix: top-align both columns of the split (align-items: start)
  FAIL split-pair       section#reservar > div.wrap.booking-grid "04 / Hablemos de vuestro planVUESTRO PLA"  [1440]
       the split's columns are off the page's one pair of lines: its right column starts at x 698, the first split's at 741; its right column starts at x 698, on none of the split lines 732 (k=6) (SR-8)
       fix: start every split's right column on one shared line (wrap.left + k x (width + 24) / 12, k 5, 6 or 7; 6 on a place page) and end the left one 24px before it
  FAIL button-styles    div#packs-actividades > div.pricebox > a.btn.primary "Consultar disponibilidad por WhatsAp  [390]
       one button style (square, fill #c23d12, outline #c23d12) with labels in 4 sizes: 10, 11, 12, 13px ("Consultar disponibilidad por WhatsApp", "Leer todas las reseñas en Google")
       fix: one primary and one secondary button: one shape, one height per size, one label size
  FAIL section-gaps     section#inicio / section#misiones  [390]
       293px between these sections, +119% against the median 134px
       fix: use one gap between sections (all within 25% of each other)
  FAIL edge-left        #inicio div.hero__media  [1440]
       starts at x 741; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        #misiones p "Compara actividades, edades y pr"  [1440]
       starts at x 1064; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        #packs p "Todos los precios son por person"  [1440]
       starts at x 1064; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-right       #packs figure.celebration-frame.mo-pd  [1440]
       ends at x 688; the right line is 1384
       fix: end it on the .wrap right line
  FAIL edge-left        #packs h3 "CUMPLEAÑOSCON PARTIDA."  [1440]
       starts at x 752; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        #packs p "Descubre los packs con actividad"  [1440]
       starts at x 752; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        #packs h3 "Battle Start"  [1440]
       starts at x 962.7; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        #packs p.price-note "Desde 6 años · 8–16 personas"  [1440]
       starts at x 962.7; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        #packs h3 "Stress Room"  [1440]
       starts at x 962.7; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        #packs p.price-note "Desde 16 años · 2 jugadores"  [1440]
       starts at x 962.7; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        #galeria p "Partidas, retos y recuerdos comp"  [1440]
       starts at x 1064; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        #galeria p "Vídeos de nuestras partidas y de"  [1440]
       starts at x 1084; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        #ubicacion div.map-wrap "Cómo llegar con Google Maps Abri"  [1440]
       starts at x 752; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        #reservar form.booking-form "Tu nombre Actividad o packSelecc"  [1440]
       starts at x 697.6; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        #reservar p.fine "Se abrirá WhatsApp para que revi"  [1440]
       starts at x 697.6; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        section.section.faq div. "¿Tengo que reservar antes de ir?"  [1440]
       starts at x 730.3; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-right       footer.footer a.brand "PARK AVENTURALLEIDA · EXPERIENCI"  [1440, 390]
       ends at x 277.2; the right line is 1384
       fix: end it on the .wrap right line
  FAIL edge-left        footer.footer p "© 2026 Park Aventura Lleida"  [1440]
       starts at x 718; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        footer.footer div.footer-actions "Contacto"  [1440, 390]
       starts at x 1290.2; the lines are 56 and the column starts
       fix: start it on the .wrap left line
  FAIL one-sided        #packs section.section.packs-section "02 / Más de un motivo para venir"  [1440]
       its visuals end at x 688, short of the right line 1384
       fix: let the row reach both .wrap edges
  FAIL screen-height    #misiones section.section "01 / Las experienciasSIETE FORMA"  [1440, 390]
       2464px, 3.03 screens; a section is exactly one or two (--h)
       fix: make the section exactly one or two screens (--h: 1 or 2)
  FAIL screen-short (screen-height) #resenas section.section.reviews-section "Experiencias que dejan huellaOPI"  [1440]
       784px tall; one screen under the nav is 812px
       fix: make the section one full screen (--h: 1, layout-v4.md section 2)
  FAIL screen-height    #galeria section.section.gallery-section "03 / Así se vive aquíFOTOS DELPA"  [1440, 390]
       2135px, 2.63 screens; a section is exactly one or two (--h)
       fix: make the section exactly one or two screens (--h: 1 or 2)
  FAIL screen-short (screen-height) #reservar section.section.booking "04 / Hablemos de vuestro planVUE"  [1440]
       691px tall; one screen under the nav is 812px
       fix: make the section one full screen (--h: 1, layout-v4.md section 2)
  FAIL neighbour        #reservar section.section.booking "04 / Hablemos de vuestro planVUE"  [1440, 390]
       framed, 8px of section.section.faq section.section.faq "Antes de venirANTESDE VENIR.¿Ten" shows
       fix: keep the next section's heading and picture out of this screen
  FAIL screen-short     section.section.faq section.section.faq "Antes de venirANTESDE VENIR.¿Ten"  [1440, 390]
       505px tall; one screen under the nav is 812px
       fix: make the section one full screen (--h: 1, layout-v4.md section 2)
  FAIL screen-height    section.section.faq section.section.faq "Antes de venirANTESDE VENIR.¿Ten"  [1440, 390]
       505px, 0.62 screens; a section is exactly one or two (--h)
       fix: make the section exactly one or two screens (--h: 1 or 2)
  FAIL neighbour        section.section.faq section.section.faq "Antes de venirANTESDE VENIR.¿Ten"  [1440, 390]
       framed, 189px of section.final-cta.mo-wh section.final-cta.mo-wh "Park Aventura LleidaEL MEJOR PLA" shows
       fix: keep the next section's heading and picture out of this screen
  FAIL screen-short     section.final-cta.mo-wh section.final-cta.mo-wh "Park Aventura LleidaEL MEJOR PLA"  [1440, 390]
       637px tall; one screen under the nav is 812px
       fix: make the section one full screen (--h: 1, layout-v4.md section 2)
  FAIL screen-height    section.final-cta.mo-wh section.final-cta.mo-wh "Park Aventura LleidaEL MEJOR PLA"  [1440, 390]
       637px, 0.78 screens; a section is exactly one or two (--h)
       fix: make the section exactly one or two screens (--h: 1 or 2)
  FAIL neighbour        section.final-cta.mo-wh section.final-cta.mo-wh "Park Aventura LleidaEL MEJOR PLA"  [1440, 390]
       framed, 118px of the footer shows
       fix: keep the next section's heading and picture out of this screen
  49 WARN (not blocking), first: scroll-reveal section#packs > div.wrap > div.celebrati; scroll-reveal main > section.final-cta.mo-wh > div.wra; card-visual div#packs-combinados > div.packs "1 h–1 ; button-styles div#homeGalleryFilters > button.active "; pricing-tiers div#packs-cumple > div.packs "Lunes a ju
Stop fixing: put these open FAILs and the waivers in your report, then finish.
GATE: OPEN 79 (rounds used up)
```

## Registro de rendimiento final

```text

perf index.html @ 1440px
  PASS  host CPU load (before/after)               0/5 %          
  WARN  total transfer                             2279.4 KiB     html 14.4K  css 19.6K  js 33.6K  font 141.3K  img 2034.8K  other 35.8K
  PASS  requests                                   47             31 by load
  WARN  images bytes                               2034.8 KiB     20 files
  PASS  largest image                              264.6 KiB      photos/PHOTO-2026-11-07-14-44-30%20%281%29.webp
  PASS  JS parsed                                  88.3 KiB       11 files, 33.6K gz
  PASS  CSS                                        19.6 KiB       7 files
  PASS  font families                              2              Barlow Condensed, DM Sans
  WARN  font files                                 6              141.3K
  PASS  font bytes                                 141.3 KiB      
  PASS  images without width+height                0              
  PASS  below-fold images not lazy                 0              1 marked lazy in the page source, set eager by system.js once the page has loaded
  PASS  oversized images (natural > 2.2x shown)    0              
  PASS  WebGL live at load                         0              
  PASS  WebGL live at bottom                       0              
  PASS  WebGL peak live                            0              0 contexts made in all
  PASS  long tasks                                 0              runs 1, , max 0ms
  PASS  blocking time                              0 ms           runs 1,  ms; at load 0ms
  PASS  FCP (CPU, relative)                        676 ms         
  PASS  LCP (CPU, relative)                        676 ms         img
  PASS  layout shift                               0.000          at load 0.000
  PASS  modules loaded, never mounted              0              
  FAIL  broken requests                            1              @supabase/supabase-js@2
  PASS  page height                                14.6 screens   DOM 850 nodes

perf index.html @ 390px
  PASS  host CPU load (before/after)               0/5 %          
  PASS  total transfer                             1408.9 KiB     html 14.4K  css 19.6K  js 33.6K  font 141.3K  img 1185.7K  other 14.4K
  PASS  requests                                   45             30 by load
  PASS  images bytes                               1185.7 KiB     19 files
  PASS  largest image                              134.6 KiB      photos/PHOTO-2026-11-07-14-44-30%20%281%29-600.webp
  PASS  JS parsed                                  88.3 KiB       11 files, 33.6K gz
  PASS  CSS                                        19.6 KiB       7 files
  PASS  font families                              2              Barlow Condensed, DM Sans
  WARN  font files                                 6              141.3K
  PASS  font bytes                                 141.3 KiB      
  PASS  images without width+height                0              
  PASS  below-fold images not lazy                 0              1 marked lazy in the page source, set eager by system.js once the page has loaded
  PASS  oversized images (natural > 2.2x shown)    0              
  PASS  WebGL live at load                         0              
  PASS  WebGL live at bottom                       0              
  PASS  WebGL peak live                            0              0 contexts made in all
  PASS  long tasks                                 0              runs 1, , max 0ms
  PASS  blocking time                              0 ms           runs 1,  ms; at load 0ms
  PASS  FCP (CPU, relative)                        352 ms         
  PASS  LCP (CPU, relative)                        352 ms         img
  PASS  layout shift                               0.000          at load 0.000
  PASS  modules loaded, never mounted              0              
  FAIL  broken requests                            1              @supabase/supabase-js@2
  PASS  page height                                25.7 screens   DOM 850 nodes

SUMMARY index.html: 2 FAIL, 4 WARN  -> FAIL
```

## Registro de copy-lint

```text

== index.html  (1505 words)  0 FAIL, 2 WARN
  WARN copy-exclaim         1 line with an exclamation mark
       - «Una experiencia de Paintball fantàstica!… riure molt i suar molt!!»
       fix: end on a full stop: copy.md bans exclamation marks
  WARN copy-eyebrows        9 eyebrow or kicker labels
       fix: one or two a page; a heading that names the thing needs no label over it
  INFO copy-two-fragment    two-fragment headings "X. Y.": 1 of 1
       - EL MEJOR PLAN. VUESTRO GRUPO.
  INFO copy-rhythm          52 sentences, mean 21.6 words, spread 37.2, 15% of 4 words or fewer
```
