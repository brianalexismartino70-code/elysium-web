# Auditoría legal y de privacidad — elysiumesrp.com

- **Fecha:** 28/10/2026.
- **Rama:** `claude/nice-ritchie-njorw8`.
- **Alcance:** el sitio, sus formularios, enlaces externos, la tienda enlazada y lo que el sitio dice del servidor y del Discord. Desde la ampliación del 28/10/2026, también las leyes de otros países (sección F).

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
- **Normas de otros países:** ver la matriz de la sección F.3.

## Resumen de riesgos

| # | Riesgo | Dónde | Prioridad | Quién lo resuelve |
|---|---|---|---|---|
| 1 | **Webhook de Discord válido en el historial público** | Git, hasta el 14/09/2026 | **Crítica** | Propietario: eliminar el webhook (ver `docs/LIMPIEZA_HISTORIAL.md`) |
| 2 | **Condiciones de la tienda con cláusulas que la ley de consumo podría anular**: compras como «donación», renuncia a reembolsos sin salvedad por país (F.6), expulsión por contracargo | `condiciones-tienda.html` (texto del 21/09/2026, vigente) | **Alta** | Abogado y propietario. **No se modificó**: es una condición comercial |
| 3 | **Botón de arrepentimiento, botón de baja y enlace de reclamos**: no hay ninguno y su obligación no está analizada. En la UE rige además una función de desistimiento en línea desde el 19/06/2026 (F.6) | Sitio y tienda | **Alta** | Abogado, con los datos de Tebex del propietario |
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
| 14 | **Alcance internacional sin definir**: no se sabe dónde está el responsable ni a qué países se dirige la comunidad | Todo el sitio | **Alta** | Propietario (preguntas 4, 5, 8 y 40) y abogado |
| 15 | **Representante en la UE y en el Reino Unido**, que podría ser obligatorio (art. 27) | Privacidad | Media | Abogado (pregunta 47) |
| 16 | **Jugadores de 16 y 17 años con permiso presunto**, frente al Children's Code británico y el ECA Digital de Brasil | Términos, sección 2 | Media | Propietario y abogado (preguntas 25 y 44) |
| 17 | **Pedidos sobre datos sin procedimiento**: quién los atiende, cómo se verifica la identidad y en qué plazo | Privacidad, sección 10 | Media | Propietario (pregunta 45) |
| 18 | **Prueba del consentimiento de cookies** guardada solo en el navegador | Cookies | Baja | Abogado |

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
10. **Público en otros países.** La comunidad podría dirigirse también a España y a otros países. Si eso incluye medir o atender a personas fuera de Argentina, un abogado debería evaluar el RGPD, la LSSI española y las demás leyes de la sección F. El aviso de cookies ya sigue prácticas exigentes: consentimiento previo, rechazo con el mismo peso que la aceptación y, desde esta ampliación, la señal GPC.

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

## F. Alcance internacional (ampliación del 28/10/2026)

> Esta sección amplía la auditoría para personas de otros países. **No declara que el sitio cumpla la ley de ningún país ni promete riesgo legal cero.** Separa lo que se verificó técnicamente (código y pruebas) de lo que necesita una conclusión jurídica, que queda para un abogado.

### F.1 Método y límites

- **Verificado técnicamente:** el código del sitio y las pruebas automáticas (`tests/verificar.mjs`, secciones 3 y 14).
- **Fuentes oficiales: no consultadas.** El 28/10/2026 el proxy del entorno rechazó con un error 403 todos los sitios oficiales probados:
  - Unión Europea: EUR-Lex, el CEPD y el Tribunal de Justicia;
  - España y Reino Unido: AEPD, ICO y legislation.gov.uk;
  - Brasil: Planalto y gov.br;
  - Estados Unidos: FTC, eCFR, la Legislatura de California, su agencia de privacidad y su fiscalía;
  - América Latina: DOF y Cámara de Diputados de México, BCN de Chile, SIC de Colombia, gob.pe y argentina.gob.ar;
  - plataformas: Discord, Rockstar Games, FiveM, el checkout de Tebex y globalprivacycontrol.org.

  La lista para habilitarlos está en `LEGAL_DATA_REQUIRED.md`, parte 3.
