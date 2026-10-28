# Auditoría completa de la web — Elysium | ES (etapa 2)

- **Fecha:** 28/10/2026.
- **Rama:** `claude/nice-ritchie-njorw8`, creada desde `main` en `c4d515b`.
- **Complementos:** [`AUDITORIA_LEGAL.md`](AUDITORIA_LEGAL.md), [`REGISTRO_ASSETS.md`](REGISTRO_ASSETS.md), [`LIMPIEZA_HISTORIAL.md`](LIMPIEZA_HISTORIAL.md), [`SEGURIDAD_ESTADO.md`](SEGURIDAD_ESTADO.md), [`FORO_EVALUACION.md`](FORO_EVALUACION.md) y el cuestionario [`../LEGAL_DATA_REQUIRED.md`](../LEGAL_DATA_REQUIRED.md).

## 0. Cómo leer la evidencia

| Marca | Significa |
|---|---|
| **[Código]** | Verificado en el repositorio, en el sitio compilado con la misma versión de Jekyll que GitHub Pages o en las pruebas automáticas en navegador |
| **[API]** | Verificado con la API de GitHub: despliegues, ejecuciones de Actions y sus registros |
| **[Tu mensaje]** | Lo afirmaste vos. No lo pude comprobar |
| **[Secundaria]** | Resultado de búsqueda web de terceros. No es el sitio original |
| **[Hipótesis]** | Inferencia sin verificar |
| **[No revisado]** | El sitio no se pudo abrir: el proxy del entorno rechaza el dominio (403) |

**Dominios que no se pudieron abrir** (probados el 28/10/2026, dos veces):

- `elysiumesrp.com` y `www.elysiumesrp.com`;
- `gtahub.gg` y sus rutas `/news`, `/shop` y `/creator`, `news.gtahub.gg` y `foro.gtahub.gg`;
- `www.argentina.gob.ar`, `servicios.infoleg.gob.ar` y `www.boletinoficial.gob.ar`;
- `docs.fivem.net`, `portal.cfx.re`, `servers-frontend.fivem.net` y `cfx.re`;
- `elysium-488.tebex.io`, `checkout.tebex.io` y `www.tebex.io`;
- `discord.com`;
- la dirección alternativa `brianalexismartino70-code.github.io`.

**No se intentó eludir el bloqueo.** Tampoco se usó GitHub Actions para descargar esos sitios: la acción de estado solo corrió en sus horarios normales.

## 1. P0 — Qué versión está publicada

### Verificado

| Control | Resultado | Evidencia |
|---|---|---|
| Mecanismo de publicación | GitHub Pages «Deploy from a branch» sobre `main`, compilado con Jekyll (flujo `pages-build-deployment`) | [API] |
| Último despliegue antes de esta etapa | Ejecución 308, commit `c4d515b`, **éxito** el 27/10/2026 a las 23:26:17 UTC | [API] |
| Relación con `main` | `c4d515b` era la punta de `main`. Contiene el merge `1cf243e` y su registro `5135ff3` | [API] y [Código] |
| Dominio configurado | `CNAME` = `elysiumesrp.com`. La URL que informa el entorno de Pages empieza con `http://`: hay que revisar si «Enforce HTTPS» está activado | [Código] y [API] |
| Rutas generadas | Páginas: `/`, `/novedades/` y 3 publicaciones, `como-entrar`, `normativa`, `comunidad`, `tienda`, `staff`, `privacidad`, `cookies`, `terminos`, `moderacion`, `condiciones-tienda`, `aviso-legal` y `404`. Archivos: `feed.xml`, `sitemap.xml` (15 direcciones), `robots.txt`, `site.webmanifest`, `estado.json` y `version.json` (nuevo) | [Código], compilación local |
| Textos viejos en lo publicado | **0 apariciones** en la compilación de `c4d515b` de: «La ciudad ya está abierta», «grupos de hasta cinco», «Academia de cadetes», «abre postulaciones», «migración corporativa», «Economía estable», «Fronteras abiertas», «entrada libre», proxies y la IP | [Código] |
| Todas las páginas se abren directo | 17 de 17 responden 200 en 1440, 768 y 390 px, con sus enlaces y anclas | [Código], prueba 1 y 2 |

### No verificado

- **La respuesta real del dominio**, porque `elysiumesrp.com` está bloqueado.
- Lo que viste con una consulta externa coincide con el sitio **anterior** a `1cf243e` (por ejemplo, el boletín con «Academia de cadetes»). Como ninguno de esos textos existe en lo que se compiló y desplegó el 27/10, la explicación más probable es una **copia en caché** de la herramienta externa. **[Hipótesis]**
- Para descartarlo hay que mirar el dominio real.

