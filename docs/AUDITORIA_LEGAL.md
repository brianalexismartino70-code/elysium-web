# Auditoría legal y de privacidad — elysiumesrp.com

- **Fecha:** 28/10/2026.
- **Rama:** `claude/nice-ritchie-njorw8`.
- **Alcance:** el sitio, sus formularios, enlaces externos, la tienda enlazada y lo que el sitio dice del servidor y del Discord.

> **No es asesoramiento legal ni una garantía de cumplimiento.** Identifica riesgos, separa lo verificado de lo supuesto y marca lo que necesita datos del propietario o la revisión de un abogado. No se puede afirmar que el sitio quede libre de riesgos legales.

## Fuentes y cómo se usaron

| Tipo | Qué incluye | Uso en este documento |
|---|---|---|
| **Verificado en el código** | Repositorio completo con su historial; sitio compilado con la misma versión de Jekyll que GitHub Pages; pruebas automáticas en navegador (`tests/verificar.mjs`) | Hechos sobre lo que el sitio hace |
| **Fuentes oficiales: no consultadas** | `servicios.infoleg.gob.ar`, `www.boletinoficial.gob.ar`, `www.argentina.gob.ar`, Tebex y Cfx.re | **El entorno de trabajo las bloquea** (respuesta 403 del proxy). Ninguna se presenta como leída |
| **Fuentes secundarias** (búsqueda web) | Resúmenes de estudios jurídicos, prensa y documentación de terceros, citados en cada punto | Orientación. Hay que confirmarlas con el texto oficial |
| **Conocimiento general** | Normas conocidas antes de esta revisión | Marcado como «a verificar». Nunca como conclusión |

Normas que conviene que revise un abogado, con su fuente oficial (no consultada):

- **Ley 25.326 de Protección de los Datos Personales y Decreto 1558/2001.** Infoleg, norma 64790. La autoridad de control es la Agencia de Acceso a la Información Pública (AAIP).
- **Ley 24.240 de Defensa del Consumidor.** Infoleg, norma 638.
- **Código Civil y Comercial, arts. 1092 a 1122 (contratos de consumo y a distancia).**
- **Disposición 954/2025 de la Subsecretaría de Defensa del Consumidor y Lealtad Comercial.** Boletín Oficial del 04/09/2025, aviso 330827.
- **Resolución 274/2021 (Ventanilla Única Federal de reclamos).** argentina.gob.ar, norma 348345.

## Resumen de riesgos

| # | Riesgo | Dónde | Prioridad | Quién lo resuelve |
|---|---|---|---|---|
| 1 | **Webhook de Discord válido en el historial público** | Git, hasta el 14/09/2026 | **Crítica** | Propietario: eliminar el webhook (ver `docs/LIMPIEZA_HISTORIAL.md`) |
| 2 | **Condiciones de la tienda con cláusulas que la ley de consumo podría anular**: compras como «donación», renuncia a reembolsos, expulsión por contracargo | `condiciones-tienda.html` (texto del 21/09/2026, vigente) | **Alta** | Abogado y propietario. **No se modificó**: es una condición comercial |
| 3 | **Botón de arrepentimiento, botón de baja y enlace de reclamos**: no hay ninguno y su obligación no está analizada | Sitio y tienda | **Alta** | Abogado, con los datos de Tebex del propietario |
| 4 | **Responsable de los datos sin identificar** (nombre, domicilio, contacto) | Privacidad y aviso legal | **Alta** | Propietario |
| 5 | **Plazo de 30 días** para pedidos sobre datos, más largo que los de la Ley 25.326 | Privacidad y normas de comunidad | **Alta** | **Corregido en la rama**: ahora remite a los plazos de la ley aplicable |
| 6 | **Promesa de seguridad sin verificar** sobre la base de datos del servidor | Privacidad, sección 10 | Media | **Marcada como pendiente en la rama**. Propietario: confirmar |
| 7 | **Transferencias internacionales** (GitHub, Google, Discord, Tebex, alojamiento) sin un mecanismo documentado | Privacidad | Media | Abogado |
| 8 | **Registro de la base de datos** de jugadores ante la AAIP sin evaluar | Servidor | Media | Abogado y propietario |
| 9 | **Uso promocional de voz, imagen y clips** de jugadores por aceptar los términos | Términos, sección 5 | Media | Abogado: conviene un consentimiento aparte |
| 10 | **«Sin fines de lucro»** frente a una tienda con membresías | Términos, sección 1 (ya marcado pendiente) | Media | Propietario y abogado |
| 11 | **Edad mínima de 16 años** frente a un juego PEGI 18 | Términos, sección 2 (ya marcado pendiente) | Media | Propietario y abogado |
| 12 | **Arte de portada sobre imágenes de GTA V** (posible arte oficial de Rockstar) | Portada y vista previa en redes | Media | Propietario: ver `docs/REGISTRO_ASSETS.md` |
| 13 | **Metadatos con el nombre de una persona** en los PNG publicados | Raíz del sitio | Baja | Propietario |

