// ═════════════════════════════════════════════════════════════
//  ELYSIUM | ES — prueba de la variante con el acceso confirmado
//
//  Comprueba que, cuando se confirmen el acceso público y el código en
//  _data/sitio.yml, aparezcan el comando y los botones para conectarse,
//  y que el video de portada solo se descargue cuando corresponde.
//
//  Uso:
//    bash tests/variante-acceso.sh /tmp/variante
//    python3 -m http.server 4001 --directory /tmp/variante --bind 127.0.0.1 &
//    node tests/verificar-variante.mjs http://127.0.0.1:4001
// ═════════════════════════════════════════════════════════════
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:4001').replace(/\/$/, '');
const LOCAL = new URL(BASE).host;
const ELECCION = JSON.stringify({ v: 2, analitica: false, t: Date.now() });
let fallas = 0, pruebas = 0;
const resultado = [];
const ok = (c, m) => { pruebas++; if (!c) fallas++; resultado.push((c ? 'OK    ' : 'FALLA ') + m); };

async function contexto(nav, opciones = {}) {
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'], ...opciones });
  await ctx.addInitScript(e => { try { localStorage.setItem('elysium_cookies', e); } catch (x) {} }, ELECCION);
  await ctx.route(u => new URL(u).host !== LOCAL, r => r.fulfill({ status: 204, body: '' }));
  return ctx;
}

const nav = await chromium.launch();
{
  const ctx = await contexto(nav);
  const videos = [];
  await ctx.route('**/prueba.mp4', r => { videos.push(r.request().url()); return r.fulfill({ status: 200, contentType: 'video/mp4', body: '' }); });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'load' });
  ok(await p.locator('.hero .actions a[href="fivem://connect/cfx.re/join/kr546a"]').count() === 1, 'portada: con el acceso confirmado aparece «Entrar a la ciudad»');
  ok(/Confirmado/.test(await p.locator('[data-estado]').innerText()), 'placa: el acceso público figura confirmado');
  await p.locator('#comando-portada + button').click();
  ok(await p.evaluate(() => navigator.clipboard.readText()) === 'connect cfx.re/join/kr546a', 'conexión: el comando se copia completo');
  await p.waitForTimeout(1500);
  ok(videos.length >= 1, 'video de portada: en escritorio se descarga después de cargar la página');
  ok(await p.locator('.hero-video source').count() >= 1, 'video de portada: se arma con sus fuentes');
  await p.evaluate(() => document.getElementById('sistemas').scrollIntoView({ behavior: 'instant' }));
  await p.waitForTimeout(700);
  ok(await p.locator('[data-dock] a[href^="fivem://connect/cfx.re/join/"]').isVisible(), 'acceso rápido: ofrece «Entrar»');
  await p.goto(BASE + '/como-entrar.html', { waitUntil: 'networkidle' });
  ok(await p.locator('#paso-4 a[href^="fivem://connect/cfx.re/join/kr546a"]').count() === 1, 'guía: botón «Abrir en FiveM» en el paso IV');
  ok(await p.locator('#listo a[href^="fivem://"]').count() === 1, 'guía: el cierre también conecta');
  await ctx.close();
}
for (const [nombre, opciones] of [['pantalla chica', { viewport: { width: 390, height: 844 } }], ['menos movimiento', { reducedMotion: 'reduce' }]]) {
  const ctx = await contexto(nav, opciones);
  const videos = [];
  await ctx.route('**/prueba.mp4', r => { videos.push(r.request().url()); return r.fulfill({ status: 200, body: '' }); });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'load' });
  await p.waitForTimeout(1500);
  ok(videos.length === 0, `video de portada: con ${nombre} no se descarga`);
  await ctx.close();
}
await nav.close();
console.log(resultado.join('\n') + `\n\n${pruebas - fallas} de ${pruebas} comprobaciones correctas.`);
process.exit(fallas ? 1 : 0);
