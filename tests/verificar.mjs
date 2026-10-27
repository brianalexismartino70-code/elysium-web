// ═════════════════════════════════════════════════════════════
//  ELYSIUM | ES — verificación del sitio compilado
//
//  Uso:
//    bundle exec jekyll build -d _site
//    python3 -m http.server 4000 --directory _site --bind 127.0.0.1 &
//    node tests/verificar.mjs http://127.0.0.1:4000 [carpeta-de-capturas]
//
//  Requiere Playwright con Chromium. No publica nada ni se conecta a
//  servicios externos: las peticiones a terceros se interceptan.
// ═════════════════════════════════════════════════════════════
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:4000').replace(/\/$/, '');
const CAPTURAS = process.argv[3] || '';
const LOCAL = new URL(BASE).host;

const PAGINAS = [
  '/', '/novedades/', '/novedades/mundo-i-en-preapertura/', '/como-entrar.html', '/normativa.html',
  '/comunidad.html', '/tienda.html', '/staff.html', '/privacidad.html', '/cookies.html',
  '/terminos.html', '/moderacion.html', '/condiciones-tienda.html', '/aviso-legal.html', '/404.html'
];
const ANCHOS = [1440, 768, 390];

let fallas = 0, pruebas = 0;
const resultado = [];
function ok(cond, msg) {
  pruebas++;
  if (!cond) fallas++;
  resultado.push((cond ? 'OK    ' : 'FALLA ') + msg);
}

const ELECCION = JSON.stringify({ v: 2, analitica: false, t: Date.now() });

async function contexto(navegador, opciones = {}) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, ...opciones });
  // Ninguna petición sale a internet durante la prueba
  await ctx.route(url => new URL(url).host !== LOCAL, ruta => {
    const u = ruta.request().url();
    if (u.includes('googletagmanager.com')) return ruta.fulfill({ status: 200, contentType: 'text/javascript', body: '/* gtag simulado */' });
    return ruta.fulfill({ status: 204, body: '' });
  });
  return ctx;
}

function vigilar(pagina) {
  const registro = { errores: [], externas: [] };
  pagina.on('console', m => { if (m.type() === 'error') registro.errores.push(m.text()); });
  pagina.on('pageerror', e => registro.errores.push('pageerror: ' + e.message));
  pagina.on('request', r => { if (new URL(r.url()).host !== LOCAL) registro.externas.push(r.url()); });
  return registro;
}

const navegador = await chromium.launch();

