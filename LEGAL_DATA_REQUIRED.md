# Cuestionario único para el propietario

- **Última revisión:** 28/10/2026.
- **Qué reemplaza:** las listas de preguntas que antes estaban repartidas entre este archivo y `DECISIONES_PENDIENTES_WEB.md`. Es la única lista.
- **Cómo usarla:** respondé en el orden que quieras. Cada respuesta indica qué documento o parte del sitio desbloquea. El análisis detrás de cada pregunta está en `docs/AUDITORIA_LEGAL.md`.

> Los documentos legales del sitio están publicados como **borradores en revisión**. Las condiciones de la tienda están **vigentes desde el 21/09/2026, en revisión**. Ninguno se va a marcar como definitivo hasta tener estas respuestas y la revisión de un abogado. Nada de esto es asesoramiento legal.

## Parte 1. Preguntas que solo vos podés responder

### Urgente

1. **Webhook de Discord expuesto.** ¿Eliminaste o regeneraste el webhook cuyo ID empieza con `1494…`? Estuvo en el código público hasta el 14/09/2026 y sigue en el historial. Los pasos están en `docs/LIMPIEZA_HISTORIAL.md`.
2. **Acceso público al servidor.** ¿Hoy puede entrar cualquier persona o solo el staff? ¿Hay whitelist? *Desbloquea:* `acceso.publico` en `_data/sitio.yml`.
3. **Código de conexión.** ¿`kr546a` es el código vigente? La API de Cfx.re respondió 404 el 15/09 y el 27/10/2026. ¿El servidor aparece en el listado de FiveM? *Desbloquea:* `acceso.codigo_confirmado`, el comando y el botón «Abrir en FiveM».

### Identidad y alcance

4. ¿Quién es el titular del sitio y del servidor? Nombre de la persona o razón social. *Desbloquea:* privacidad, aviso legal, tienda. **Respondida el 28/10/2026:** Brian Martino, creador y administrador de Elysium | ES. Falta saber si en la tienda interviene alguna entidad comercial (pregunta 16).
5. ¿Desde qué país se administra Elysium? *Desbloquea:* la ley aplicable y la autoridad de datos. **Respondida el 28/10/2026:** Argentina.
6. ¿Qué domicilio y qué identificación fiscal (por ejemplo, CUIT) corresponde publicar? Respondé solo si tu abogado confirma que hace falta.
7. ¿Qué **correo electrónico** se puede publicar para temas legales y de privacidad?
8. ¿En qué países está la comunidad? ¿Se dirige también a personas en España u otros países de la UE? Eso puede sumar el RGPD. **Respondida el 28/10/2026:** abierta a personas de todo el mundo y dirigida a una audiencia hispanohablante global.
9. ¿Qué ley y qué jurisdicción querés fijar en los términos? Tu abogado debe validarlo.

### Servidor, Discord y datos

10. ¿Qué identificadores guarda el servidor (license, steam, discord, fivem, IP u otros) y dónde?
11. ¿Quién aloja el servidor y la base de datos, y en qué país?
12. **Plazos reales de conservación.** ¿Se cumplen los que se publicaban: personaje 12 meses, registros 6 meses, sanciones permanentes, postulaciones 12 meses? ¿Cuánto se guardan los tickets, las transcripciones y las copias de seguridad?
13. ¿Quién del equipo accede a la base de datos y a los registros? ¿Es cierto que solo la dirección técnica, con credenciales restringidas? Hoy esa frase figura como pendiente.
14. ¿Qué bots de Discord se usan (tickets, registros, verificación) y qué guardan? ¿Hay un tipo de ticket o un canal para recibir las postulaciones a staff? El sitio solo dice «un ticket del Discord oficial» hasta que lo confirmes (`docs/POSTULACION_STAFF.md`). **Respondida el 28/10/2026:** las postulaciones se recibían en el canal `1494480100865872043` del Discord oficial. Falta comprobar que acepte publicaciones de quienes no son staff.
15. ¿Se publican clips o capturas de jugadores en redes o en un tráiler? ¿Con qué autorización?

### Tienda (Tebex)

16. **¿Quién vende?** En el panel de Tebex: ¿la tienda usa **Tebex Checkout**, donde Tebex actúa como comerciante registrado, o pasarelas propias a tu nombre (PayPal o Stripe)? Es la respuesta que más cambia la responsabilidad frente a quien compra.
17. Lista de productos con precio, moneda, impuestos y beneficios exactos.
18. ¿Hay **suscripciones** con renovación automática? ¿Cómo se cancelan, paso a paso?
19. ¿Qué política de reembolsos tiene configurada Tebex? ¿Coincide con `condiciones-tienda.html`?
20. ¿Qué datos de cada compra te comparte Tebex: usuario, correo, país, importe?
21. ¿Hay compradores en Argentina? ¿La tienda de Tebex ya muestra un botón de arrepentimiento o de baja?
22. ¿Pueden comprar menores de edad? ¿Con qué control?
23. ¿Los productos dan ventajas dentro del juego? La tienda no puede prometer «sin pay-to-win» si las dan.
24. ¿Se cumplen los compromisos publicados: entrega en unos 15 minutos y respuesta en hasta 72 horas?

### Edad y comunidad

25. Edad mínima para jugar: hoy los términos dicen 16 años, pero GTA V es PEGI 18. ¿Se mantiene?
26. ¿Cómo se verifica la edad del staff (18 años)?
27. ¿Se mantienen los plazos de apelación: 15 días para apelar y 7 días para responder?

### Google Analytics