## A. Privacidad y datos personales

### A.1 Qué datos pasan por el sitio (verificado en el código)

| Situación | Datos | Quién los recibe | Dónde | Cuándo | Comprobado |
|---|---|---|---|---|---|
| Visitar cualquier página | IP, navegador, página pedida | **GitHub** (alojamiento de GitHub Pages) | EE. UU. | Siempre | Configuración del repositorio. La retención la define GitHub |
| Aceptar la medición | Identificador aleatorio (cookies `_ga` y `_ga_1XMC8M5F5X`), páginas vistas, dispositivo, ubicación aproximada | **Google** (Analytics 4) | EE. UU. | **Solo después de aceptar** | Pruebas de cookies (sección 3 de `tests/verificar.mjs`): rechazar no descarga Analytics, retirar el consentimiento lo bloquea y borra las cookies |
| Decidir sobre cookies | La elección (`elysium_cookies`) | Nadie: queda en el navegador | Equipo de la persona | Al decidir | Código de `cookies.js` |
| Completar la postulación a staff | Usuario de Discord, edad, horario y respuestas, como borrador (`elysium_staff_draft`) | **Nadie mientras está en el sitio.** La persona descarga un `.txt` y lo adjunta en un ticket de Discord | Navegador; después, Discord | Si usa el formulario | Pruebas de staff (sección 8): no hay peticiones a terceros |
| Ver el estado del servidor | Ninguno de la persona | El navegador solo lee `/estado.json` del mismo dominio | — | Al abrir la portada | Pruebas de estado (sección 4) |
| Consulta del estado (servidor de GitHub) | Código público de Cfx.re y, si existe el secreto, la dirección del servidor | **Cfx.re** (listado público) y el propio servidor | GitHub Actions | Cada pocas horas | Workflow `estado-servidor.yml`. No toca datos de visitantes |
| Reproducir un video (si se publica alguno) | IP y cookies propias de YouTube o Twitch | **Google o Twitch** | EE. UU. | **Solo al apretar reproducir** | Pruebas del reproductor (sección 9) |
| Tipografías | — | Nadie: se sirven desde el sitio | — | — | Sección 1: cero peticiones a terceros en 17 páginas y 3 anchos |
| Seguir enlaces | Lo que pida el sitio de destino | Discord, Tebex, Rockstar, Steam, Epic, FiveM, redes | Varios | Al hacer clic | Sección 12: 12 enlaces externos, todos conocidos y por https |

**El sitio no tiene** cuentas de usuario, comentarios, foros ni publicidad, y ningún formulario envía datos a un servidor. El webhook que tuvo la postulación hasta el 14/09/2026 ya no está en el código (ver riesgo 1).

### A.2 Fuera del sitio (declarado, sin verificar)

Según la política del 21/09/2026, al conectarse al servidor se toman:

- la licencia de Rockstar, el Steam ID, el Discord ID y la IP;
- los datos del personaje y los registros de juego.

Discord procesa tickets y mensajes, y Tebex procesa los pagos. Nada de esto se puede comprobar desde el repositorio: **depende del propietario** (preguntas en `LEGAL_DATA_REQUIRED.md`).

### A.3 Frente a la Ley 25.326 (análisis a confirmar por un abogado)

