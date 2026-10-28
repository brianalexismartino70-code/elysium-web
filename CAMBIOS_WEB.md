# Renovación de elysiumesrp.com — registro de cambios

Etapas:

- **Segunda etapa (28/10/2026):** correcciones verificadas, listas para publicar, y evolución visual V2 en la rama, sin publicar. Ver abajo.
- **Primera etapa (27/10/2026):** renovación integrada con el merge `1cf243e`. Ver «Primera etapa».

## Segunda etapa — 28/10/2026

- **Rama:** `claude/nice-ritchie-njorw8`, reiniciada desde `main` en `c4d515b`.
- **Informe completo:** `docs/AUDITORIA_WEB_100.md`.

### Fase 1: correcciones verificadas (listas para publicar en `main`)

**Estado de la publicación:**

- Las correcciones están completas en la rama hasta el commit `ae29cfd`.
- Desde este entorno se preparó el merge a `main`, pero **el envío a `main` quedó pendiente de tu autorización**: el sistema de permisos lo bloqueó por ser un despliegue a producción.
- Mientras tanto, lo publicado sigue siendo `c4d515b`.
- Las formas de publicar están en el informe final.

| Cambio | Por qué |
|---|---|
| `_data/sitio.yml` como única fuente: `etapa: reapertura`, más un bloque `acceso` (`publico`, `codigo_confirmado`) | Decidiste anunciar la reapertura. El acceso público y el código `kr546a` (404 en Cfx.re) no están verificados, así que se informan por separado |
| Sin comando ni botón «Abrir en FiveM» mientras el código no esté confirmado | No mostrar un código que podría no funcionar |
| Mundos: I en reapertura; II «Por confirmar»; II a IV sin fecha | Quitar estados sin verificar |
| Fuera «Construida sobre QBox… más FPS», «Infraestructura propia, economía cuidada» y los países como hecho actual; los sistemas, como lo que contempla la normativa | Afirmaciones sin verificar |
| Publicación del 27/10: título nuevo y corrección fechada, misma dirección | La etapa ya no es «preapertura» |
| Estado: campo `disponible`; «Estado en vivo no disponible» sin fuente fiable; sin cifras inventadas (adiós al tope de 64); dato renovado cada 6 h | Indicador fiable |
| 19 archivos retirados del repositorio: 7 MP3 comerciales, 4 imágenes descargadas, 4 imágenes viejas de mundos y 4 recursos de Rockstar u origen dudoso | Seguían publicados aunque no se usaran |
| `version.json`, meta `elysium-version` y versión en el pie | Comprobar el despliegue sin depender de cachés |
| Privacidad y moderación: plazo de «30 días» reemplazado por «los plazos que fija la ley aplicable»; promesa de seguridad y cláusulas de los términos marcadas como pendientes; cookies «En revisión» | Riesgos legales, sin cambiar condiciones comerciales |
| Documentos: auditoría web y legal, registro de assets, limpieza del historial, cuestionario único, guion de videos y foro | Entregables de la etapa |

**Pruebas de la fase 1** (sitio compilado con `github-pages` 232):

| Prueba | Resultado |
|---|---|
| `tests/verificar.mjs`: 17 páginas en 3 anchos, 9 casos del indicador de estado, textos y archivos retirados, RSS, rutas legales y enlaces externos | **699 de 699** |
| html-validate | 17 páginas sin errores |
| axe-core (WCAG 2.1 AA) a 1440 y 390 px | 0 problemas |

### Fase 2: evolución visual V2 (en la rama, sin publicar)

