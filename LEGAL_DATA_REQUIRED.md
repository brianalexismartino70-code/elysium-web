# Cuestionario único para el propietario

- **Última revisión:** 28/10/2026, con la ampliación internacional (preguntas 40 a 49 y parte 4).
- **Qué reemplaza:** las listas de preguntas que antes estaban repartidas entre este archivo y `DECISIONES_PENDIENTES_WEB.md`. Es la única lista.
- **Cómo usarla:** respondé en el orden que quieras. Cada respuesta indica qué documento o parte del sitio desbloquea. El análisis detrás de cada pregunta está en `docs/AUDITORIA_LEGAL.md`.

> Los documentos legales del sitio están publicados como **borradores en revisión**. Las condiciones de la tienda están **vigentes desde el 21/09/2026, en revisión**. Ninguno se va a marcar como definitivo hasta tener estas respuestas y la revisión de un abogado. Nada de esto es asesoramiento legal.

## Parte 1. Preguntas que solo vos podés responder

### Urgente

1. **Webhook de Discord expuesto.** ¿Eliminaste o regeneraste el webhook cuyo ID empieza con `1494…`? Estuvo en el código público hasta el 14/09/2026 y sigue en el historial. Los pasos están en `docs/LIMPIEZA_HISTORIAL.md`.
2. **Acceso público al servidor.** ¿Hoy puede entrar cualquier persona o solo el staff? ¿Hay whitelist? *Desbloquea:* `acceso.publico` en `_data/sitio.yml`.
3. **Código de conexión.** ¿`kr546a` es el código vigente? La API de Cfx.re respondió 404 el 15/09 y el 27/10/2026. ¿El servidor aparece en el listado de FiveM? *Desbloquea:* `acceso.codigo_confirmado`, el comando y el botón «Abrir en FiveM».

### Identidad y alcance

4. ¿Quién es el titular del sitio y del servidor? Nombre de la persona o razón social. *Desbloquea:* privacidad, aviso legal, tienda.
5. ¿Desde qué país se administra Elysium? *Desbloquea:* la ley aplicable y la autoridad de datos.
6. ¿Qué domicilio y qué identificación fiscal (por ejemplo, CUIT) corresponde publicar? Respondé solo si tu abogado confirma que hace falta.
7. ¿Qué **correo electrónico** se puede publicar para temas legales y de privacidad?
8. ¿En qué países está la comunidad y en qué proporción, aproximadamente? ¿Se dirige también a personas en España u otros países de la UE? Alcanza con una estimación: no hace falta juntar datos nuevos. *Desbloquea:* qué filas de la matriz internacional (parte 4) hay que priorizar.
9. ¿Qué ley y qué jurisdicción querés fijar en los términos? Tu abogado debe validarlo.

### Servidor, Discord y datos

10. ¿Qué identificadores guarda el servidor (license, steam, discord, fivem, IP u otros) y dónde? ¿Qué contienen los registros: chat de texto, comandos, transacciones? ¿Se graba la voz?
11. ¿Quién aloja el servidor y la base de datos, y en qué país?
12. **Plazos reales de conservación.** ¿Se cumplen los que se publicaban: personaje 12 meses, registros 6 meses, sanciones permanentes, postulaciones 12 meses? ¿Cuánto se guardan los tickets, las transcripciones y las copias de seguridad?
13. ¿Quién del equipo accede a la base de datos y a los registros? ¿Es cierto que solo la dirección técnica, con credenciales restringidas? Hoy esa frase figura como pendiente.
14. ¿Qué bots de Discord se usan (tickets, registros, verificación) y qué guardan?
15. ¿Se publican clips o capturas de jugadores en redes o en un tráiler? ¿Con qué autorización?

### Tienda (Tebex)

