#!/usr/bin/env python3
"""
ELYSIUM | ES — verificación del feed Atom y del texto público.

Uso, desde la raíz del repositorio y con el sitio ya compilado:
    python3 tests/verificar_feed.py _site

Revisa:
  · que feed.xml sea XML válido y Atom, con autor y los elementos obligatorios;
  · cada entrada: identificador único, enlace a una página que existe, título y
    resumen sin Markdown, resumen igual al de la publicación, fechas válidas y
    no futuras, y contenido sin tablas, Markdown literal ni secretos;
  · que haya una entrada por cada publicación de _posts y nada más: sin
    borradores, sin entradas con published: false y sin fechas futuras;
  · que «preapertura» no aparezca en el texto público vigente. Se ignoran las
    direcciones URL, que se conservan para no romper enlaces compartidos.

Sale con código 1 si algo falla.
"""
import datetime
import html
import pathlib
import re
import sys
import xml.etree.ElementTree as ET

SITIO = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
POSTS = pathlib.Path("_posts")
DOMINIO = "https://elysiumesrp.com"
A = "{http://www.w3.org/2005/Atom}"

fallas = []
pruebas = 0


def ok(cond, msg):
    global pruebas
    pruebas += 1
    print(("OK    " if cond else "FALLA ") + msg)
    if not cond:
        fallas.append(msg)


def fecha_iso(texto):
    return datetime.datetime.fromisoformat(texto.strip())


def frente(ruta):
    """Front matter mínimo de una publicación (claves simples de una línea)."""
    texto = ruta.read_text(encoding="utf-8")
    bloque = texto.split("---", 2)[1]
    datos = {}
    for linea in bloque.splitlines():
        m = re.match(r'^([a-z_]+):\s*"?(.*?)"?\s*$', linea)
        if m:
            datos[m.group(1)] = m.group(2)
    return datos


def sin_urls(texto):
    texto = re.sub(r'\b(?:href|src|content|action)="[^"]*?(?:https?:)?//[^"]*"', "", texto)
    texto = re.sub(r'\b(?:href|src)="[^"]*"', "", texto)
    return re.sub(r"https?://[^\s\"'<>]+", "", texto)


def normalizar(texto):
    texto = html.unescape(texto or "")
    texto = texto.replace("“", '"').replace("”", '"').replace("’", "'")
    return " ".join(texto.split())


MARKDOWN = re.compile(r"\*\*|__|(?:^|\s)\*\S[^*]*\*(?:\s|[.,;:]|$)|(?:^|\s)#{1,6}\s|`")
SECRETOS = re.compile(r"discord(?:app)?\.com/api/webhooks|\b(?:ghp|gho|ghs)_[A-Za-z0-9]{30,}|\bAKIA[0-9A-Z]{16}\b|-----BEGIN [A-Z ]*PRIVATE KEY")

# ── 1. XML y Atom ───────────────────────────────────────────
crudo = (SITIO / "feed.xml").read_text(encoding="utf-8")
try:
    raiz = ET.fromstring(crudo.encode("utf-8"))
    ok(True, "feed: es XML bien formado")
except ET.ParseError as e:
    ok(False, f"feed: XML inválido ({e})")
    sys.exit(1)
ok(raiz.tag == A + "feed", "feed: la raíz es un feed Atom")
for etiqueta in ("id", "title", "updated"):
    ok(raiz.find(A + etiqueta) is not None and (raiz.findtext(A + etiqueta) or "").strip() != "", f"feed: tiene <{etiqueta}>")
ok(any(l.get("rel") == "self" and l.get("href") == DOMINIO + "/feed.xml" for l in raiz.findall(A + "link")), "feed: enlace propio a /feed.xml")
autor = (raiz.findtext(f"{A}author/{A}name") or "").strip()
ok(autor != "", f"feed: autor del feed ({autor or 'vacío'})")
generado = fecha_iso(raiz.findtext(A + "updated"))

# ── 2. Publicaciones esperadas ──────────────────────────────
esperadas = {}
for ruta in sorted(POSTS.glob("*.md")):
    d = frente(ruta)
    if d.get("published", "true").lower() == "false":
        continue
    fecha = datetime.datetime.strptime(d["date"], "%Y-%m-%d %H:%M:%S %z")
    if fecha > generado:
        continue
    slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", ruta.stem)
    esperadas[f"{DOMINIO}/novedades/{slug}/"] = (d, fecha)

