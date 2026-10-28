# Estado del servidor: problema de seguridad y corrección

Última revisión: 28/10/2026.

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
- **`estado.json`** publica solo el estado mínimo: `disponible`, `en_linea`, `jugadores`, `tope` y `actualizado`. Los valores se validan como números, así que ningún texto del servidor llega al sitio. Desde el 28/10/2026 nunca se inventa un tope: antes se usaba 64 cuando faltaba el dato.
- **Honestidad del indicador** (28/10/2026):

  | `estado.json` | Qué ve la persona |
  |---|---|
  | `disponible: false` (no hay fuente fiable: Cfx.re responde 404 y no hay secreto) | «Estado en vivo no disponible», sin luz verde ni roja |
  | `disponible: true`, `en_linea: false` (la consulta directa no respondió) | «Sin respuesta en la última comprobación» |
  | `disponible: true`, `en_linea: true` | «En línea · N de M conectados». Con 0 personas, solo «En línea», sin un cero eterno |
  | Dato de más de 12 horas | «Estaba en línea en el último dato · puede estar desactualizado», sin cifra |
  | Archivo ausente o dañado | «Estado en vivo no disponible» |

- **Frecuencia:** el workflow publica cuando cambia el estado. Si hay una fuente real y no hubo cambios, renueva la hora cada 6 horas para que el dato no quede viejo. Sin fuente fiable, no publica nada nuevo.
- **Una sola fuente para el código:** el workflow lee el código de conexión de `_data/sitio.yml` (`acceso.codigo`), igual que la web.
- **Conexión:** el comando y el botón usan el código público de Cfx.re (`cfx.re/join/<código>`), nunca la IP. Desde el 28/10/2026 **solo se muestran cuando `acceso.codigo_confirmado` es `true`**. Hasta entonces, la web remite al Discord oficial.

## Lo que tiene que hacer la administración

Al 27/10/2026 el secreto **no estaba configurado**: el registro de la acción decía «Sin secreto FIVEM_ENDPOINT: no se hace la consulta directa». Mientras falte, y mientras Cfx.re responda 404 para el código, el sitio muestra «Estado en vivo no disponible».

Para configurarlo desde la web de GitHub, **sin compartir el valor con nadie**:

1. Entrá al repositorio `brianalexismartino70-code/elysium-web` con la cuenta que lo administra.
2. Abrí **Settings** (Configuración), arriba a la derecha de la pestaña del repositorio.
3. En el menú lateral: **Secrets and variables** → **Actions**.
4. En la pestaña **Secrets**, apretá **New repository secret**.
5. En **Name** escribí exactamente `FIVEM_ENDPOINT`.
6. En **Secret** escribí la dirección del servidor en formato `ip:puerto` (por ejemplo, con el puerto de FiveM, `30120`). No agregues `http://` ni espacios.
7. Apretá **Add secret**. GitHub no vuelve a mostrar el valor, ni siquiera a vos.
8. Para probarlo: **Actions** → **Estado del servidor** → **Run workflow** → **Run workflow**. Al terminar, el registro debería decir «Consulta directa (dirección protegida)» con la dirección reemplazada por `***`, y `estado.json` debería cambiar.

Si la dirección cambia: **Settings** → **Secrets and variables** → **Actions** → el lápiz junto a `FIVEM_ENDPOINT` → escribí el valor nuevo → **Update secret**.

## Riesgo que queda

- Dos direcciones del servidor siguen en el **historial de git** (de agosto al 27/10/2026) y en los **registros viejos de Actions** (vencen a los 90 días como máximo). Además, el historial conserva una **URL de webhook de Discord** válida: es más grave que la IP y se resuelve eliminando el webhook en Discord. Detalle y estrategia en [`LIMPIEZA_HISTORIAL.md`](LIMPIEZA_HISTORIAL.md).
- Cualquier servidor de FiveM que figure en el listado público expone su dirección a quien la busque. Para reducir la exposición conviene evaluar la opción de FiveM que oculta la dirección en el listado (`sv_endpointPrivacy`), una protección contra ataques de denegación de servicio del proveedor de alojamiento y, si se considera necesario, un cambio de IP.
- El cron del workflow pide cada 10 minutos, pero GitHub ejecuta los programados con demoras de horas en repositorios con poca actividad. El sitio muestra la antigüedad del dato para no aparentar un estado «en vivo» que no es.
