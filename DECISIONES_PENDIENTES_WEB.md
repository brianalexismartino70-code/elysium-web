# Decisiones pendientes — sitio web de Elysium | ES

- **Última revisión:** 28/10/2026, segunda etapa y ampliación internacional.
- **Qué contiene:** cada punto dice qué se encontró, qué quedó hecho y qué hay que decidir, con una recomendación. Las preguntas concretas están **una sola vez**, numeradas, en [`LEGAL_DATA_REQUIRED.md`](LEGAL_DATA_REQUIRED.md). Acá se citan como «Cuestionario, n.º».
- **Criterio:** nada de esto bloquea el sitio. Donde había una afirmación pública sin verificar, se eligió la opción más prudente.

---

## 1. Etapa pública: Reapertura, y acceso verificado por separado

- **Decidido por vos:** el mensaje actual es **REAPERTURA**, porque el servidor ya estuvo abierto. «Preapertura» dejó de usarse como mensaje actual.
- **Verificado:**
  - el 27/10/2026 a las 19:26 UTC, el servidor se identificaba como `Elysium | ES · PREAPERTURA (solo STAFF)`, con 1 persona conectada y 48 plazas;
  - la API de Cfx.re respondió 404 para `kr546a` el 15/09 y el 27/10/2026.
- **Hecho:** `_data/sitio.yml` es la única fuente de verdad:
  - `etapa: reapertura` es lo que se anuncia: portada, placa de estado, pie, guía, preguntas frecuentes y cierre;
  - `acceso.publico` y `acceso.codigo_confirmado` guardan lo comprobado. Hoy los dos son `false`, así que el sitio dice «Acceso público: por confirmar» y no muestra el comando ni el botón «Abrir en FiveM».
- **Para cambiarlo** (Cuestionario, n.º 2 y 3):
  1. Comprobá que una persona sin rol de staff puede conectarse y que `cfx.re/join/<código>` lleva al servidor.
  2. Poné `codigo_confirmado: true` y, si corresponde, `publico: true`, con la fecha en `verificado`.
  3. Con ambos en `true`, la portada vuelve a mostrar «Entrar a la ciudad».
  4. `etapa: abierto` se usa cuando la reapertura termine.
  5. Publicá una novedad en `_posts/`.

## 2. Mundos

| Mundo | Antes en la web | Ahora |
|---|---|---|
| I | Rol · Abierto | **Roleplay · Reapertura**, acceso por confirmar |
| II | Cuarentena · Abierto, «ya recibe grupos de hasta cinco» | Cuarentena · **Por confirmar**, diseño previsto, sin fecha |
| III | PvP · En construcción | PvP · En desarrollo, proyecto posterior, sin fecha |
| IV | Arena · En diseño | Arena (nombre provisional) · En diseño, sin fecha |

- **Decidir:** el estado real de Cuarentena y si los detalles de diseño (hordas, pactos, Humane Labs, grupos de 1 a 5) siguen vigentes. Los textos están en `_data/mundos.yml`.

## 3. Sistemas, empleos, facciones y economía

- **Hecho:** los diez sistemas se presentan como **lo que contempla la normativa**, con el artículo de cada punto, y todos figuran «Por confirmar». Se quitaron del sitio «Construida sobre QBox… más FPS» y «Infraestructura propia, economía cuidada», porque no se pudieron verificar.
- **Decidir:** confirmar en el servidor qué funciona hoy y cambiar `estado` en `_data/sistemas.yml`. Si la base técnica es QBox con recursos ox y querés mostrarlo, confirmalo y se vuelve a publicar.

## 4. Seguridad: webhook en el historial — **urgente**

- **Encontrado (28/10/2026, con el historial completo):** entre el 16/04 y el 14/09/2026, `index.html` y `staff.html` tuvieron una **URL real de webhook de Discord**. La versión del 27/10 de este documento decía que el webhook «nunca se configuró»: eso describía solo la última versión del código y quedó corregido. Sigue legible en el historial público.
- **Decidir:** eliminar el webhook en Discord ya (Cuestionario, n.º 1). Si además querés reescribir el historial, ver el punto 12.