- **Fuentes secundarias:** resúmenes de un buscador web sobre artículos de estudios jurídicos, universidades y prensa especializada, enlazados en F.8. **No se presentan como leídos en su sitio original**: se cita lo que mostraba el buscador, y hay que confirmarlo en el texto oficial.
- **Conocimiento general:** marcado «a verificar».

### F.2 Qué decide qué leyes se aplican

| Factor | Qué se sabe | Qué falta (cuestionario) |
|---|---|---|
| Dónde está el responsable | Nada: no hay titular identificado | 4 y 5 |
| A quién se dirige | Sitio y comunidad en español; el nombre lleva «ES» | 8 y 40 |
| Qué datos se tratan | Sitio: verificado (A.1). Servidor, Discord y tienda: declarado, sin verificar (A.2) | 10, 12 y 14 |
| Proveedores | GitHub, Google (solo con consentimiento), Discord, Cfx.re y Rockstar, Tebex y un alojamiento sin identificar | 11 y 48 |
| Pagos | Tebex; su rol exacto está sin confirmar | 16, 20, 42 y 43 |
| Canales de atención | Tickets de Discord; no hay correo | 7 y 45 |

Sin esos datos **no se puede concluir qué leyes se aplican**. Tampoco se puede suponer que Elysium queda exento por administrarse desde Argentina: varias de estas leyes alcanzan a responsables del extranjero que ofrecen servicios a personas en su territorio o miden su comportamiento.

### F.3 Matriz por país o región

Cada fila dice por qué una ley **podría** aplicarse, no que se aplique. Los números de «Datos faltantes» son preguntas de `LEGAL_DATA_REQUIRED.md`; la 4, la 5 y la 8 sirven para todas las filas. Las fuentes de cada fila están en F.8.

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

### F.4 Cookies por región

**Lo que hace el sitio (verificado con pruebas):**

- Google Analytics es el único servicio opcional y no se descarga hasta que la persona lo acepta (secciones 1 y 3).
- Aceptar, rechazar y configurar tienen el mismo peso. Retirar el consentimiento bloquea el envío y borra las cookies `_ga` (sección 3).
- **Nuevo:** la señal GPC vale como rechazo para cualquier persona. Con la señal encendida, la medición no se puede activar (sección 14).
- La elección se guarda solo en el navegador durante 12 meses, con la fecha y el estado de la señal GPC.
- El criterio es el mismo para todos los países: no hay detección de país ni selector.

| Región | Regla general (fuentes secundarias) | El sitio | Qué revisar |
|---|---|---|---|
| UE y España | Consentimiento previo para lo que no es necesario; rechazar tan fácil como aceptar. La AEPD considera buena práctica que el consentimiento no dure más de 24 meses y admite una exención limitada para cierta medición de audiencia sin cesión a terceros | Consentimiento previo durante 12 meses, sin exenciones | El RGPD pide poder demostrar el consentimiento (art. 7.1); hoy solo queda en el navegador |
| Reino Unido | Desde el 05/02/2026, algunas cookies estadísticas pueden usarse sin consentimiento, con condiciones estrictas | No usa esa excepción | Nada, salvo que se quiera aprovecharla |
| EE. UU. | No hay una regla federal general sobre cookies. En California, Colorado y otros estados, las empresas alcanzadas deben aceptar señales como GPC para excluir la venta o el uso compartido | Respeta GPC para todos | Umbrales (F.3) |
| Brasil | La LGPD exige una base legal para cada tratamiento. La ANPD publicó una guía sobre cookies (conocimiento general, a verificar) | Consentimiento previo | Nada urgente |
| Argentina y el resto de América Latina | No se encontró una regla específica de cookies; rige la ley general de datos (a verificar) | Consentimiento previo | Nada urgente |

**Conclusión técnica, no jurídica:** el sitio aplica a todos el patrón más exigente que mostraron las fuentes: permiso previo, rechazo equivalente, revocación efectiva y GPC. Queda para el abogado si alcanza en cada país y si hace falta una prueba del consentimiento fuera del navegador. Esa prueba obligaría a guardar datos nuevos en un servidor: **no se implementó** y la decide el propietario.

