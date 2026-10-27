# Decisiones pendientes — sitio web de Elysium | ES

Última revisión: 27/10/2026. Cada punto indica qué se encontró, qué quedó hecho mientras tanto y qué falta decidir. Nada de esto bloquea el sitio: donde había una afirmación pública sin verificar, se eligió la opción más prudente.

---

## 1. Fase pública del Mundo I

- **Verificado (27/10/2026, 19:26 UTC):** la consulta automática del servidor devolvió el nombre `Elysium | ES · PREAPERTURA (solo STAFF)`, 1 persona conectada y 48 plazas.
- **Antes:** la web decía «La ciudad ya está abierta», «Fronteras abiertas · entrada libre» y «El ingreso está habilitado para toda la comunidad».
- **Hecho:** el sitio muestra la fase **Preapertura · acceso reservado al staff** y el botón principal lleva al Discord en lugar de conectar al servidor.
- **Para abrir:** en `_data/sitio.yml` cambiar `fase: preapertura` por `fase: abierto`. Eso cambia la portada, el cierre, la guía y las preguntas frecuentes, y vuelve a poner «Entrar a la ciudad» como botón principal. Publicar además una novedad en `_posts/`.

## 2. Código de conexión `kr546a`

- **Verificado:** el 27/10/2026 la API pública de Cfx.re respondió **404** para `kr546a` (el código no figura en el listado). Puede deberse a que el servidor está oculto durante la preapertura, a que el código cambió o a que el servidor no está registrado en el listado.
- **Hecho:** el código se mantiene (es el que usaba la web y el workflow), centralizado en `_data/sitio.yml` → `conexion.codigo`. El comando pasó de `connect kr546a` a **`connect cfx.re/join/kr546a`**, que es el formato que acepta la consola F8 de FiveM.
- **Decidir:** confirmar el código definitivo antes de la apertura y probar el botón «Abrir en FiveM» (`fivem://connect/cfx.re/join/<código>`) desde una PC con FiveM instalado. Si el código cambia, actualizarlo también en `.github/workflows/estado-servidor.yml` (`JOIN`).

## 3. Identidad y estado de los mundos

| Mundo | Antes en la web | Ahora | Pendiente |
|---|---|---|---|
| I | «Rol» · Abierto | **Roleplay** · Preapertura | Confirmar el nombre «Roleplay» |
| II | Cuarentena · Abierto | Cuarentena · **En pruebas** | Confirmar detalles (grupos de 1 a 5, hordas, pactos) tras las pruebas |
| III | PvP · En construcción | PvP · **En desarrollo** | — |
| IV | Arena · En diseño | Arena (**nombre provisional**) · En diseño | Confirmar nombre definitivo (¿Arena o proyecto de héroes?) |

- Los textos de cada mundo están en `_data/mundos.yml`. Se quitó la promesa de «premios para los finalistas» del Mundo IV hasta que se confirme.
- `mundo4.webp` (no usado) muestra a Superman y Batman: son personajes de DC Comics. **No conviene usarlo** para presentar el mundo de héroes.

## 4. Sistemas de rol

- Se presentan diez sistemas (empleos, facciones, economía, vehículos, propiedades, comunicación, emergencias, rol ilegal, eventos, inventario y soporte). Cada punto cita el artículo de la normativa o el texto de Elysium del que sale.
- **Todos figuran «Por confirmar»**, porque con el servidor en preapertura no hay forma de verificar desde el sitio qué está implementado para el público.
- **Decidir:** revisar `_data/sistemas.yml` y cambiar `estado` a `disponible`, `pruebas` o `desarrollo` según corresponda. No agregar sistemas que solo existan en un documento de diseño.

## 5. Tienda y modelo de monetización

- **Hecho:** el enlace a Tebex se mantiene, ahora con una página previa (`tienda.html`) que explica que es un sitio externo, que Tebex procesa el pago y dónde están las condiciones.
- Las condiciones de la tienda del 21/09/2026 siguen vigentes **sin cambios** en pagos, cancelaciones ni reembolsos. Solo se retiró la afirmación «Nada de pay-to-win» y la descripción de beneficios («cosmético, de comodidad o de acceso anticipado»), porque no se pudo verificar contra los productos reales.
- **Decidir:** la política de la tienda. Las discrepancias concretas y las alternativas están en [`docs/TIENDA_DISCREPANCIAS.md`](docs/TIENDA_DISCREPANCIAS.md). Hay un borrador de condiciones nuevas para revisar en [`legal/borradores/condiciones-tienda-propuesta.md`](legal/borradores/condiciones-tienda-propuesta.md); **no está publicado**.

## 6. Postulación a staff

- **Encontrado:** el formulario intentaba enviar las respuestas a un webhook de Discord escrito en el código de la página. El webhook nunca se configuró (el código tenía el texto `PEGA_ACA_TU_WEBHOOK_NUEVO`), así que después de 40–60 minutos de examen la persona recibía «el formulario todavía no está conectado». Además, un webhook puesto en el navegador lo puede leer cualquiera y usarlo para publicar o borrar en ese canal.
- **Hecho:** el examen se conserva igual. Al terminar, la persona **descarga un archivo .txt** (o copia las respuestas) y lo adjunta en un ticket del Discord. El paso «Enviás el examen» dice ahora eso, en lugar de «Llega directo al canal privado de la dirección».
- **Decidir:** si se quiere envío automático, hacerlo con una pieza en servidor que guarde el secreto (por ejemplo, un bot de tickets de Discord con formularios, o una función serverless con límite de envíos y captcha). Nunca con el webhook en el HTML.

