# Auditoría del feed Atom — `feed.xml`

- **Fecha:** 28/10/2026.
- **Qué se revisó:** el feed que genera `jekyll-feed` a partir de `_posts/`. Se compiló con la misma versión que usa GitHub Pages (`github-pages` 232).
- **Límite:** desde este entorno no se puede abrir `https://elysiumesrp.com/feed.xml`, porque el dominio está bloqueado. La versión publicada se reconstruyó compilando el mismo commit que sirve GitHub Pages (`c4d515b`).

## Problemas en la versión publicada (`c4d515b`)

| Problema | Causa | Corrección |
|---|---|---|
| «El Mundo I, en preapertura» decía que el servidor estaba en «PREAPERTURA (solo STAFF)» | Texto del 27/10/2026, anterior a la decisión de anunciar la reapertura | Título, resumen y contenido describen la reapertura actual. La fecha original se conserva y `last_modified_at` registra la actualización real. Una nota de corrección explica el cambio |
| Primer párrafo dentro de una tabla y asteriscos literales | La barra de «Elysium \| ES» dentro de un párrafo Markdown se interpretaba como una fila de tabla, y esa división dejaba sueltos los `*` del énfasis | En los cuerpos de las publicaciones, la barra se escribe `\|`. La prueba falla si aparece una tabla o Markdown literal |
| `<author><name></name></author>` vacío en cada entrada | El sitio no tenía `author` en `_config.yml` | `author: Elysium \| ES`, con la dirección del sitio |
| Resúmenes que no eran el resumen | `jekyll-feed` usa `description` o, si falta, el primer párrafo, y las publicaciones solo tenían `resumen` | Cada publicación tiene `description`, igual a `resumen`. La prueba verifica que coincidan |
| «Renovamos elysiumesrp.com» prometía la guía «con el comando listo para copiar» | El comando ya no se muestra mientras el código no esté confirmado | Texto corregido, con la actualización fechada |

«Google Analytics, solo con tu consentimiento» coincide con el código: Analytics no se descarga hasta aceptar, y la elección se cambia desde el pie. No se modificó.

## Lo que se conserva

- **Direcciones y fechas:** la dirección `/novedades/mundo-i-en-preapertura/` y el `id` de cada entrada no cambian, para no romper enlaces compartidos ni duplicar entradas en los lectores de feeds. Las fechas de publicación originales tampoco cambian.
- **Publicación de fechas futuras:** `future: false` en `_config.yml` evita que una publicación con fecha futura se publique antes de tiempo, porque GitHub Pages las permite por defecto.

## Prueba automática

`python3 tests/verificar_feed.py _site`, después de compilar. Revisa lo siguiente:

- que el XML sea válido y siga el formato Atom;
- autor, identificadores estables, enlaces a páginas que existen y fechas originales, coherentes y no futuras;
- que el resumen sea el de la publicación, sin tablas, Markdown literal ni secretos;
- una entrada por cada publicación vigente, sin borradores;
- que «preapertura» no aparezca en ningún texto público. Las direcciones URL se ignoran.

Resultados:

- **Versión publicada `c4d515b`:** 12 fallas de 45, las de la tabla.
- **Fase 1 corregida:** 46 de 46.

## Publicación

- **En `main`:** desde el commit `c94a47d` (28/10/2026). GitHub Pages lo desplegó sin errores (ejecución #309, 04:52 UTC).
- **Sin verificar en vivo:** el proxy de este entorno bloquea `elysiumesrp.com` (error 403). Para comprobarlo desde un navegador:
  1. Abrí `https://elysiumesrp.com/version.json?v=1` y confirmá que `commit` coincide con el último commit de `main`.
  2. Abrí `https://elysiumesrp.com/feed.xml?v=1`. Tienen que aparecer el título «El Mundo I vuelve: Elysium | ES está en reapertura» y `<name>Elysium | ES</name>`, y no tienen que aparecer `&lt;table` ni «PREAPERTURA».
  3. Si ves la versión anterior, esperá unos minutos y recargá: GitHub Pages guarda copias hasta 10 minutos.
- **«Google Analytics, solo con tu consentimiento»:** coincide con `cookies.js`. Analytics no se descarga antes de aceptar, y la elección se cambia desde el pie.
