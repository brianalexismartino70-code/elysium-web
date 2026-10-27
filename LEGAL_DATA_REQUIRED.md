# Datos necesarios para cerrar la documentación legal

Última revisión: 27/10/2026.

Los documentos publicados (`privacidad.html`, `cookies.html`, `terminos.html`, `moderacion.html`, `condiciones-tienda.html` y `aviso-legal.html`) están marcados como **en revisión** y señalan en el texto cada punto `pendiente`. Este archivo reúne las preguntas para completarlos.

> **Importante.** Estos textos se prepararon a partir de lo que el sitio hace (verificado en su código) y de la documentación que Elysium ya publicaba el 21/09/2026. No son asesoramiento legal ni garantizan el cumplimiento de ninguna norma. Antes de darlos por definitivos, conviene que los revise un profesional del país desde el que se administra Elysium.

## Qué está verificado y qué no

| Tema | Fuente | Estado |
|---|---|---|
| Qué datos trata el sitio, cookies, almacenamiento local, Analytics con consentimiento, contenido externo bajo demanda | Código del sitio | Verificado |
| Alojamiento en GitHub Pages | Configuración del repositorio | Verificado |
| Datos que toma el servidor de juego (licencia de Rockstar, Steam, Discord, IP, personaje, registros) | Política del 21/09/2026 | **Sin verificar** |
| Plazos de conservación del servidor y del Discord | Política del 21/09/2026 | **Sin verificar** |
| Edad mínima de 16 años para jugar, 18 para staff | Términos del 21/09/2026 | Declarado por Elysium, **sin revisión jurídica** |
| Condiciones de la tienda | Condiciones del 21/09/2026 | Vigentes, **en revisión** |

## 1. Titular y contacto

1. ¿Quién es el titular del sitio y del servidor? Nombre de la persona o razón social.
2. ¿Desde qué país se administra Elysium? Define la ley aplicable y la autoridad de protección de datos.
3. ¿Hay un correo electrónico de contacto para temas legales y de privacidad? Hoy todo se canaliza por ticket en Discord, que exige tener cuenta allí.
4. ¿Hace falta publicar un domicilio o un número de identificación fiscal según la ley de ese país?

## 2. Público y jurisdicción

5. ¿En qué países está la comunidad? El sitio menciona Argentina, España, México, Chile, Colombia y Perú. Si se dirige a personas en la Unión Europea, conviene revisar el Reglamento General de Protección de Datos (RGPD).
6. ¿Qué ley y qué jurisdicción se quieren fijar en los términos de uso?

## 3. Servidor de juego

7. Lista exacta de identificadores que guarda el servidor (license, steam, discord, fivem, IP, otros) y dónde se guardan.
8. Proveedor de alojamiento del servidor y de la base de datos, y país donde están.
9. Plazos reales de conservación: datos del personaje, registros, sanciones y copias de seguridad. ¿Se cumplen los que figuraban en la versión anterior (12 meses, 6 meses, permanente)?
10. ¿Quién del equipo tiene acceso a la base de datos y a los registros?

## 4. Discord

11. ¿Qué bots se usan (tickets, registros, verificación) y qué guardan?
12. ¿Cuánto tiempo se conservan los tickets y las transcripciones?
13. ¿Dónde se guardan las postulaciones a staff que llegan por ticket y cuánto tiempo? La versión anterior decía 12 meses.

## 5. Tienda (Tebex)

14. ¿Tebex actúa como vendedor o revendedor ante la persona que compra, o solo como pasarela? Se ve en el panel de Tebex y en sus condiciones. Cambia quién es responsable frente al consumidor.
15. ¿Qué datos de cada compra comparte Tebex con la administración (usuario, correo, país, importe)?
16. Lista de productos con su precio, moneda y beneficios exactos. ¿Hay suscripciones con renovación automática? ¿Cómo se cancelan?
17. ¿Qué política de reembolso tiene configurada la tienda en Tebex? Debe coincidir con `condiciones-tienda.html`.
18. ¿Pueden comprar menores de edad? ¿Con qué control?

## 6. Edad mínima

19. Confirmar la edad mínima para jugar (hoy 16 años) frente a las condiciones de uso de FiveM y de Rockstar Games y frente a la ley del país del titular.
20. ¿Cómo se verifica la edad del staff (18 años)?

## 7. Google Analytics

21. Plazo de retención configurado en la propiedad (2 o 14 meses).
22. ¿Están desactivados Google Signals y la vinculación con productos publicitarios?
23. ¿Quién tiene acceso a la propiedad?

## 8. Creadores de contenido

24. ¿Cómo se va a documentar la autorización de quienes aparezcan en la sección de creadores (mensaje en ticket, formulario)? El sitio solo muestra canales con `autorizado: true` en `_data/creadores.yml`.

## 9. Puntos para revisión jurídica

Conviene que un profesional revise especialmente:

- **Reembolsos.** La cláusula «todas las transacciones son finales» y «renunciás a solicitar la devolución». Según el país, la ley de consumo puede dar derechos que no se pueden renunciar por contrato. Normas que conviene revisar: en Argentina, la Ley 24.240 de Defensa del Consumidor (revocación en ventas a distancia) y la Resolución 424/2020 de la Secretaría de Comercio Interior («botón de arrepentimiento»); en la Unión Europea, la Directiva 2011/83/UE (desistimiento y contenido digital).
- **«Donación voluntaria» y «sin fines de lucro».** La tienda vende membresías y productos con beneficios: la calificación como donación puede no sostenerse.
- **Contracargos.** La expulsión por contracargo no puede impedir el ejercicio de derechos legales.
- **Menores de edad** en la comunidad y en la tienda.
- **Transferencias internacionales** de datos (GitHub, Google, Discord, Tebex, proveedor del servidor).
- **Limitación de responsabilidad** en los términos de uso.
- **Normas de protección de datos** del país del titular. En Argentina, por ejemplo, la Ley 25.326 y la autoridad de control (Agencia de Acceso a la Información Pública).

## Cómo completar

Con las respuestas, actualizá el texto de cada página (los puntos están marcados con `<i class="pending">`), quitá esas marcas, cambiá `estado_doc` a «Vigente» y borrá la línea `borrador:` de la cabecera del archivo. Publicá una novedad con el cambio.