### F.5 Menores de edad por región

**Hechos:**

- Términos, sección 2: 16 años para jugar; entre 16 y 17 «se entiende» que hay permiso de madre, padre o tutor (marcado pendiente). 18 años para el staff.
- GTA V: PEGI 18 y ESRB Mature, según los términos.
- Discord exige al menos 13 años y la edad mínima de cada país. Por debajo de la mayoría de edad, la madre, el padre o el tutor acepta los términos por la persona. Fuente: resumen del buscador de la versión vigente desde el 29/09/2025; `discord.com` está bloqueado.
- FiveM y Cfx.re, Rockstar Games y Tebex: **edades no verificadas** (dominios bloqueados).

| Región | Regla (fuentes secundarias o conocimiento general) | Con la regla actual de 16 años | Qué decidir o revisar |
|---|---|---|---|
| UE y EEE | El consentimiento de un menor para servicios en línea vale desde una edad de entre 13 y 16 años, según el país; en España, 14 | Cualquier jugador de 16 o más puede aceptar la medición | La capacidad para comprar en la tienda, según cada país |
| Reino Unido | Consentimiento digital desde los 13. El Children's Code alcanza a servicios en línea, incluidos juegos, que probablemente usen menores de 18 en el Reino Unido | Con jugadores de 16 y 17 años, el código podría aplicarse si hay usuarios británicos | Una evaluación documentada del alcance |
| Brasil | LGPD: interés superior y consentimiento parental para menores de 12. ECA Digital (menores de 18): verificación de edad confiable en ciertos casos, herramientas de supervisión y prohibición de cajas de recompensa en juegos | Si hay adolescentes en Brasil, podría aplicarse | Preguntas 25 y 44 |
| EE. UU. | COPPA protege a menores de 13 | No se aplica si no hay menores de 13 y el servicio no se dirige a ellos. Ojo: Discord admite desde los 13 | Pregunta 25 |
| Argentina | La Ley 25.326 no fija una edad; el Código Civil y Comercial regula la capacidad de los menores (a verificar) | «Se entiende que contás con permiso» es un consentimiento presunto | Si hace falta un permiso expreso |
| Chile, Colombia, México y Perú | Reglas propias sobre datos de niños y adolescentes (a verificar) | Sin analizar | Solo si hay jugadores de esos países |

**Qué no se hizo:** no se fijó una edad nueva ni una edad por país. El sitio no detecta el país, así que no puede aplicar edades distintas: una regla por país solo funcionaría si la aplica el staff. La política de privacidad remite a los términos y menciona la regla de Discord sin contradecirla.

**Opciones para el propietario** (no son una recomendación jurídica):

1. Mantener 16 años, con un permiso real de madre, padre o tutor para quienes tengan 16 y 17.
2. Subir a 18 años, en línea con la clasificación PEGI 18 del juego.
3. En cualquier caso, que la edad coincida en los términos, la privacidad, las reglas del Discord, la postulación a staff y la tienda.

### F.6 Tienda: privacidad y condiciones comerciales por separado

**Privacidad (datos de la compra):**

