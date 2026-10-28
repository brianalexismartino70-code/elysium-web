# Registro de recursos (assets) — Elysium | ES

- **Última revisión:** 28/10/2026, sobre la rama `claude/nice-ritchie-njorw8`.
- **Método:** inspección de cada archivo del repositorio (metadatos XMP y C2PA, historial de Git, uso en el sitio) y revisión visual. No se pudo consultar ninguna fuente externa: los dominios de terceros están bloqueados en el entorno de trabajo.
- **Regla para sumar recursos:** solo material propio o con una licencia que se pueda demostrar. Cada recurso nuevo se agrega a esta tabla antes de publicarlo.

Estados posibles:

- **OK:** se puede usar con lo que se sabe.
- **Pendiente:** se usa, pero falta un dato del propietario.
- **Retirado:** ya no se publica.

## 1. Recursos que usa el sitio

| Recurso | Qué es y dónde se usa | Autoría y origen (verificado) | Licencia o permiso | Usos permitidos | Estado |
|---|---|---|---|---|---|
| `E2.png` → `assets/img/marca/*`, `favicon.ico`, `apple-touch-icon.png` | Logotipo «E» de Elysium (barra superior, favicons, ícono de la app) | Diseño hecho en **Canva** (metadatos XMP: `CreatorTool = Canva`, creado el 10/04/2026). El campo `pdf:Author` tiene el nombre de una persona | No documentada. Las condiciones de Canva limitan el uso de sus elementos gráficos como **marca registrada o logotipo** | Identidad del proyecto (sitio, redes) | **Pendiente:** confirmar quién lo diseñó, si usa elementos de la biblioteca de Canva y si se quiere registrar como marca |
| `ELYSIUM3.png` → `assets/img/portada/*` | Fondo de la portada (hero) | Composición hecha en Canva (XMP, 10/04/2026) sobre una escena de **Grand Theft Auto V**: calle de Los Santos, patrulleros, drones y un personaje que parece ser Franklin, protagonista de GTA V | Las imágenes y personajes de GTA V son propiedad de Rockstar Games / Take-Two. No hay licencia documentada | Hoy: fondo de la portada, con crédito «sobre imágenes de Grand Theft Auto V» | **Pendiente (prioritario):** confirmar si la escena es una **captura propia dentro del juego** o **arte oficial descargado**. Si es arte oficial, reemplazarla por una captura propia del servidor (ver `docs/GUION_VIDEOS.md`) |
| `ELYSIUM2.png` → `assets/img/og/elysium-og.jpg` | Vista previa al compartir en redes (Open Graph) | Misma composición que la portada, con el logotipo | Igual que la anterior | Vista previa en redes | **Pendiente (prioritario):** igual que la portada |
| `ELYSIUM.png` → `assets/img/galeria/*` | Primera pieza de la galería («Arte de Elysium») | Canva (XMP, 10/04/2026), logotipo sobre una calle de Los Santos con un auto deportivo rojo (escena de GTA V) | Igual que la anterior | Galería, con crédito | **Pendiente:** confirmar el origen de la escena |
| `mundo-1.svg` a `mundo-4.svg` | Ilustraciones de los cuatro mundos (selector y galería) | Subidas por la cuenta del propietario el 15/09/2026. Cada archivo trae un manifiesto **C2PA firmado por Anthropic**: «Claude provided this file at the request of a user and may have created or modified the file contents». Son ilustraciones vectoriales generadas con IA a pedido del proyecto | Contenido generado a pedido de la persona usuaria; sin elementos de terceros reconocibles en la revisión visual | Ilustración conceptual, siempre rotulada «Ilustración conceptual» | **OK.** No deben presentarse como capturas del juego. Las obras generadas con IA pueden tener una protección por derechos de autor limitada |
| `assets/img/iconos.svg` | Íconos de línea del sitio | Dibujados para este sitio en la renovación del 27/10/2026 (commit `c5cf948`) | Propios del proyecto | Todo el sitio | **OK** |
| Íconos `discord`, `tiktok`, `instagram`, `youtube`, `twitch`, `kick` dentro de `iconos.svg` | Enlaces a redes oficiales y plataformas | Versiones simplificadas de logotipos de terceros | Son marcas de sus dueños. Se usan solo para identificar el enlace (uso nominativo) | Enlazar a perfiles y canales | **OK**, con la condición de no alterarlos para sugerir patrocinio. Conviene revisar las guías de marca de cada plataforma |
| `assets/fonts/*.woff2` | Tipografías Marcellus, Marcellus SC y Jost | Paquetes de Fontsource, servidos desde el propio sitio | **SIL Open Font License 1.1**. Las licencias están junto a los archivos (`LICENSE-*.txt`) | Web, sin venderlas por separado | **OK** |
| `_includes/normativa.html` y textos de staff | Normativa oficial y examen de staff | Textos de la administración de Elysium, publicados antes de la renovación | Propios | Sitio y Discord | **OK** |
| Nombres «Grand Theft Auto V», «FiveM», «Cfx.re», «Rockstar Games» | Guía para entrar, aviso legal y preguntas frecuentes | Marcas de terceros | Uso nominativo: el aviso legal aclara que no hay afiliación | Explicar requisitos y enlazar a tiendas oficiales | **OK** |

### V2 (en la rama, sin publicar): ilustraciones generadas por código

Generadas el 28/10/2026 con `tools/arte/generar_arte.py`. El script dibuja todo desde cero con numpy y Pillow y da siempre el mismo resultado:

- no usa fotos, capturas, modelos de IA ni recursos de terceros;
- no tiene personajes, logotipos ni marcas.