// ── 1. Todas las páginas en los tres anchos ──────────────────
{
  const ctx = await contexto(navegador);
  await ctx.addInitScript(e => { try { localStorage.setItem('elysium_cookies', e); } catch (x) {} }, ELECCION);
  for (const ancho of ANCHOS) {
    const pagina = await ctx.newPage();
    await pagina.setViewportSize({ width: ancho, height: ancho > 800 ? 900 : 844 });
    for (const ruta of PAGINAS) {
      const reg = vigilar(pagina);
      const resp = await pagina.goto(BASE + ruta, { waitUntil: 'networkidle' });
      await pagina.waitForTimeout(300);
      const esperado = ruta === '/404.html' ? 200 : 200;
      ok(resp && resp.status() === esperado, `${ancho}px ${ruta} responde ${resp && resp.status()}`);
      const datos = await pagina.evaluate(() => ({
        desborde: document.documentElement.scrollWidth - window.innerWidth,
        h1: document.querySelectorAll('h1').length,
        sinAlt: [...document.images].filter(i => !i.hasAttribute('alt')).map(i => i.src),
        blankSinRel: [...document.querySelectorAll('a[target=_blank]')].filter(a => !/noopener/.test(a.rel)).map(a => a.href),
        titulo: document.title,
        descripcion: (document.querySelector('meta[name=description]') || {}).content || '',
        canonical: (document.querySelector('link[rel=canonical]') || {}).href || '',
        og: (document.querySelector('meta[property="og:image"]') || {}).content || '',
        lang: document.documentElement.lang,
        idsDuplicados: (() => { const v = {}; return [...document.querySelectorAll('[id]')].map(e => e.id).filter(id => (v[id] = (v[id] || 0) + 1) === 2); })()
      }));
      ok(datos.desborde <= 1, `${ancho}px ${ruta} sin desplazamiento horizontal (${datos.desborde}px)`);
      if (ancho === 1440) {
        ok(datos.h1 === 1, `${ruta} tiene un solo h1 (${datos.h1})`);
        ok(datos.sinAlt.length === 0, `${ruta} todas las imágenes tienen alt ${datos.sinAlt.join(' ')}`);
        ok(datos.blankSinRel.length === 0, `${ruta} enlaces externos con rel=noopener ${datos.blankSinRel.join(' ')}`);
        ok(datos.titulo.length > 10 && datos.descripcion.length > 40, `${ruta} título y descripción presentes`);
        ok(datos.canonical.startsWith('https://elysiumesrp.com/'), `${ruta} canonical absoluto (${datos.canonical})`);
        ok(datos.og.startsWith('https://elysiumesrp.com/'), `${ruta} og:image absoluta`);
        ok(datos.lang === 'es', `${ruta} lang=es`);
        ok(datos.idsDuplicados.length === 0, `${ruta} sin ids duplicados ${datos.idsDuplicados.join(' ')}`);
      }
      ok(reg.errores.length === 0, `${ancho}px ${ruta} sin errores de consola ${reg.errores.join(' | ')}`);
      ok(reg.externas.length === 0, `${ancho}px ${ruta} sin peticiones a terceros ${reg.externas.join(' ')}`);
      if (CAPTURAS && (ruta === '/' || ancho !== 1440)) {
        mkdirSync(CAPTURAS, { recursive: true });
        await pagina.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-in')));
        await pagina.waitForTimeout(800);
        const nombre = (ruta === '/' ? 'inicio' : ruta.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')) + '-' + ancho + '.png';
        await pagina.screenshot({ path: `${CAPTURAS}/${nombre}`, fullPage: ancho !== 1440 && ruta === '/' });
      }
    }
    await pagina.close();
  }
  await ctx.close();
}

// ── 2. Enlaces internos y anclas ─────────────────────────────
{
  const ctx = await contexto(navegador);
  await ctx.addInitScript(e => { try { localStorage.setItem('elysium_cookies', e); } catch (x) {} }, ELECCION);
  const pagina = await ctx.newPage();
  const vistos = new Map();
  for (const ruta of PAGINAS) {
    await pagina.goto(BASE + ruta, { waitUntil: 'domcontentloaded' });
    const enlaces = await pagina.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href));
    for (const e of enlaces) {
      const u = new URL(e);
      if (u.host !== LOCAL) continue;
      if (!['http:', 'https:'].includes(u.protocol)) continue;
      const clave = u.pathname + u.hash;
      if (!vistos.has(clave)) vistos.set(clave, ruta);
    }
  }
  const sinAncla = [];
  for (const [clave, origen] of vistos) {
    const [ruta, ancla] = clave.split('#');
    const r = await pagina.request.get(BASE + ruta);
    ok(r.status() === 200, `enlace ${ruta} (desde ${origen}) responde ${r.status()}`);
    if (ancla && r.status() === 200) {
      const html = await r.text();
      if (!html.includes(`id="${ancla}"`)) sinAncla.push(`${clave} (desde ${origen})`);
    }
  }
  ok(sinAncla.length === 0, `todas las anclas internas existen ${sinAncla.join(', ')}`);
  for (const recurso of ['/estado.json', '/feed.xml', '/sitemap.xml', '/robots.txt', '/site.webmanifest', '/favicon.ico', '/apple-touch-icon.png', '/assets/img/iconos.svg']) {
    const r = await pagina.request.get(BASE + recurso);
    ok(r.status() === 200, `recurso ${recurso} disponible`);
  }
  for (const pista of ['/bad-bunny.mp3', '/ice-cube.mp3', '/Inner_Light.mp3']) {
    const r = await pagina.request.get(BASE + pista);
    ok(r.status() === 404, `${pista} ya no se publica (${r.status()})`);
  }
  await ctx.close();
}