16. **¿Quién vende?** En el panel de Tebex: ¿la tienda usa **Tebex Checkout**, donde Tebex actúa como comerciante registrado, o pasarelas propias a tu nombre (PayPal o Stripe)? Es la respuesta que más cambia la responsabilidad frente a quien compra.
17. Lista de productos con precio, moneda, impuestos y beneficios exactos.
18. ¿Hay **suscripciones** con renovación automática? ¿Cómo se cancelan, paso a paso? ¿Tebex avisa antes de cada renovación? ¿Se pueden cancelar en línea sin hablar con nadie?
19. ¿Qué política de reembolsos tiene configurada Tebex? ¿Coincide con `condiciones-tienda.html`?
20. ¿Qué datos de cada compra te comparte Tebex: usuario, correo, país, importe?
21. ¿Hay compradores en Argentina? ¿La tienda de Tebex ya muestra un botón de arrepentimiento o de baja?
22. ¿Pueden comprar menores de edad? ¿Con qué control?
23. ¿Los productos dan ventajas dentro del juego? La tienda no puede prometer «sin pay-to-win» si las dan.
24. ¿Se cumplen los compromisos publicados: entrega en unos 15 minutos y respuesta en hasta 72 horas?

### Edad y comunidad

25. Edad mínima para jugar: hoy los términos dicen 16 años, pero GTA V es PEGI 18. ¿Se mantiene? ¿Cómo se comprueba la edad al entrar al Discord y al servidor? ¿Sabés si hoy hay jugadores menores de 16, o de 13, y de qué países? Opciones en `docs/AUDITORIA_LEGAL.md`, F.5.
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
34. ¿La invitación `discord.gg/4mTVJhu3gx` es permanente (sin vencimiento ni límite de usos)?

### Imágenes y marca

35. La escena de GTA V de la portada y de la vista previa en redes, ¿es una **captura propia** dentro del juego o **arte oficial** descargado? Parece mostrar a Franklin, el protagonista. Si es arte oficial, conviene reemplazarla.
36. ¿Quién diseñó el logotipo «E» en Canva? ¿Usa elementos de la biblioteca de Canva? ¿Se quiere registrar como marca?
37. Los PNG originales de marca tienen en sus metadatos el **nombre de una persona**. ¿Se publican tal cual, se limpian los metadatos o se dejan fuera del sitio?
38. ¿Hay grabaciones propias del servidor, con permiso de quienes aparecen, para el video de portada? Lista sugerida en `docs/GUION_VIDEOS.md`.

### Historial público

39. Después de eliminar el webhook, ¿querés además **reescribir el historial** para quitar las direcciones del servidor y los archivos retirados? Implica un push forzado y cambia todos los identificadores, incluido `1cf243e`. Procedimiento y consecuencias en `docs/LIMPIEZA_HISTORIAL.md`. **No se hace sin tu autorización expresa.**

### Alcance internacional

El análisis está en `docs/AUDITORIA_LEGAL.md`, sección F, y la matriz por país en la parte 4. Las preguntas 4, 5, 8, 18 y 25 también sirven para esta parte.

40. **El nombre.** ¿«ES» quiere decir España, español o ambos? ¿La comunidad se promociona en países concretos (banderas, horarios, moneda, publicidad)? *Desbloquea:* si el servicio se dirige a la UE (RGPD y LSSI) o a otros países.
41. **Fines de lucro y facturación.** ¿Elysium tiene fines de lucro? ¿Qué orden de magnitud factura la tienda por año? *Desbloquea:* descartar leyes con umbrales (California y otros estados de EE. UU.) y el régimen de agentes pequeños de Brasil. Se relaciona con el «sin fines de lucro» de los términos.
42. **Moneda, impuestos y países.** ¿En qué moneda cobra Tebex? ¿Muestra los precios con impuestos según el país? ¿Desde qué países se compra?
43. **Checkout de Tebex.** ¿Qué dice antes de pagar sobre desistimiento, reembolsos y renovación? ¿Envía un comprobante por correo? Alcanza con capturas de pantalla.
44. **Premios al azar.** ¿La tienda o el servidor venden cajas de recompensa, sorteos pagos u otros premios aleatorios?
45. **Pedidos sobre datos.** ¿Quién los atiende? ¿Cómo se comprueba que quien pide es titular de la cuenta? ¿Qué plazo máximo puede cumplir el equipo? ¿Querés aplicar el mismo procedimiento a todos los países? Es lo más simple, si el equipo puede cumplirlo.
46. **Incidentes.** ¿Hay un procedimiento ante una filtración, el robo de una cuenta del staff o un acceso indebido a la base de datos? ¿Quién decide avisar, por qué canal y dónde queda registrado? Hay una propuesta en `legal/borradores/privacidad-propuesta.md`, sección 9.
47. **Representante en la UE y el Reino Unido.** Si el abogado concluye que hace falta, ¿se contrataría uno (es un servicio pago)? ¿O preferís otra alternativa, como no dirigirse a esos países?
48. **Acuerdos con proveedores.** ¿Aceptaste acuerdos de tratamiento de datos con Google (en Analytics), con Tebex o con el alojamiento del servidor? ¿Dónde están?
49. **¿Hace falta Google Analytics?** Sin Analytics, el sitio no tendría servicios opcionales y no necesitaría pedir permiso para cookies en ningún país.

