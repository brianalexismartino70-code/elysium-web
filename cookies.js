/* ═════════════════════════════════════════════════════════════
   ELYSIUM | ES — consentimiento de cookies (versión 2)
   ─────────────────────────────────────────────────────────────
   Se carga en todas las páginas desde _includes/head.html.

   · Google Analytics 4 no se descarga ni guarda nada hasta que la
     persona lo acepta. Si lo rechaza o retira el consentimiento,
     se bloquea el envío de datos y se borran las cookies _ga.
   · "Aceptar", "Rechazar" y "Configurar" tienen el mismo peso visual.
   · La elección dura 12 meses y se cambia desde cualquier elemento con
     el atributo data-cookies (por ejemplo, el pie de página).
   · Los videos de terceros no dependen de este aviso: nunca se cargan
     solos, solo cuando la persona aprieta reproducir.
   · Si el navegador envía la señal Global Privacy Control (GPC), vale como
     rechazo de la medición para cualquier persona, sin importar el país,
     y no se puede activar mientras la señal siga encendida.
   · Si cambian los servicios opcionales, subir la versión (v) para que se
     vuelva a preguntar: un consentimiento viejo no cubre lo nuevo.

   API: window.ElysiumCookies.abrir(), .configurar(), .estado(),
        .permite('analitica'), .alCambiar(fn)
   ═════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GA_ID = 'G-1XMC8M5F5X';
  var CLAVE = 'elysium_cookies';
  var VIGENCIA_DIAS = 365;              // pasado un año se vuelve a preguntar
  var MAS_INFO = '/cookies.html';
  var oyentes = [];
  var GPC = navigator.globalPrivacyControl === true;   // señal del navegador

  /* ── gtag disponible desde el principio (no envía nada por sí solo) ── */
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }

  /* ── Elección guardada ──────────────────────────────────── */
  // v1 (hasta 10/2026): { v: 'si' | 'no', t }
  // v2: { v: 2, analitica: true | false, t }
  function leer() {
    try {
      var d = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (!d || !d.t || Date.now() - d.t > VIGENCIA_DIAS * 86400000) return null;
      if (d.v === 'si' || d.v === 'no') return { analitica: d.v === 'si', t: d.t };
      if (d.v === 2 && typeof d.analitica === 'boolean') return { analitica: d.analitica, t: d.t };
      return null;
    } catch (e) { return null; }
  }
  function guardar(eleccion) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({ v: 2, analitica: !!eleccion.analitica, t: Date.now(), gpc: GPC }));
    } catch (e) {}
  }

  /* ── Google Analytics ───────────────────────────────────── */
  var cargado = false;
  function activarAnalytics() {
    window['ga-disable-' + GA_ID] = false;
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
    // Bloquea cualquier envío de esta página y de las siguientes
    window['ga-disable-' + GA_ID] = true;
    if (cargado) gtag('consent', 'update', { analytics_storage: 'denied' });
    // Borra las cookies de Analytics en el dominio y en sus dominios padre
    var partes = location.hostname.split('.');
    var dominios = [''];
    for (var i = 0; i < partes.length - 1; i++) dominios.push('.' + partes.slice(i).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var nombre = c.split('=')[0].trim();
      if (!/^(_ga|_gid|_gat)/.test(nombre)) return;
      dominios.forEach(function (d) {
        document.cookie = nombre + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  var eleccion = leer();
  // Con la señal GPC encendida, la medición queda rechazada aunque antes se
  // hubiera aceptado; se guarda para no preguntar en cada página.
  if (GPC && (!eleccion || eleccion.analitica)) {
    eleccion = { analitica: false, t: Date.now() };
    guardar(eleccion);
    apagarAnalytics();
  }
  if (eleccion && eleccion.analitica) activarAnalytics();
  else window['ga-disable-' + GA_ID] = true;

  function aplicar(nueva) {
    var antes = eleccion;
    eleccion = { analitica: !!nueva.analitica && !GPC, t: Date.now() };
    guardar(eleccion);
    if (eleccion.analitica) activarAnalytics(); else apagarAnalytics();
    oyentes.forEach(function (fn) { try { fn(eleccion, antes); } catch (e) {} });
  }

  /* ── Estilos del aviso ──────────────────────────────────── */
  var CSS = [
    '.ely-ck{position:fixed;left:0;right:0;bottom:0;z-index:150;',
    ' background:rgba(11,15,13,.97);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);',
    ' border-top:1px solid rgba(185,143,82,.35);max-height:100vh;overflow-y:auto;',
    ' font-family:"Jost",system-ui,sans-serif;font-weight:300;color:#ECE7DC;',
    ' transform:translateY(100%);transition:transform .55s cubic-bezier(.2,.75,.25,1);}',
    '.ely-ck.is-on{transform:none;}',
    '.ely-ck-in{max-width:78rem;margin:0 auto;padding:1.35rem clamp(1.25rem,5vw,3rem);',
    ' display:flex;align-items:center;gap:1.1rem 2.5rem;flex-wrap:wrap;}',
    '.ely-ck-txt{flex:1 1 26rem;margin:0;font-size:.875rem;line-height:1.65;color:#94A09A;max-width:none;}',
    '.ely-ck-txt b{display:block;font-family:"Marcellus SC",Georgia,serif;font-weight:400;',
    ' font-size:.72rem;letter-spacing:.2em;color:#B98F52;margin-bottom:.3rem;}',
    '.ely-ck-txt em{font-style:normal;color:#ECE7DC;}',
    '.ely-ck-acc{display:flex;align-items:center;gap:.75rem 1rem;flex-wrap:wrap;}',
    '.ely-ck-mas{font-size:.8125rem;letter-spacing:.05em;color:#94A09A;',
    ' text-decoration:none;border-bottom:1px solid rgba(185,143,82,.35);padding-bottom:.1rem;',
    ' transition:color .3s ease,border-color .3s ease;}',
    '.ely-ck-mas:hover{color:#B98F52;border-color:#B98F52;}',
    /* Aceptar, Rechazar y Configurar con el mismo peso visual */
    '.ely-ck-btn{font-family:"Jost",sans-serif;font-weight:400;font-size:.8125rem;letter-spacing:.11em;',
    ' min-width:8.5rem;min-height:2.9rem;padding:.8rem 1.4rem;cursor:pointer;',
    ' background:transparent;color:#ECE7DC;border:1px solid #B98F52;',
    ' transition:background .3s ease,color .3s ease;}',
    '.ely-ck-btn:hover{background:#B98F52;color:#0B0F0D;}',
    '.ely-ck-btn:focus-visible,.ely-ck-mas:focus-visible,.ely-ck-sw:focus-visible{outline:2px solid #B98F52;outline-offset:3px;}',
    '.ely-ck-hoy{flex-basis:100%;font-size:.75rem;letter-spacing:.06em;color:#7F8A84;margin:0;}',
    /* Panel de configuración */
    '.ely-ck-cfg{flex-basis:100%;display:grid;gap:.75rem;margin:.25rem 0 .5rem;}',
    '.ely-ck-cfg[hidden]{display:none;}',
    '.ely-ck-cat{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.35rem 1.5rem;align-items:center;',
    ' border:1px solid #2B3B32;padding:1rem 1.15rem;background:#101613;}',
    '.ely-ck-cat h3{margin:0;font-family:"Marcellus",Georgia,serif;font-weight:400;font-size:1rem;color:#ECE7DC;letter-spacing:.01em;}',
    '.ely-ck-cat p{grid-column:1/-1;margin:0;font-size:.8125rem;line-height:1.6;color:#94A09A;max-width:none;}',
    '.ely-ck-fija{font-size:.6875rem;letter-spacing:.14em;text-transform:uppercase;color:#B98F52;}',
    '.ely-ck-gpc{border-left:2px solid #7FA393;padding-left:.75rem;color:#ECE7DC !important;}',
    '.ely-ck-sw:disabled{opacity:.45;cursor:not-allowed;}',
    '.ely-ck-sw{position:relative;width:3rem;height:1.6rem;flex:none;cursor:pointer;border-radius:1rem;',
    ' background:#171F1A;border:1px solid #5F7568;padding:0;transition:background .3s ease,border-color .3s ease;}',
    '.ely-ck-sw::after{content:"";position:absolute;top:.2rem;left:.22rem;width:1.05rem;height:1.05rem;border-radius:50%;',
    ' background:#94A09A;transition:transform .3s cubic-bezier(.2,.7,.3,1),background .3s ease;}',
    '.ely-ck-sw[aria-checked="true"]{background:rgba(185,143,82,.25);border-color:#B98F52;}',
    '.ely-ck-sw[aria-checked="true"]::after{transform:translateX(1.35rem);background:#B98F52;}',
    '@media (max-width:640px){',
    ' .ely-ck-acc{width:100%;}',
    ' .ely-ck-btn{flex:1 1 0;min-width:0;padding-inline:.6rem;}',
    ' .ely-ck-mas{order:4;flex-basis:100%;text-align:center;border:none;padding-top:.25rem;}',
    '}',
    '@media (prefers-reduced-motion:reduce){.ely-ck,.ely-ck-sw,.ely-ck-sw::after{transition:none;}}',
    '@media print{.ely-ck{display:none!important;}}'
  ].join('');

  /* ── Aviso ──────────────────────────────────────────────── */
  var aviso = null, panel = null, interruptor = null, guardarSel = null, aceptarBtn = null;

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
        '<p class="ely-ck-txt" id="ely-ck-txt"><b>Cookies</b>' +
          'Usamos Google Analytics para saber cuánta gente visita el sitio y qué secciones lee. ' +
          '<em>No se activa hasta que lo aceptes</em>, y podés cambiar de idea cuando quieras desde el pie de página. ' +
          'Los videos de terceros solo se cargan si los reproducís.' +
        '</p>' +
        '<div class="ely-ck-cfg" id="ely-ck-cfg" hidden>' +
          '<div class="ely-ck-cat">' +
            '<h3>Necesarias</h3><span class="ely-ck-fija">Siempre activas</span>' +
            '<p>Guardan en tu navegador esta elección y, si usás la postulación a staff, el borrador de tus respuestas. No se envían a ningún servidor.</p>' +
          '</div>' +
          '<div class="ely-ck-cat">' +
            '<h3 id="ely-ck-ga">Medición de visitas · Google Analytics</h3>' +
            '<button type="button" class="ely-ck-sw" role="switch" aria-checked="false" aria-labelledby="ely-ck-ga" data-ck-sw="analitica"></button>' +
            '<p>Cuenta visitas y secciones leídas con las cookies _ga y _ga_1XMC8M5F5X, de Google. Solo se cargan si activás esta opción.</p>' +
            '<p class="ely-ck-gpc" hidden>Tu navegador envía la señal Global Privacy Control (GPC). Mientras esté encendida, la medición de visitas queda desactivada.</p>' +
          '</div>' +
          '<div class="ely-ck-cat">' +
            '<h3>Contenido externo · YouTube y Twitch</h3><span class="ely-ck-fija">Solo al reproducir</span>' +
            '<p>Los reproductores de terceros nunca se cargan solos: cada video muestra un aviso y se carga únicamente cuando apretás reproducir.</p>' +
          '</div>' +
        '</div>' +
        '<div class="ely-ck-acc">' +
          '<a class="ely-ck-mas" href="' + MAS_INFO + '">Política de cookies</a>' +
          '<button type="button" class="ely-ck-btn" data-ck="no">Rechazar</button>' +
          '<button type="button" class="ely-ck-btn" data-ck="cfg" aria-expanded="false" aria-controls="ely-ck-cfg">Configurar</button>' +
          '<button type="button" class="ely-ck-btn" data-ck="guardar" hidden>Guardar selección</button>' +
          '<button type="button" class="ely-ck-btn" data-ck="si">Aceptar</button>' +
        '</div>' +
        '<p class="ely-ck-hoy" hidden></p>' +
      '</div>';
    document.body.appendChild(aviso);

    panel = aviso.querySelector('.ely-ck-cfg');
    interruptor = aviso.querySelector('[data-ck-sw]');
    guardarSel = aviso.querySelector('[data-ck="guardar"]');
    aceptarBtn = aviso.querySelector('[data-ck="si"]');
    if (GPC) {
      aviso.querySelector('.ely-ck-gpc').hidden = false;
      interruptor.disabled = true;
      aceptarBtn.hidden = true;
    }

    aviso.addEventListener('click', function (e) {
      var sw = e.target.closest('[data-ck-sw]');
      if (sw) {
        sw.setAttribute('aria-checked', String(sw.getAttribute('aria-checked') !== 'true'));
        return;
      }
      var b = e.target.closest('[data-ck]');
      if (!b) return;
      var accion = b.getAttribute('data-ck');
      if (accion === 'cfg') { mostrarPanel(panel.hidden); return; }
      if (accion === 'si') aplicar({ analitica: true });
      else if (accion === 'no') aplicar({ analitica: false });
      else if (accion === 'guardar') aplicar({ analitica: interruptor.getAttribute('aria-checked') === 'true' });
      cerrar();
    });
    aviso.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && eleccion) cerrar();
    });
    return aviso;
  }

  function mostrarPanel(ver) {
    panel.hidden = !ver;
    guardarSel.hidden = !ver;
    aviso.querySelector('[data-ck="cfg"]').setAttribute('aria-expanded', String(ver));
    aceptarBtn.textContent = ver ? 'Aceptar todo' : 'Aceptar';
    if (ver) (interruptor.disabled ? guardarSel : interruptor).focus();
  }

  var origenFoco = null;
  function abrir(conFoco, enConfiguracion) {
    construir();
    var actual = leer();
    var hoy = aviso.querySelector('.ely-ck-hoy');
    interruptor.setAttribute('aria-checked', String(!!(actual && actual.analitica)));
    if (actual) {
      hoy.hidden = false;
      hoy.textContent = 'Tu elección actual: medición de visitas ' + (actual.analitica ? 'aceptada.' : 'rechazada.');
    } else {
      hoy.hidden = true;
    }
    mostrarPanel(!!enConfiguracion);
    aviso.style.display = '';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { aviso.classList.add('is-on'); });
    });
    if (conFoco) {
      origenFoco = document.activeElement;
      setTimeout(function () {
        (enConfiguracion && !interruptor.disabled ? interruptor : aviso.querySelector('[data-ck="no"]')).focus();
      }, 80);
    }
  }

  function cerrar() {
    if (!aviso) return;
    aviso.classList.remove('is-on');
    var fin = function () { if (!aviso.classList.contains('is-on')) aviso.style.display = 'none'; };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) fin();
    else setTimeout(fin, 600);
    if (origenFoco && document.contains(origenFoco)) origenFoco.focus();
    origenFoco = null;
  }

  /* ── Arranque ───────────────────────────────────────────── */
  function iniciar() {
    // Cualquier enlace o botón con data-cookies reabre el aviso en modo configuración
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cookies]');
      if (!t) return;
      e.preventDefault();
      abrir(true, true);
    });
    // Primera visita, o pasó más de un año: se pregunta
    if (!eleccion) setTimeout(function () { abrir(false, false); }, 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  window.ElysiumCookies = {
    abrir: function () { abrir(true, false); },
    configurar: function () { abrir(true, true); },
    estado: function () { return leer(); },
    permite: function (categoria) {
      var e = leer();
      return categoria === 'necesarias' || (!GPC && !!(e && e[categoria]));
    },
    senalGPC: function () { return GPC; },
    alCambiar: function (fn) { if (typeof fn === 'function') oyentes.push(fn); }
  };
})();