## 5. Postulación a staff

- **Hecho:** el examen no cambió. Al terminar, la persona descarga sus respuestas (o las copia) y las adjunta en un ticket. El sitio no envía nada.
- **Recomendación:** si se quiere envío automático, usar un bot de tickets con formularios o una función en servidor que guarde el secreto. Nunca un webhook en el HTML.

## 6. Tienda

- **Hecho:** no se cambiaron productos, precios, suscripciones, la configuración de Tebex ni las condiciones del 21/09/2026. No hay promesas de «sin pay-to-win».
- **Decidir:**
  - quién vende (Tebex Checkout o pasarelas propias);
  - suscripciones y cancelación;
  - revisión jurídica de las cláusulas de donación, reembolsos y contracargos;
  - aplicación de la Disposición 954/2025.

  Ver Cuestionario, n.º 16 a 24; [`docs/AUDITORIA_LEGAL.md`](docs/AUDITORIA_LEGAL.md), sección D; y el borrador **no publicado** [`legal/borradores/condiciones-tienda-propuesta.md`](legal/borradores/condiciones-tienda-propuesta.md).

## 7. Música e imágenes

- **Hecho (28/10/2026):** se retiraron del repositorio y de la publicación 19 archivos sin autorización verificable: 7 MP3 comerciales, 4 imágenes descargadas, 4 imágenes viejas de los mundos (una con personajes de DC Comics) y 4 recursos de Rockstar u origen desconocido. Registro en [`docs/REGISTRO_ASSETS.md`](docs/REGISTRO_ASSETS.md).
- **Decidir:**
  - el origen de la escena de GTA V de la portada (Cuestionario, n.º 35);
  - la autoría del logotipo en Canva (n.º 36);
  - los metadatos con el nombre de una persona (n.º 37).
- **Recomendación:** reemplazar el fondo de la portada por una captura propia del servidor en cuanto exista (lista de tomas en [`docs/GUION_VIDEOS.md`](docs/GUION_VIDEOS.md)). La radio queda vacía hasta tener música propia o con licencia.

## 8. Estado del servidor

- **Hecho:** el indicador ya no muestra una luz roja ni un cero cuando no hay datos: dice «Estado en vivo no disponible» mientras no exista una fuente fiable. Nunca inventa cifras. Detalle en [`docs/SEGURIDAD_ESTADO.md`](docs/SEGURIDAD_ESTADO.md).
- **Decidir:** crear el secreto `FIVEM_ENDPOINT`. Los pasos en la interfaz de GitHub están en ese documento: **nunca pegues el valor en un chat ni en el repositorio**.

## 9. Foro — recomendación concreta

- **Recomendación:** en esta fase, **canales de tipo Foro en el Discord oficial** (anuncios, novedades, guías, soporte, bugs y sugerencias). Un foro web propio, como Discourse en un subdominio, solo después: cuando haya presupuesto, alojamiento, una persona técnica responsable, un equipo de moderación y la decisión de tocar el DNS. Comparación completa en [`docs/FORO_EVALUACION.md`](docs/FORO_EVALUACION.md).
- **En la rama de trabajo, sin publicar:** la página se llama **«Comunidad»**, no «Foro activo». Organiza los temas con destinos que existen hoy y no simula un foro.
- **Decidir:** crear o confirmar esos canales y pasarme sus enlaces (Cuestionario, n.º 33), y confirmar si la invitación es permanente (n.º 34).

## 10. Creadores y transmisiones

- **Hecho:** la sección solo muestra canales con autorización expresa (`autorizado: true` en `_data/creadores.yml`). Hoy no hay ninguno, así que muestra un estado vacío honesto. En la rama de trabajo, sin publicar, se prepara una **propuesta marcada como pendiente** de cómo funcionaría el programa.
- **Decidir:** si existe un programa (Cuestionario, n.º 31 y 32). No se anuncian recompensas ni pagos por traer jugadores.