### Cómo comprobarlo sin caché (dos minutos)

1. Abrí `https://elysiumesrp.com/version.json` en una ventana privada. Tiene que mostrar el commit de `main` que figura en `CAMBIOS_WEB.md`. El pie de cada página dice lo mismo: «Versión del sitio `xxxxxxx`».
2. Si ves algo viejo, revisá en GitHub, Settings → Pages, que el dominio sea `elysiumesrp.com`, que no haya errores de DNS y que «Enforce HTTPS» esté activado.
3. Los registros DNS del dominio raíz deben apuntar a las IP de GitHub Pages (`185.199.108.153`, `.109.153`, `.110.153` y `.111.153`), según la configuración habitual de GitHub. **[Hipótesis]**: no pude abrir `docs.github.com`.
4. Las cabeceras de la respuesta deben incluir `server: GitHub.com`.

Cuando habilites `elysiumesrp.com` en el entorno, hago esta verificación yo mismo.

### Código de conexión `kr546a` y acceso

| Fecha | Fuente | Resultado |
|---|---|---|
| 15/09/2026 | Registro de la acción de estado | API de Cfx.re: **404** | [API] |
| 27/10/2026, 19:26 UTC | Registro de la acción (consulta directa al servidor) | El servidor respondió: `Elysium \| ES · PREAPERTURA (solo STAFF)`, 1 de 48 plazas | [API] |
| 27/10/2026, 23:25 UTC | Registro de la acción | Cfx.re: **404**; sin secreto `FIVEM_ENDPOINT`, sin consulta directa | [API] |
| 28/10/2026, 02:07 UTC | Registro de la ejecución programada | Cfx.re: **404**; el secreto sigue sin configurar | [API] |

**Conclusión:** el código no está confirmado y el acceso público tampoco. El sitio anuncia la **reapertura** (tu decisión) y, por separado, informa «Acceso público: por confirmar». No muestra un comando que podría no funcionar. Para confirmar el código hay que entrar desde FiveM (F8 → `connect cfx.re/join/kr546a`) o abrir `cfx.re/join/kr546a`: Cuestionario, n.º 2 y 3.

## 2. P1 — Matriz funcional con GTAHUB como referencia

**Ninguna sección de GTAHUB se pudo revisar.** La columna de referencia indica en cada caso de dónde sale lo que se dice. Lo único que se usa como dato es lo que dijiste:

- «la web de GTAHUB posee espacios separados para novedades, creadores, tienda y foro»;
- las rutas `/`, `/shop`, `/news`, `/creator` y `foro.gtahub.gg/categories`.

**[Secundaria]:**