| Mejora | Detalle |
|---|---|
| Portada cinematográfica | Telón que se abre con un hilo de bronce (solo en pantallas grandes), acercamiento lento de la imagen, polvo dorado ambiental con botón «Pausar animación» y un brillo que cruza el título |
| Video de portada opcional | Configurable en `_data/sitio.yml` (`portada`), **solo con material propio**. Nunca se descarga en pantallas chicas, con ahorro de datos ni con «menos movimiento» |
| Acceso rápido | Barra fija con «Cómo entrar» (o «Entrar» cuando el acceso esté confirmado) y Discord. Aparece al bajar, se retira en el cierre y el pie, no tapa el aviso de cookies y no aparece en el examen de staff |
| Selector de mundos V2 | Miniatura en cada pestaña, transición de cortina y un tratamiento propio por estado: luz cálida (reapertura), imagen apagada con borde punteado (por confirmar), retícula de plano (desarrollo) y trama de boceto (diseño) |
| Profundidad al desplazar | Numerales romanos de fondo que se mueven más lento que el contenido y líneas de bronce que se dibujan al entrar cada escena |
| Sistemas | Detalle desplegable y accesible («Ver lo que dice la normativa»). Sin JavaScript, el detalle queda a la vista |
| Visor de la galería | Miniaturas, deslizamiento táctil, anuncio del cambio para lectores de pantalla, precarga de vecinas y fondo inerte |
| Novedades | Portada propia por categoría (arte en CSS, sin fotos de terceros), con fecha y marca «Corregida» |
| Comunidad | «Temas de la comunidad» (anuncios, novedades, guías, soporte, bugs y sugerencias) con destinos reales; nota sobre el foro, sin simularlo; propuesta de programa de creadores rotulada como pendiente |
| Guía para entrar | Indicador de pasos fijo que avanza con la lectura y un cierre «Listo para entrar» |
| Videos propios | Componente `_includes/video.html`: póster y descarga solo al apretar reproducir, rotulado como captura o como pieza conceptual |

**Pruebas de la V2** (local, `github-pages` 232):

| Prueba | Resultado |
|---|---|
| `tests/verificar.mjs` (secciones 1 a 13) | **753 de 753** |
| `tests/verificar-variante.mjs` (acceso confirmado y video de portada) | **10 de 10** |
| html-validate | 17 páginas sin errores |
| axe-core en las 17 páginas a 1440 y 390 px, más acceso rápido visible, sistemas abiertos, visor abierto y guía con pasos | 0 problemas |
| Lighthouse, solo como referencia (servidor local sin compresión) | Escritorio 99 · 100 · 100 · 100. Móvil 89–91 · 100 · 100 · 100, contra 90–93 de la fase 1 |

Con la compresión que usa GitHub Pages, la V2 suma unos 7 KB: CSS +3,5 KB, JS +2,4 KB, HTML +1,4 KB.

## Primera etapa — 27/10/2026

- **Fecha:** 27/10/2026
- **Rama de trabajo:** `claude/nice-ritchie-njorw8`
- **Punto de partida:** `main` en `af3b7da` («Estado: 1 jugadores»), la versión publicada en ese momento según el último despliegue de GitHub Pages.

### Qué cambió

#### Base técnica
- El sitio pasó de tres HTML con estilos y scripts duplicados a **Jekyll**, que GitHub Pages ya ejecutaba en cada publicación. No hace falta instalar nada para publicar.
- Plantillas compartidas (`_layouts/`, `_includes/`): una sola cabecera, un solo pie y un solo menú para todo el sitio.
- Sistema de diseño en `assets/css/elysium.css` con la paleta tomada del sitio publicado (tinta `#0B0F0D`, laurel `#2B3B32`, bronce `#B98F52`, mármol `#ECE7DC`, gris `#94A09A`) y Marcellus, Marcellus SC y Jost. Se sumó un verdín (`#7FA393`) para los estados «en pruebas».
- Comportamiento en `assets/js/elysium.js`, sin dependencias externas.
- Textos editables en `_data/` y novedades en `_posts/`.
- Se desactivó explícitamente el tema por defecto de GitHub Pages (`theme: null`).

#### Portada (`index.html`)
Se conservaron la portada con su imagen, el título animado, el lema, el selector de mundos, los cuatro pilares, los tres pasos, el mosaico, el buscador de normativa, la barra de lectura y el botón para volver arriba. Se sumaron:
- placa de estado con la fase del proyecto y el dato en vivo;
- boletín con titulares reales y botón de pausa;
- recorrido por diez sistemas de rol con filtros, íconos propios y la fuente de cada punto;
- novedades, comunidad, galería con créditos, preguntas frecuentes y cierre según la fase.

#### Páginas nuevas
`novedades/` (con página propia por publicación y RSS), `como-entrar.html`, `normativa.html`, `comunidad.html`, `tienda.html`, `privacidad.html`, `cookies.html`, `moderacion.html`, `condiciones-tienda.html`, `aviso-legal.html` y `404.html`.

#### Páginas existentes
- `staff.html`: mismo examen; ahora el resultado se descarga o se copia para adjuntarlo en un ticket (el envío por webhook nunca estuvo conectado).
- `terminos.html`: términos de uso reorganizados. Los enlaces antiguos a `terminos.html#p5`, `#s2`, etc. redirigen a la sección nueva correspondiente.
- `cookies.js`: mismo aviso, ahora con «Rechazar», «Configurar» y «Aceptar» del mismo peso, bloqueo real de Analytics al retirar el consentimiento y migración de la elección guardada.

