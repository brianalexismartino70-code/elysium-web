# Datos sensibles en el historial de Git y cómo limpiarlo

- **Fecha:** 28/10/2026.
- **Alcance:** las 313 versiones (commits) de todas las ramas, con el historial completo descargado (`git fetch --unshallow`).
- **Estado:** **nada de esto se ejecutó.** Reescribir el historial público y forzar un push necesitan tu autorización expresa, un respaldo previo y una ventana de trabajo acordada.

## 1. Qué hay en el historial

El repositorio es público, así que cualquier versión anterior se puede leer en GitHub conociendo el commit.

| Hallazgo | Dónde aparece | Qué es | Riesgo |
|---|---|---|---|
| **URL de un webhook de Discord** (ID `1494…175`, con su token) | `index.html` y `staff.html`, desde `5eab2c4` (16/04/2026) hasta `6801497` (14/09/2026), cuando se quitó del código | **Credencial.** Quien tenga la URL puede publicar mensajes en ese canal de Discord con el nombre y la imagen que quiera | **Alto** mientras el webhook exista. La solución real es **eliminarlo en Discord**: limpiar el historial no lo invalida |
| Dos direcciones del servidor de juego (`186.18.x.x:30120` y `190.55.x.x:30120`) | `index.html`, `estado.html` y `.github/workflows/estado-servidor.yml`, desde agosto de 2026 hasta `d7eb472` (27/10/2026) | **Dirección pública, no contraseña.** Un servidor de FiveM tiene que ser alcanzable para que la gente juegue | **Medio:** permite apuntar ataques de denegación de servicio o escaneos directo al equipo, sin pasar por Cfx.re. Si una de las dos ya no se usa, el riesgo es menor |
| Las mismas direcciones en los **registros de GitHub Actions** | Ejecuciones de «Estado del servidor» anteriores al 27/10/2026: GitHub imprime el guion de cada paso y ese guion tenía la dirección escrita | Igual que la anterior | Los registros de repositorios públicos los puede ver cualquiera con cuenta de GitHub. Vencen solos (como máximo 90 días) o se pueden borrar a mano |
| 7 MP3 comerciales (≈ 34 MB) y 15 imágenes sin licencia verificada | Raíz del repositorio hasta `0c486b7` (28/10/2026) | Material de terceros | Siguen accesibles por commit. Riesgo de reclamo de derechos de autor |
| Identificador de Google Analytics `G-1XMC8M5F5X` | `cookies.js` y páginas anteriores | **Público por diseño:** aparece en el código de cualquier sitio que usa Analytics | Ninguno |

**Sin hallazgos** de tokens de GitHub, claves de API (Google, AWS u otras), claves privadas, licencias de Cfx.re (`cfxk_…`), claves secretas de Tebex, tokens de bots de Discord ni cadenas de conexión a bases de datos. Los patrones buscados están en `tools/escanear_secretos.py`.

**En el código actual no queda ninguno de estos datos.** El workflow toma la dirección del secreto `FIVEM_ENDPOINT` y la enmascara en los registros.

## 2. Qué hacer ahora, sin tocar el historial

1. **Eliminar el webhook de Discord.** Configuración del servidor → Integraciones → Webhooks → elegí el webhook → «Eliminar webhook». Si todavía hace falta, creá uno nuevo y guardalo solo en un lugar privado, nunca en este repositorio. Esto invalida la URL vieja en el acto.
2. **Decidir sobre la dirección del servidor.** Si el riesgo de ataques preocupa:
   - cambiá el puerto o la IP pública;
   - restringí con el firewall lo que no sea el tráfico de juego;
   - consultá a tu proveedor por protección contra ataques de denegación de servicio.
3. **Borrar los registros viejos de Actions**, si no querés esperar a que venzan: Actions → «Estado del servidor» → abrí cada ejecución anterior al 27/10/2026 → «…» → «Delete workflow run».
4. **No volver a subir secretos.** El repositorio ya ignora archivos locales comunes (`.gitignore`) y el estado del servidor usa un secreto de GitHub.