## 11. Material cinematográfico

- **En la rama de trabajo, sin publicar:** reproductor de video bajo demanda, con portada, que no se reproduce solo en celulares. Lista de tomas para grabar en FiveM en [`docs/GUION_VIDEOS.md`](docs/GUION_VIDEOS.md).
- **Decidir:** quién graba, con qué permisos de quienes aparecen y con qué música (propia o con licencia).

## 12. Historial público

- **Decidir** (Cuestionario, n.º 39): si, además de eliminar el webhook, querés reescribir el historial. Implica un push forzado y cambia todos los identificadores, incluido `1cf243e`. Procedimiento con respaldo previo en [`docs/LIMPIEZA_HISTORIAL.md`](docs/LIMPIEZA_HISTORIAL.md). No se hace sin tu autorización expresa.

## 13. Google Analytics

- El identificador `G-1XMC8M5F5X` se mantiene y solo se carga con consentimiento.
- **Confirmar:** retención, Google Signals y accesos (Cuestionario, n.º 28 a 30).

## 14. Verificaciones que necesitan acceso de red

No pude abrir:

- `elysiumesrp.com`;
- `gtahub.gg`, `news.gtahub.gg` y `foro.gtahub.gg`;
- los sitios oficiales de Argentina y de los demás países de la matriz internacional;
- Tebex, Cfx.re y Discord.

El entorno los bloquea. La lista exacta de dominios y para qué sirve cada uno está en `LEGAL_DATA_REQUIRED.md`, parte 3. Hasta habilitarlos, la versión publicada se verifica con la API de GitHub y con `version.json`.

## 15. Cumplimiento internacional

- **Encontrado:** sin saber dónde está el titular ni a qué países se dirige la comunidad, no se puede decidir qué leyes se aplican. Tampoco se puede suponer que ninguna lo hace. El análisis y la matriz por país están en [`docs/AUDITORIA_LEGAL.md`](docs/AUDITORIA_LEGAL.md), sección F.
- **Hecho (en la rama, sin publicar):**
  - una sola política de privacidad para cualquier país, con anexos para Argentina, la UE y el Reino Unido, Brasil, EE. UU. y otros países de América Latina. Sigue como «Borrador en revisión»;
  - la señal GPC vale como rechazo de la medición para todas las personas;
  - un solo criterio de cookies para todos, sin selector de país.
- **Decidir** (Cuestionario, n.º 40 a 49, más la 8, la 18 y la 25 ampliadas):
  - si los derechos y plazos se ofrecen igual en todos los países. Recomendado, si el equipo puede cumplirlos;
  - la edad mínima, la misma en todas las plataformas (opciones en la auditoría, F.5);
  - si se mantiene Google Analytics;
  - si se contrataría un representante en la UE y el Reino Unido, en caso de que el abogado lo pida.
- **Recomendación:** responder primero la 4, la 5, la 8 y la 40. Con eso el abogado puede priorizar las filas de la matriz.

## 16. Aprobación de la V2

- **Estado:** la Fase 1 está publicada desde el 28/10/2026 (`c94a47d`). La V2 y los borradores de privacidad internacional siguen en la rama `claude/nice-ritchie-njorw8`, sin publicar.
- **Cómo revisarla:**
  1. Compilá la rama (`bundle exec jekyll serve`) o pedime capturas de las páginas que quieras ver.
  2. Revisá la portada, los mundos, las novedades y la comunidad, a 1440 y a 390 px.
- **Para aprobarla:** decime «publicá la V2». Se integra la rama en `main` con un merge normal, sin reescribir el historial, y se verifica el despliegue.
- **A tener en cuenta:** las ilustraciones son procedurales y conceptuales. Para un acabado fotográfico hacen falta capturas reales del servidor, con permiso de quienes aparecen, o arte de una herramienta o de un artista con licencia documentada (punto 11).

