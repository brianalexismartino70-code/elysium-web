/* ═════════════════════════════════════════════════════════════
   ELYSIUM | ES — comportamiento del sitio
   Sin dependencias. Cada bloque se activa solo si su marcado existe.
   Todo funciona sin animaciones si la persona pidió menos movimiento.
   ═════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var cuerpo = document.body;

  /* ══════ AVISOS BREVES ══════ */
  var toastEl = $('#toast'), toastReloj = null;
  function avisar(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastReloj);
    toastReloj = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2400);
  }

  function copiar(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texto);
    }
    return new Promise(function (ok, mal) {
      var t = document.createElement('textarea');
      t.value = texto;
      t.setAttribute('readonly', '');
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy') ? ok() : mal(); } catch (e) { mal(e); }
      document.body.removeChild(t);
    });
  }

  /* ══════ CABECERA, PROGRESO Y VOLVER ARRIBA ══════ */
  var cabecera = $('#cabecera');
  var readbar = $('#readbar');
  var toTop = $('#toTop');
  var cue = $('#cue');
  var heroMedia = $('.hero-media');
  var pendiente = false;

  function alDesplazar() {
    pendiente = false;
    var y = window.scrollY;
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    if (cabecera) cabecera.classList.toggle('is-stuck', y > 40);
    if (readbar) readbar.style.transform = 'scaleX(' + (alto > 0 ? Math.min(y / alto, 1) : 0).toFixed(4) + ')';
    if (toTop) toTop.classList.toggle('is-on', y > window.innerHeight * 0.9);
    if (cue) cue.classList.toggle('is-gone', y > 80);
    if (heroMedia && !quieto && y < window.innerHeight * 1.2) {
      heroMedia.style.transform = 'translate3d(0,' + (y * 0.22).toFixed(1) + 'px,0)';
    }
  }
  window.addEventListener('scroll', function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(alDesplazar); }
  }, { passive: true });
  alDesplazar();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: quieto ? 'auto' : 'smooth' });
      var destino = $('#contenido');
      if (destino) destino.focus({ preventScroll: true });
    });
  }

  /* ══════ MENÚ EN PANTALLAS MEDIANAS Y CHICAS ══════ */
  var menu = $('#menu');
  var botonMenu = $('.menu-toggle');
  if (menu && botonMenu) {
    botonMenu.hidden = false;
    var etiqueta = $('span', botonMenu);
    var afuera = $$('main, .foot, .skip');

    var enfocables = function () {
      return [botonMenu].concat($$('a[href], button:not([disabled])', menu));
    };
    var abrirMenu = function () {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add('is-open'); });
      botonMenu.setAttribute('aria-expanded', 'true');
      if (etiqueta) etiqueta.textContent = 'Cerrar';
      cuerpo.classList.add('menu-open');
      afuera.forEach(function (el) { el.setAttribute('inert', ''); });
      var primero = $('a', menu);
      if (primero) setTimeout(function () { primero.focus(); }, 60);
    };
    var cerrarMenu = function (devolverFoco) {
      menu.classList.remove('is-open');
      botonMenu.setAttribute('aria-expanded', 'false');
      if (etiqueta) etiqueta.textContent = 'Menú';
      cuerpo.classList.remove('menu-open');
      afuera.forEach(function (el) { el.removeAttribute('inert'); });
      setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, quieto ? 0 : 350);
      if (devolverFoco) botonMenu.focus();
    };

    botonMenu.addEventListener('click', function () {
      if (botonMenu.getAttribute('aria-expanded') === 'true') cerrarMenu(false);
      else abrirMenu();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) cerrarMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (botonMenu.getAttribute('aria-expanded') !== 'true') return;
      if (e.key === 'Escape') { e.preventDefault(); cerrarMenu(true); return; }
      if (e.key !== 'Tab') return;
      var lista = enfocables();
      var i = lista.indexOf(document.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); lista[lista.length - 1].focus(); }
      else if (!e.shiftKey && i === lista.length - 1) { e.preventDefault(); lista[0].focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1240 && botonMenu.getAttribute('aria-expanded') === 'true') cerrarMenu(false);
    });
  }

  /* ══════ SECCIÓN ACTIVA EN LA BARRA (portada) ══════ */
  if ('IntersectionObserver' in window && location.pathname === '/') {
    var anclas = $$('.site-nav a[href^="/#"]');
    var secciones = anclas.map(function (a) { return document.getElementById(a.getAttribute('href').slice(2)); }).filter(Boolean);
    if (secciones.length) {
      var vistas = {};
      var espia = new IntersectionObserver(function (filas) {
        filas.forEach(function (f) { vistas[f.target.id] = f.isIntersecting; });
        var actual = null;
        secciones.forEach(function (s) { if (vistas[s.id] && !actual) actual = s.id; });
        anclas.forEach(function (a) { a.classList.toggle('is-here', !!actual && a.getAttribute('href') === '/#' + actual); });
      }, { rootMargin: '-20% 0px -65% 0px' });
      secciones.forEach(function (s) { espia.observe(s); });
    }
  }

  /* ══════ PORTADA: LETRAS Y PROFUNDIDAD ══════ */
  var h1 = $('.hero h1');
  if (h1 && !quieto) {
    var nodo = h1.firstChild;
    if (nodo && nodo.nodeType === 3) {
      h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
      var frag = document.createDocumentFragment();
      nodo.textContent.split('').forEach(function (c, i) {
        var sp = document.createElement('span');
        sp.className = 'l';
        sp.setAttribute('aria-hidden', 'true');
        sp.textContent = c;
        sp.style.animationDelay = (0.12 + i * 0.055) + 's';
        frag.appendChild(sp);
      });
      h1.replaceChild(frag, nodo);
      var es = $('.es', h1);
      if (es) es.setAttribute('aria-hidden', 'true');
    }
  }
  if (heroMedia && !quieto && fino) {
    var hero = $('.hero');
    var img = $('img', heroMedia);
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var dx = (e.clientX / r.width - 0.5) * -14;
      var dy = ((e.clientY - r.top) / r.height - 0.5) * -10;
      if (img) img.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0)';
    });
    if (img) img.style.transition = 'transform .6s cubic-bezier(.2,.7,.3,1)';
  }

  /* ══════ ESTADO DEL SERVIDOR ══════
     Solo se lee /estado.json, que publica la acción "Estado del servidor"
     en este mismo dominio. El navegador no consulta servicios externos
     ni conoce la dirección del servidor. */
  var cajas = $$('[data-estado]');
  if (cajas.length) {
    var MINIMO = parseInt(cuerpo.getAttribute('data-minimo') || '1', 10);
    var HORAS = parseFloat(cuerpo.getAttribute('data-horas') || '12');
    var previo = 0;

    var haceCuanto = function (ms) {
      var s = Math.max(0, Math.round(ms / 1000));
      if (s < 90) return 'hace un momento';
      if (s < 5400) return 'hace ' + Math.round(s / 60) + ' min';
      if (s < 172800) return 'hace ' + Math.round(s / 3600) + ' h';
      return 'hace ' + Math.round(s / 86400) + ' días';
    };
    var contar = function (el, destino) {
      if (quieto) { el.textContent = destino; previo = destino; return; }
      var desde = previo, t0 = performance.now(), dur = 900;
      (function paso(t) {
        var k = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(desde + (destino - desde) * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(paso); else previo = destino;
      })(t0);
    };
    var pintar = function (d) {
      cajas.forEach(function (caja) {
        var vivo = $('[data-estado-vivo]', caja);
        var texto = $('[data-estado-texto]', caja);
        var hace = $('[data-estado-hace]', caja);
        if (!vivo || !texto) return;
        vivo.classList.remove('is-online', 'is-offline', 'is-stale');
        if (!d) {
          texto.textContent = 'Estado en vivo no disponible';
          if (hace) hace.textContent = '';
          return;
        }
        var sello = Date.parse(d.actualizado || '');
        var edad = sello ? Date.now() - sello : Infinity;
        var viejo = edad > HORAS * 3600000;
        var jugadores = parseInt(d.jugadores, 10);
        var tope = parseInt(d.tope, 10);
        if (d.en_linea === true && !isNaN(jugadores)) {
          vivo.classList.add(viejo ? 'is-stale' : 'is-online');
          if (jugadores >= MINIMO) {
            texto.innerHTML = 'Servidor en línea · <strong class="num">' + previo + '</strong>' + (tope ? ' de ' + tope : '') + ' conectados';
            contar($('.num', texto), jugadores);
          } else {
            texto.textContent = 'Servidor en línea';
          }
        } else {
          vivo.classList.add('is-offline');
          texto.textContent = 'No se pudo confirmar el estado del servidor';
        }
        if (hace) hace.textContent = sello ? 'Dato ' + haceCuanto(edad) + (viejo ? ' · puede estar desactualizado' : '') : '';
      });
    };
    var consultar = function () {
      fetch('/estado.json', { cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(pintar, function () { pintar(null); });
    };
    consultar();
    setInterval(function () { if (document.visibilityState === 'visible') consultar(); }, 300000);
  }

  /* ══════ BOLETÍN ══════ */
  var feed = $('#feed');
  if (feed && feed.children.length > 1 && !quieto) {
    var items = feed.children, fi = 0, pausado = false;
    var pausa = $('#feedPause');
    var rotar = setInterval(function () {
      if (pausado) return;
      items[fi].classList.remove('is-on');
      fi = (fi + 1) % items.length;
      items[fi].classList.add('is-on');
    }, 6500);
    if (pausa) {
      pausa.hidden = false;
      pausa.addEventListener('click', function () {
        pausado = !pausado;
        pausa.setAttribute('aria-pressed', String(pausado));
        pausa.setAttribute('aria-label', pausado ? 'Reanudar el boletín' : 'Pausar el boletín');
        $('use', pausa).setAttribute('href', '/assets/img/iconos.svg#' + (pausado ? 'play' : 'pausa'));
      });
    }
    feed.addEventListener('focusin', function () { pausado = true; });
    feed.addEventListener('focusout', function () { pausado = pausa ? pausa.getAttribute('aria-pressed') === 'true' : false; });
    void rotar;
  }

  /* ══════ COPIAR ══════ */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copiar], [data-copiar-de]');
    if (!b) return;
    var texto = b.getAttribute('data-copiar');
    if (!texto) {
      var origen = document.getElementById(b.getAttribute('data-copiar-de'));
      texto = origen ? origen.textContent.trim() : '';
    }
    if (!texto) return;
    copiar(texto).then(function () {
      var msg = b.getAttribute('data-copiado') || 'Copiado';
      avisar(msg);
      b.classList.add('is-done');
      var span = $('span', b);
      var antes = span ? span.textContent : null;
      if (span) span.textContent = 'Copiado';
      setTimeout(function () { b.classList.remove('is-done'); if (span) span.textContent = antes; }, 2200);
    }, function () {
      avisar('No se pudo copiar: seleccioná el texto y copialo a mano');
    });
  });

  /* ══════ SELECTOR DE MUNDOS (pestañas accesibles) ══════ */
  $$('[data-mundos]').forEach(function (w) {
    var rail = $('.world-rail', w);
    var tabs = $$('.world-tab', w);
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('data-panel')); });
    if (!rail || !tabs.length) return;
    rail.setAttribute('role', 'tablist');
    if (rail.getAttribute('data-etiqueta')) rail.setAttribute('aria-label', rail.getAttribute('data-etiqueta'));
    tabs.forEach(function (t, i) {
      t.setAttribute('role', 'tab');
      t.setAttribute('aria-controls', panels[i].id);
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', t.id);
      panels[i].tabIndex = 0;
    });
    function mostrar(i, foco) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[k].classList.toggle('is-on', on);
      });
      if (foco) tabs[i].focus({ preventScroll: true });
      var t = tabs[i];
      if (rail.scrollWidth > rail.clientWidth) {
        rail.scrollTo({ left: t.offsetLeft - 16, behavior: quieto ? 'auto' : 'smooth' });
      }
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { mostrar(i, false); });
      t.addEventListener('keydown', function (e) {
        var n = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n >= 0) { e.preventDefault(); mostrar(n, true); }
      });
    });
    mostrar(0, false);
  });

  /* ══════ FILTROS POR CATEGORÍA ══════ */
  $$('[data-filtros]').forEach(function (grupo) {
    var nombre = grupo.getAttribute('data-filtros');
    var lista = $('[data-lista="' + nombre + '"]');
    if (!lista) return;
    var elementos = $$('[data-cat]', lista);
    var botones = $$('[data-filtro]', grupo);
    var conUrl = grupo.hasAttribute('data-url');
    var vacio = $('[data-vacio="' + nombre + '"]');
    grupo.hidden = false;

    function aplicar(cat, actualizarUrl) {
      if (!botones.some(function (b) { return b.getAttribute('data-filtro') === cat; })) cat = 'todos';
      var visibles = 0;
      botones.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filtro') === cat)); });
      elementos.forEach(function (el) {
        var ver = cat === 'todos' || el.getAttribute('data-cat') === cat;
        el.hidden = !ver;
        if (ver) { visibles++; el.classList.add('is-in'); }
      });
      if (vacio) vacio.hidden = visibles > 0;
      if (conUrl && actualizarUrl && window.history && history.replaceState) {
        var u = new URL(location.href);
        if (cat === 'todos') u.searchParams.delete('categoria'); else u.searchParams.set('categoria', cat);
        history.replaceState(null, '', u.pathname + u.search + u.hash);
      }
    }
    botones.forEach(function (b) {
      b.addEventListener('click', function () { aplicar(b.getAttribute('data-filtro'), true); });
    });
    if (conUrl) {
      var inicial = new URLSearchParams(location.search).get('categoria');
      if (inicial) aplicar(inicial, false);
    }
  });

  /* ══════ VISOR DE IMÁGENES ══════ */
  $$('[data-galeria]').forEach(function (galeria) {
    var laminas = $$('.plate', galeria);
    if (!laminas.length) return;
    var visor = document.createElement('div');
    visor.className = 'lb';
    visor.setAttribute('role', 'dialog');
    visor.setAttribute('aria-modal', 'true');
    visor.setAttribute('aria-label', 'Visor de imágenes');
    visor.innerHTML =
      '<button class="lb-close" type="button">Cerrar</button>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="Imagen anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6z"/></svg></button>' +
      '<figure><img alt=""><figcaption><span></span><small></small></figcaption></figure>' +
      '<button class="lb-btn lb-next" type="button" aria-label="Imagen siguiente"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.6 16.6 10 18l6-6-6-6-1.4 1.4 4.6 4.6z"/></svg></button>';
    document.body.appendChild(visor);

    var vImg = $('img', visor), vTxt = $('figcaption span', visor), vNum = $('figcaption small', visor);
    var actual = 0, antes = null;

    function abrir(i) {
      actual = (i + laminas.length) % laminas.length;
      var fig = laminas[actual];
      var img = $('img', fig);
      vImg.src = fig.getAttribute('data-full') || img.currentSrc || img.src;
      vImg.alt = img.getAttribute('alt') || '';
      vTxt.textContent = $('figcaption', fig).firstChild.textContent.trim();
      vNum.textContent = (fig.getAttribute('data-credito') || '') + ' · ' + (actual + 1) + ' de ' + laminas.length;
      if (!visor.classList.contains('is-on')) {
        visor.classList.add('is-on');
        document.documentElement.style.overflow = 'hidden';
        $('.lb-close', visor).focus();
      }
    }
    function cerrar() {
      visor.classList.remove('is-on');
      document.documentElement.style.overflow = '';
      if (antes) antes.focus();
    }
    laminas.forEach(function (fig, i) {
      // Un botón real sobre cada imagen: se activa con clic, Enter o Espacio
      var zoom = document.createElement('button');
      zoom.type = 'button';
      zoom.className = 'plate-zoom';
      zoom.setAttribute('aria-label', 'Ampliar imagen: ' + $('figcaption', fig).firstChild.textContent.trim());
      zoom.addEventListener('click', function () { antes = zoom; abrir(i); });
      fig.appendChild(zoom);
    });
    $('.lb-close', visor).addEventListener('click', cerrar);
    $('.lb-prev', visor).addEventListener('click', function () { abrir(actual - 1); });
    $('.lb-next', visor).addEventListener('click', function () { abrir(actual + 1); });
    visor.addEventListener('click', function (e) { if (e.target === visor) cerrar(); });
    document.addEventListener('keydown', function (e) {
      if (!visor.classList.contains('is-on')) return;
      if (e.key === 'Escape') cerrar();
      else if (e.key === 'ArrowLeft') abrir(actual - 1);
      else if (e.key === 'ArrowRight') abrir(actual + 1);
      else if (e.key === 'Tab') {
        var b = $$('button', visor), i = b.indexOf(document.activeElement);
        e.preventDefault();
        b[(i + (e.shiftKey ? -1 : 1) + b.length) % b.length].focus();
      }
    });
  });

  /* ══════ APARICIÓN AL DESPLAZAR ══════ */
  var ocultos = $$('[data-reveal]');
  if (quieto || !('IntersectionObserver' in window)) {
    ocultos.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var padres = [], cuentas = [];
    ocultos.forEach(function (el) {
      var p = el.parentNode, i = padres.indexOf(p);
      if (i === -1) { padres.push(p); cuentas.push(0); i = padres.length - 1; }
      el.style.setProperty('--d', Math.min(cuentas[i], 5) * 80 + 'ms');
      cuentas[i]++;
    });
    var ojo = new IntersectionObserver(function (filas) {
      filas.forEach(function (f) {
        if (!f.isIntersecting) return;
        f.target.classList.add('is-in');
        ojo.unobserve(f.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    ocultos.forEach(function (el) { ojo.observe(el); });
    // Si se llega por un ancla, lo que ya está en pantalla aparece de inmediato
    window.addEventListener('load', function () {
      ocultos.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
    });
  }

  /* ══════ TARJETAS: BRILLO E INCLINACIÓN ══════ */
  if (fino && !quieto) {
    $$('.card').forEach(function (c) {
      var inclinar = c.hasAttribute('data-tilt');
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        c.style.setProperty('--mx', x + 'px');
        c.style.setProperty('--my', y + 'px');
        if (inclinar) {
          var rx = (y / r.height - 0.5) * -4;
          var ry = (x / r.width - 0.5) * 4;
          c.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-3px)';
        }
      });
      c.addEventListener('pointerleave', function () { c.style.transform = ''; });
    });
  }

  /* ══════ ÍNDICE DE DOCUMENTOS ══════ */
  var indice = $('[data-indice]');
  if (indice && 'IntersectionObserver' in window) {
    var enlaces = $$('a[href^="#"]', indice);
    var destinos = enlaces.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var marcados = {};
    var obsIndice = new IntersectionObserver(function (filas) {
      filas.forEach(function (f) { marcados[f.target.id] = f.isIntersecting; });
      var actual = null;
      destinos.forEach(function (d) { if (marcados[d.id] && !actual) actual = d.id; });
      if (!actual) return;
      enlaces.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + actual;
        a.classList.toggle('is-here', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    destinos.forEach(function (d) { obsIndice.observe(d); });
  }
  $$('[data-saltar]').forEach(function (sel) {
    sel.addEventListener('change', function () {
      var d = sel.value && document.getElementById(sel.value);
      if (!d) return;
      location.hash = sel.value;
      d.setAttribute('tabindex', '-1');
      d.focus({ preventScroll: true });
      sel.value = '';
    });
  });
  $$('[data-imprimir]').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });

  /* Resalta el artículo o la cláusula al que apunta el enlace */
  function marcarDestino() {
    if (!location.hash) return;
    var d;
    try { d = document.querySelector(location.hash); } catch (e) { return; }
    if (!d || !d.matches('.article, .clause')) return;
    d.classList.remove('is-target');
    void d.offsetWidth;
    d.classList.add('is-target');
  }
  window.addEventListener('hashchange', marcarDestino);
  marcarDestino();

  /* Enlace directo a cada artículo o cláusula */
  $$('.article[id] > h3, .clause[id] > h3').forEach(function (h) {
    var id = h.parentNode.id;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'anchor';
    b.textContent = 'Copiar enlace';
    b.setAttribute('aria-label', 'Copiar enlace a ' + h.textContent.trim());
    b.setAttribute('data-copiar', location.origin + location.pathname + '#' + id);
    b.setAttribute('data-copiado', 'Enlace al artículo copiado');
    h.appendChild(b);
  });

  /* ══════ BUSCADOR DE LA NORMATIVA ══════ */
  var campo = $('[data-buscador]');
  if (campo) {
    var limpiar = $('[data-buscador-limpiar]');
    var cuenta = $('[data-buscador-cuenta]');
    var indiceNorma = $('[data-indice]');
    var capitulos = $$('.chapter');
    var articulos = $$('.chapter .article');
    articulos.forEach(function (a) { a._orig = a.innerHTML; });
    var activo = false;

    var plano = function (t) { return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
    var resaltar = function (el, termino) {
      var paseo = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      var nodos = [], n;
      while ((n = paseo.nextNode())) {
        if (!n.parentNode.closest('.anchor')) nodos.push(n);
      }
      nodos.forEach(function (nodoTexto) {
        var crudo = nodoTexto.nodeValue;
        if (plano(crudo).indexOf(termino) === -1) return;
        var frag = document.createDocumentFragment();
        var resto = crudo, vueltas = 0;
        while (true) {
          var pos = plano(resto).indexOf(termino);
          if (pos === -1 || ++vueltas > 40) { frag.appendChild(document.createTextNode(resto)); break; }
          frag.appendChild(document.createTextNode(resto.slice(0, pos)));
          var m = document.createElement('mark');
          m.textContent = resto.slice(pos, pos + termino.length);
          frag.appendChild(m);
          resto = resto.slice(pos + termino.length);
        }
        nodoTexto.parentNode.replaceChild(frag, nodoTexto);
      });
    };
    var restaurar = function () {
      articulos.forEach(function (a) {
        if (a._sucio) { a.innerHTML = a._orig; a._sucio = false; }
        a.hidden = false;
      });
      capitulos.forEach(function (c) { c.hidden = false; });
    };
    var buscar = function (valor, actualizarUrl) {
      var termino = plano(valor.trim());
      if (limpiar) limpiar.hidden = termino.length === 0;
      restaurar();
      if (termino.length < 2) {
        activo = false;
        if (indiceNorma) indiceNorma.classList.remove('is-off');
        if (cuenta) cuenta.textContent = '';
      } else {
        activo = true;
        if (indiceNorma) indiceNorma.classList.add('is-off');
        var total = 0;
        capitulos.forEach(function (cap) {
          var hallados = 0;
          $$('.article', cap).forEach(function (a) {
            if (plano(a.textContent).indexOf(termino) !== -1) {
              resaltar(a, termino);
              a._sucio = true;
              hallados++;
            } else {
              a.hidden = true;
            }
          });
          total += hallados;
          cap.hidden = hallados === 0;
        });
        if (cuenta) {
          cuenta.textContent = total === 0 ? 'Ningún artículo menciona eso. Probá con otra palabra.'
            : total === 1 ? '1 artículo encontrado' : total + ' artículos encontrados';
        }
      }
      if (actualizarUrl && window.history && history.replaceState) {
        var u = new URL(location.href);
        if (activo) u.searchParams.set('q', valor.trim()); else u.searchParams.delete('q');
        history.replaceState(null, '', u.pathname + u.search + u.hash);
      }
    };
    var reloj = null;
    campo.addEventListener('input', function () {
      clearTimeout(reloj);
      reloj = setTimeout(function () { buscar(campo.value, true); }, 180);
    });
    campo.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { campo.value = ''; buscar('', true); }
    });
    if (campo.form) campo.form.addEventListener('submit', function (e) { e.preventDefault(); buscar(campo.value, true); });
    if (limpiar) limpiar.addEventListener('click', function () { campo.value = ''; buscar('', true); campo.focus(); });
    var q = new URLSearchParams(location.search).get('q');
    if (q) { campo.value = q; buscar(q, false); }
  }

  /* ══════ REPRODUCTORES BAJO DEMANDA (YouTube / Twitch) ══════
     Nada se descarga de terceros hasta que la persona aprieta reproducir. */
  $$('[data-embed]').forEach(function (caja) {
    var boton = $('.play', caja);
    if (!boton) return;
    boton.addEventListener('click', function () {
      var tipo = caja.getAttribute('data-embed');
      var id = caja.getAttribute('data-id');
      var src = '';
      if (tipo === 'youtube') src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      else if (tipo === 'twitch') src = 'https://player.twitch.tv/?channel=' + encodeURIComponent(id) + '&parent=' + encodeURIComponent(location.hostname) + '&autoplay=true';
      if (!src) return;
      var f = document.createElement('iframe');
      f.src = src;
      f.title = caja.getAttribute('data-titulo') || 'Reproductor de video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.setAttribute('allowfullscreen', '');
      f.loading = 'lazy';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      caja.innerHTML = '';
      caja.appendChild(f);
      f.focus();
    });
  });

  /* ══════ ELYSIUM FM ══════
     Solo existe si _data/radio.yml tiene pistas con licencia. */
  var radio = $('#radio');
  if (radio) {
    var lista = [];
    try { lista = JSON.parse(radio.getAttribute('data-pistas') || '[]'); } catch (e) { lista = []; }
    var audio = $('#audio'), pista = $('#track'), playBtn = $('#playBtn'), ri = 0;
    var cargar = function (sonar) {
      audio.src = lista[ri].archivo;
      pista.textContent = lista[ri].titulo;
      if (sonar) audio.play().catch(function () {});
    };
    $('#radioToggle').addEventListener('click', function () {
      var abierto = radio.classList.toggle('is-open');
      this.setAttribute('aria-expanded', String(abierto));
    });
    playBtn.addEventListener('click', function () {
      if (!audio.getAttribute('src')) cargar(false);
      if (audio.paused) audio.play().catch(function () {}); else audio.pause();
    });
    $('#nextBtn').addEventListener('click', function () {
      ri = (ri + 1) % lista.length;
      cargar(!audio.paused || audio.currentTime > 0);
    });
    audio.addEventListener('ended', function () { ri = (ri + 1) % lista.length; cargar(true); });
    audio.addEventListener('play', function () {
      radio.classList.add('is-playing');
      $('use', playBtn).setAttribute('href', '/assets/img/iconos.svg#pausa');
      playBtn.setAttribute('aria-label', 'Pausar');
    });
    audio.addEventListener('pause', function () {
      radio.classList.remove('is-playing');
      $('use', playBtn).setAttribute('href', '/assets/img/iconos.svg#play');
      playBtn.setAttribute('aria-label', 'Reproducir');
    });
    var vol = $('#vol');
    audio.volume = parseFloat(vol.value);
    vol.addEventListener('input', function () { audio.volume = parseFloat(vol.value); });
  }
})();