## 7. Radio «Elysium FM»

- **Encontrado:** siete MP3 en el repositorio (≈ 34 MB). Las etiquetas internas muestran que al menos dos son descargas de YouTube de canciones comerciales («Ice Cube – You Know How We Do It», «La T y La M – Soy Favela (Official Audio)»), y los nombres de otros archivos sugieren artistas comerciales (`bad-bunny.mp3`, `omar-courtz.mp3`, `jhay-co.mp3`). No hay licencia que permita difundirlos.
- **Hecho:** el reproductor queda apagado (`_data/radio.yml` con la lista vacía) y los MP3 **ya no se publican** en elysiumesrp.com (`exclude` en `_config.yml`). Los archivos siguen en el repositorio.
- **Decidir:** borrar los MP3 del repositorio (siguen en el historial de git) y, si se quiere la radio, cargar solo música propia, encargada o con licencia libre de regalías en `_data/radio.yml`.

## 8. Imágenes de la galería

- **Encontrado:** la sección «Archivos de la ciudad» presentaba cuatro imágenes como contenido de Elysium (`police-map-fivem-1536x848.webp`, `4903967.webp`, `wp8853423.webp`, `982-1-1024x576.webp`). Sus nombres son los de imágenes descargadas de sitios web y fondos de pantalla, no tienen marca de Elysium y varias son PNG o JPEG con extensión `.webp`.
- **Hecho:** la galería muestra solo arte de marca de Elysium e ilustraciones conceptuales, con su tipo indicado. Las cuatro imágenes siguen en el repositorio, sin usar.
- **Decidir:** si alguna de esas imágenes es una captura real del servidor, confirmarlo y agregarla en `_data/galeria.yml` con `tipo: captura`. Lo ideal es reemplazarlas por capturas tomadas en Elysium, con permiso de quienes aparecen.
- Otros archivos sin uso: `mundo1-4.webp`, `logo-lspd.png` (sello de Los Santos, de Rockstar), `mapa-gta.jpg` (mapa de GTA V, de Rockstar), `fondo-lspd.webp`, `cash-clean.png`. Se pueden borrar o archivar fuera del repositorio.

## 9. Boletín de la portada

- **Antes:** cuatro titulares sin fecha que mezclaban ficción del rol con afirmaciones reales falsas o sin verificar («Fronteras abiertas», «El Mundo II ya recibe grupos de hasta cinco supervivientes», «Academia de cadetes», «Economía estable»).
- **Hecho:** el boletín muestra los titulares de las novedades reales, con fecha.
- **Decidir:** si se quiere un «diario de la ciudad» con noticias dentro del rol, crearlo como categoría propia y señalarlo claramente como ficción.

## 10. Estado del servidor y seguridad

- Detalle técnico en [`docs/SEGURIDAD_ESTADO.md`](docs/SEGURIDAD_ESTADO.md).
- **Acción necesaria del dueño:** crear el secreto `FIVEM_ENDPOINT` (Settings → Secrets and variables → Actions → New repository secret) con el valor `ip:puerto` del servidor. Sin ese secreto, el estado depende del listado público de Cfx.re, que hoy responde 404, y el sitio mostrará «No se pudo confirmar el estado del servidor».
- **Evaluar:** la IP sigue en el historial de git y en registros viejos de GitHub Actions. Ver opciones en el documento de seguridad.

## 11. Foro

- Evaluación completa en [`docs/FORO_EVALUACION.md`](docs/FORO_EVALUACION.md). **Recomendación:** usar canales de foro en el Discord oficial en una primera etapa y, si hace falta un foro web público, montar Discourse con inicio de sesión por Discord en una segunda etapa.
- **Decidir:** plataforma, alojamiento, subdominio (requiere tocar el DNS) y equipo de moderación.

## 12. Enlaces que no se pudieron verificar desde este entorno

- El entorno de trabajo no tenía acceso a `elysiumesrp.com`, `gtahub.gg`, Discord ni Tebex. Se conservaron los enlaces que ya usaba el sitio: invitación `https://discord.gg/4mTVJhu3gx`, tienda `https://elysium-488.tebex.io` y las redes de TikTok, Instagram y YouTube.
- **Confirmar:** que la invitación de Discord sea permanente (sin vencimiento ni límite de usos).

## 13. Google Analytics

- El identificador `G-1XMC8M5F5X` se mantiene y solo se carga con consentimiento.
- **Confirmar en la propiedad de Analytics:** plazo de retención de datos, que Google Signals y la vinculación publicitaria estén desactivados, y quién tiene acceso. Esos datos completan la política de privacidad.

## 14. Datos legales

- Las preguntas concretas para cerrar los documentos están en [`LEGAL_DATA_REQUIRED.md`](LEGAL_DATA_REQUIRED.md).