## Parte 2. Para revisión de un abogado

Se resuelven con las respuestas de la Parte 1, pero exigen criterio jurídico.

| Tema | Por qué | Detalle |
|---|---|---|
| Cláusulas de la tienda: «donación», sin reembolsos, contracargos | Pueden chocar con derechos irrenunciables del consumidor, en Argentina y en otros países | Auditoría D.3 y F.6 |
| Disposición 954/2025: botón de arrepentimiento y de baja | Su aplicación depende de quién vende y desde dónde | Auditoría D.4 |
| Resolución 274/2021: enlace a la Ventanilla Única Federal | Obligación para proveedores en entornos digitales | Auditoría D.4 |
| Ley 25.326: responsable, plazos, leyenda de la AAIP, registro de la base, transferencias internacionales | Deberes del responsable de los datos | Auditoría A.3 y `legal/borradores/privacidad-propuesta.md` |
| Uso de la voz y la imagen de jugadores en contenido promocional | Suele requerir consentimiento expreso | Auditoría C |
| Cambios unilaterales y cierre sin reembolso | Riesgo de cláusulas abusivas frente a quien pagó | Auditoría C |
| Edad mínima y datos de menores | GTA V es PEGI 18; consentimiento de madre, padre o tutor; Children's Code británico, ECA Digital de Brasil y COPPA | Auditoría A.3 y F.5 |
| Alcance internacional: RGPD y LSSI, UK GDPR, LGPD y leyes de EE. UU. y de América Latina, incluido el representante del art. 27 | Depende de dónde esté el responsable y a quién se dirige | Auditoría F y parte 4 |
| Prueba del consentimiento de cookies | Hoy queda solo en el navegador | Auditoría F.4 |
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
| Textos oficiales de otros países | `eur-lex.europa.eu`, `www.edpb.europa.eu`, `curia.europa.eu`, `www.aepd.es`, `ico.org.uk`, `www.legislation.gov.uk`, `www.planalto.gov.br`, `www.gov.br`, `www.ftc.gov`, `www.ecfr.gov`, `leginfo.legislature.ca.gov`, `cppa.ca.gov`, `oag.ca.gov`, `www.dof.gob.mx`, `www.diputados.gob.mx`, `www.bcn.cl`, `www.sic.gov.co` y `www.gob.pe` | Confirmar en el texto oficial lo que la matriz internacional toma de fuentes secundarias |
| Condiciones de las plataformas | `discord.com`, `www.rockstargames.com`, `fivem.net` y `checkout.tebex.io` | Edades mínimas y reglas de cada plataforma |
| Especificación de GPC | `globalprivacycontrol.org` | Contrastar la implementación de `cookies.js` |

Cómo habilitarlos: en la configuración del entorno de Claude Code (menú del entorno, «Edit» → *Network access*), agregá esos dominios en *Allowed domains*, o elegí un nivel de acceso más amplio. Pasos: <https://code.claude.com/docs/en/cloud-environments#network-access>.

## Parte 4. Matriz internacional