- Tebex procesa el pago. Según su documentación, actúa como comerciante registrado (D.2).
- Según la política de privacidad de [una tienda de terceros alojada en Tebex](https://fastscripts.tebex.io/terms/privacy), Tebex comparte con quien administra la tienda el nombre, el correo, el país, el detalle del pedido, el ID de Discord y el estado del pago, pero no los datos de la tarjeta. **Hay que confirmarlo en el panel de Elysium** (pregunta 20).
- Elysium usa esos datos para entregar los beneficios, y ese uso es responsabilidad de Elysium. El cobro, los impuestos y la tarjeta son de Tebex.

**Condiciones comerciales (sin cambios):**

| Región | Desistimiento o retracto | Suscripciones | Información obligatoria |
|---|---|---|---|
| Argentina | Revocación en 10 días, con excepciones para contenido digital (a verificar) | Botón de baja (Disposición 954/2025), si se aplica | Botón de arrepentimiento y enlace de reclamos, si se aplican |
| UE | 14 días; en contenido digital se pierde con consentimiento expreso y reconocimiento previos | Función de desistimiento en línea desde el 19/06/2026 | Precio final con impuestos e identidad del vendedor |
| Reino Unido | 14 días, con una excepción parecida para contenido digital | Régimen de la DMCC, previsto para 2027 | Igual que en la UE |
| Brasil | 7 días (Código de Defensa del Consumidor, art. 49) | — | Identificación del proveedor en el sitio de venta (Decreto 7.962/2013) |
| EE. UU. | No hay un derecho general | ROSCA y, en California, consentimiento, recordatorios y baja en línea | Condiciones claras antes de cobrar |
| Chile, Colombia, México y Perú | Plazos y excepciones propios: 10 días en Chile; en Colombia, excepciones discutidas; México y Perú, a verificar | — | A verificar |

- **Moneda e impuestos:** los fija Tebex en el checkout (pregunta 42). El sitio no muestra precios y no debe prometerlos.
- **Lo que dice hoy el sitio:** `tienda.html` avisa que la tienda es externa y enlaza a las condiciones. Las condiciones del 21/09/2026 dicen que todas las compras son finales y no reembolsables, **sin salvedad por país**. Frente a esta tabla, es el principal riesgo comercial (D.3). **No se cambió**: es una condición comercial que decide el propietario con su abogado.
- **Borrador:** `legal/borradores/condiciones-tienda-propuesta.md` suma una sección para compradores de otros países. No está publicada.

### F.7 Cambios hechos en la rama (verificación técnica)

1. `cookies.js`: la señal GPC vale como rechazo para todas las personas. Con la señal, el interruptor de medición queda desactivado, el botón «Aceptar» no aparece y la elección se guarda con `gpc: true`.
2. `cookies.html`: secciones nuevas sobre GPC, el mismo criterio en todos los países y cómo se registra la elección. La tabla describe lo que guarda `elysium_cookies`.
3. `privacidad.html`: una política principal para cualquier país, con quién controla cada dato, transferencias, incidentes y anexos regionales A a E. Se conservan las anclas `#p1` a `#p7`, que usan otras páginas.
4. `_layouts/legal.html`: el índice puede numerar con letras (anexos A a E).
5. Pruebas nuevas en la sección 14 de `tests/verificar.mjs`.

**No se hizo, a propósito:**

- un selector de país o protecciones distintas por país;
- analítica, seguimiento o marketing nuevos;
- cambios en Tebex, productos, precios, suscripciones o condiciones de la tienda;
- publicar como definitivo un documento legal o la leyenda de la AAIP.

### F.8 Fuentes secundarias por región

Resultados de búsqueda usados como orientación. Ninguno reemplaza el texto oficial.

- **Unión Europea y España**
  - Representante (art. 27): [texto del artículo en gdpr-info.eu](https://gdpr-info.eu/art-27-gdpr/) y [análisis de GDPR Local](https://gdprlocal.com/gdpr-article-27-gdpr-exemptions/).
  - Cookies: [Garrigues](https://www.garrigues.com/es_ES/noticia/la-nueva-guia-de-cookies-de-la-aepd-obliga-revisar-las-politicas-de-las-webs-de-las-empresas), [PwC](https://periscopiofiscalylegal.pwc.es/nueva-guia-de-uso-de-las-cookies-publicada-por-la-aepd/) y [Finreg360 sobre medición de audiencia](https://finreg360.com/alerta/la-aepd-publica-la-guia-uso-de-cookies-para-herramientas-de-medicion-de-audiencias/).
  - Función de desistimiento: [Greenberg Traurig](https://www.gtlaw.com/es/insights/2026/5/eu-consumer-law-new-withdrawal-button-requirements-for-online-contracts) e [iubenda](https://www.iubenda.com/en/blog/online-withdrawal-function-eu-directive-2023-2673/).
  - Adecuación de Argentina y del Reino Unido: [revisión de 2024](https://www.hunton.com/privacy-and-cybersecurity-law-blog/european-commission-reviews-and-reaffirms-adequacy-decisions-for-11-jurisdictions) y [renovación del Reino Unido](https://www.hunton.com/privacy-and-cybersecurity-law-blog/european-commission-renews-uk-data-adequacy-decisions), ambas de Hunton.
  - Marco de Privacidad de Datos UE-EE. UU.: [JD Supra](https://www.jdsupra.com/legalnews/european-court-of-justice-to-review-2760225/) y [Captain Compliance](https://captaincompliance.com/education/latombe-pleas-in-eu-us-data-privacy-framework-appeal-published-in-eu-official-journal/).
- **Reino Unido**
  - Data (Use and Access) Act: [A&O Shearman](https://www.aoshearman.com/en/insights/ao-shearman-on-data/key-data-protection-changes-under-the-data-use-and-access-act-2025-comes-into-force), [Wiggin](https://www.wiggin.co.uk/insight/key-provisions-of-the-data-use-and-access-act-2025-come-into-force/) y [Secure Privacy](https://secureprivacy.ai/blog/uk-data-use-and-access-act-2025-pecr-cookie-consent-changes-and-how-to-comply).
  - Children's Code: [Orrick](https://www.orrick.com/en/Insights/2021/07/The-UKs-Age-Appropriate-Design-Code-Comes-into-Force-in-September-2021) y [ESRB](https://esrb.org/privacy-certified-blog/what-is-the-ico-age-appropriate-design-code).
  - Suscripciones (DMCC): [Taylor Wessing](https://www.taylorwessing.com/de/insights-and-events/insights/2026/04/subscription-contracts), [DWF](https://dwfgroup.com/en/news-and-insights/insights/2026/3/subscription-contracts-preparing-for-change-in-2026) y [Bird & Bird](https://cm.twobirds.com/en/insights/2026/uk/new-uk-legislation-to-mean-stricter-rules-for-subscription-services).
- **Brasil**
  - Alcance de la LGPD: [Serpro](https://www.serpro.gov.br/menu/noticias/noticias-2021/dados-pessoais-de-estrangeiros-o-que-a-lgpd-diz-sobre-isso), [Confidata](https://confidata.com.br/blog/lgpd-comentada-02-aplicacao-territorial-excecoes) y [Jus.com.br](https://jus.com.br/artigos/95910/dados-pessoais-consideracoes-para-empresas-estrangeiras).
  - Agentes pequeños: [Conjur](https://www.conjur.com.br/?p=365241) y [Demarest](https://www.demarest.com.br/conselho-diretor-aprova-regulamento-de-aplicacao-da-lgpd-para-agentes-de-tratamento-de-pequeno-porte/).
  - Incidentes: [Mattos Filho](https://www.mattosfilho.com.br/unico/regulamento-incidente-seguranca/), [Confidata](https://confidata.com.br/blog/comunicacao-incidente-seguranca-anpd) y [presentación en el foro de CERT.br](https://forum.cert.br/forum2024/slides/forumcsirts2024-opiceblum.pdf).
  - ECA Digital: [Machado Meyer](https://www.machadomeyer.com.br/pt/inteligencia-juridica/publicacoes-ij/direito-digital/estatuto-digital-da-crianca-e-do-adolescente-lei-n-15-211-2025-entra-em-vigor-em-17-de-marco-de-2026) y [Confidata](https://confidata.com.br/blog/eca-digital-o-que-muda-empresas).
  - Comercio electrónico: [Decreto 7.962/2013 en el sitio de la Cámara de Diputados](https://www2.camara.leg.br/legin/fed/decret/2013/decreto-7962-15-marco-2013-775557-publicacaooriginal-139266-pe.html) (enlace oficial devuelto por el buscador, no abierto desde el entorno).
- **Estados Unidos**
  - COPPA: [BBB National Programs](https://bbbprograms.org/media/insights/blog/coppa-amended) y [Mondaq](https://www.mondaq.com/unitedstates/privacy-protection/1621136/ftc-finally-publishes-amended-coppa-rule-compliance-deadlines-set).
  - «Click-to-cancel» y renovación automática en California: [Fenwick](https://www.fenwick.com/insights/publications/eighth-circuit-vacates-ftcs-click-to-cancel-rule) y [JD Supra](https://www.jdsupra.com/legalnews/ftc-click-to-cancel-rule-on-hold-but-2056488).
  - Umbrales de la CCPA: [Clym](https://www.clym.io/blog/ccpa-applicability-guide) y [Sprinto](https://sprinto.com/ccpa/).
  - Otros estados: [Baker Donelson](https://bakerdonelson.com/privacy-laws-ring-in-the-new-year-state-requirements-expand-across-the-us-in-2026) y [Feroot](https://www.feroot.com/blog/when-do-u-s-state-privacy-laws-apply-scope-and-thresholds).
  - GPC: [explicación del W3C](https://w3c.github.io/gpc/explainer), [Mondaq sobre Colorado](https://www.mondaq.com/unitedstates/privacy-protection/1485232/colorado-privacy-act-requires-universal-optout-starting-july-1-2024) y [Foley](https://www.foley.com/p/102iw4p/colorado-state-ag-approves-global-privacy-signal-as-first-universal-opt-out-mec/).
- **México:** [Garrigues](https://www.garrigues.com/es_ES/noticia/mexico-nueva-ley-federal-proteccion-datos-personales-posesion-particulares-introduce) y [Usercentrics](https://usercentrics.com/es/knowledge-hub/lfpdppp-mexico/).
- **Chile:** [Diario Constitucional](https://www.diarioconstitucional.cl/2026/06/12/la-ley-21-719-entra-en-vigor-el-1-de-diciembre-y-expone-vacios-en-regulacion-de-pequenas-empresas/), [OneTrust](https://www.onetrust.com/es/glossary/ley-de-proteccion-de-datos-chile/) y [Lawwwing](https://lawwwing.com/la-nueva-era-de-la-proteccion-de-datos-en-chile-que-cambia-con-la-ley-21-719/). Retracto: [Universidad Diego Portales](https://derechoyconsumo.udp.cl/wp-content/uploads/2014/11/An%C3%A1lisis-cr%C3%ADtico-del-retracto.pdf).
- **Colombia:** [Asuntos Legales sobre países adecuados](https://www.asuntoslegales.com.co/actualidad/la-superindustria-avala-el-intercambio-de-datos-personales-con-mas-de-37-paises-2613831), [Allende & Brea sobre la Circular 003/2025](https://allende.com/?p=21743) y [Universidad del Rosario sobre el retracto](https://repository.urosario.edu.co/bitstreams/50627b08-52c7-4cc2-b2c9-ba2ae231f43a/download).
- **Perú:** [texto del Decreto Supremo 016-2024-JUS en vLex](https://vlex.com.pe/vid/decreto-supremo-n-016-1060435180) y [PUCP sobre el retracto](https://repositorio.pucp.edu.pe/index/handle/123456789/143733).
- **Plataformas:** [condiciones de Discord](https://discord.com/terms) (bloqueado; se usó el resumen del buscador) y la documentación de Tebex citada en D.2.

## Correcciones hechas en esta etapa (rama)

1. Privacidad, sección 8, y normas de comunidad, sección 4: «30 días» pasa a «los plazos que fija la ley aplicable», marcado pendiente.
2. Privacidad, sección 10: la afirmación sobre la seguridad de la base de datos queda marcada como pendiente de confirmación.
3. Términos, secciones 5 y 10: las cláusulas de uso promocional y de cierre sin reembolso quedan marcadas para revisión jurídica, sin cambiar su contenido.
4. Política de cookies: «Vigente» pasa a «En revisión · describe el funcionamiento real del sitio».
5. Ampliación internacional: política de privacidad para cualquier país, con anexos regionales, y señal GPC en el aviso y en la política de cookies (F.7). Todo sigue como borrador en revisión.

**No se cambiaron** precios, productos, suscripciones, la configuración de Tebex ni el texto de las condiciones de la tienda.
