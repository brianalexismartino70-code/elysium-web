# Dirección de arte pendiente — personajes 3D ilustrados

- **Fecha:** 28/10/2026.
- **Estado:** pendiente. Esta sesión no tenía una herramienta de generación de imágenes ni una GPU para correr un modelo abierto, así que no se produjo arte con personajes.
- **Qué hay hoy:** la portada usa una escena 3D renderizada con Blender, desenfocada detrás de la tipografía, y los mundos y las novedades usan ilustraciones generadas por código. Todo está rotulado como ilustración conceptual.

## Cómo sumar el arte cuando exista

1. **Encargarlo o generarlo** con una herramienta cuyas condiciones permitan el uso comercial. Guardá esas condiciones y los archivos originales.
2. **Exportar la portada** en 2560 × 1440 (16:9) y en una versión móvil de 1080 × 1350 (4:5). El tercio izquierdo tiene que quedar despejado para el título.
3. **Copiarla** en `assets/img/portada/` y completar en `_data/sitio.yml` los campos `portada.arte_escritorio` y `portada.arte_movil`. La portada la usa sin tocar el código.
4. **Registrarla** en `docs/REGISTRO_ASSETS.md`, con autoría, herramienta y licencia.

## Propuesta original para el arte de portada

**Escena:** noche de emergencia en una avenida de la ciudad. Una protagonista civil, adulta, cruza en primer plano con una linterna, guiando a dos aliados (un paramédico y una mecánica) entre autos detenidos con las balizas encendidas. Al fondo, entre la bruma, se adivina una amenaza lejana.

**Estilo:**

- iluminación de tres puntos;
- contraluz bronce y relleno frío verde laurel;
- acabado pictórico sobre volúmenes 3D;
- rostros y anatomía creíbles;
- ropa con texturas.

**Prohibido:**

- reproducir personajes, poses, composiciones o pantallas de carga de GTAHUB o de Rockstar Games, incluida la imagen de cinco personajes corriendo de zombis;
- usar logotipos de terceros;
- usar capturas de otros servidores.

## Variantes que hacen falta

| Uso | Tamaño | Nota |
|---|---|---|
| Portada de escritorio | 2560 × 1440 | Título a la izquierda |
| Portada móvil | 1080 × 1350 | Reencuadre, sin deformar |
| Mundos I a IV | 1600 × 900 cada uno | Misma técnica, una atmósfera por mundo: ciudad, cuarentena, PvP y arena |
| Novedades | 1200 × 630 | Una por categoría |
| Redes | 1200 × 630, 1080 × 1080 y 1080 × 1920 | Sin texto incrustado |
| Halloween | Portada estacional, una escena urbana nocturna, una de investigación paranormal y versiones para historias | Sin gore; rotuladas como conceptuales |

La decoración de Halloween del sitio (luna, niebla y brasas) ya existe y se activa por fechas desde `_data/sitio.yml` (`temporada`).

## Paquete para producir el arte (28/10/2026)

El lenguaje buscado son los personajes 3D estilizados con acabado de ilustración digital, como en el arte promocional de un videojuego de mundo abierto. Las escenas, los personajes y las composiciones de abajo son propias de Elysium | ES.

**No se usa como referencia ni como imagen de entrada:**

- la imagen de GTAHUB con cinco personajes y zombis;
- pantallas de carga de GTA V;
- personajes, logotipos ni rostros reales.

Las indicaciones están en inglés porque las herramientas suelen responder mejor así. Generá varias opciones, elegí una y retocá rostros y manos.

**Base común** (se suma a cada indicación):
`stylized 3D render with painterly digital illustration finish, AAA open-world video game promotional key art, original adult characters, defined faces, detailed hair, fabric and accessories, strong rim lighting, dramatic cinematic shading, atmospheric depth, high detail, 16:9`

**Lo que se excluye:**
`text, logos, watermark, existing game or movie characters, celebrity likeness, gore, extra fingers, distorted faces, flat silhouettes`

| Imagen | Indicación (en inglés) | Notas |
|---|---|---|
| **Portada** | `night emergency on a rain-slick downtown avenue; a determined woman in a bronze utility jacket strides forward with a flashlight (focal point, right of center); beside her a paramedic carrying a medical bag and a mechanic gripping a wrench; stalled cars with flashing light bars, fog, wet reflections, skyscrapers fading into haze, a distant infected crowd far in the background; deep ink-black night with laurel-green and bronze accents; empty dark space on the left third for a large title` | La protagonista a la derecha del centro y el tercio izquierdo libre para el título |
| **Portada de Halloween** | `Halloween night in an old city square; a paranormal investigator with a glowing EMF reader, a firefighter raising a lantern and a hacker with a tablet lighting her face explore stone steps with carved pumpkins; full moon behind a gothic bell tower, low fog, eerie green and warm orange light, shadowy figures between the trees` | Sin gore. Otra historia y otra composición que la de GTAHUB |
| **Mundo I · Roleplay** | `golden-hour downtown street full of everyday life: a taxi driver leaning on his car, a lawyer crossing with a briefcase, a street musician; cafés, traffic and modern architecture` | Ciudad y vida civil |
| **Mundo II · Cuarentena** | `abandoned quarantine checkpoint: two survivors, a scavenger with a backpack and a medic in a gas mask, move carefully past tents and chain-link fences; infected shapes behind the fence in green floodlit fog` | Rotular como conceptual |
| **Mundo III · PvP** | `nighttime container-port arena: two rival crews in unbranded tactical gear face off under crossing spotlights, sparks and smoke, dynamic poses` | En desarrollo: rotular como conceptual |
| **Mundo IV · Arena** | `futuristic colosseum of marble and bronze: modern armored competitors enter under a central beam of light, crowd lights in tiered stands` | Proyecto futuro: rotular como conceptual |

**Formatos y entrega:**

- **Original:** la mayor resolución que dé la herramienta, guardado sin pérdida (PNG). El tamaño mínimo de la portada es 2560 × 1440.
- **Reencuadres:** el móvil (1080 × 1350), las novedades (1200 × 630) y las redes (1080 × 1080 y 1080 × 1920) se recortan de ese original, sin estirarlo y sin cortar rostros.
- **Para la web:** WebP o AVIF en las rutas de la tabla «Variantes que hacen falta».

**Licencia (antes de publicar):**

1. Confirmá que las condiciones de la herramienta o el contrato con el artista permiten el uso comercial. Guardá una copia de esas condiciones.
2. Anotá en `docs/REGISTRO_ASSETS.md` la herramienta, la fecha, quién la generó y la indicación usada.
3. En el sitio, rotulá cada imagen como «Ilustración conceptual», nunca como captura del servidor.

**Cómo integrarlo:**

- **Portada:** completá `portada.arte_escritorio` y `portada.arte_movil` en `_data/sitio.yml`.
- **Mundos:** reemplazá `assets/img/mundos/mundo-N-{480,960,1600}.webp`.
- **Novedades:** reemplazá `assets/img/novedades/novedad-*-{600,1200}.webp`.

No hace falta tocar el código. Después hay que correr `tests/verificar.mjs` y publicar.

