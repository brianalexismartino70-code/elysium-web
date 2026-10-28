# Material cinematográfico: qué grabar en FiveM

- **Última revisión:** 28/10/2026.
- **Por qué existe:** el sitio todavía no tiene grabaciones propias del servidor. Las ilustraciones de los mundos son conceptuales y el fondo de la portada usa imágenes de GTA V cuyo origen falta confirmar (ver `docs/REGISTRO_ASSETS.md`). Esta lista ordena qué grabar para reemplazarlos por **material real de Elysium**.

## Reglas para todo el material

1. **Solo dentro de Elysium.** Nada de capturas de otros servidores, de tráileres oficiales de Rockstar ni de bancos de imágenes sin licencia.
2. **Permiso de quienes aparecen.** Si se ve o se oye a alguien, hace falta su autorización por escrito, por ejemplo en un ticket: qué toma, para qué uso y hasta cuándo. Mejor todavía: grabar con personajes del staff.
3. **Sin música comercial.** El video de portada va **sin audio**. Para piezas con sonido, solo música propia o con licencia escrita.
4. **Sin datos visibles:** nada de IP, nombres de usuario reales, chat de Discord, consola F8 ni la interfaz de administración.
5. **Contenido real.** Si una función todavía no existe en el servidor, no se graba como si existiera. Las piezas que no muestren juego real se rotulan «Ilustración conceptual».
6. Cada pieza nueva se anota en `docs/REGISTRO_ASSETS.md` con autor, fecha, personas que aparecen y permiso.

## Especificaciones técnicas

| Uso | Formato | Duración | Peso máximo | Notas |
|---|---|---|---|---|
| Fondo de portada (bucle) | MP4 H.264, más WebM VP9 o AV1 si se puede, 1920×1080, 24–30 fps, sin audio | 8 a 15 s, en bucle sin corte visible | **2 MB** por versión | Movimiento lento de cámara: sin cortes bruscos, sin texto quemado y con zonas oscuras a la izquierda, donde va el título |
| Póster del fondo | AVIF y WebP, 1920×1080, más una versión de 768 px | Imagen fija | 150 KB | Es lo que se ve en celulares, con «menos movimiento» y mientras carga |
| Cortos de mundos o sistemas | MP4 H.264 1280×720 | 10 a 20 s | 3 MB | Se cargan **solo al apretar reproducir**, con su póster |
| Capturas para la galería | PNG original; el sitio genera AVIF y WebP con `tools/optimizar_imagenes.py` | — | — | Rotuladas «Captura del servidor», con fecha |

El sitio ya tiene preparado el reproductor:

- **nunca se reproduce solo** en celulares, con datos ahorrados ni con «menos movimiento»;
- en escritorio, el fondo de portada se carga después de la página y solo si está visible;
- los cortos muestran su póster y cargan el video al apretar reproducir.

## Tomas sugeridas

### Portada (prioridad 1)

1. **Amanecer sobre la ciudad.** Toma aérea lenta (cámara libre o dron del juego) desde el mar hacia el centro, con la luz dorada. Reemplaza el fondo actual.
2. **Calle con vida.** Plano fijo a la altura de una persona en una esquina del centro: tránsito, peatones, semáforos. Sin personajes identificables o con personajes del staff.
3. **Noche y neón.** Travelling lateral por una avenida mojada de noche: el tono «tinta y bronce» del sitio.

### Mundo I · Roleplay (prioridad 2)

1. Hospital o comisaría por fuera, de día. Son zonas seguras de la normativa (Cap. VI).
2. Taller mecánico con un auto en el elevador. Solo si la facción de mecánicos funciona.
3. Persecución corta filmada desde un helicóptero, con personajes del staff y acordada antes.
4. Escena de rol con `/me` y `/do` en un mostrador, con los textos legibles. Muestra el «rol serio».

### Sistemas (solo los confirmados)

Grabar cada sistema **recién cuando su estado en `_data/sistemas.yml` pase a `disponible`**: empleos, facciones, economía, vehículos, propiedades, comunicación, emergencias, rol ilegal, eventos y soporte. Un corto de 10 a 20 s por sistema.

### Mundos II a IV

**No grabar** hasta que existan en el servidor. Mientras tanto siguen las ilustraciones conceptuales, rotuladas como tales.

## Cómo subir el material

1. Exportar con las especificaciones de la tabla.
2. Guardar en `assets/video/` (portada: `portada.mp4`, `portada.webm`, `portada-poster.avif` y `.webp`).
3. Anotar cada pieza en `docs/REGISTRO_ASSETS.md`.
4. Activar el video de portada en `_data/sitio.yml` (`portada.video`).
5. Compilar y correr `tests/verificar.mjs` antes de publicar.
