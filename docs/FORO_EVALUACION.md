# Foro de la comunidad: evaluación

Última revisión: 27/10/2026.

## Punto de partida

- El sitio es estático, alojado gratis en GitHub Pages. No tiene servidor propio, base de datos ni cuentas de usuario.
- Un foro real necesita cuentas, sesiones, base de datos, correo saliente, moderación, protección contra spam y copias de seguridad. Nada de eso se puede hacer de forma segura en GitHub Pages.
- Por eso **no se construyó un foro de imitación**: la página Comunidad explica que el foro está en evaluación y lleva al Discord oficial.

## Opciones

| Opción | Qué es | A favor | En contra |
|---|---|---|---|
| **Canales de foro de Discord** | Tipo de canal de Discord con publicaciones, etiquetas e hilos | Sin costo ni infraestructura; la comunidad ya está ahí; moderación y AutoMod incluidos | No es público en la web ni lo encuentran los buscadores; exige cuenta de Discord |
| **Discourse** | Foro de código abierto, muy usado por comunidades de juegos | Maduro, con niveles de confianza, antispam y moderación; admite inicio de sesión con Discord | Necesita un servidor propio (Docker, 2 GB de RAM como referencia) y correo saliente, o el plan pago del servicio oficial; mantenimiento |
| **Flarum** | Foro liviano en PHP | Simple y moderno; extensiones | Ecosistema más chico; también necesita servidor y mantenimiento |
| **NodeBB** | Foro en Node.js | Tiempo real, integración con Discord | Requiere Node y base de datos; mantenimiento |
| **phpBB** | Foro clásico en PHP | Muy probado, hosting barato | Interfaz antigua |

## Recomendación

1. **Etapa 1 (ahora, sin costo):** crear o usar canales de foro en el Discord oficial (sugerencias, ayuda, historias de personajes) y enlazarlos desde la página Comunidad.
2. **Etapa 2 (si se necesita un foro público):** Discourse autoalojado en un subdominio (por ejemplo, `foro.elysiumesrp.com`) con:
   - inicio de sesión con Discord para no crear contraseñas nuevas;
   - niveles de confianza y AutoMod/Akismet contra spam;
   - copias de seguridad automáticas;
   - un equipo de moderación definido antes de abrir.

## Qué hay que decidir y actualizar antes de la etapa 2

- Plataforma, proveedor de alojamiento y presupuesto mensual.
- Crear el subdominio: requiere cambiar el DNS del dominio (no se tocó en esta renovación).
- Actualizar la política de privacidad (cuentas, correos, registros del foro) y la de cookies (el foro usa cookies de sesión propias).
- Definir la edad mínima y las normas de moderación del foro (se pueden extender `moderacion.html`).
