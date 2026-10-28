# Foro de la comunidad: evaluación y recomendación

- **Última revisión:** 28/10/2026.
- **Fuentes:** conocimiento general de cada plataforma. **No se pudo consultar** la documentación oficial de Discord ni de Discourse, ni el foro de referencia `foro.gtahub.gg`: el entorno de trabajo bloquea esos dominios. Los costos son órdenes de magnitud y hay que confirmarlos antes de contratar.

## Punto de partida

- El sitio es estático y está alojado gratis en GitHub Pages. No tiene servidor propio, base de datos ni cuentas de usuario.
- Un foro real necesita todo eso, más correo saliente, moderación, protección contra spam y copias de seguridad. Nada de eso se puede hacer de forma segura en GitHub Pages.
- Por eso **no hay ni habrá un foro de imitación** en el sitio: una página que parezca un foro sin dejar publicar engañaría a la comunidad.

## Comparación

| Criterio | **A. Canales de tipo Foro en el Discord oficial** | **B. Discourse autoalojado** (u otra plataforma mantenida) |
|---|---|---|
| Costo | Sin costo | Servidor virtual (del orden de USD 10 a 20 por mes con 2 GB de RAM) más correo transaccional. El plan alojado oficial cuesta bastante más |
| Alojamiento | Lo da Discord | Propio: Docker en un servidor virtual, más un subdominio como `foro.elysiumesrp.com`, que exige **tocar el DNS** |
| Autenticación | Cuenta de Discord, que la comunidad ya usa | Cuentas propias o inicio de sesión con Discord (OAuth). Hay que configurarlo y mantenerlo |
| Seguridad | La gestiona Discord. Elysium solo administra roles y permisos | A cargo de Elysium: actualizaciones, certificados, copias de seguridad y endurecimiento del servidor |
| Moderación | Roles, permisos, AutoMod, hilos, etiquetas, cierre y fijado de publicaciones | Muy completa: niveles de confianza, cola de revisión, silencios, marcado por la comunidad |
| Antispam | AutoMod de Discord y verificación del servidor | Niveles de confianza, límites de publicación y servicios antispam externos |
| Privacidad | Datos en Discord (EE. UU.) bajo sus condiciones. Ya figura en la política de privacidad | Datos en el servidor que se elija: hay que actualizar la privacidad, sumar cookies de sesión y definir la conservación |
| Copias de seguridad | No hay exportación completa simple. Discord conserva el contenido mientras exista el servidor | Copias automáticas diarias, que hay que guardar fuera del servidor y probar |
| Mantenimiento | Casi nulo | Continuo: actualizaciones y monitoreo, una persona técnica responsable |
| Visibilidad | Solo para miembros. Los buscadores no lo indexan | Público e indexable si se quiere |
| Requisito previo | El servidor debe tener activada la función «Comunidad» de Discord para crear canales de foro **[a confirmar en el panel]** | Presupuesto, alojamiento, equipo de moderación y DNS |

Flarum, NodeBB y phpBB tienen el mismo costo de infraestructura que Discourse, con ecosistemas más chicos o interfaces más antiguas. No cambian la conclusión.

## Recomendación concreta

**Fase actual: opción A, canales de tipo Foro en el Discord oficial.** Es la única que funciona de verdad sin presupuesto ni mantenimiento. Además, la comunidad ya está en Discord y la moderación ya existe ahí.

1. En el Discord, crear o confirmar los canales de foro con etiquetas: **anuncios** (solo lectura), **novedades**, **guías**, **soporte**, **bugs** y **sugerencias**. Soporte, apelaciones y compras siguen por ticket, que deja registro.
2. Pasarme los **enlaces reales** de cada canal (clic derecho → «Copiar enlace»). Con ellos, la página Comunidad enlaza directo a cada uno. Mientras no los tenga, la página organiza esos temas con destinos que ya existen: Novedades del sitio, Cómo entrar, Normativa, Soporte por ticket y la invitación general del Discord.
3. La sección se llama **«Comunidad»**, nunca «Foro activo».

**Fase posterior: opción B, solo si se cumplen todas estas condiciones.** Se necesita contenido público indexable (guías largas o historias de personajes), hay presupuesto mensual, una persona técnica asume el mantenimiento, hay al menos dos personas de moderación y se decide tocar el DNS. Antes de abrir habría que:

- elegir alojamiento y presupuesto;
- crear el subdominio;
- configurar el inicio de sesión con Discord, el correo saliente y las copias de seguridad;
- actualizar privacidad, cookies y las normas de moderación (`moderacion.html` ya prevé extenderse a un foro);
- definir la edad mínima del foro.

## Lo que no se hace

- No se publica una página que simule un foro sin permitir publicar ni moderar.
- No se inventa una invitación permanente ni enlaces a canales que no existan: se usa solo `https://discord.gg/4mTVJhu3gx`, la invitación que ya usaba el sitio, hasta que confirmes que es permanente (cuestionario, pregunta 34).