// ── 3. Aviso de cookies y Google Analytics ───────────────────
{
  const ctx = await contexto(navegador);
  const pagina = await ctx.newPage();
  const ga = [];
  pagina.on('request', r => { if (r.url().includes('googletagmanager')) ga.push(r.url()); });
  await pagina.goto(BASE + '/', { waitUntil: 'networkidle' });
  await pagina.waitForTimeout(1200);
  const aviso = pagina.locator('.ely-ck.is-on');
  ok(await aviso.count() === 1, 'cookies: el aviso aparece en la primera visita');
  ok(ga.length === 0, 'cookies: Analytics no se carga antes de decidir');
  const botones = await pagina.locator('.ely-ck-acc .ely-ck-btn:visible').allTextContents();
  ok(botones.join('|') === 'Rechazar|Configurar|Aceptar', `cookies: opciones visibles ${botones.join('|')}`);
  const pesos = await pagina.evaluate(() => [...document.querySelectorAll('.ely-ck-acc .ely-ck-btn')].filter(b => !b.hidden).map(b => getComputedStyle(b).backgroundColor + getComputedStyle(b).borderColor + getComputedStyle(b).fontSize));
  ok(new Set(pesos).size === 1, 'cookies: las tres opciones tienen el mismo peso visual');
  ok(await pagina.locator('.ely-ck-mas').getAttribute('href') === '/cookies.html', 'cookies: «Más información» lleva a la política');

  await pagina.click('.ely-ck [data-ck="no"]');
  await pagina.waitForTimeout(300);
  let guardado = await pagina.evaluate(() => JSON.parse(localStorage.getItem('elysium_cookies')));
  ok(guardado && guardado.v === 2 && guardado.analitica === false, 'cookies: «Rechazar» guarda la elección');
  await pagina.reload({ waitUntil: 'networkidle' });
  await pagina.waitForTimeout(900);
  ok(ga.length === 0, 'cookies: tras rechazar, Analytics no se carga al volver');
  ok(await pagina.locator('.ely-ck.is-on').count() === 0, 'cookies: tras decidir, el aviso no reaparece');

  await pagina.click('.foot [data-cookies]');
  await pagina.waitForTimeout(500);
  ok(await pagina.locator('#ely-ck-cfg').isVisible(), 'cookies: el pie reabre el aviso en modo configuración');
  const sw = pagina.locator('[data-ck-sw="analitica"]');
  ok(await sw.getAttribute('aria-checked') === 'false', 'cookies: el interruptor refleja la elección guardada');
  await sw.click();
  await pagina.click('.ely-ck [data-ck="guardar"]');
  await pagina.waitForTimeout(600);
  guardado = await pagina.evaluate(() => JSON.parse(localStorage.getItem('elysium_cookies')));
  ok(guardado.analitica === true, 'cookies: «Guardar selección» activa la medición');
  ok(ga.length === 1, 'cookies: Analytics se carga solo después de aceptar');

  await pagina.evaluate(() => { document.cookie = '_ga=GA1.1.123; path=/'; document.cookie = '_ga_1XMC8M5F5X=GS1; path=/'; });
  await pagina.click('.foot [data-cookies]');
  await pagina.waitForTimeout(400);
  await pagina.click('.ely-ck [data-ck="no"]');
  await pagina.waitForTimeout(300);
  const tras = await pagina.evaluate(() => ({ c: document.cookie, off: window['ga-disable-G-1XMC8M5F5X'] }));
  ok(!/_ga/.test(tras.c), 'cookies: retirar el consentimiento borra las cookies _ga');
  ok(tras.off === true, 'cookies: retirar el consentimiento bloquea el envío de Analytics');

  // Migración de la elección anterior (v1)
  await pagina.evaluate(() => localStorage.setItem('elysium_cookies', JSON.stringify({ v: 'no', t: Date.now() })));
  await pagina.reload({ waitUntil: 'networkidle' });
  await pagina.waitForTimeout(900);
  ok(await pagina.locator('.ely-ck.is-on').count() === 0, 'cookies: la elección de la versión anterior se respeta');
  await ctx.close();
}