Con los pasos 1 a 3, el riesgo práctico baja casi por completo **sin reescribir nada**.

## 3. Si además se quiere limpiar el historial

Tiene sentido si un titular de derechos lo pide, si el asesor legal lo recomienda o si la dirección del servidor no se puede cambiar.

### Consecuencias, antes de decidir

- **Cambian los identificadores de todos los commits** desde el primero afectado (marzo de 2026), incluido `1cf243e`, el merge de la renovación que se pidió conservar como referencia. `git filter-repo` guarda la equivalencia entre identificadores viejos y nuevos (`.git/filter-repo/commit-map`): con ella habría que actualizar `CAMBIOS_WEB.md`.
- Cualquier copia local, rama o fork hecho antes queda con el historial viejo. Hay que volver a clonar, y GitHub no limpia los forks de terceros.
- GitHub puede seguir mostrando vistas en caché de commits viejos hasta que su soporte las elimine. Hay que pedirlo con el formulario de eliminación de datos sensibles.
- Mientras dure la operación hay que pausar el workflow de estado, porque publica commits solo.
- Las ramas protegidas pueden rechazar el push forzado. Habría que permitirlo de forma temporal.

### Procedimiento (no ejecutado)

1. Pausar «Estado del servidor»: Actions → el workflow → «…» → «Disable workflow».
2. **Respaldo completo**, guardado fuera de GitHub:

   ```bash
   git clone --mirror https://github.com/brianalexismartino70-code/elysium-web.git elysium-web-respaldo.git
   tar czf elysium-web-respaldo-AAAAMMDD.tar.gz elysium-web-respaldo.git
   git -C elysium-web-respaldo.git rev-list --all --count   # anotar el número
   ```

3. Trabajar sobre **otro** clon espejo, nunca sobre el respaldo:

   ```bash
   git clone --mirror https://github.com/brianalexismartino70-code/elysium-web.git trabajo.git
   cd trabajo.git
   ```

4. Crear **fuera del repositorio** un archivo `reemplazos.txt`, con los valores reales que solo vos tenés:

   ```text
   literal:https://discord.com/api/webhooks/<ID>/<TOKEN>==>[webhook eliminado]
   literal:<IP-1>==>[dirección eliminada]
   literal:<IP-2>==>[dirección eliminada]
   ```

5. Reescribir. Quita los archivos retirados de todas las versiones y reemplaza los textos:

   ```bash
   git filter-repo --replace-text ../reemplazos.txt \
     --invert-paths \
     --path bad-bunny.mp3 --path ice-cube.mp3 --path jhay-co.mp3 --path omar-courtz.mp3 \
     --path soy-favela.mp3 --path Inner_Light.mp3 --path Se_Me_Nota.mp3 \
     --path 4903967.webp --path 982-1-1024x576.webp --path police-map-fivem-1536x848.webp \
     --path wp8853423.webp --path mundo1.webp --path mundo2.webp --path mundo3.webp \
     --path mundo4.webp --path logo-lspd.png --path mapa-gta.jpg --path fondo-lspd.webp \
     --path cash-clean.png
   ```

6. Verificar antes de publicar:
   - `python3 tools/escanear_secretos.py` sobre el resultado: no debe encontrar nada;
   - compilar el sitio y correr `tests/verificar.mjs`.
7. Publicar, con la ventana avisada: `git push --force --all` y `git push --force --tags`.
8. Pedir a GitHub que elimine las vistas en caché. Volver a activar el workflow, borrar `reemplazos.txt` y volver a clonar en cada equipo.

Si algo sale mal, el respaldo del paso 2 permite volver al estado anterior con `git push --force --mirror` desde `elysium-web-respaldo.git`.

## 4. Recomendación

1. **Ahora:** eliminar el webhook (imprescindible), decidir sobre la dirección del servidor y borrar los registros viejos de Actions.
2. **Más adelante y solo si hace falta:** reescribir el historial con el procedimiento de arriba. Requiere tu autorización expresa y conlleva perder la referencia `1cf243e` tal como está hoy.
