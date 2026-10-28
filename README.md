# elysiumesrp.com

Sitio oficial de **Elysium | ES — Sin fronteras**, comunidad de rol hispanohablante en FiveM.

## Cómo se publica

- El sitio se aloja en **GitHub Pages** y se publica desde la rama `main` (dominio en `CNAME`).
- En cada push a `main`, GitHub compila el sitio con **Jekyll** (el workflow automático «pages build and deployment») y lo publica en uno o dos minutos.
- La acción **«Estado del servidor»** (`.github/workflows/estado-servidor.yml`) consulta el servidor desde GitHub y actualiza `estado.json`. Necesita el secreto `FIVEM_ENDPOINT` para la consulta directa (ver `docs/SEGURIDAD_ESTADO.md`).
- No hace falta instalar nada para publicar: se puede editar desde la web de GitHub.

## Qué editar para cada cosa

| Quiero… | Archivo |
|---|---|
| Cambiar la etapa que se anuncia (reapertura, abierto, mantenimiento) | `_data/sitio.yml` → `etapa` |
| Confirmar el acceso público o el código de conexión | `_data/sitio.yml` → `acceso` (`publico`, `codigo_confirmado`, `codigo`). El workflow lee el mismo código |
| Cambiar el enlace de Discord, la tienda o las redes | `_data/sitio.yml` → `enlaces` y `redes` |
| Editar los mundos | `_data/mundos.yml` |
| Editar los sistemas y su estado | `_data/sistemas.yml` |
| Publicar una novedad | Crear `_posts/AAAA-MM-DD-titulo-corto.md` (ver abajo) |
| Agregar imágenes a la galería | `_data/galeria.yml` |
| Mostrar creadores de contenido | `_data/creadores.yml` (solo con autorización) |
| Video de fondo de la portada (material propio) | `_data/sitio.yml` → `portada` |
| Insertar un video propio bajo demanda | `{% include video.html … %}` (ver `_includes/video.html`) |
| Editar la normativa | `_includes/normativa.html` (y los títulos en `_data/normativa.yml`) |
| Cambiar el menú | `_data/navegacion.yml` |
| Colores, tipografías y componentes | `assets/css/elysium.css` |
| Comportamiento (menú, estado, filtros, buscador) | `assets/js/elysium.js` |
| Aviso de cookies | `cookies.js` |

### Publicar una novedad

Crear un archivo en `_posts/` con este formato (la fecha del nombre es la fecha real de publicación):

```markdown
---
title: "Título de la novedad"
categoria: anuncios        # anuncios | servidor | eventos | actualizaciones | sitio
resumen: "Una o dos líneas para la tarjeta y el boletín."
---

Texto de la novedad en Markdown.
```

Aparece sola en la portada, en `/novedades/`, en el boletín y en el canal RSS (`/feed.xml`), con su propia página en `/novedades/titulo-corto/`.

## Ver el sitio en tu computadora

Requiere Ruby 3.x.

```bash
bundle install
bundle exec jekyll serve
# abrir http://127.0.0.1:4000
```

## Pruebas

`tests/verificar.mjs` revisa el sitio compilado con Playwright: las páginas en 1440, 768 y 390 px, errores de consola, peticiones a terceros, enlaces y anclas, aviso de cookies, estado del servidor, menú, formularios y accesibilidad básica.

```bash
bundle exec jekyll build -d _site
python3 -m http.server 4000 --directory _site --bind 127.0.0.1 &
node tests/verificar.mjs http://127.0.0.1:4000 tests/capturas
```

Para probar cómo se verá el sitio cuando se confirmen el acceso y el código de conexión (y un video de portada), sin tocar el repositorio:

```bash
bash tests/variante-acceso.sh /tmp/variante
python3 -m http.server 4001 --directory /tmp/variante --bind 127.0.0.1 &
node tests/verificar-variante.mjs http://127.0.0.1:4001
```

## Estructura

```
_config.yml            configuración de Jekyll y archivos que no se publican
_data/                 textos y datos editables
_includes/             piezas compartidas (cabecera, pie, estado, normativa…)
_layouts/              plantillas: base, página, legal y novedad
_posts/                novedades
assets/css|js|fonts|img recursos del sitio (fuentes alojadas en el propio sitio)
index.html …           páginas
cookies.js             aviso de cookies y carga condicionada de Google Analytics
estado.json            lo escribe la acción «Estado del servidor»
docs/, legal/          documentación interna (no se publica)
tools/                 imágenes optimizadas y búsqueda de secretos en el historial
version.json           commit publicado (para comprobar el despliegue sin caché)
tests/                 pruebas automáticas
```

## Documentación de la renovación

- `CAMBIOS_WEB.md`: qué cambió en cada etapa, cómo se probó y cómo volver atrás.
- `DECISIONES_PENDIENTES_WEB.md`: lo que necesita una decisión del dueño, con recomendaciones.
- `LEGAL_DATA_REQUIRED.md`: cuestionario único para el propietario y verificaciones pendientes.
- `docs/AUDITORIA_WEB_100.md`: auditoría de la publicación y matriz funcional.
- `docs/AUDITORIA_LEGAL.md`: privacidad, cookies, términos, tienda y enlaces legales.
- `docs/REGISTRO_ASSETS.md`: autoría y licencia de cada recurso.
- `docs/LIMPIEZA_HISTORIAL.md`: datos sensibles en el historial y cómo tratarlos.
- `docs/`: además, seguridad del estado, foro, tienda y guion de videos.