28. Plazo de retención configurado en la propiedad (2 o 14 meses).
29. ¿Están desactivados Google Signals y la vinculación con productos publicitarios?
30. ¿Quién tiene acceso a la propiedad?

### Creadores, comunidad y foro

31. ¿Hay creadores que ya autorizaron por escrito mostrar su canal? ¿Cómo se registra esa autorización?
32. ¿Existe o se aprobó algún programa de recompensas para creadores? Si no, el sitio no lo menciona.
33. ¿El Discord tiene canales de tipo Foro? ¿Con qué nombres? ¿Querés que el sitio enlace a ellos?
34. ¿La invitación `discord.gg/4mTVJhu3gx` es permanente (sin vencimiento ni límite de usos)? **Respondida el 28/10/2026:** sí, es permanente.

### Imágenes y marca

35. La escena de GTA V de la portada y de la vista previa en redes, ¿es una **captura propia** dentro del juego o **arte oficial** descargado? Parece mostrar a Franklin, el protagonista. Si es arte oficial, conviene reemplazarla.
36. ¿Quién diseñó el logotipo «E» en Canva? ¿Usa elementos de la biblioteca de Canva? ¿Se quiere registrar como marca?
37. Los PNG originales de marca tienen en sus metadatos el **nombre de una persona**. ¿Se publican tal cual, se limpian los metadatos o se dejan fuera del sitio?
38. ¿Hay grabaciones propias del servidor, con permiso de quienes aparecen, para el video de portada? Lista sugerida en `docs/GUION_VIDEOS.md`.

### Historial público

39. Después de eliminar el webhook, ¿querés además **reescribir el historial** para quitar las direcciones del servidor y los archivos retirados? Implica un push forzado y cambia todos los identificadores, incluido `1cf243e`. Procedimiento y consecuencias en `docs/LIMPIEZA_HISTORIAL.md`. **No se hace sin tu autorización expresa.**

## Parte 2. Para revisión de un abogado

Se resuelven con las respuestas de la Parte 1, pero exigen criterio jurídico.

| Tema | Por qué | Detalle |
|---|---|---|
| Cláusulas de la tienda: «donación», sin reembolsos, contracargos | Pueden chocar con derechos irrenunciables del consumidor | Auditoría D.3 |
| Disposición 954/2025: botón de arrepentimiento y de baja | Su aplicación depende de quién vende y desde dónde | Auditoría D.4 |
| Resolución 274/2021: enlace a la Ventanilla Única Federal | Obligación para proveedores en entornos digitales | Auditoría D.4 |
| Ley 25.326: responsable, plazos, leyenda de la AAIP, registro de la base, transferencias internacionales | Deberes del responsable de los datos | Auditoría A.3 y `legal/borradores/privacidad-propuesta.md` |
| Uso de la voz y la imagen de jugadores en contenido promocional | Suele requerir consentimiento expreso | Auditoría C |
| Cambios unilaterales y cierre sin reembolso | Riesgo de cláusulas abusivas frente a quien pagó | Auditoría C |
| Edad mínima y datos de menores | GTA V es PEGI 18; consentimiento de madre, padre o tutor | Auditoría A.3 |
| RGPD y LSSI, si hay público en la UE | Alcance territorial | Auditoría A.3 |
| Uso de imágenes de GTA V en la marca | Propiedad intelectual de Rockstar Games | `docs/REGISTRO_ASSETS.md` |

## Parte 3. Verificaciones técnicas que hago yo

No necesitan respuesta tuya: solo **acceso de red** desde el entorno de trabajo. Hoy el proxy rechaza todos estos dominios.

| Verificación | Dominio que hay que habilitar | Para qué |
|---|---|---|
| Versión publicada, rutas y caché en el dominio real | `elysiumesrp.com` (y `www.elysiumesrp.com`) | Comparar `https://elysiumesrp.com/version.json` con el commit de `main` |
| Productos, precios, moneda y condiciones de compra | `elysium-488.tebex.io`, `checkout.tebex.io` y `www.tebex.io` (condiciones de Tebex) | Contrastar la tienda con `condiciones-tienda.html` |
| Rol de Tebex y reglas de monetización de Cfx.re | `docs.tebex.io`, `docs.fivem.net`, `portal.cfx.re` y `fivem.net` (condiciones) | Confirmar quién vende y qué se puede vender |
| Código de conexión y listado de FiveM | `servers-frontend.fivem.net` y `cfx.re` | Comprobar `kr546a` |
| Textos oficiales | `servicios.infoleg.gob.ar`, `www.boletinoficial.gob.ar` y `www.argentina.gob.ar` | Citar la Ley 25.326, la Disposición 954/2025 y la Resolución 274/2021 desde la fuente |
| Referencia funcional | `gtahub.gg`, `news.gtahub.gg` y `foro.gtahub.gg` | Completar la matriz de `docs/AUDITORIA_WEB_100.md` |
| Invitación de Discord | `discord.com` y `discord.gg` | Ver si la invitación es permanente (solo lo que muestra la página pública) |

Cómo habilitarlos: en la configuración del entorno de Claude Code (menú del entorno, «Edit» → *Network access*), agregá esos dominios en *Allowed domains*, o elegí un nivel de acceso más amplio. Pasos: <https://code.claude.com/docs/en/cloud-environments#network-access>.

## Cómo cerrar un documento

Con las respuestas y la revisión jurídica:

1. Completá el texto donde dice `<i class="pending">…</i>` y quitá esas marcas.
2. Cambiá `estado_doc` a «Vigente» y borrá la línea `borrador:` de la cabecera.
3. Actualizá `version` con la fecha.
4. Publicá una novedad que explique el cambio.
