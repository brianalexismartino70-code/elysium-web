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