En este entorno no había una herramienta de generación de imágenes por IA, ni una GPU para usar un modelo abierto. Por eso los mundos y las portadas de novedades son ilustraciones procedurales de estilo gráfico.

La portada se rehízo en 3D:

- una escena construida por código con `tools/arte/escena_hero.py`;
- renderizada con Blender 5.2 (módulo oficial `bpy`, GPL, instalado desde PyPI) y su motor Cycles en CPU;
- terminada con `tools/arte/postproceso_hero.py`.

Lo que produce Blender pertenece al proyecto. No se usaron modelos, texturas ni recursos de terceros.

| Recurso | Qué es y dónde se usa | Autoría y licencia | Estado |
|---|---|---|---|
| `assets/img/portada/hero-fondo-*`, `hero-frente-*` | Portada en dos capas: la ciudad al atardecer y, en primer plano, la terraza con columnas y balaustrada | Propias del proyecto: escena 3D renderizada en Blender | **OK.** Rotulada en la portada «Ilustración conceptual · no es una captura del servidor» |
| `assets/img/portada/hero-completa-1280.*` | Galería: «La terraza» | Igual | **OK** |
| `assets/img/mundos/mundo-1…4-*` | Selector de mundos y galería: avenida, cuarentena, patio de contenedores y coliseo | Igual | **OK.** Rotuladas «Ilustración conceptual». Reemplazan a `mundo-1…4.svg` |
| `assets/img/novedades/novedad-*` | Portadas de las tarjetas y de cada artículo | Recortes de las ilustraciones anteriores | **OK.** Rotuladas en el artículo |
| `assets/img/redes/elysium-og-1200x630.jpg`, `elysium-cuadrado-1080.jpg`, `elysium-vertical-1080x1920.jpg` | Vista previa al compartir y formatos para redes, sin texto incrustado | Recortes de la portada | **OK** |

**La V2 retira** las imágenes sobre escenas de GTA V (`assets/img/portada/elysium-portada-*`, `assets/img/og/elysium-og.jpg` y `assets/img/galeria/elysium-arte-*`) y `mundo-1…4.svg`. Mientras la V2 no se apruebe, la versión publicada (Fase 1) las sigue usando.

### Metadatos personales en archivos publicados

Los PNG originales de marca (`E.png`, `E2.png`, `ELYSIUM.png`, `ELYSIUM2.png` y `ELYSIUM3.png`) se publican en la raíz del sitio. Sus metadatos XMP incluyen:

- el nombre de la persona que los diseñó;
- identificadores de su cuenta de Canva.

Las versiones optimizadas que usa el sitio (`assets/img/…`) **no** tienen metadatos. Si esa persona no quiere que su nombre quede público, se pueden publicar los originales sin metadatos. Otra opción es dejarlos fuera de la publicación con `exclude` en `_config.yml`, porque el sitio no los usa directamente. **Decisión del propietario** (ver `LEGAL_DATA_REQUIRED.md`).

## 2. Recursos retirados de la publicación

Retirados del árbol del repositorio el 28/10/2026 (commit `0c486b7`). GitHub Pages deja de servirlos en cuanto ese cambio llega a `main`. **Siguen en el historial de Git** y en `raw.githubusercontent.com` para quien conozca un commit anterior. La limpieza del historial está en `docs/LIMPIEZA_HISTORIAL.md`.

| Archivo | Motivo | Uso en el sitio |
|---|---|---|
| `bad-bunny.mp3`, `ice-cube.mp3`, `jhay-co.mp3`, `omar-courtz.mp3`, `soy-favela.mp3`, `Inner_Light.mp3`, `Se_Me_Nota.mp3` | Canciones comerciales. Dos tienen etiquetas internas de descargas de YouTube. No hay licencia para difundirlas | Ninguno desde el 27/10/2026 |
| `4903967.webp`, `982-1-1024x576.webp`, `police-map-fivem-1536x848.webp`, `wp8853423.webp` | Nombres de imágenes descargadas de sitios web y fondos de pantalla. Muestran escenas de FiveM sin marca de Elysium: podrían ser de otros servidores | Ninguno desde el 27/10/2026 |
| `mundo1.webp`, `mundo2.webp`, `mundo3.webp`, `mundo4.webp` | Imágenes anteriores de los mundos, de origen no verificado. `mundo4.webp` muestra a Superman y Batman (DC Comics) | Ninguno |
| `logo-lspd.png` | Sello de la «City of Los Santos», elemento de GTA V (Rockstar), rehecho en Canva | Ninguno |
| `mapa-gta.jpg` | Mapa de GTA V (Rockstar) | Ninguno |
| `fondo-lspd.webp`, `cash-clean.png` | Origen no verificado (interior policial de FiveM y foto de billetes) | Ninguno |

Para recuperar uno: `git checkout c4d515b -- <archivo>`. Hacelo solo si conseguís una licencia, y anotala en esta tabla.

## 3. Sin recursos de audio

El sitio no reproduce música. El reproductor «Elysium FM» quedó preparado, pero vacío (`_data/radio.yml`, `pistas: []`). Para sumar pistas hace falta, por cada una:

- autoría y título;
- licencia que permita difundirla en la web (propia, Creative Commons compatible o comprada con derecho de difusión);
- enlace a la licencia.

## 4. Pendientes de autoría y licencias

1. Origen de la escena de GTA V en la portada y la vista previa. Si es arte oficial de Rockstar, reemplazarla.
2. Autoría del logotipo y uso de elementos de Canva, sobre todo si se quiere registrar la marca.
3. Metadatos con el nombre de una persona en los PNG originales.
4. Licencia escrita de cualquier captura, video o música que se sume en el futuro, con permiso de quienes aparezcan.