Copia de `docs/AUDITORIA_LEGAL.md`, F.3, donde están el análisis y las fuentes. Cada fila dice por qué una ley **podría** aplicarse, no que se aplique. Los números de «Datos faltantes» son preguntas de este cuestionario; la 4, la 5 y la 8 sirven para todas las filas.

<!-- matriz-internacional:inicio · la misma tabla está en docs/AUDITORIA_LEGAL.md (F.3) y en LEGAL_DATA_REQUIRED.md (parte 4): si cambia una, actualizá la otra -->

| País o región | Normas | Por qué podrían aplicarse | Obligaciones principales | Cambios técnicos o documentales | Datos faltantes del propietario | Puntos de revisión jurídica |
|---|---|---|---|---|---|---|
| **Argentina** | Ley 25.326 y Decreto 1558/2001 (datos personales). Ley 24.240 y Código Civil y Comercial, arts. 1092 a 1122 (consumo). Disposición 954/2025 (botones de arrepentimiento y de baja). Resolución 274/2021 (Ventanilla Única Federal) | Se aplicaría a todo el tratamiento si Elysium se administra desde Argentina. Además, puede haber jugadores y compradores en el país | Identificar al responsable y su domicilio · informar finalidades y destinatarios · consentimiento como regla, con excepciones · acceso en 10 días corridos y rectificación o supresión en 5 hábiles (a verificar) · leyenda de la AAIP (a verificar) · inscripción de la base, a evaluar · transferencias a países adecuados o con garantías · si hay ventas a consumidores: información previa, revocación y, según el caso, botones y enlace de reclamos | **Hecho:** anexo A de la política de privacidad, con plazos y leyenda marcados «a verificar»; los «30 días» ya no figuran. **Preparado, sin publicar:** enlaces de arrepentimiento, de baja y de la Ventanilla Única (D.4) | 4, 5, 6, 7, 11, 16, 18, 21 y 41 | Si es la ley del responsable · inscripción de la base · mecanismo de transferencias · texto de la leyenda · Disposición 954/2025 frente a Tebex · cláusulas de la tienda (D.3) |
| **Unión Europea y EEE, incluida España** | RGPD. Directiva 2002/58/CE de privacidad electrónica (en España, art. 22.2 de la LSSI y guías de cookies de la AEPD). LOPDGDD (edad de 14 años en España). Directiva 2011/83/UE de derechos de los consumidores, con la función de desistimiento que agrega la Directiva 2023/2673 | El RGPD alcanza a responsables de fuera de la UE que ofrecen servicios a personas en la UE o controlan su comportamiento (art. 3.2). Indicios a evaluar: el idioma, el «ES» del nombre, jugadores en España y la medición de visitas. Las reglas de cookies rigen al guardar o leer datos en el dispositivo de quien visita | Información completa (art. 13) · una base jurídica para cada finalidad · respuesta a los derechos en un mes · representante en la UE, salvo excepción (art. 27) · registro de actividades · seguridad · aviso a la autoridad en 72 horas si el incidente supone un riesgo · consentimiento previo para cookies no necesarias · tienda: 14 días de desistimiento; en contenido digital se pierde solo con consentimiento expreso y reconocimiento previos; desde el 19/06/2026, función de desistimiento en línea | **Hecho:** consentimiento previo, rechazo con el mismo peso, revocación con borrado de cookies, señal GPC y anexo B. **Pendiente:** bases jurídicas revisadas y, si corresponde, representante | 4, 5, 8, 40, 42, 43 y 47 | Si se aplica el art. 3.2 · representante · bases jurídicas · transferencias (Argentina tiene decisión de adecuación de la UE, reafirmada el 15/01/2024; EE. UU. tiene el Marco de Privacidad de Datos, recurrido ante el Tribunal de Justicia) · desistimiento en el checkout de Tebex · prueba del consentimiento guardada solo en el navegador |
| **Reino Unido** | UK GDPR y Data Protection Act 2018. PECR (cookies), reformadas por la Data (Use and Access) Act 2025. Código de diseño apropiado para la edad de la ICO (Children's Code). Consumer Contracts Regulations 2013. DMCC Act 2024 (régimen de suscripciones previsto para 2027, sin fecha confirmada) | Mismo criterio de alcance que el RGPD. Con una comunidad hispanohablante, probablemente haya pocas personas del Reino Unido | Obligaciones parecidas a las del RGPD, con representante en el Reino Unido salvo excepción · consentimiento digital desde los 13 años · Children's Code: servicios en línea, incluidos juegos, que probablemente usen menores de 18 · cookies: desde el 05/02/2026, excepción para algunas cookies estadísticas con condiciones estrictas (según fuentes secundarias) · tienda: 14 días de cancelación, con la excepción del contenido digital | **Hecho:** el sitio no usa la excepción estadística (Analytics siempre pide permiso); el anexo B incluye al Reino Unido | 8, 25 y 47 | Alcance · representante · Children's Code si hay jugadores de 16 y 17 años en el Reino Unido · Online Safety Act 2023, solo si hubiera muchos usuarios británicos (conocimiento general, a verificar) |
| **Brasil** | LGPD (Lei 13.709/2018). Resoluciones CD/ANPD 2/2022 (agentes de tratamiento de pequeño porte) y 15/2024 (incidentes). ECA Digital (Lei 15.211/2025, vigente desde el 17/03/2026). Código de Defensa del Consumidor (art. 49) y Decreto 7.962/2013 (comercio electrónico) | La LGPD alcanza los datos recolectados mientras la persona está en Brasil y los servicios ofrecidos a personas en Brasil (art. 3), aunque el responsable esté en el exterior | Base legal para cada finalidad · información clara · derechos del art. 18 · canal de atención (los agentes pequeños pueden no designar encargado) · aviso de incidentes a la ANPD y a los titulares en 3 días hábiles (algunas fuentes indican plazo doble para agentes pequeños) · menores: interés superior y consentimiento parental para menores de 12 · ECA Digital: verificación de edad confiable y herramientas de supervisión en ciertos casos, y prohibición de cajas de recompensa en juegos (según fuentes secundarias) · tienda: 7 días de arrepentimiento e identificación del proveedor en el sitio de venta | **Hecho:** anexo C | 8, 22, 25, 41 y 44 | Si la LGPD alcanza a Elysium y si califica como agente pequeño · ECA Digital con un juego abierto desde los 16 años · arrepentimiento en bienes digitales |
| **Estados Unidos (federal)** | FTC Act, sección 5 (prácticas engañosas). COPPA y su regla reformada (vigente desde el 23/06/2025; cumplimiento exigible desde el 22/04/2026). ROSCA (renovaciones automáticas en línea). La regla «click-to-cancel» de la FTC fue anulada el 08/07/2025 | Puede haber jugadores o compradores en EE. UU. Lo que dice una política de privacidad tiene que ser cierto | No publicar promesas falsas sobre privacidad o seguridad · COPPA: consentimiento verificable de los padres si el servicio se dirige a menores de 13 o sabe que los tiene · ROSCA: informar las condiciones antes de cobrar, obtener consentimiento expreso y ofrecer una forma simple de cancelar | **Hecho:** la política solo afirma lo verificado o lo declarado por la administración, y marca el resto como pendiente; anexo D | 8, 18, 25 y 43 | COPPA, si hay menores de 13 en el Discord · ROSCA, si hay suscripciones con compradores en EE. UU. |
| **Estados Unidos: California y otros estados** | CCPA, reformada por la CPRA. Ley de renovación automática de California (reformada el 01/07/2025). CalOPPA (contenido mínimo de la política; conocimiento general, a verificar). Leyes de privacidad de otros estados (19 o 20 vigentes en 2026, según la fuente), varias con señales universales de exclusión como GPC | La CCPA alcanza a empresas con fines de lucro que superan un umbral: USD 26.625.000 de facturación anual, datos de 100.000 consumidores de California o la mitad de los ingresos por vender o compartir datos. Las leyes de otros estados tienen umbrales parecidos. Es probable que Elysium no los alcance, pero falta confirmarlo | Sin umbrales alcanzados: informar con veracidad y, si hay suscripciones con compradores de California, cumplir las reglas de renovación automática (consentimiento, recordatorios y baja en línea) · con umbrales alcanzados: derechos de los consumidores, exclusión de la venta o del uso compartido y respeto de GPC | **Hecho:** el sitio respeta GPC para cualquier persona e informa que no interpreta «Do Not Track»; la medición funciona con las funciones publicitarias de Google desactivadas | 18, 29, 41 y 43 | Umbrales · CalOPPA · renovación automática |
| **México** | Ley Federal de Protección de Datos Personales en Posesión de los Particulares (publicada el 20/03/2025, vigente desde el 21/03/2025; autoridad: Secretaría Anticorrupción y Buen Gobierno). Ley Federal de Protección al Consumidor | Si hay jugadores o compradores en México. Su alcance sobre un responsable sin establecimiento ni medios en México es dudoso | Aviso de privacidad · consentimiento, tácito como regla y expreso cuando la ley lo pide · derechos ARCO: respuesta en 20 días hábiles y ejecución en otros 15 (según fuentes secundarias) · retracto en ventas a distancia (plazo a verificar) | **Hecho:** anexo E | 8 y 42 | Alcance territorial · retracto en bienes digitales |
| **Chile** | Ley 19.628, reformada por la Ley 21.719 (rige desde el 01/12/2026 y crea la Agencia de Protección de Datos Personales). Ley 19.496 (consumidor; retracto del art. 3 bis) | Si hay jugadores o compradores en Chile. El alcance de la reforma sobre responsables del extranjero no se pudo confirmar | Desde el 01/12/2026: bases de licitud, derechos, seguridad y deberes con proveedores · retracto de 10 días en compras electrónicas, con reglas a verificar | **Hecho:** anexo E | 8 y 42 | Alcance de la Ley 21.719 · situación de la Agencia (según fuentes secundarias, podría no estar constituida a tiempo) · retracto |
| **Colombia** | Ley 1581 de 2012 y su reglamentación. Superintendencia de Industria y Comercio (SIC), con la Circular Externa 003/2025 sobre cláusulas modelo (según fuentes secundarias). Ley 1480 de 2011 (consumidor; retracto del art. 47) | Si hay jugadores o compradores en Colombia. El alcance sobre responsables extranjeros es discutido | Autorización previa, expresa e informada · política de tratamiento · respuesta en 10 días hábiles a consultas y en 15 a reclamos (conocimiento general, a verificar) · transferencias solo a países con nivel adecuado según la SIC, o con excepciones · retracto en ventas a distancia, con excepciones | **Hecho:** anexo E | 8 y 42 | Alcance · autorización como base · transferencias |
| **Perú** | Ley 29733 y su nuevo reglamento (Decreto Supremo 016-2024-JUS, publicado el 30/11/2024; una fuente indica vigencia desde el 30/03/2025, a verificar). Autoridad Nacional de Protección de Datos Personales. Código de Protección y Defensa del Consumidor | Si hay jugadores o compradores en Perú. El alcance del nuevo reglamento sobre responsables extranjeros no se pudo confirmar | Consentimiento e información · derechos ARCO · seguridad · aviso de incidentes (plazo no confirmado) · retracto en compras por internet: no se encontró una regla general clara | **Hecho:** anexo E | 8 y 42 | Alcance · deberes y plazos del nuevo reglamento |
| **Otros países** | Las leyes de datos y de consumo de cada país con jugadores (por ejemplo, Uruguay, Ecuador, Paraguay o Venezuela). Sin analizar | Depende de dónde estén los jugadores | Sin analizar. Mientras tanto rige la política principal, con los mismos derechos para todos | Ninguno específico: no hay selector de país ni protecciones distintas por país | 8 | Priorizar los países con más jugadores |

<!-- matriz-internacional:fin -->

## Cómo cerrar un documento

Con las respuestas y la revisión jurídica:

1. Completá el texto donde dice `<i class="pending">…</i>` y quitá esas marcas.
2. Cambiá `estado_doc` a «Vigente» y borrá la línea `borrador:` de la cabecera.
3. Actualizá `version` con la fecha.
4. Publicá una novedad que explique el cambio.