#### Seguridad y privacidad
- Se quitaron del código público la IP y el puerto del servidor y las consultas a dos proxies de terceros (`api.allorigins.win`, `api.codetabs.com`). Detalle en `docs/SEGURIDAD_ESTADO.md`.
- El workflow de estado toma la dirección de un secreto opcional (`FIVEM_ENDPOINT`) y la enmascara en los registros.
- Las tipografías se sirven desde el sitio: ya no hay consultas a Google Fonts.
- Los MP3 sin licencia verificada dejaron de publicarse (siguen en el repositorio).

#### Contenido corregido por no estar verificado
- «La ciudad ya está abierta» → el servidor se anuncia en **preapertura, solo staff** (verificado el 27/10/2026).
- Cuarentena «Abierto» → **En pruebas**.
- «Nada de pay-to-win» y la descripción de beneficios de la tienda → retirados hasta que se confirme la política.
- Cuatro imágenes de procedencia no verificada dejaron de presentarse como «archivos de la ciudad».
- Titulares del boletín sin fecha ni fuente → reemplazados por novedades reales.

#### Rendimiento, accesibilidad y SEO
- Imagen de portada: de un PNG de 4,2 MB a AVIF/WebP de 32–136 KB según el ancho de pantalla (script en `tools/optimizar_imagenes.py`).
- Open Graph con URL absolutas e imagen de 1200×630, `canonical`, datos estructurados, `sitemap.xml`, `robots.txt`, `feed.xml`, favicons y manifiesto.
- Foco visible, enlace para saltar al contenido, menú con gestión de foco, pestañas y filtros accesibles, contrastes AA, `prefers-reduced-motion` y funcionamiento sin JavaScript.

### Pruebas realizadas (en local, sobre el sitio compilado)

| Prueba | Resultado |
|---|---|
| Compilación con `github-pages` 232 (Jekyll 3.10.0, la misma de GitHub Pages) | Sin errores |
| `tests/verificar.mjs`: 15 páginas en 1440, 768 y 390 px; consola; peticiones a terceros; enlaces y anclas; cookies; estado del servidor; mundos; filtros; visor; buscador; anclas antiguas; menú y teclado; formulario de staff; reproductor bajo demanda; sin JavaScript; menos movimiento | **489 de 489** comprobaciones correctas |
| html-validate (reglas recomendadas) en todas las páginas | Sin errores |
| axe-core (WCAG 2.1 A/AA y buenas prácticas) en las 15 páginas, 1440 y 390 px | 0 problemas |
| Lighthouse, portada, escritorio | Rendimiento 100 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 |
| Lighthouse, portada, móvil (simulado) | 93 · 100 · 100 · 100 |

Las pruebas se hicieron con un servidor local sin compresión. No equivalen a una prueba en producción: después de publicar hay que revisar el sitio real (ver abajo).

### Lo que no se tocó

`CNAME`, DNS, secretos del repositorio, `estado.json` (lo escribe la acción), la tienda de Tebex, precios y productos, y los archivos originales de imagen y audio.

### Publicación

GitHub Pages publica la rama `main`. La renovación se integró en `main` el 27/10/2026 con el commit de fusión **`1cf243e`** («Publicar la renovación del sitio»), sobre `c94fbe9` (último commit del bot de estado). Así, toda la renovación se puede revertir de una sola vez.

#### Cómo volver a la versión anterior

1. Revertir la fusión: `git revert -m 1 1cf243e` y hacer push a `main`. GitHub Pages vuelve a publicar la versión anterior en uno o dos minutos. Los commits posteriores del bot de estado no interfieren: solo tocan `estado.json`.
2. Para consultar el sitio anterior sin publicarlo: `git checkout c94fbe9` (o crear una rama desde ese commit).

#### Revisión después de publicar

- Abrir elysiumesrp.com en el celular y en la computadora, con la caché vacía.
- Comprobar la portada, el aviso de cookies, el menú, la normativa y un enlace antiguo (`/terminos.html#p5`).
- Crear el secreto `FIVEM_ENDPOINT` y ejecutar la acción «Estado del servidor» para que el indicador vuelva a mostrar datos.