1. **Deber de informar.** La ley exige informar, entre otras cosas, la identidad y el domicilio del responsable y la finalidad del tratamiento. La política explica bien finalidades y destinatarios, pero **el responsable no está identificado**: falta nombre o razón social, domicilio y un contacto escrito.
2. **Plazos para atender pedidos.** Según fuentes secundarias, la ley fija **5 días hábiles** para rectificar o suprimir (art. 16), y una resolución de la AAIP sancionó una respuesta tardía. Para el acceso, el plazo de **10 días corridos** (art. 14) es conocimiento general a verificar. El sitio prometía «30 días».
   - **Corregido en la rama** (privacidad y normas de comunidad): «dentro de los plazos que fija la ley aplicable», marcado pendiente hasta definirla.
   - Fuentes: [resolución AAIP RS-2019-137](https://www.argentina.gob.ar/sites/default/files/rs-2019-137-apn-aaip_4.pdf), [guía de denuncias de la AAIP](https://www.argentina.gob.ar/node/93199).
3. **Consentimiento y otras bases.** La regla general de la ley es el consentimiento, con excepciones como el tratamiento necesario para una relación contractual.
   - Analytics ya funciona con consentimiento previo.
   - Para el servidor, el Discord y las postulaciones, la política dice que el tratamiento es necesario para dar el servicio. **No se agregó ninguna base jurídica nueva.** La sección sigue marcada para revisión jurídica.
4. **Transferencias internacionales.** GitHub, Google, Discord, Tebex y probablemente el alojamiento del servidor tratan datos fuera de Argentina. La ley restringe las transferencias a países sin protección adecuada: suele resolverse con consentimiento o con cláusulas contractuales. **A verificar por un abogado.**
5. **Registro de bases de datos.** Las bases con datos personales pueden tener que inscribirse en el Registro Nacional de Bases de Datos de la AAIP. Sería la base del servidor de juego, no el sitio, que no guarda datos. **A evaluar.**
6. **Leyenda de la AAIP.** Conocimiento general a verificar: una disposición de la autoridad de control exige incluir en los avisos de privacidad una leyenda sobre la facultad de denunciar ante el organismo y el derecho de acceso gratuito. No se agregó: está propuesta en `legal/borradores/privacidad-propuesta.md` para que la confirme el abogado.
7. **Seguridad.** La política afirmaba que «la base de datos del servidor está protegida con credenciales de acceso restringido y solo la dirección técnica puede consultarla». **No se pudo verificar**: quedó marcada como pendiente de confirmación en la rama.
8. **Menores de edad.** Los términos fijan 16 años, mientras que GTA V es PEGI 18. El tratamiento de datos de menores suele exigir intervención de madre, padre o tutor. **A revisar.**
9. **Canal para ejercer derechos.** Hoy solo hay tickets de Discord, que exigen tener cuenta allí. Conviene sumar un correo electrónico.
10. **Público en la Unión Europea.** La comunidad se dirige también a España. Si eso incluye medir o atender a personas en la UE, un abogado debería evaluar el RGPD y la LSSI española. El aviso de cookies ya cumple prácticas exigentes: consentimiento previo y rechazar con el mismo peso que aceptar.

## B. Cookies y seguimiento (verificado con pruebas)

| Requisito | Resultado | Prueba |
|---|---|---|
| Nada no esencial antes de decidir | ✔ Analytics no se descarga hasta aceptar, y ninguna página pide recursos a terceros | Secciones 3 y 1 (17 páginas, 3 anchos) |
| Aceptar tiene efecto real | ✔ Analytics se carga solo después de aceptar | Sección 3 |
| Rechazar tiene efecto real | ✔ No se carga, ni siquiera al volver | Sección 3 |
| Configurar tiene efecto real | ✔ El interruptor refleja y guarda la elección | Sección 3 |
| Revocar | ✔ Bloquea el envío (`ga-disable`) y borra las cookies `_ga` | Sección 3 |
| Las tres opciones con el mismo peso | ✔ Mismo fondo, borde y tamaño | Sección 3 |
| Enlaces a la política, en escritorio y móvil | ✔ El aviso enlaza a `/cookies.html` y el pie lleva a cada documento legal a 1440 y 390 px | Secciones 3 y 12 |
| Textos coherentes con el código | ✔ La tabla de `cookies.html` lista exactamente lo que usa el código: `elysium_cookies`, `elysium_staff_draft`, `_ga` y `_ga_1XMC8M5F5X` | Revisión del código |
| Sin scripts, proxies ni servicios no identificados | ✔ Solo Google Analytics, con consentimiento. Ya no hay proxies de terceros ni Google Fonts | Sección 1 y búsqueda en el código |
| Un solo aviso | ✔ El aviso es único (`cookies.js`) | — |

**Ajuste:** la política de cookies figuraba como «Vigente». Ahora dice «En revisión · describe el funcionamiento real del sitio», como el resto de los documentos, hasta identificar al responsable.

**Pendiente del propietario** (en la propiedad de Analytics): plazo de retención, Google Signals y quién tiene acceso.

## C. Términos de uso y normas de comunidad

| Tema | Situación | Riesgo | Recomendación |
|---|---|---|---|
| Uso del sitio y servicios | Claro (t7): sitio informativo, estado orientativo, ilustraciones conceptuales | Bajo | — |
| Propiedad intelectual | Aclara la independencia de Rockstar y Cfx.re (t6 y aviso legal) | Bajo | Coordinar con el registro de assets: la portada usa imágenes de GTA V |
| Conducta y moderación | Normas y apelación de 15 días (moderación 1 y 2) | Bajo | Para quien pagó una membresía, que la expulsión y la pérdida de beneficios estén previstas de forma proporcional (ver D) |
| Suspensión y expulsión | Expulsión definitiva sin descargo para cheats, fraude, contenido sexual con menores y amenazas | Bajo a medio | Razonable para una comunidad privada. El abogado debe revisarlo junto con la tienda |
| Disponibilidad e interrupciones | t9: sin garantía de disponibilidad ni de conservación del progreso, con salvedad de los derechos legales | Medio | La salvedad ayuda. Frente a consumidores que pagaron, la exclusión total de responsabilidad puede considerarse abusiva |
| Contenido de usuarios | t5: el contenido es de quien lo publica, pero se autoriza a usarlo en clips, redes y el tráiler | **Medio** | El uso de la **voz y la imagen** de una persona suele requerir su consentimiento. Conviene un consentimiento aparte para el uso promocional y una vía simple para retirarlo |
| Restricciones razonables | Cuentas, prohibición de vender bienes del juego fuera de la tienda y suplantación (t3) | Bajo | — |
| Cambios y vigencia | t10: aviso de 7 días y aceptación por seguir conectándose | **Medio** | Para membresías pagas, permitir dar de baja con reintegro proporcional si el cambio perjudica. Se marcó pendiente de revisión jurídica |
| Cierre del proyecto | «No genera derecho a reembolso de aportes ya realizados» | **Medio a alto** | Puede chocar con derechos del consumidor por períodos pagados y no usados. Se marcó pendiente de revisión jurídica. No se cambió la condición |
| Ley aplicable | t11, pendiente | Medio | En contratos de consumo, el consumidor suele poder reclamar en su domicilio aunque el contrato diga otra cosa |
| Información enviada al soporte | Los tickets van por Discord. No hay plazo de conservación de tickets ni transcripciones | Medio | El propietario debe definirlo (cuestionario) |
| No copiar a terceros | No se usaron términos de GTAHUB ni plantillas genéricas: el texto parte del publicado por Elysium el 21/09/2026 | — | — |

## D. Tienda, membresías y pagos

### D.1 Qué se pudo verificar

- **Verificado en el código:**
  - el sitio enlaza a `https://elysium-488.tebex.io`, con una página previa (`tienda.html`) que avisa que es un sitio externo;
  - el sitio no procesa pagos ni datos de tarjetas;
  - no hay promesas del tipo «sin pay-to-win»: se retiraron el 27/10/2026 y la prueba de textos retirados lo controla.
- **No verificado** (dominios bloqueados):
  - productos, precios, moneda, impuestos y suscripciones;
  - las condiciones que muestra Tebex al pagar;
  - el papel exacto de Tebex.

  Tu mensaje indica que hay **membresías VIP** y otros productos.

### D.2 El papel de Tebex (fuentes secundarias)

- La [documentación de Tebex sobre su Checkout](https://docs.tebex.io/creators/tebex-checkout/faqs) lo describe como un servicio de pago que actúa como **comerciante registrado** (*merchant of record*): cobra, gestiona contracargos e impuestos.
- Algunas tiendas de creadores declaran que **Tebex Limited** vende y factura cada compra (por ejemplo, [estas condiciones de una tienda en Tebex](https://agency-script.tebex.io/agb)).
- Según guías de terceros, Cfx.re exige usar Tebex para monetizar servidores de FiveM y prohíbe vender moneda del juego por dinero real y las mecánicas de azar ([guía de monetización](https://www.gameserverkings.com/knowledge-base/fivem/server-monetisation/)). Hay que confirmarlo en el acuerdo de Cfx.re, que no se pudo consultar.
- **Lo que define la responsabilidad frente a quien compra es la configuración real de tu cuenta de Tebex:** si usa Tebex Checkout como comerciante registrado o pasarelas propias (PayPal o Stripe a tu nombre). En el segundo caso, el vendedor serías vos. **Dato del propietario.**

### D.3 Cláusulas publicadas con riesgo (condiciones del 21/09/2026, sin modificar)

| Cláusula | Riesgo | Normas a revisar |
|---|---|---|
| «Cualquier aporte… es una **donación voluntaria**» | Si a cambio se entregan beneficios (VIP, vehículos, cosméticos), puede tratarse de un contrato oneroso y no de una donación: la etiqueta no cambia la naturaleza del contrato | CCyC (donación y contratos de consumo) |
| «Todas las transacciones son finales… **renunciás a solicitar la devolución**» | En contratos de consumo, las renuncias a derechos del consumidor suelen ser nulas. En ventas a distancia hay un derecho de revocación, con excepciones posibles para contenido digital ya entregado, que exigen haber informado antes | Ley 24.240 (cláusulas abusivas y revocación); CCyC, arts. 1110 a 1116 |
| «Contracargo… **expulsión permanente e irrevocable**» | Penalizar el ejercicio de un reclamo ante el medio de pago puede considerarse abusivo | Ley 24.240 |
| «Si un donante es sancionado… **no tiene derecho a reclamar devolución**» | Puede sostenerse si la sanción es proporcional y está prevista con claridad; hay que revisarlo | Ley 24.240 y CCyC |
| «Los beneficios… **pueden ajustarse por balance**» | Modificar unilateralmente lo pagado | Ley 24.240 y CCyC |
| «Tenemos hasta **72 horas** para resolverlo» | Compromiso propio. Confirmar que se cumpla | — |

Un borrador alternativo, **no publicado**, está en `legal/borradores/condiciones-tienda-propuesta.md`.

### D.4 Disposición 954/2025 y otras obligaciones de comercio electrónico

Lo que dicen fuentes secundarias:

- **Contenido:** la Disposición 954/2025 se publicó en el Boletín Oficial el 04/09/2025. Unifica el derecho de arrepentimiento y la baja de servicios contratados a distancia, exige un **«Botón de Arrepentimiento»** y un **«Botón de Baja de Servicio»** visibles desde el primer acceso, sin registro previo, y reemplaza a las Resoluciones 424/2020 y 316/2018. Dio 60 días corridos para adecuarse.
  - Fuentes: [Beccar Varela](https://beccarvarela.com/novedades/disposicion-n-954-2025-actualizacion-integral-de-la-normativa-sobre-contratacion-a-distancia-derecho-de-arrepentimiento-y-baja-de-servicios/), [abogados.com.ar](https://abogados.com.ar/se-unifican-el-derecho-de-arrepentimiento-y-el-boton-de-baja-de-servicios/37500), [Contadores en red](https://contadoresenred.com/ejercicio-del-derecho-de-arrepentimiento-y-la-baja-de-servicios-contratados-a-distancia-disposicion-954-2025/), [Palabras del Derecho](https://www.palabrasdelderecho.com.ar/articulo/6214/Empresas-de-venta-online-deberan-exhibir-el-boton-de-arrepentimiento-o-baja-de-servicio).
  - Detalles como plazos de respuesta o códigos de gestión **no se pudieron confirmar**.
- **Resolución 274/2021:** los proveedores en entornos digitales deben mostrar un enlace a la Ventanilla Única Federal con la leyenda «Defensa de las y los Consumidores. Para reclamos ingrese aquí».
  - Fuentes: [abogados.com.ar](https://abogados.com.ar/defensa-del-consumidor-obligacion-de-establecer-un-enlace-link-a-la-ventanilla-unica-federal/28038), [Allende & Brea](https://allende.com/administrativo/creacion-de-la-ventanilla-unica-federal-en-el-ambito-de-la-direccion-nacional-de-defensa-del-consumidor-y-arbitraje-del-consumo-03-31-2021/).

**¿Se aplica a Elysium?** No se puede concluir sin estos datos:

1. Si hay compradores en Argentina y desde dónde se administra Elysium.
2. Quién vende: Tebex como comerciante registrado o vos con pasarelas propias. En la cadena de consumo puede haber responsabilidad de todos los que participan, incluido quien entrega el beneficio dentro del servidor.
3. Si la tienda de Tebex ya muestra esos botones y enlaces, y si además deben estar en elysiumesrp.com.
4. Si hay **suscripciones** con renovación automática, que es justo lo que regula el botón de baja.

**Resultado: revisión jurídica requerida, prioridad alta.** No se presupone que la tienda esté exenta ni incluida.

**Preparado para cuando haya criterio:** se puede agregar en el pie y en `tienda.html` un enlace «Botón de arrepentimiento», más el de baja si hay suscripciones y el de la Ventanilla Única. Llevarían a una página que explique el trámite (dónde se pide, qué dato hace falta y en qué plazo se responde). Ese proceso lo debe definir la administración con su abogado: el sitio no puede inventarlo.

## E. Documentos y enlaces legales (verificado)

| Control | Resultado |
|---|---|
| Las seis páginas legales existen y responden | ✔ 200 en `privacidad`, `cookies`, `terminos`, `moderacion`, `condiciones-tienda` y `aviso-legal` (secciones 1 y 12) |
| Sin enlaces rotos ni anclas faltantes | ✔ Todos los enlaces internos de las 17 páginas responden 200 y sus anclas existen (sección 2) |
| Rutas antiguas | ✔ `terminos.html#p5`, `#s2` y el resto redirigen a la sección nueva (sección 6) |
| Fáciles de encontrar | ✔ El pie de **todas** las páginas enlaza a cada documento por separado. La privacidad tiene enlace directo, a 1440 y 390 px (sección 12) |
| Coherencia entre pie, aviso de cookies y tienda | ✔ El aviso enlaza a la política de cookies; la tienda, a sus condiciones; el pie, a todo |
| Sin datos ficticios presentados como reales | ✔ Lo que falta se muestra como «pendiente». Compromisos como 72 horas, 15 minutos, 7 o 15 días y 12 meses vienen de los textos del 21/09/2026 y figuran en el cuestionario para que los confirmes |
| Ningún documento presentado como definitivo | ✔ Cinco dicen «Borrador en revisión» o «En revisión». Las condiciones de la tienda dicen «Vigente, en revisión», porque son las del 21/09/2026 y no se cambiaron |

## Correcciones hechas en esta etapa (rama)

1. Privacidad, sección 8, y normas de comunidad, sección 4: «30 días» pasa a «los plazos que fija la ley aplicable», marcado pendiente.
2. Privacidad, sección 10: la afirmación sobre la seguridad de la base de datos queda marcada como pendiente de confirmación.
3. Términos, secciones 5 y 10: las cláusulas de uso promocional y de cierre sin reembolso quedan marcadas para revisión jurídica, sin cambiar su contenido.
4. Política de cookies: «Vigente» pasa a «En revisión · describe el funcionamiento real del sitio».

**No se cambiaron** precios, productos, suscripciones, la configuración de Tebex ni el texto de las condiciones de la tienda.
