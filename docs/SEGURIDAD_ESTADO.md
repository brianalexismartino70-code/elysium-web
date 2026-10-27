# Estado del servidor: problema de seguridad y corrección

Última revisión: 27/10/2026.

## Qué pasaba

El contador de jugadores de la portada (`index.html`, bloque «ESTADO DEL SERVIDOR») probaba cinco fuentes en orden, desde el navegador de cada visitante y cada 60 segundos:

1. `estado.json` del propio sitio.
2. La API de Cfx.re, directamente.
3. `api.allorigins.win`, un proxy de terceros, consultando la API de Cfx.re.
4. `api.codetabs.com`, otro proxy de terceros, consultando la API de Cfx.re.
5. `api.codetabs.com` consultando `http://<IP>:30120/dynamic.json`.

Consecuencias:

- **La IP pública y el puerto del servidor estaban escritos en el código fuente de la página**, visibles para cualquiera.
- Cada vez que `estado.json` decía que el servidor no respondía (algo frecuente según el historial), **el navegador de cada visitante consultaba dos proxies desconocidos**, que recibían su dirección IP y el sitio de origen, y además la dirección del servidor de juego.
- El workflow `.github/workflows/estado-servidor.yml` también tenía la IP escrita, en un repositorio público. GitHub Actions imprime el script en los registros de cada ejecución, así que la IP también figura en esos registros.

## Qué se cambió

- **Navegador:** `assets/js/elysium.js` solo lee `/estado.json`, del mismo dominio. No hay IP, puerto, proxies ni consultas a terceros. Se consulta al cargar y cada 5 minutos con la pestaña visible.
- **Workflow:** la consulta directa usa el secreto `FIVEM_ENDPOINT` (formato `ip:puerto`). La dirección no está en el archivo, se enmascara en los registros (`::add-mask::`) y los errores de `curl` no se imprimen. Sin el secreto, solo se usa la API pública de Cfx.re.
- **`estado.json`:** solo publica `en_linea`, `jugadores`, `tope` y `actualizado`. Se quitó `via` y se valida que los valores sean números, para que ningún texto del servidor llegue al sitio.
- **Honestidad del indicador:** si el dato tiene más de 12 horas se muestra como posiblemente desactualizado; si ninguna fuente respondió, se dice que no se pudo confirmar el estado; si no hay archivo, «Estado en vivo no disponible». Por debajo de 1 persona conectada no se muestra cifra (criterio que ya tenía el sitio).
- **Conexión:** el botón y el comando usan el código público de Cfx.re (`cfx.re/join/<código>`), nunca la IP.

## Lo que tiene que hacer la administración

1. Crear el secreto en GitHub: **Settings → Secrets and variables → Actions → New repository secret**, nombre `FIVEM_ENDPOINT`, valor `ip:puerto`.
2. Ejecutar el workflow a mano una vez (pestaña **Actions → Estado del servidor → Run workflow**) y revisar que `estado.json` se actualice.

## Riesgo que queda

- La IP sigue en el **historial de git** (por ejemplo, en los commits `af2e94a` y `9e0518f` del 15/09/2026 y siguientes) y en los **registros viejos de Actions** (GitHub los conserva 90 días por defecto). Borrarla del historial exige reescribirlo, lo que rompe las copias existentes del repositorio: no se hizo y es decisión del dueño.
- Cualquier servidor de FiveM que figure en el listado público expone su dirección a quien la busque. Para reducir la exposición conviene evaluar la opción de FiveM que oculta la dirección en el listado (`sv_endpointPrivacy`), una protección contra ataques de denegación de servicio del proveedor de alojamiento y, si se considera necesario, un cambio de IP.
- El cron del workflow pide cada 10 minutos, pero GitHub ejecuta los programados con demoras de horas en repositorios con poca actividad. El sitio muestra la antigüedad del dato para no aparentar un estado «en vivo» que no es.
