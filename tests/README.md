# Pruebas de interacción

Requiere Python, Playwright (`pip install playwright`) y Chromium. Si Chromium no está en PATH, indica su ruta con `CHROMIUM_PATH`; también puedes instalar el navegador de Playwright con `python -m playwright install chromium`.

Desde la raíz del proyecto, inicia un servidor local:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

En otra terminal:

```sh
python tests/verify_interactions.py
```

`PARK_TEST_URL` permite elegir otra URL de prueba. Las pruebas comprueban los paneles de precios, la selección de todos los packs, los vídeos, la ausencia de vídeos sin contenido, los filtros de galería, teclado, enlaces internos, menú móvil, desbordamiento y visibilidad de las tarjetas con animaciones activadas y el buscador desplegable. Se ejecutan a 1440, 768 y 390 píxeles.

El servicio de galería se bloquea deliberadamente para probar la recuperación mediante fotos locales. La apertura de WhatsApp se intercepta: no se envían mensajes. Las capturas se guardan en `/tmp`. No valida el inicio de sesión del administrador ni operaciones de escritura en servicios externos.

Para verificar las recomendaciones, las fotos reales y el cálculo orientativo de la reserva:

```sh
python tests/verify_planner.py
```

Comprueba edades, límites de participantes, modalidad, tarifa según el día, transferencia al formulario y recuperación tras corregir datos. Los importes son orientativos y la disponibilidad necesita confirmación del parque.

Para comprobar la versión con todos los efectos activados:

```sh
python tests/verify_motion.py
```

Verifica partículas, radar, parallax, la banda de texto en movimiento, los siete efectos de actividad, las transiciones, el envío preparado de la reserva y la ausencia de desbordamiento a 1440, 390 y 320 píxeles. Comprueba también que los bucles se detienen fuera de pantalla y que se respeta la preferencia de movimiento reducido. No envía mensajes.
