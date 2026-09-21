/* ═════════════════════════════════════════════════════════════
   ELYSIUM | ES — consentimiento de cookies
   ─────────────────────────────────────────────────────────────
   Va en el <head> de cada página, EN LUGAR del bloque de Google
   Analytics:

       <script src="cookies.js"></script>

   Analytics no se descarga ni guarda nada hasta que la persona
   aprieta "Aceptar". Si deniega, no se carga y se borran las
   cookies _ga que hubieran quedado de visitas anteriores.

   Cualquier enlace con el atributo data-cookies vuelve a abrir
   el aviso, para cambiar la elección:
       <a href="#" data-cookies>Preferencias de cookies</a>
   ═════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GA_ID = 'G-1XMC8M5F5X';
  var CLAVE = 'elysium_cookies';
  var VIGENCIA_DIAS = 365;            // pasado un año se vuelve a preguntar
  var MAS_INFO = 'terminos.html#p5';  // sección de cookies de la política

  /* ── gtag disponible desde el principio ─────────────────── */
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }

  /* ── Elección guardada ──────────────────────────────────── */
  function leer() {
    try {
      var d = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (!d || (d.v !== 'si' && d.v !== 'no') || !d.t) return null;
      if (Date.now() - d.t > VIGENCIA_DIAS * 86400000) return null;
      return d.v;
    } catch (e) { return null; }
  }
  function guardar(v) {
    try { localStorage.setItem(CLAVE, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }

  /* ── Analytics ──────────────────────────────────────────── */
  var cargado = false;
  function cargarAnalytics() {
    if (cargado) {
      gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    cargado = true;
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted'
    });
    gtag('js', new Date());
    gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function apagarAnalytics() {
    if (cargado) gtag('consent', 'update', { analytics_storage: 'denied' });
    // Borra las cookies de Analytics en el dominio y en sus dominios padre
    var partes = location.hostname.split('.');
    var dominios = [''];
    for (var i = 0; i < partes.length - 1; i++) dominios.push('.' + partes.slice(i).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var nombre = c.split('=')[0].trim();
      if (!/^_ga|^_gid|^_gat/.test(nombre)) return;
      dominios.forEach(function (d) {
        document.cookie = nombre + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  var eleccion = leer();
  if (eleccion === 'si') cargarAnalytics();

  /* ── Estilos del aviso ──────────────────────────────────── */
  var CSS = [
    '.ely-ck{position:fixed;left:0;right:0;bottom:0;z-index:150;',
    ' background:rgba(11,15,13,.97);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);',
    ' border-top:1px solid rgba(185,143,82,.35);',
    ' font-family:"Jost",system-ui,sans-serif;font-weight:300;color:var(--marble,#ECE7DC);',
    ' transform:translateY(100%);transition:transform .55s cubic-bezier(.2,.75,.25,1);}',
    '.ely-ck.is-on{transform:none;}',
    '.ely-ck-in{max-width:76rem;margin:0 auto;padding:1.35rem clamp(1.25rem,5vw,3rem);',
    ' display:flex;align-items:center;gap:1.25rem 2.5rem;flex-wrap:wrap;}',
    '.ely-ck-txt{flex:1 1 26rem;margin:0;font-size:.875rem;line-height:1.65;color:var(--muted,#94A09A);max-width:none;}',
    '.ely-ck-txt b{display:block;font-family:"Marcellus SC",Georgia,serif;font-weight:400;',
    ' font-size:.72rem;letter-spacing:.2em;color:var(--bronze,#B98F52);margin-bottom:.3rem;}',
    '.ely-ck-txt em{font-style:normal;color:var(--marble,#ECE7DC);}',
    '.ely-ck-acc{display:flex;align-items:center;gap:.75rem 1.25rem;flex-wrap:wrap;}',
    '.ely-ck-mas{font-size:.8125rem;letter-spacing:.05em;color:var(--muted,#94A09A);',
    ' text-decoration:none;border-bottom:1px solid rgba(185,143,82,.35);padding-bottom:.1rem;',
    ' transition:color .3s ease,border-color .3s ease;}',
    '.ely-ck-mas:hover{color:var(--bronze,#B98F52);border-color:var(--bronze,#B98F52);}',
    /* Aceptar y Denegar con el mismo peso visual: ninguna opción se esconde */
    '.ely-ck-btn{font-family:"Jost",sans-serif;font-weight:400;font-size:.8125rem;letter-spacing:.11em;',
    ' min-width:8.5rem;padding:.85rem 1.5rem;cursor:pointer;',
    ' background:transparent;color:var(--marble,#ECE7DC);border:1px solid var(--bronze,#B98F52);',
    ' transition:background .3s ease,color .3s ease;}',
    '.ely-ck-btn:hover{background:var(--bronze,#B98F52);color:var(--ink,#0B0F0D);}',
    '.ely-ck-btn:focus-visible,.ely-ck-mas:focus-visible{outline:2px solid var(--bronze,#B98F52);outline-offset:3px;}',
    '.ely-ck-hoy{flex-basis:100%;font-size:.75rem;letter-spacing:.06em;color:#6D7773;margin:0;}',
    '@media (max-width:640px){',
    ' .ely-ck-acc{width:100%;}',
    ' .ely-ck-btn{flex:1 1 0;min-width:0;}',
    ' .ely-ck-mas{order:3;flex-basis:100%;text-align:center;border:none;padding-top:.25rem;}',
    '}',
    '@media (prefers-reduced-motion:reduce){.ely-ck{transition:none;}}',
    '@media print{.ely-ck{display:none!important;}}'
  ].join('');

  /* ── Aviso ──────────────────────────────────────────────── */
  var aviso = null;

  function construir() {
    if (aviso) return aviso;
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    aviso = document.createElement('section');
    aviso.className = 'ely-ck';
    aviso.setAttribute('role', 'region');
    aviso.setAttribute('aria-label', 'Aviso de cookies');
    aviso.innerHTML =
      '<div class="ely-ck-in">' +
        '<p class="ely-ck-txt"><b>Cookies</b>' +
          'Usamos Google Analytics para saber cuánta gente visita el sitio y qué secciones lee. ' +
          '<em>No se activa hasta que lo aceptes</em>, y podés cambiar de idea cuando quieras desde el pie de página.' +
        '</p>' +
        '<div class="ely-ck-acc">' +
          '<a class="ely-ck-mas" href="' + MAS_INFO + '">Más información</a>' +
          '<button type="button" class="ely-ck-btn" data-ck="no">Denegar</button>' +
          '<button type="button" class="ely-ck-btn" data-ck="si">Aceptar</button>' +
        '</div>' +
        '<p class="ely-ck-hoy" hidden></p>' +
      '</div>';
    document.body.appendChild(aviso);

    aviso.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ck]');
      if (!b) return;
      var v = b.getAttribute('data-ck');
      guardar(v);
      eleccion = v;
      if (v === 'si') cargarAnalytics(); else apagarAnalytics();
      cerrar();
    });
    return aviso;
  }

  function abrir(conFoco) {
    construir();
    var hoy = aviso.querySelector('.ely-ck-hoy');
    var actual = leer();
    if (actual) {
      hoy.hidden = false;
      hoy.textContent = 'Tu elección actual: ' + (actual === 'si' ? 'aceptadas.' : 'denegadas.');
    } else {
      hoy.hidden = true;
    }
    aviso.style.display = '';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { aviso.classList.add('is-on'); });
    });
    if (conFoco) setTimeout(function () { aviso.querySelector('[data-ck="si"]').focus(); }, 80);
  }

  function cerrar() {
    if (!aviso) return;
    aviso.classList.remove('is-on');
    var fin = function () { if (!aviso.classList.contains('is-on')) aviso.style.display = 'none'; };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) fin();
    else setTimeout(fin, 600);
  }

  /* ── Arranque ───────────────────────────────────────────── */
  function iniciar() {
    // Cualquier enlace o botón con data-cookies reabre el aviso
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cookies]');
      if (!t) return;
      e.preventDefault();
      abrir(true);
    });
    // Primera visita, o pasó más de un año: se pregunta
    if (!eleccion) setTimeout(function () { abrir(false); }, 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  window.ElysiumCookies = { abrir: function () { abrir(true); }, estado: leer };
})();
