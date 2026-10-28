# Postulación a staff — cómo llega al equipo

- **Fecha:** 28/10/2026.
- **Cómo se verificó:** prueba de punta a punta con Playwright sobre la versión publicada (`c4d515b`, compilada localmente) y sobre la Fase 1.

## Resultado

- **Sin envío automático y sin webhook.** El código vigente no contiene ninguna dirección de webhook y la prueba no registró ninguna petición a otros sitios. El webhook antiguo dejó de usarse el 14/09/2026, pero **sigue en el historial público** y hay que revocarlo en Discord.
- **Qué hace la persona:**
  1. Completa el perfil y el examen. El borrador queda en su navegador.
  2. Descarga un `.txt` o copia el texto.
  3. Lo publica en el canal de postulaciones del Discord oficial. La página enlaza la invitación («Entrar al Discord») y el canal («Abrir el canal de postulaciones»).
- **Qué recibe el staff:** solo lo que la persona adjunta o pega en el ticket. Es un archivo de texto con este contenido:
  - el encabezado «ELYSIUM | ES — POSTULACIÓN A STAFF» y la fecha y hora en que se preparó;
  - usuario de Discord, edad, disponibilidad y área;
  - cada caso del examen con su respuesta;
  - una última línea que recuerda publicarlo en el canal de postulaciones.

  En la prueba fueron 116 líneas. Copiar produce el mismo texto.
- **Sin simular un envío.** Después de descargar o copiar, el aviso dice «Postulación lista para enviar». Desde la Fase 1 agrega además: «Todavía no lo recibió nadie: el staff solo lo ve cuando lo publicás en el canal de postulaciones del Discord oficial».

## Destino de las postulaciones (dato del propietario, 28/10/2026)

- **Canal:** `https://discord.com/channels/1484725476785393816/1494480100865872043` (ID `1494480100865872043`). Está en `_data/sitio.yml` (`enlaces.postulaciones`) y la página lo enlaza.
- **Invitación:** `discord.gg/4mTVJhu3gx`, permanente según el propietario.

## Sin verificar

`discord.com` y `discord.gg` están bloqueados en este entorno. Falta comprobar:

- que el canal siga aceptando publicaciones de miembros que no son staff;
- que el enlace al canal se abra para alguien que acaba de entrar con la invitación.

**Prueba sugerida:** con una cuenta sin rol de staff, entrar con la invitación, abrir el canal desde la página de staff y publicar un archivo de prueba.
