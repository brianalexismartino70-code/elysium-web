# Renovación de elysiumesrp.com — registro de cambios

- **Fecha:** 27/10/2026
- **Rama de trabajo:** `claude/nice-ritchie-njorw8`
- **Punto de partida:** `main` en `af3b7da` («Estado: 1 jugadores»), la versión publicada en ese momento según el último despliegue de GitHub Pages.

## Qué cambió

### Base técnica
- El sitio pasó de tres HTML con estilos y scripts duplicados a **Jekyll**, que GitHub Pages ya ejecutaba en cada publicación. No hace falta instalar nada para publicar.
- Plantillas compartidas (`_layouts/`, `_includes/`): una sola cabecera, un solo pie y un solo menú para todo el sitio.
- Sistema de diseño en `assets/css/elysium.css` con la paleta tomada del sitio publicado (tinta `#0B0F0D`, laurel `#2B3B32`, bronce `#B98F52`, mármol `#ECE7DC`, gris `#94A09A`) y Marcellus, Marcellus SC y Jost. Se sumó un verdín (`#7FA393`) para los estados «en pruebas».
- Comportamiento en `assets/js/elysium.js`, sin dependencias externas.
- Textos editables en `_data/` y novedades en `_posts/`.
- Se desactivó explícitamente el tema por defecto de GitHub Pages (`theme: null`).

### Portada (`index.html`)
Se conservaron la portada con su imagen, el título animado, el lema, el selector de mundos, los cuatro pilares, los tres pasos, el mosaico, el buscador de normativa, la barra de lectura y el botón para volver arriba. Se sumaron:
- placa de estado con la fase del proyecto y el dato en vivo;
- boletín con titulares reales y botón de pausa;
- recorrido por diez sistemas de rol con filtros, íconos propios y la fuente de cada punto;
- novedades, comunidad, galería con créditos, preguntas frecuentes y cierre según la fase.

### Páginas nuevas
`novedades/` (con página propia por publicación y RSS), `como-entrar.html`, `normativa.html`, `comunidad.html`, `tienda.html`, `privacidad.html`, `cookies.html`, `moderacion.html`, `condiciones-tienda.html`, `aviso-legal.html` y `404.html`.

### Páginas existentes
- `staff.html`: mismo examen; ahora el resultado se descarga o se copia para adjuntarlo en un ticket (el envío por webhook nunca estuvo conectado).
- `terminos.html`: términos de uso reorganizados. Los enlaces antiguos a `terminos.html#p5`, `#s2`, etc. redirigen a la sección nueva correspondiente.
- `cookies.js`: mismo aviso, ahora con «Rechazar», «Configurar» y «Aceptar» del mismo peso, bloqueo real de Analytics al retirar el consentimiento y migración de la elección guardada.

### Seguridad y privacidad
- Se quitaron del código público la IP y el puerto del servidor y las consultas a dos proxies de terceros (`api.allorigins.win`, `api.codetabs.com`). Detalle en `docs/SEGURIDAD_ESTADO.md`.
- El workflow de estado toma la dirección de un secreto opcional (`FIVEM_ENDPOINT`) y la enmascara en los registros.
- Las tipografías se sirven desde el sitio: ya no hay consultas a Google Fonts.
- Los MP3 sin licencia verificada dejaron de publicarse (siguen en el repositorio).

### Contenido corregido por no estar verificado
- «La ciudad ya está abierta» → el servidor se anuncia en **preapertura, solo staff** (verificado el 27/10/2026).
- Cuarentena «Abierto» → **En pruebas**.
- «Nada de pay-to-win» y la descripción de beneficios de la tienda → retirados hasta que se confirme la política.
- Cuatro imágenes de procedencia no verificada dejaron de presentarse como «archivos de la ciudad».
- Titulares del boletín sin fecha ni fuente → reemplazados por novedades reales.

### Rendimiento, accesibilidad y SEO
- Imagen de portada: de un PNG de 4,2 MB a AVIF/WebP de 32–136 KB según el ancho de pantalla (script en `tools/optimizar_imagenes.py`).
- Open Graph con URL absolutas e imagen de 1200×630, `canonical`, datos estructurados, `sitemap.xml`, `robots.txt`, `feed.xml`, favicons y manifiesto.
- Foco visible, enlace para saltar al contenido, menú con gestión de foco, pestañas y filtros accesibles, contrastes AA, `prefers-reduced-motion` y funcionamiento sin JavaScript.

## Pruebas realizadas (en local, sobre el sitio compilado)

| Prueba | Resultado |
|---|---|
| Compilación con `github-pages` 232 (Jekyll 3.10.0, la misma de GitHub Pages) | Sin errores |
| `tests/verificar.mjs`: 15 páginas en 1440, 768 y 390 px; consola; peticiones a terceros; enlaces y anclas; cookies; estado del servidor; mundos; filtros; visor; buscador; anclas antiguas; menú y teclado; formulario de staff; reproductor bajo demanda; sin JavaScript; menos movimiento | **489 de 489** comprobaciones correctas |
| html-validate (reglas recomendadas) en todas las páginas | Sin errores |
| axe-core (WCAG 2.1 A/AA y buenas prácticas) en las 15 páginas, 1440 y 390 px | 0 problemas |
| Lighthouse, portada, escritorio | Rendimiento 100 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 |
| Lighthouse, portada, móvil (simulado) | 93 · 100 · 100 · 100 |

Las pruebas se hicieron con un servidor local sin compresión. No equivalen a una prueba en producción: después de publicar hay que revisar el sitio real (ver abajo).

## Lo que no se tocó

`CNAME`, DNS, secretos del repositorio, `estado.json` (lo escribe la acción), la tienda de Tebex, precios y productos, y los archivos originales de imagen y audio.

## Publicación

GitHub Pages publica la rama `main`. La renovación se integra en `main` con un commit de fusión, de modo que toda la renovación se puede revertir de una sola vez.

### Cómo volver a la versión anterior

1. Buscar el commit de fusión de la renovación en `main` («Publicar la renovación del sitio»).
2. Revertirlo: `git revert -m 1 <hash-del-merge>` y hacer push a `main`. GitHub Pages vuelve a publicar la versión anterior en uno o dos minutos.
3. Alternativa: crear una rama desde `af3b7da` para consultar el sitio anterior.

### Revisión después de publicar

- Abrir elysiumesrp.com en el celular y en la computadora, con la caché vacía.
- Comprobar la portada, el aviso de cookies, el menú, la normativa y un enlace antiguo (`/terminos.html#p5`).
- Crear el secreto `FIVEM_ENDPOINT` y ejecutar la acción «Estado del servidor» para que el indicador vuelva a mostrar datos.