// ── 4. Estado del servidor ───────────────────────────────────
{
  const casos = [
    { nombre: 'en línea', json: { en_linea: true, jugadores: 7, tope: 48, actualizado: new Date().toISOString() }, espera: /Servidor en línea · 7 de 48 conectados/ },
    { nombre: 'sin respuesta', json: { en_linea: false, actualizado: new Date().toISOString() }, espera: /no respondió/ },
    { nombre: 'dato viejo', json: { en_linea: true, jugadores: 2, tope: 48, actualizado: new Date(Date.now() - 30 * 3600e3).toISOString() }, espera: /desactualizado/ },
    { nombre: 'archivo ausente', estado: 404, espera: /no disponible/ }
  ];
  for (const c of casos) {
    const ctx = await contexto(navegador, { reducedMotion: 'reduce' });
    await ctx.addInitScript(e => { try { localStorage.setItem('elysium_cookies', e); } catch (x) {} }, ELECCION);
    await ctx.route('**/estado.json', r => c.estado ? r.fulfill({ status: c.estado, body: '' }) : r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(c.json) }));
    const pagina = await ctx.newPage();
    const reg = vigilar(pagina);
    await pagina.goto(BASE + '/', { waitUntil: 'networkidle' });
    await pagina.waitForTimeout(600);
    const texto = await pagina.locator('[data-estado]').innerText();
    ok(c.espera.test(texto), `estado (${c.nombre}): «${texto.replace(/\s+/g, ' ').trim()}»`);
    ok(reg.externas.length === 0, `estado (${c.nombre}): sin consultas a terceros`);
    await ctx.close();
  }
  const fuente = readFileSync(new URL('../assets/js/elysium.js', import.meta.url), 'utf8');
  ok(!/codetabs|allorigins|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(fuente), 'estado: el código del sitio no contiene IP ni proxies');
}