- [una ficha de Discord Bot List](https://discordbotlist.com/servers/gtahub) describe a GTAHUB como un servidor de rol en español con un Discord grande;
- [una página de preguntas frecuentes de LaPS4](https://www.laps4.com/preguntas-y-respuestas/que-es-gtahub) menciona que para registrarse hay que inscribirse en su foro.

No se copió código, texto, íconos, logos ni imágenes de GTAHUB.

En la columna «Prueba», «Prueba N» es la sección N de `tests/verificar.mjs`.

| # | Área | Referencia (GTAHUB) | Elysium hoy [Código] | Qué falta | Solución recomendada | Prioridad | Prueba |
|---|---|---|---|---|---|---|---|
| 1 | Navegación | **[No revisado]** [Hipótesis]: menú con accesos a servidor, novedades, tienda, creadores y foro | Barra fija con 8 secciones, menú móvil accesible con foco atrapado y fondo inerte, migas de pan en las páginas internas | Un acceso fijo a «Cómo entrar» siempre visible al desplazarse | Llamada a la acción fija que aparece al pasar la portada y se oculta en el pie (V2) | Media | Prueba 7 (menú y teclado) |
| 2 | Inicio y hero | **[No revisado]** [Hipótesis]: portada de impacto con llamada a jugar | Título animado, lema, placa de estado con etapa y acceso por separado, fondo con parallax suave | Transición de entrada más memorable y movimiento ambiental | Entrada en capas (velo, trazo de bronce, título), partículas de polvo dorado livianas en CSS, video de fondo opcional y bajo demanda (V2) | Media | Pruebas 4, 5 y 10 |
| 3 | Presentación del servidor y los mundos | **[No revisado]** | Selector de 4 mundos con pestañas accesibles e ilustraciones conceptuales rotuladas | Estados más diferenciados visualmente | Selector V2: tarjetas con número romano, estado propio de cada mundo (reapertura, por confirmar, desarrollo, diseño) y transición entre paneles | Media | Prueba 5 (mundos) |
| 4 | Sistemas de rol | **[No revisado]** [Hipótesis]: presentación de trabajos, facciones y economía | 10 sistemas con filtros por categoría y la fuente de cada punto en la normativa, todos «Por confirmar» | Detalle ampliable | Tarjetas V2 con «Ver detalle» desplegable y accesible. **No se presentan como disponibles** hasta confirmarlos | Media | Prueba 5 (filtros) |
| 5 | Estado del servidor | **[No revisado]** | Placa con etapa, acceso y estado en vivo desde `/estado.json`. Muestra «no disponible» cuando no hay fuente fiable | El secreto `FIVEM_ENDPOINT` o un código de Cfx.re válido | Configurar el secreto (pasos en `SEGURIDAD_ESTADO.md`) | **Alta** | Prueba 4 (9 casos) |
| 6 | Novedades | [Tu mensaje]: sección propia de noticias. **[No revisado]**: `/news` y `news.gtahub.gg` | Listado con filtros por categoría en la URL, página por publicación, RSS, boletín en la portada y nota de corrección fechada | Imágenes en las tarjetas | Portadas generadas por categoría (arte propio en SVG, sin fotos de terceros) y tarjeta destacada para la última publicación (V2). **No se inventan publicaciones** | Media | Pruebas 6 y 11 (RSS) |
| 7 | Tienda | [Tu mensaje]: sección propia de tienda. **[No revisado]**: `/shop` y `elysium-488.tebex.io` | Página previa que explica que la tienda es Tebex, sus condiciones y cómo reclamar | Contrastar productos y condiciones con Tebex | Cuando se habilite el dominio. **No se cambia nada comercial** | Alta (legal) | Prueba 12 (enlace a Tebex) |
| 8 | Creadores | [Tu mensaje]: sección propia. **[No revisado]**: `/creator` | Sección que muestra solo canales autorizados (hoy ninguno), con reproductores que cargan al apretar reproducir | Propuesta de cómo funcionaría | Bloque «Programa de creadores: propuesta pendiente», sin recompensas ni pagos (V2) | Media | Prueba 9 (reproductor) |
| 9 | Foro | [Tu mensaje]: foro propio. **[No revisado]**: `foro.gtahub.gg/categories`. [Secundaria]: el registro pasa por el foro | Bloque «en evaluación» en Comunidad | Decisión y destinos reales | **Comunidad**, no «foro activo»: temas (anuncios, novedades, guías, soporte, bugs y sugerencias) con destinos que existen hoy. Recomendación: canales de foro en Discord ([evaluación](FORO_EVALUACION.md)) | Media | Pruebas 2 y 12 |
| 10 | Incorporación (cómo entrar) | **[No revisado]** [Hipótesis]: guía de registro o whitelist | Guía de 4 pasos con requisitos y problemas frecuentes. Sin código confirmado, remite al Discord | Recorrido más atractivo | Pasos V2 con progreso visible y llamada a la acción final | Media | Prueba 1 y 5 |
| 11 | Normativa | **[No revisado]** | 11 capítulos y 31 artículos numerados con buscador sin tildes, resaltado, enlace por artículo y búsqueda desde la portada | — | Se mantiene | Baja | Pruebas 5 y 6 |
| 12 | Soporte | **[No revisado]** | Ticket en Discord, explicado en Normas de comunidad | Correo alternativo | Depende del cuestionario (n.º 7) | Media | — |
| 13 | Legal y cookies | **[No revisado]**. No se usan sus textos | 6 documentos en el pie, un solo aviso de cookies con efecto real, borradores rotulados | Datos del titular y revisión jurídica | Ver `AUDITORIA_LEGAL.md` | Alta | Pruebas 3 y 12 |
| 14 | Galería y multimedia | **[No revisado]** | Visor con teclado, contador y créditos. Arte de marca más 4 ilustraciones conceptuales | Miniaturas, gesto de deslizar y video | Visor V2 con tira de miniaturas, deslizamiento táctil y créditos. Video solo bajo demanda y con póster ([guion](GUION_VIDEOS.md)) | Media | Prueba 5 (galería) |
| 15 | Rendimiento | **[No revisado]** | Portada AVIF y WebP de 32 a 139 KB, fuentes propias, sin bibliotecas | Mantenerlo con V2 | Efectos solo en CSS y en el JS existente; video diferido | Alta | Lighthouse como referencia, no como prueba funcional |
| 16 | Accesibilidad | **[No revisado]** | axe sin problemas, html-validate sin errores, «menos movimiento», funciona sin JavaScript | Mantenerlo con V2 | Las animaciones nuevas respetan `prefers-reduced-motion` y el teclado | Alta | Prueba 10 y axe |
| 17 | SEO | **[No revisado]** | Canonical, Open Graph, JSON-LD, sitemap y RSS | — | Se mantiene | Baja | Prueba 1 |

## 3. Hallazgos por prioridad (orden de P8)

1. **Información pública incorrecta** (corregida en la rama y lista para publicar):
   - etapa «Reapertura» con el acceso por separado;
   - mundos y sistemas sin afirmaciones no verificadas;
   - fuera QBox, FPS, «economía cuidada» y la lista de países como hecho;
   - publicación del 27/10 corregida;
   - el indicador ya no muestra rojo ni cero sin datos.
2. **Despliegue y enlaces:**
   - `version.json` y el sello de versión en el pie para comprobar el despliegue sin caché;
   - todos los enlaces internos y anclas verificados;
   - 12 enlaces externos a destinos conocidos.
3. **Riesgos técnicos, datos expuestos y assets:**
   - **webhook de Discord válido en el historial** (urgente: eliminarlo);
   - dos IP en el historial y en registros viejos;
   - 19 archivos sin autorización retirados;
   - escena de GTA V en la portada, pendiente de confirmar.
4. **Legal:** ver el resumen de riesgos de `AUDITORIA_LEGAL.md`. Los críticos son las cláusulas de la tienda, la Disposición 954/2025, el titular sin identificar y los plazos de privacidad (ya corregidos).
5. **Riqueza visual:** la V2 queda en la rama, sin publicar (sección 4).
6. **Foro:** recomendación concreta en `FORO_EVALUACION.md`.

## 4. Evolución visual V2 (en la rama, sin publicar)

Qué se implementó de la matriz y cómo se probó. «Prueba 13» es la sección V2 de `tests/verificar.mjs`.

| Fila de la matriz | Implementado | Prueba |
|---|---|---|
| 1. Navegación | Acceso rápido fijo: guía y Discord, o «Entrar» cuando el acceso esté confirmado | 13 (aparece, se retira en el pie, no tapa el aviso de cookies, no está en staff, móvil) y variante |
| 2. Inicio y hero | Telón con hilo de bronce (escritorio), acercamiento, polvo dorado con pausa, brillo del título, video propio opcional bajo condiciones | 13 (telón, polvo, pausa y reanudar, sin video si no hay), 10 y 13 (menos movimiento y sin JS), variante (video solo en escritorio) |
| 3. Mundos | Miniaturas, cortina y un tratamiento visual por estado | 5 y 13 (estados, etiqueta en una línea, imagen distinta por estado, miniaturas) |
| 4. Sistemas | Detalle desplegable con teclado; visible sin JavaScript | 5 (filtros) y 13 (abrir, teclado, plegar, sin JS) |
| 6. Novedades | Portadas propias por categoría con la fecha; marca «Corregida» | 11 (RSS) y 13 (portadas) |
| 8. Creadores | Propuesta rotulada «pendiente», sin recompensas; componente de video propio bajo demanda | 9 y 13 (propuesta, video sin descarga previa) |
| 9. Foro y comunidad | Temas con destinos reales, nota honesta sobre el foro, ancla `#foro` conservada | 2 y 13 (destinos, sin «foro activo») |
| 10. Incorporación | Indicador de pasos que avanza y cierre «Listo para entrar» | 13 (paso actual, cierre sin conectar a un código sin confirmar) |
| 14. Galería | Miniaturas, deslizamiento, anuncio para lectores de pantalla, fondo inerte | 5 y 13 |
| 15 y 16. Rendimiento y accesibilidad | Efectos en CSS y en el JS existente, sin bibliotecas. Menos efectos en celulares. Todo respeta «menos movimiento» | axe: 0 problemas. html-validate: sin errores. Lighthouse solo como referencia (ver `CAMBIOS_WEB.md`) |

Resultado: **753 de 753** comprobaciones en `tests/verificar.mjs` y **10 de 10** en `tests/verificar-variante.mjs`.
