/* ═════════════════════════════════════════════════════════════
   ELYSIUM | ES — postulación a staff
   Guarda un borrador en este navegador mientras la persona escribe.
   Al terminar, genera un archivo .txt (o copia el texto) para
   publicarlo en el canal de postulaciones del Discord oficial.

   No hay envío automático: un webhook de Discord puesto en el código
   del navegador lo puede leer y usar cualquiera (ver
   DECISIONES_PENDIENTES_WEB.md, punto «Postulación a staff»).
   ═════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CLAVE_BORRADOR = 'elysium_staff_draft';
  // Clave de la versión anterior del formulario, que ya no se usa
  try { localStorage.removeItem('elysium_staff_apply_date'); } catch (e) {}

  var form = document.getElementById('staffForm');
  if (!form) return;

  var examen = document.getElementById('examen');
  var progress = document.getElementById('progress');
  var pDone = document.getElementById('pDone');
  var pTotal = document.getElementById('pTotal');
  var pBar = document.getElementById('pBar');
  var pSaved = document.getElementById('pSaved');
  var notice = document.getElementById('notice');
  var noticeTitle = document.getElementById('noticeTitle');
  var noticeText = document.getElementById('noticeText');
  var noticeAcciones = document.getElementById('noticeAcciones');
  var btnCopiar = document.getElementById('btnCopiar');

  var perfil = {
    discord: document.getElementById('staff-discord'),
    edad: document.getElementById('staff-edad'),
    horario: document.getElementById('staff-horario')
  };
  var radios = Array.prototype.slice.call(document.querySelectorAll('input[name=puesto]'));
  var bloques = Array.prototype.slice.call(document.querySelectorAll('[data-block]'));
  var areas = Array.prototype.slice.call(document.querySelectorAll('textarea'));

  var PREFIJO = {
    'Soporte y Moderación': 'mod-',
    'Playmaker': 'pm-',
    'Desarrollo': 'dev-',
    'Diseño y Mapeo': 'map-'
  };

  function elegido() {
    var r = radios.filter(function (x) { return x.checked; })[0];
    return r ? r.value : '';
  }
  function prefijo() { return PREFIJO[elegido()] || ''; }

  function activos() {
    var out = [];
    for (var i = 1; i <= 10; i++) out.push(document.getElementById('gen-' + i));
    var p = prefijo();
    if (p) for (var j = 11; j <= 20; j++) out.push(document.getElementById(p + j));
    return out.filter(Boolean);
  }

  /* ── Progreso y contadores ────────────────────── */
  function refrescar() {
    var lista = activos();
    var hechas = lista.filter(function (t) { return t.value.trim().length > 0; }).length;
    var total = lista.length;
    pDone.textContent = hechas;
    pTotal.textContent = total;
    pBar.style.width = total ? (hechas / total * 100) + '%' : '0%';
    progress.classList.toggle('is-on', !!elegido());
    lista.forEach(function (t) {
      var caja = t.closest('.q');
      if (caja) caja.classList.toggle('is-done', t.value.trim().length > 0);
    });
  }

  function contador(t) {
    var c = t.parentNode.querySelector('.counter');
    if (!c) return;
    c.textContent = t.value.length + ' / 1000';
    c.classList.toggle('is-near', t.value.length > 900);
  }

  areas.forEach(function (t) {
    // Cada respuesta queda asociada a su enunciado para lectores de pantalla
    var q = t.closest('.q');
    var titulo = q && q.querySelector('.q-title');
    var caso = q && q.querySelector('.q-case');
    if (titulo && !titulo.id) titulo.id = t.id + '-titulo';
    if (caso && !caso.id) caso.id = t.id + '-caso';
    if (titulo) t.setAttribute('aria-labelledby', titulo.id);
    if (caso) t.setAttribute('aria-describedby', caso.id);
    t.addEventListener('input', function () {
      contador(t);
      refrescar();
      guardarPronto();
    });
  });

  /* ── Elección de área ─────────────────────────── */
  function mostrarArea(valor) {
    examen.hidden = !valor;
    bloques.forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-block') === valor); });
  }
  radios.forEach(function (r) {
    r.addEventListener('change', function () {
      mostrarArea(elegido());
      refrescar();
      guardarPronto();
    });
  });

  /* ── Borrador en el navegador ─────────────────── */
  var reloj = null;
  function guardarPronto() {
    clearTimeout(reloj);
    reloj = setTimeout(guardar, 700);
  }
  function guardar() {
    var datos = {
      discord: perfil.discord.value,
      edad: perfil.edad.value,
      horario: perfil.horario.value,
      puesto: elegido(),
      respuestas: {}
    };
    areas.forEach(function (t) { if (t.value.trim()) datos.respuestas[t.id] = t.value; });
    try {
      localStorage.setItem(CLAVE_BORRADOR, JSON.stringify(datos));
      pSaved.classList.add('is-on');
      setTimeout(function () { pSaved.classList.remove('is-on'); }, 1600);
    } catch (e) {}
  }
  function restaurar() {
    var datos = null;
    try { datos = JSON.parse(localStorage.getItem(CLAVE_BORRADOR) || 'null'); } catch (e) { datos = null; }
    if (!datos) return;
    perfil.discord.value = datos.discord || '';
    perfil.edad.value = datos.edad || '';
    perfil.horario.value = datos.horario || '';
    if (datos.puesto) {
      radios.forEach(function (r) { if (r.value === datos.puesto) r.checked = true; });
      mostrarArea(datos.puesto);
    }
    Object.keys(datos.respuestas || {}).forEach(function (id) {
      var t = document.getElementById(id);
      if (!t) return;
      t.value = datos.respuestas[id];
      contador(t);
    });
  }
  [perfil.discord, perfil.edad, perfil.horario].forEach(function (i) {
    i.addEventListener('input', guardarPronto);
  });
  document.getElementById('btnBorrar').addEventListener('click', function () {
    if (!window.confirm('Se borran todas las respuestas escritas hasta ahora. ¿Seguro?')) return;
    try { localStorage.removeItem(CLAVE_BORRADOR); } catch (e) {}
    window.location.reload();
  });

  /* ── Avisos ───────────────────────────────────── */
  function avisar(titulo, texto, malo, conAcciones) {
    noticeTitle.textContent = titulo;
    noticeText.textContent = texto;
    notice.hidden = false;
    notice.classList.toggle('is-bad', !!malo);
    noticeAcciones.hidden = !conAcciones;
    notice.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ── Validación ───────────────────────────────── */
  function validar() {
    if (!perfil.discord.value.trim() || !perfil.horario.value.trim() || !perfil.edad.value) {
      avisar('Faltan datos del perfil', 'Completá tu usuario de Discord, tu edad y tu disponibilidad antes de terminar.', true);
      return false;
    }
    if (parseInt(perfil.edad.value, 10) < 18) {
      avisar('Edad mínima', 'El equipo de staff requiere 18 años cumplidos. Podés seguir jugando y volver a intentarlo más adelante.', true);
      return false;
    }
    if (!elegido()) {
      avisar('Falta elegir el área', 'Seleccioná una especialidad para que se carguen sus preguntas.', true);
      return false;
    }
    var vacias = activos().filter(function (t) { return !t.value.trim(); });
    if (vacias.length) {
      avisar(
        vacias.length === 1 ? 'Queda una pregunta sin responder' : 'Quedan ' + vacias.length + ' preguntas sin responder',
        'Las veinte son obligatorias. Te llevo a la primera que falta.',
        true
      );
      setTimeout(function () {
        vacias[0].focus();
        vacias[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 900);
      return false;
    }
    return true;
  }

  /* ── Texto de la postulación ──────────────────── */
  function textoDe(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }

  function armarTexto() {
    var ahora = new Date();
    var linea = '────────────────────────────────────────';
    var partes = [
      'ELYSIUM | ES — POSTULACIÓN A STAFF',
      'Preparada el ' + ahora.toLocaleString('es') + ' (hora local)',
      linea,
      'Usuario de Discord: ' + perfil.discord.value.trim(),
      'Edad: ' + perfil.edad.value.trim(),
      'Disponibilidad: ' + perfil.horario.value.trim(),
      'Área: ' + elegido(),
      linea
    ];
    var fase = '';
    activos().forEach(function (t) {
      var q = t.closest('.q');
      var bloque = t.closest('[data-block]');
      var nuevaFase = bloque ? 'FASE 2 · ' + elegido().toUpperCase() : 'FASE 1 · CRITERIO Y NORMATIVA';
      if (nuevaFase !== fase) {
        fase = nuevaFase;
        partes.push('', fase, '');
      }
      partes.push(
        textoDe(q.querySelector('.q-num')) + '. ' + textoDe(q.querySelector('.q-title')),
        'Caso: ' + textoDe(q.querySelector('.q-case')),
        'Respuesta:',
        t.value.trim(),
        ''
      );
    });
    partes.push(linea, 'Publicá este archivo en el canal de postulaciones del Discord oficial de Elysium | ES.');
    return partes.join('\n');
  }

  function nombreArchivo() {
    var usuario = perfil.discord.value.trim().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'postulacion';
    var d = new Date();
    var fecha = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    return 'postulacion-staff-' + usuario + '-' + fecha + '.txt';
  }

  /* ── Descargar ────────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    notice.hidden = true;
    if (!validar()) return;
    guardar();
    var nombre = nombreArchivo();
    var blob = new Blob(['﻿' + armarTexto()], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    avisar(
      'Postulación lista para enviar',
      'Se descargó el archivo ' + nombre + '. Todavía no lo recibió nadie: el staff solo lo ve cuando lo publicás en el canal de postulaciones del Discord oficial. Lo leemos completo, así que puede tardar hasta diez días. Tu borrador sigue guardado en este navegador hasta que lo borres.',
      false,
      true
    );
  });

  /* ── Copiar ───────────────────────────────────── */
  btnCopiar.addEventListener('click', function () {
    notice.hidden = true;
    if (!validar()) return;
    guardar();
    var texto = armarTexto();
    var ok = function () {
      avisar(
        'Respuestas copiadas',
        'Todavía no las recibió nadie: el staff solo las ve cuando las publicás en el canal de postulaciones del Discord oficial. Si el texto es largo, Discord te ofrece enviarlo como archivo: aceptá esa opción.',
        false,
        true
      );
    };
    var mal = function () {
      avisar('No se pudo copiar', 'Tu navegador bloqueó el portapapeles. Usá el botón de descarga y adjuntá el archivo.', true);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(texto).then(ok, mal);
    else mal();
  });

  /* ── Arranque ─────────────────────────────────── */
  restaurar();
  refrescar();
})();