entradas = raiz.findall(A + "entry")
ids = [e.findtext(A + "id") for e in entradas]
enlaces = [next((l.get("href") for l in e.findall(A + "link") if l.get("rel") == "alternate"), "") for e in entradas]
ok(len(ids) == len(set(ids)), "feed: identificadores únicos")
ok(sorted(enlaces) == sorted(esperadas), f"feed: {len(entradas)} entradas, una por cada publicación vigente ({len(esperadas)}), sin borradores ni fechas futuras")
ok(not (pathlib.Path("_drafts").exists() and any(pathlib.Path("_drafts").iterdir())), "feed: no hay borradores en _drafts")

# ── 3. Cada entrada ─────────────────────────────────────────
for e in entradas:
    titulo = normalizar(e.findtext(A + "title"))
    url = next((l.get("href") for l in e.findall(A + "link") if l.get("rel") == "alternate"), "")
    # jekyll-feed arma el id con la dirección sin la barra final: debe seguir igual para no duplicar entradas
    ok(url.startswith(DOMINIO + "/novedades/") and e.findtext(A + "id") == url.rstrip("/"), f"«{titulo}»: enlace en el dominio oficial e id estable")
    pagina = SITIO / url[len(DOMINIO) + 1:] / "index.html"
    ok(pagina.exists(), f"«{titulo}»: la página {url[len(DOMINIO):]} existe")
    ok(len(titulo) > 5 and not MARKDOWN.search(titulo), f"«{titulo}»: título sin Markdown")
    nombre = (e.findtext(f"{A}author/{A}name") or "").strip()
    ok(nombre != "", f"«{titulo}»: autor ({nombre or 'vacío'})")
    publicada, actualizada = fecha_iso(e.findtext(A + "published")), fecha_iso(e.findtext(A + "updated"))
    d, fecha = esperadas.get(url, ({}, None))
    ok(fecha is not None and publicada == fecha, f"«{titulo}»: conserva la fecha original ({publicada.isoformat()})")
    ok(publicada <= actualizada <= generado, f"«{titulo}»: fechas coherentes y no futuras")
    resumen = normalizar(e.findtext(A + "summary"))
    ok(resumen != "" and resumen == normalizar(d.get("resumen")), f"«{titulo}»: el resumen es el de la publicación")
    ok(not MARKDOWN.search(resumen), f"«{titulo}»: resumen sin Markdown")
    contenido = e.findtext(A + "content") or ""
    texto = re.sub(r"<[^>]+>", " ", re.sub(r"<code>.*?</code>", " ", contenido, flags=re.S))
    ok("<table" not in contenido, f"«{titulo}»: contenido sin tablas")
    ok(not MARKDOWN.search(normalizar(texto)), f"«{titulo}»: contenido sin Markdown literal")
    for ref in re.findall(r'href="(/[^"#]*)', contenido):
        destino = SITIO / ref.lstrip("/")
        ok(destino.exists() or (destino / "index.html").exists(), f"«{titulo}»: el enlace interno {ref} existe")
    ok(not SECRETOS.search(contenido), f"«{titulo}»: sin credenciales ni webhooks")

# ── 4. «Preapertura» fuera del contenido público ────────────
apariciones = []
for ruta in sorted(SITIO.rglob("*")):
    if ruta.suffix not in (".html", ".xml", ".js", ".json", ".txt", ".webmanifest") or not ruta.is_file():
        continue
    texto = sin_urls(ruta.read_text(encoding="utf-8", errors="replace"))
    for m in re.finditer(r"pre-?apertura", texto, re.I):
        apariciones.append(f"{ruta.relative_to(SITIO)}: …{texto[max(0, m.start() - 40):m.end() + 20]}…")
ok(not apariciones, "texto público: sin «preapertura» (las URL se conservan)" + ("".join("\n        " + a.replace("\n", " ") for a in apariciones[:10])))

print(f"\n{pruebas - len(fallas)} de {pruebas} comprobaciones correctas.")
sys.exit(1 if fallas else 0)