// ── 5. Interacciones de la portada ───────────────────────────
{
  const ctx = await contexto(navegador, { permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.addInitScript(e => { try { localStorage.setItem('elysium_cookies', e); } catch (x) {} }, ELECCION);
  const pagina = await ctx.newPage();
  await pagina.goto(BASE + '/', { waitUntil: 'networkidle' });

  await pagina.locator('#comando-portada + button').click();
  const portapapeles = await pagina.evaluate(() => navigator.clipboard.readText());
  ok(portapapeles === 'connect cfx.re/join/kr546a', `copiar: el comando queda en el portapapeles («${portapapeles}»)`);

  await pagina.locator('#mundo-tab-2').click();
  ok(await pagina.locator('#mundo-2').isVisible() && !(await pagina.locator('#mundo-1').isVisible()), 'mundos: la pestaña II muestra Cuarentena');
  await pagina.keyboard.press('ArrowRight');
  ok(await pagina.locator('#mundo-tab-3').getAttribute('aria-selected') === 'true', 'mundos: las flechas cambian de pestaña');
  ok(await pagina.locator('#mundo-1 .chip').innerText() === 'PREAPERTURA' || /preapertura/i.test(await pagina.locator('#mundo-1 .chip').innerText()), 'mundos: el Mundo I figura en preapertura');
  ok(/en pruebas/i.test(await pagina.locator('#mundo-2 .chip').innerText()), 'mundos: Cuarentena figura en pruebas');

  await pagina.locator('[data-filtros="sistemas"] [data-filtro="economia"]').click();
  const visibles = await pagina.locator('.systems .system:visible').count();
  ok(visibles === 1, `sistemas: el filtro Economía deja 1 tarjeta (${visibles})`);
  await pagina.locator('[data-filtros="sistemas"] [data-filtro="todos"]').click();
  ok(await pagina.locator('.systems .system:visible').count() === 10, 'sistemas: «Todos» vuelve a mostrar las 10');

  await pagina.locator('.plate').first().click();
  ok(await pagina.locator('.lb.is-on').isVisible(), 'galería: el visor se abre');
  await pagina.keyboard.press('ArrowRight');
  ok(/2 de 5/.test(await pagina.locator('.lb figcaption small').innerText()), 'galería: las flechas avanzan');
  await pagina.keyboard.press('Escape');
  ok(!(await pagina.locator('.lb.is-on').count()), 'galería: Escape cierra el visor');

  await pagina.fill('#buscar-normativa', 'vdm');
  await Promise.all([pagina.waitForURL('**/normativa.html?q=vdm'), pagina.press('#buscar-normativa', 'Enter')]);
  await pagina.waitForTimeout(400);
  ok(/artículo/.test(await pagina.locator('[data-buscador-cuenta]').innerText()), 'normativa: la búsqueda desde la portada filtra artículos');
  ok(await pagina.locator('.article mark').count() > 0, 'normativa: el término queda resaltado');
  await ctx.close();
}

// ── 6. Normativa, novedades y anclas antiguas ────────────────
{
  const ctx = await contexto(navegador, { permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.addInitScript(e => { try { localStorage.setItem('elysium_cookies', e); } catch (x) {} }, ELECCION);
  const pagina = await ctx.newPage();
  await pagina.goto(BASE + '/normativa.html#art-3-2', { waitUntil: 'networkidle' });
  ok(await pagina.locator('#art-3-2.is-target').count() === 1, 'normativa: el enlace directo resalta el artículo');
  await pagina.fill('[data-buscador]', 'mascara');
  await pagina.waitForTimeout(500);
  const n = await pagina.locator('.chapter .article:visible').count();
  ok(n >= 2, `normativa: la búsqueda ignora tildes («mascara» encuentra ${n})`);
  ok(/q=mascara/.test(pagina.url()), 'normativa: la búsqueda queda en la URL');
  await pagina.locator('[data-buscador-limpiar]').click();
  ok(await pagina.locator('.chapter .article:visible').count() === 33, 'normativa: limpiar muestra los 33 artículos');
  await pagina.locator('#art-1-1 .anchor').click();
  ok((await pagina.evaluate(() => navigator.clipboard.readText())).endsWith('/normativa.html#art-1-1'), 'normativa: copiar enlace de un artículo');

  await pagina.goto(BASE + '/novedades/?categoria=sitio', { waitUntil: 'networkidle' });
  ok(await pagina.locator('[data-lista="novedades"] .news-card:visible').count() === 2, 'novedades: el filtro por URL muestra la categoría');
  await pagina.locator('[data-filtro="servidor"]').click();
  ok(/categoria=servidor/.test(pagina.url()), 'novedades: el filtro actualiza la URL');

  await pagina.goto(BASE + '/terminos.html#p5', { waitUntil: 'networkidle' });
  ok(pagina.url().endsWith('/cookies.html'), 'terminos: el ancla antigua #p5 lleva a la política de cookies');
  await pagina.goto(BASE + '/terminos.html#s2', { waitUntil: 'networkidle' });
  ok(pagina.url().endsWith('/condiciones-tienda.html#s2'), 'terminos: el ancla antigua #s2 lleva a las condiciones de la tienda');
  await pagina.goto(BASE + '/terminos.html#t7', { waitUntil: 'networkidle' });
  ok(pagina.url().endsWith('/terminos.html#t7'), 'terminos: las anclas que siguen en el documento no redirigen');
  await ctx.close();
}

// ── 7. Menú móvil y teclado ──────────────────────────────────
{
  const ctx = await contexto(navegador, { viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(e => { try { localStorage.setItem('elysium_cookies', e); } catch (x) {} }, ELECCION);
  const pagina = await ctx.newPage();
  await pagina.goto(BASE + '/como-entrar.html', { waitUntil: 'networkidle' });
  const boton = pagina.locator('.menu-toggle');
  ok(await boton.isVisible(), 'menú: el botón aparece en móvil');
  await boton.click();
  await pagina.waitForTimeout(450);
  ok(await pagina.locator('#menu.is-open').isVisible(), 'menú: se abre');
  ok(await pagina.evaluate(() => document.activeElement && !!document.activeElement.closest('#menu')), 'menú: el foco entra al menú');
  ok(await pagina.evaluate(() => document.querySelector('main').hasAttribute('inert')), 'menú: el contenido de fondo queda inerte');
  await pagina.keyboard.press('Escape');
  await pagina.waitForTimeout(450);
  ok(await boton.getAttribute('aria-expanded') === 'false', 'menú: Escape lo cierra');
  ok(await pagina.evaluate(() => document.activeElement.classList.contains('menu-toggle')), 'menú: el foco vuelve al botón');
  ok(await pagina.locator('#menu a[aria-current="page"]').count() === 1, 'menú: marca la página actual');

  await pagina.goto(BASE + '/', { waitUntil: 'networkidle' });
  await pagina.keyboard.press('Tab');
  ok(await pagina.evaluate(() => document.activeElement.classList.contains('skip')), 'teclado: el primer Tab llega a «Saltar al contenido»');
  await ctx.close();
}

// ── 8. Postulación a staff ───────────────────────────────────
{
  const ctx = await contexto(navegador, { acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.addInitScript(e => { try { localStorage.setItem('elysium_cookies', e); localStorage.setItem('elysium_staff_apply_date', '1'); } catch (x) {} }, ELECCION);
  const pagina = await ctx.newPage();
  const reg = vigilar(pagina);
  await pagina.goto(BASE + '/staff.html', { waitUntil: 'networkidle' });
  ok(await pagina.evaluate(() => localStorage.getItem('elysium_staff_apply_date')) === null, 'staff: se borra la clave antigua de espera');
  await pagina.click('#btnDescargar').catch(() => {});
  await pagina.locator('#staff-discord').fill('prueba.usuario');
  await pagina.locator('#staff-edad').fill('21');
  await pagina.locator('#staff-horario').fill('Lunes a viernes de 18 a 23 (GMT-3)');
  await pagina.locator('label[for="rol-pm"]').click();
  ok(await pagina.locator('#examen').isVisible(), 'staff: elegir el área muestra el examen');
  await pagina.click('#btnDescargar');
  ok(/sin responder/.test(await pagina.locator('#noticeTitle').innerText()), 'staff: valida preguntas vacías');
  for (let i = 1; i <= 10; i++) await pagina.locator('#gen-' + i).fill('Respuesta general ' + i);
  for (let i = 11; i <= 20; i++) await pagina.locator('#pm-' + i).fill('Respuesta de Playmaker ' + i);
  await pagina.waitForTimeout(900);
  ok(/"puesto":"Playmaker"/.test(await pagina.evaluate(() => localStorage.getItem('elysium_staff_draft'))), 'staff: el borrador se guarda en el navegador');
  const [descarga] = await Promise.all([pagina.waitForEvent('download'), pagina.click('#btnDescargar')]);
  const nombre = descarga.suggestedFilename();
  ok(/^postulacion-staff-prueba\.usuario-\d{4}-\d{2}-\d{2}\.txt$/.test(nombre), `staff: descarga ${nombre}`);
  const contenido = readFileSync(await descarga.path(), 'utf8');
  ok(contenido.includes('Respuesta de Playmaker 20') && contenido.includes('Área: Playmaker') && contenido.includes('Caso:'), 'staff: el archivo incluye perfil, casos y respuestas');
  ok(!(await pagina.locator('#notice').isHidden()) && /lista/.test(await pagina.locator('#noticeTitle').innerText()), 'staff: indica cómo seguir');
  await pagina.click('#btnCopiar');
  await pagina.waitForTimeout(200);
  ok((await pagina.evaluate(() => navigator.clipboard.readText())).includes('Respuesta general 10'), 'staff: copiar las respuestas');
  ok(reg.externas.length === 0, 'staff: no envía nada a terceros');
  await pagina.reload({ waitUntil: 'networkidle' });
  ok(await pagina.locator('#pm-15').inputValue() === 'Respuesta de Playmaker 15', 'staff: el borrador se restaura al volver');
  await ctx.close();
}

// ── 9. Reproductor bajo demanda ──────────────────────────────
{
  const ctx = await contexto(navegador);
  await ctx.addInitScript(e => { try { localStorage.setItem('elysium_cookies', e); } catch (x) {} }, ELECCION);
  const pagina = await ctx.newPage();
  const externas = [];
  pagina.on('request', r => { if (new URL(r.url()).host !== LOCAL) externas.push(r.url()); });
  await pagina.goto(BASE + '/comunidad.html', { waitUntil: 'networkidle' });
  ok(await pagina.locator('#creadores .empty').isVisible(), 'creadores: sin datos autorizados muestra el estado vacío');
  await pagina.evaluate(() => {
    const d = document.createElement('div');
    d.className = 'embed'; d.setAttribute('data-embed', 'youtube'); d.setAttribute('data-id', 'PRUEBA123');
    d.innerHTML = '<div class="embed-cover"><button class="play" type="button" aria-label="Reproducir">▶</button><p>Aviso</p></div>';
    document.querySelector('#creadores').appendChild(d);
  });
  await pagina.addScriptTag({ url: '/assets/js/elysium.js' });
  ok(await pagina.locator('#creadores iframe').count() === 0 && externas.length === 0, 'reproductor: nada se carga antes de apretar reproducir');
  await pagina.locator('#creadores .embed .play').click();
  await pagina.waitForTimeout(300);
  const src = await pagina.locator('#creadores iframe').getAttribute('src');
  ok(src && src.startsWith('https://www.youtube-nocookie.com/embed/PRUEBA123'), 'reproductor: al reproducir carga YouTube en modo privacidad mejorada');
  await ctx.close();
}

// ── 10. Sin JavaScript y con menos movimiento ────────────────
{
  const ctx = await contexto(navegador, { javaScriptEnabled: false });
  const pagina = await ctx.newPage();
  await pagina.goto(BASE + '/', { waitUntil: 'networkidle' });
  const opacidad = await pagina.evaluate(() => getComputedStyle(document.querySelector('[data-reveal]')).opacity);
  ok(opacidad === '1', 'sin JS: el contenido es visible');
  ok(await pagina.locator('.world-panel:visible').count() === 4, 'sin JS: se ven los cuatro mundos');
  await ctx.close();

  const ctx2 = await contexto(navegador, { reducedMotion: 'reduce' });
  await ctx2.addInitScript(e => { try { localStorage.setItem('elysium_cookies', e); } catch (x) {} }, ELECCION);
  const p2 = await ctx2.newPage();
  await p2.goto(BASE + '/', { waitUntil: 'networkidle' });
  ok(await p2.evaluate(() => [...document.querySelectorAll('[data-reveal]')].every(e => getComputedStyle(e).opacity === '1')), 'menos movimiento: nada queda oculto esperando animación');
  ok(await p2.locator('.hero h1 .l').count() === 0, 'menos movimiento: el título no se anima letra por letra');
  await ctx2.close();
}

await navegador.close();

const informe = resultado.join('\n') + `\n\n${pruebas - fallas} de ${pruebas} comprobaciones correctas.`;
console.log(informe);
if (CAPTURAS) writeFileSync(`${CAPTURAS}/resultado.txt`, informe);
process.exit(fallas ? 1 : 0);
