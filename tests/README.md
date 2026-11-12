# Verificación del modelo Taste

Requiere Python, Playwright y Chromium. Si el navegador no está en PATH, configura `CHROMIUM_PATH`. Las pruebas aceptan `PARK_TEST_URL`.

Inicia el sitio estático desde la raíz del proyecto:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Ejecuta las comprobaciones del modelo actual:

```sh
python tests/verify_redesign.py
python tests/verify_interactions.py
python tests/verify_planner.py
```

`verify_redesign.py` comprueba seis anchuras (1440, 1024, 820, 768, 390 y 320), fuentes locales, botón de reserva visible en la portada, ausencia de desbordamiento, fotografías reales cargadas, las siete actividades, los ocho packs, los dos momentos de Taste y el contraste del cierre. Utiliza movimiento reducido para verificar que la información sigue visible.

`verify_interactions.py` comprueba los siete diálogos de información y precios, ocho packs, tres vídeos, filtros y ampliación de la galería, teclado, enlaces internos, menú móvil, reserva y visibilidad de todas las actividades con movimiento activado. Incluye la galería independiente.

`verify_planner.py` comprueba edades y límites de participantes, modalidades, tarifas según el día, cálculo orientativo, recuperación al corregir datos y coherencia del mensaje de WhatsApp.

La galería remota se bloquea deliberadamente para probar la recuperación mediante fotografías locales. WhatsApp se intercepta: no se envían mensajes. No se escribe en servicios externos ni se prueba el acceso del administrador. Los importes y la disponibilidad requieren confirmación del parque.

`verify_motion.py` se conserva como referencia de la versión anterior; verifica sus partículas, radar y parallax. Ese diseño está preservado en `backup/antes-taste-2026-11-12`. El nuevo modelo utiliza la entrada y los momentos de Taste en lugar de esos efectos; su comprobación es `verify_redesign.py`.
