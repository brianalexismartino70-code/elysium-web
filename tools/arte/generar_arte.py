#!/usr/bin/env python3
"""
ELYSIUM | ES — ilustraciones conceptuales generadas por código.

Todo se dibuja desde cero con numpy y Pillow: no usa fotos, capturas,
modelos de IA ni recursos de terceros. Con la misma semilla, el resultado
es siempre el mismo. Son ilustraciones conceptuales: no muestran el juego
ni el servidor.

Uso, desde la raíz del repositorio:
    python3 tools/arte/generar_arte.py            # todo
    python3 tools/arte/generar_arte.py hero mundo1

Salida en assets/img/ (WebP, AVIF y JPEG de respaldo). El registro de
licencias está en docs/REGISTRO_ASSETS.md.
"""
import math
import pathlib
import sys

import numpy as np
from PIL import Image, ImageDraw

RAIZ = pathlib.Path(__file__).resolve().parents[2]
SALIDA = RAIZ / "assets" / "img"
SS = 2  # supersampling de las formas


# ── Utilidades ──────────────────────────────────────────────
def color(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)], np.float32)


def gradiente(h, w, paradas):
    t = np.linspace(0, 1, h, dtype=np.float32)
    canales = [np.interp(t, [p[0] for p in paradas], [color(p[1])[c] for p in paradas]) for c in range(3)]
    return np.repeat(np.stack(canales, -1)[:, None, :], w, axis=1).astype(np.float32)


def ruido(rng, h, w, escala, octavas=4, estirar=1.0, persist=0.5):
    total = np.zeros((h, w), np.float32)
    amp, norma = 1.0, 0.0
    for o in range(octavas):
        gh = max(2, int(h / escala * 2 ** o))
        gw = max(2, int(w / (escala * estirar) * 2 ** o))
        g = Image.fromarray(rng.random((gh, gw)).astype(np.float32), "F")
        total += np.asarray(g.resize((w, h), Image.BICUBIC)) * amp
        norma += amp
        amp *= persist
    return np.clip(total / norma, 0, 1)


def radial(h, w, cx, cy, rx, ry=None):
    ry = ry or rx
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    return np.exp(-d).astype(np.float32)


def suavizar(a, f):
    """Desenfoque barato: reducir y volver a ampliar."""
    if a.ndim == 3:
        return np.stack([suavizar(a[..., c], f) for c in range(a.shape[2])], -1)
    h, w = a.shape
    chica = Image.fromarray(a.astype(np.float32), "F").resize((max(1, w // f), max(1, h // f)), Image.BOX)
    return np.asarray(chica.resize((w, h), Image.BICUBIC), np.float32)


def mascara(w, h, dibujar):
    im = Image.new("L", (w * SS, h * SS), 0)
    dibujar(ImageDraw.Draw(im), SS)
    return np.asarray(im.resize((w, h), Image.LANCZOS), np.float32) / 255


def pintar(base, col, alfa):
    return base * (1 - alfa[..., None]) + col * alfa[..., None]


def sumar(base, col, alfa):
    return base + col * alfa[..., None]


def bloom(img, umbral=0.7, fuerza=0.55):
    brillo = np.clip(img.max(-1) - umbral, 0, None)[..., None] * img
    return img + (suavizar(brillo, 6) * 0.6 + suavizar(brillo, 20) * 0.4) * fuerza


def terminar(img, rng, vineta=0.45, grano=0.025, sombras="#0f2a2a", luces="#f2c48a"):
    img = img / (1 + img * 0.35)                       # compresión suave de luces
    lum = img.mean(-1, keepdims=True)
    img = img + (color(sombras) - 0.5) * 0.10 * (1 - lum) + (color(luces) - 0.5) * 0.06 * lum
    h, w, _ = img.shape
    v = radial(h, w, w * 0.52, h * 0.48, w * 0.85, h * 0.95)
    img = img * (1 - vineta + vineta * v[..., None])
    img = img + (rng.random((h, w, 1)).astype(np.float32) - 0.5) * grano
    return np.clip(img, 0, 1)


def guardar(img, nombre, anchos, carpeta, alfa=None, jpeg=None):
    carpeta = SALIDA / carpeta
    carpeta.mkdir(parents=True, exist_ok=True)
    rgb = (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)
    im = Image.fromarray(rgb, "RGB")
    if alfa is not None:
        im.putalpha(Image.fromarray((np.clip(alfa, 0, 1) * 255 + 0.5).astype(np.uint8), "L"))
    hechos = []
    for ancho in anchos:
        alto = round(im.height * ancho / im.width)
        r = im.resize((ancho, alto), Image.LANCZOS)
        r.save(carpeta / f"{nombre}-{ancho}.webp", "WEBP", quality=82, method=6)
        r.save(carpeta / f"{nombre}-{ancho}.avif", "AVIF", quality=58, speed=4)
        hechos.append(f"{nombre}-{ancho}")
        if jpeg == ancho and alfa is None:
            r.save(carpeta / f"{nombre}-{ancho}.jpg", "JPEG", quality=84, optimize=True, progressive=True)
    print("  ", carpeta.relative_to(RAIZ), ", ".join(hechos))
    return im


def recorte(im, caja, tam):
    return im.crop(caja).resize(tam, Image.LANCZOS)


# ── Ciudad en silueta ───────────────────────────────────────
def edificios(rng, x0, x1, y_base, alto, ancho):
    formas, ventanas = [], []
    x = x0 - rng.integers(0, 40)
    while x < x1:
        bw = int(rng.integers(*ancho))
        bh = int(rng.integers(*alto) * (0.55 + 0.45 * math.sin(math.pi * min(1, max(0, (x - x0) / max(1, x1 - x0))))))
        top = y_base - bh
        formas.append(("r", x, top, x + bw, y_base + 4))
        ventanas.append((x, top, x + bw, y_base))
        r = rng.random()
        if r < 0.16:
            formas.append(("r", x + bw * 0.18, top - bh * 0.16, x + bw * 0.82, top + 1))
        elif r < 0.27:
            formas.append(("r", x + bw * 0.47, top - bh * 0.34, x + bw * 0.53, top + 1))
        elif r < 0.33:
            formas.append(("e", x + bw * 0.12, top - bw * 0.38, x + bw * 0.88, top + bw * 0.38))
        elif r < 0.40:
            formas.append(("p", [(x + bw * 0.28, top + 1), (x + bw * 0.5, top - bh * 0.45), (x + bw * 0.72, top + 1)]))
        x += bw + int(rng.integers(-5, 7))
    return formas, ventanas


def dibujar_formas(formas):
    def f(d, s):
        for fo in formas:
            if fo[0] == "r":
                d.rectangle([fo[1] * s, fo[2] * s, fo[3] * s, fo[4] * s], fill=255)
            elif fo[0] == "e":
                d.ellipse([fo[1] * s, fo[2] * s, fo[3] * s, fo[4] * s], fill=255)
            else:
                d.polygon([(px * s, py * s) for px, py in fo[1]], fill=255)
    return f


def luces_ventanas(rng, w, h, ventanas, prob, paso=(9, 12), tam=(3, 4), calidez=0.85):
    im = Image.new("RGB", (w, h), 0)
    d = ImageDraw.Draw(im)
    for x0, y0, x1, y1 in ventanas:
        if rng.random() < 0.35:
            continue
        for yy in range(int(y0) + 6, int(y1) - 6, paso[1]):
            for xx in range(int(x0) + 4, int(x1) - 4, paso[0]):
                if rng.random() < prob:
                    tibia = rng.random() < calidez
                    c = (255, 186 + int(rng.integers(0, 40)), 110) if tibia else (170, 215, 255)
                    k = 0.35 + 0.65 * rng.random()
                    d.rectangle([xx, yy, xx + tam[0], yy + tam[1]], fill=tuple(int(v * k) for v in c))
    return np.asarray(im, np.float32) / 255


# ── 1. Portada ──────────────────────────────────────────────
def portada(rng):
    W, H = 3200, 1800
    sx, sy = W * 0.63, H * 0.60
    img = gradiente(H, W, [(0, "#05090a"), (0.35, "#0f2224"), (0.55, "#3b3a2c"), (0.66, "#b4793f"), (0.72, "#e7b06a"), (1, "#2a2016")])
    # estrellas
    est = (rng.random((H, W)) > 0.9993).astype(np.float32) * rng.random((H, W)).astype(np.float32)
    est *= np.clip(1 - np.linspace(0, 1.8, H)[:, None], 0, 1)
    img = sumar(img, color("#f4ead8"), suavizar(est, 2) * 2.2 + est * 0.8)
    # nubes altas iluminadas desde abajo
    nub = ruido(rng, H, W, 380, 5, estirar=5.0)
    banda = np.exp(-((np.arange(H)[:, None] - H * 0.42) / (H * 0.13)) ** 2)
    alfa_n = np.clip((nub - 0.52) * 3.2, 0, 1) * banda
    img = pintar(img, color("#2b2a22"), alfa_n * 0.55)
    img = sumar(img, color("#d7954f"), alfa_n * radial(H, W, sx, sy, W * 0.45, H * 0.35) * 0.55)
    # sol y rayos
    img = sumar(img, color("#ffcf8a"), radial(H, W, sx, sy, W * 0.05) * 1.6 + radial(H, W, sx, sy, W * 0.18, H * 0.16) * 0.7)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    ang = (np.arctan2(yy - sy, xx - sx) / (2 * math.pi) + 0.5) * 240
    rayos = np.interp(ang, np.arange(241), np.concatenate([rng.random(240), rng.random(1)])).astype(np.float32) ** 5
    dist = np.sqrt((xx - sx) ** 2 + (yy - sy) ** 2)
    img = sumar(img, color("#f0b46b"), suavizar(rayos * np.exp(-dist / (W * 0.30)) * (yy < sy + 40), 3) * 0.20)
    del yy, xx, ang, rayos, dist
    # tres planos de ciudad con perspectiva aérea
    planos = [
        (H * 0.655, (60, 210), (40, 120), "#8b6b48", 0.0, 0.70),
        (H * 0.690, (90, 380), (60, 170), "#3a3428", 0.08, 0.86),
        (H * 0.735, (140, 560), (90, 230), "#141513", 0.16, 1.0),
        (H * 0.800, (30, 160), (70, 200), "#0d0e0c", 0.10, 1.0),
    ]
    for y_base, alto, ancho, tono, prob, opac in planos:
        formas, vent = edificios(rng, 0, W, y_base, alto, ancho)
        m = mascara(W, H, dibujar_formas(formas))
        img = pintar(img, color(tono), m * opac)
        if prob:
            luz = luces_ventanas(rng, W, H, vent, prob, paso=(12, 17), tam=(3, 4))
            img = img + luz * m[..., None] * (1.7 if prob > 0.2 else 1.0)
        # niebla al pie de cada plano
        niebla = np.exp(-((np.arange(H)[:, None] - y_base) / (H * 0.025)) ** 2) * (0.5 + 0.5 * ruido(rng, H, W, 260, 3, estirar=4))
        img = pintar(img, color("#a9845a"), niebla * 0.30)
    # suelo y bruma baja
    suelo = np.clip((np.arange(H)[:, None] - H * 0.80) / (H * 0.05), 0, 1) * np.ones((1, W))
    img = pintar(img, color("#0b0d0b"), suelo * 0.92)
    img = bloom(img, 0.72, 0.5)
    base = terminar(img, rng)

    # primer plano: terraza con columnata clásica (capa aparte, con transparencia)
    def columnas(d, s):
        piso = H * 0.865
        d.polygon([(0, piso * s), (W * s, (piso + 18) * s), (W * s, H * s), (0, H * s)], fill=255)
        izq = [(-30, 205), (300, 190), (600, 170)]
        for x, cw in izq:
            alto_c = H * 0.70
            d.rectangle([(x - 12) * s, (piso - 46) * s, (x + cw + 12) * s, piso * s], fill=255)          # basa
            d.rectangle([x * s, (piso - alto_c) * s, (x + cw) * s, (piso - 46) * s], fill=255)          # fuste
            d.rectangle([(x - 26) * s, (piso - alto_c - 60) * s, (x + cw + 26) * s, (piso - alto_c) * s], fill=255)  # capitel
        d.rectangle([-40 * s, (piso - H * 0.70 - 150) * s, 860 * s, (piso - H * 0.70 - 60) * s], fill=255)  # entablamento
        d.polygon([(-40 * s, (piso - H * 0.70 - 150) * s), (860 * s, (piso - H * 0.70 - 150) * s),
                   (760 * s, (piso - H * 0.70 - 210) * s), (-40 * s, (piso - H * 0.70 - 210) * s)], fill=255)
        # balaustrada en el borde de la terraza
        d.rectangle([780 * s, (piso - 120) * s, (W - 360) * s, (piso - 100) * s], fill=255)
        d.rectangle([780 * s, (piso - 14) * s, (W - 360) * s, piso * s], fill=255)
        for bx in range(800, W - 380, 58):
            d.rectangle([(bx + 8) * s, (piso - 100) * s, (bx + 20) * s, (piso - 14) * s], fill=255)
            d.ellipse([(bx + 2) * s, (piso - 74) * s, (bx + 26) * s, (piso - 30) * s], fill=255)
        # columna quebrada a la derecha
        xr, cw = W - 330, 200
        d.rectangle([(xr - 12) * s, (piso - 46) * s, (xr + cw + 12) * s, piso * s], fill=255)
        d.polygon([(xr * s, (piso - 46) * s), (xr * s, (piso - H * 0.47) * s), ((xr + 60) * s, (piso - H * 0.50) * s),
                   ((xr + 110) * s, (piso - H * 0.44) * s), ((xr + cw) * s, (piso - H * 0.41) * s), ((xr + cw) * s, (piso - 46) * s)], fill=255)
        d.rectangle([(W - 40) * s, (piso - H * 0.70) * s, (W + 40) * s, piso * s], fill=255)
        # fragmentos en el piso
        for fx, fw in ((xr - 260, 150), (1260, 90)):
            d.ellipse([fx * s, (piso - 30) * s, (fx + fw) * s, (piso + 22) * s], fill=255)
    m = mascara(W, H, columnas)
    piso_y = int(H * 0.865)
    estrias = (np.sin(np.arange(W) / 7.5) > 0.6).astype(np.float32)[None, :] * 0.035 * (np.arange(H)[:, None] < piso_y - 120)
    modelado = np.zeros(W, np.float32)
    for x0, cw in ((-30, 205), (300, 190), (600, 170), (W - 330, 200)):
        t = np.clip((np.arange(W) - x0) / cw, 0, 1)
        modelado += ((np.arange(W) >= x0) & (np.arange(W) <= x0 + cw)) * t ** 2 * 0.07
    frente = np.zeros((H, W, 3), np.float32) + color("#0a0c0a") + estrias[..., None] + modelado[None, :, None] * color("#c08850")
    juntas = ((np.arange(H)[:, None] - piso_y) % 70 < 2) * (np.arange(H)[:, None] > piso_y) * 0.03
    frente = frente + juntas[..., None]
    # luz de borde del lado del sol (bordes derechos y superiores)
    borde = np.clip(m - np.roll(m, 4, axis=1), 0, 1) + np.clip(m - np.roll(m, 3, axis=0), 0, 1) * 0.5
    frente = sumar(frente, color("#d99a55"), suavizar(borde, 2) * 1.4)
    frente = sumar(frente, color("#3a2a18"), np.clip(1 - np.abs(np.arange(H)[:, None] / H - 0.88) * 9, 0, 1) * np.ones((1, W)) * 0.35)
    frente = np.clip(frente, 0, 1)
    completa = pintar(base, frente, m)

    guardar(base, "hero-fondo", [768, 1280, 1920, 2560], "portada", jpeg=1280)
    guardar(frente, "hero-frente", [768, 1280, 1920, 2560], "portada", alfa=m)
    im = guardar(completa, "hero-completa", [1280], "portada", jpeg=1280)
    im = Image.fromarray((completa * 255 + 0.5).astype(np.uint8))
    redes = SALIDA / "redes"
    redes.mkdir(parents=True, exist_ok=True)
    recorte(im, (240, 260, 240 + 2752, 260 + 1445), (1200, 630)).save(redes / "elysium-og-1200x630.jpg", quality=86, optimize=True, progressive=True)
    recorte(im, (1180, 220, 1180 + 1560, 220 + 1560), (1080, 1080)).save(redes / "elysium-cuadrado-1080.jpg", quality=86, optimize=True)
    recorte(im, (1520, 0, 1520 + 1012, 1800), (1080, 1920)).save(redes / "elysium-vertical-1080x1920.jpg", quality=86, optimize=True)
    print("   assets/img/redes elysium-og-1200x630, elysium-cuadrado-1080, elysium-vertical-1080x1920")


# ── Perspectiva para los mundos ─────────────────────────────
class Camara:
    def __init__(self, w, h, f, cx, cy, altura):
        self.f, self.cx, self.cy, self.altura = f, cx, cy, altura

    def p(self, x, y, z, s=1):
        return ((self.cx + self.f * x / z) * s, (self.cy - self.f * (y - self.altura) / z) * s)


def poligono(cam, puntos):
    def f(d, s):
        d.polygon([cam.p(x, y, z, s) for x, y, z in puntos], fill=255)
    return f


# ── 2. Mundo I · Roleplay: avenida al atardecer ─────────────
def mundo1(rng):
    W, H = 1600, 900
    cam = Camara(W, H, 760, W * 0.5, H * 0.47, 1.7)
    img = gradiente(H, W, [(0, "#0a1418"), (0.30, "#1d3134"), (0.47, "#d8995a"), (0.52, "#8a5a33"), (1, "#121212")])
    img = sumar(img, color("#ffd08f"), radial(H, W, cam.cx, cam.cy - 8, 70) * 1.3 + radial(H, W, cam.cx, cam.cy, 420, 160) * 0.45)
    formas, vent = edificios(rng, W * 0.30, W * 0.70, cam.cy + 4, (30, 150), (16, 46))
    img = pintar(img, color("#6d5038"), mascara(W, H, dibujar_formas(formas)) * 0.85)
    # fachadas a los dos lados, de atrás hacia adelante
    tramos = []
    for lado in (-1, 1):
        z = 6.0
        while z < 420:
            largo = float(rng.uniform(10, 26))
            tramos.append((z, lado, largo, float(rng.uniform(14, 75)) * (1.4 if rng.random() < 0.15 else 1)))
            z += largo + float(rng.uniform(0, 3))
    tramos.sort(key=lambda t: -t[0])
    luz = Image.new("RGB", (W * SS, H * SS), 0)
    dl = ImageDraw.Draw(luz)
    for z0, lado, largo, alto in tramos:
        x = lado * 11.0
        z1 = z0 + largo
        m = mascara(W, H, poligono(cam, [(x, 0, z0), (x, alto, z0), (x, alto, z1), (x, 0, z1)]))
        lejania = 1 - math.exp(-(z0 + largo / 2) / 140)
        tono = color("#1a1c1b") * (0.75 + 0.5 * rng.random()) * (1 - lejania) + color("#9a7350") * lejania
        img = pintar(img, tono, m)
        for piso in np.arange(3.0, alto - 2, 3.4):
            for zz in np.arange(z0 + 1.0, z1 - 1.2, 2.6):
                if rng.random() < 0.34:
                    c = (255, 190, 110) if rng.random() < 0.93 else (175, 215, 255)
                    k = (0.35 + 0.65 * rng.random()) * (1 - lejania * 0.8) * min(1.0, zz / 30)
                    dl.polygon([cam.p(x - lado * 0.05, piso, zz, SS), cam.p(x - lado * 0.05, piso + 1.5, zz, SS),
                                cam.p(x - lado * 0.05, piso + 1.5, zz + 1.2, SS), cam.p(x - lado * 0.05, piso, zz + 1.2, SS)],
                               fill=tuple(int(v * k) for v in c))
    luz = np.asarray(luz.resize((W, H), Image.LANCZOS), np.float32) / 255
    img = img + luz * 1.3
    # calle, veredas y marcas
    img = pintar(img, color("#141414"), mascara(W, H, poligono(cam, [(-8, 0, 1.2), (8, 0, 1.2), (8, 0, 900), (-8, 0, 900)])))
    for lado in (-1, 1):
        img = pintar(img, color("#2a2622"), mascara(W, H, poligono(cam, [(lado * 8, 0.15, 1.2), (lado * 11, 0.15, 1.2), (lado * 11, 0.15, 900), (lado * 8, 0.15, 900)])))
    marcas = Image.new("L", (W * SS, H * SS), 0)
    dm = ImageDraw.Draw(marcas)
    for z in np.arange(3, 300, 7):
        dm.polygon([cam.p(-0.12, 0.01, z, SS), cam.p(0.12, 0.01, z, SS), cam.p(0.12, 0.01, z + 3, SS), cam.p(-0.12, 0.01, z + 3, SS)], fill=150)
    img = sumar(img, color("#e8d9b5"), np.asarray(marcas.resize((W, H), Image.LANCZOS), np.float32) / 255 * 0.6)
    # estelas de autos y faroles
    estela = Image.new("RGB", (W * SS, H * SS), 0)
    de = ImageDraw.Draw(estela)
    for carril, c in ((-5.5, (255, 236, 200)), (-2.8, (255, 220, 170)), (2.8, (255, 60, 40)), (5.5, (255, 90, 50))):
        zs = np.geomspace(2.5, 500, 160)
        for a, b in zip(zs[:-1], zs[1:]):
            ancho = max(1, int(26 / a * SS))
            de.line([cam.p(carril, 0.8, a, SS), cam.p(carril, 0.8, b, SS)], fill=c, width=ancho)
    postes = Image.new("L", (W * SS, H * SS), 0)
    dp = ImageDraw.Draw(postes)
    for lado in (-1, 1):
        for z in np.arange(9, 320, 19):
            dp.line([cam.p(lado * 9.2, 0, z, SS), cam.p(lado * 9.2, 7.5, z, SS)], fill=255, width=max(1, int(9 / z * SS * 6)))
            dp.line([cam.p(lado * 9.2, 7.5, z, SS), cam.p(lado * 8.0, 7.5, z, SS)], fill=255, width=max(1, int(5 / z * SS * 6)))
            hx, hy = cam.p(lado * 8.0, 7.4, z, SS)
            r = max(2, int(48 / z * SS))
            de.ellipse([hx - r, hy - r, hx + r, hy + r], fill=(255, 210, 150))
    estela = np.asarray(estela.resize((W, H), Image.LANCZOS), np.float32) / 255
    img = pintar(img, color("#0e0e0d"), np.asarray(postes.resize((W, H), Image.LANCZOS), np.float32) / 255)
    img = img * (1 - estela.max(-1, keepdims=True) * 0.6) + estela * 1.2 + suavizar(estela, 6) * 1.1
    img = bloom(img, 0.65, 0.6)
    img = terminar(img, rng, vineta=0.5)
    guardar(img, "mundo-1", [480, 960, 1600], "mundos", jpeg=960)
    return img


# ── 3. Mundo II · Cuarentena ────────────────────────────────
def mundo2(rng):
    W, H = 1600, 900
    hz = H * 0.62
    img = gradiente(H, W, [(0, "#060a08"), (0.45, "#18241c"), (0.62, "#4d6650"), (0.64, "#1b221d"), (1, "#0b0e0c")])
    neb = ruido(rng, H, W, 200, 5, estirar=3)
    img = pintar(img, color("#6f8f74"), np.clip(neb - 0.35, 0, 1) * 0.5 * np.exp(-((np.arange(H)[:, None] - hz) / (H * 0.2)) ** 2))
    # edificios abandonados con bordes quebrados
    for y_base, alto, ancho, tono, prob in ((hz, (60, 220), (60, 160), "#2c3a30", 0.03), (hz + 25, (120, 360), (110, 260), "#121813", 0.05)):
        formas, vent = edificios(rng, 0, W, y_base, alto, ancho)
        for i, fo in enumerate(formas):
            if fo[0] == "r" and rng.random() < 0.5:
                x0, y0, x1, y1 = fo[1:]
                dientes = [(x0, y1), (x0, y0)] + [(x0 + (x1 - x0) * t, y0 + float(rng.uniform(0, 40))) for t in np.linspace(0.15, 0.85, 5)] + [(x1, y0 + 25), (x1, y1)]
                formas[i] = ("p", dientes)
        m = mascara(W, H, dibujar_formas(formas))
        img = pintar(img, color(tono), m)
        img = img + luces_ventanas(rng, W, H, vent, prob, paso=(12, 16), tam=(4, 5), calidez=0.3) * m[..., None] * np.array([0.6, 1.4, 0.7], np.float32)
    # carpas de cuarentena con luz interior
    for cx in (330, 560, 1180):
        w2, h2 = rng.uniform(120, 170), rng.uniform(70, 95)
        yb = hz + 70
        m = mascara(W, H, lambda d, s, cx=cx, w2=w2, h2=h2, yb=yb: d.polygon([((cx - w2) * s, yb * s), (cx * s, (yb - h2) * s), ((cx + w2) * s, yb * s)], fill=255))
        img = pintar(img, color("#b9c4b2"), m * 0.85)
        img = sumar(img, color("#d6ffcf"), m * radial(H, W, cx, yb - h2 * 0.3, w2 * 0.6, h2 * 0.6) * 0.8)
    # torre de luz y haz
    tx, ty = 1340, hz - 260
    img = pintar(img, color("#0c100d"), mascara(W, H, lambda d, s: (d.rectangle([(tx - 6) * s, ty * s, (tx + 6) * s, (hz + 80) * s], fill=255),
                                                                     d.rectangle([(tx - 40) * s, (ty - 18) * s, (tx + 40) * s, ty * s], fill=255))))
    haz = mascara(W, H, lambda d, s: d.polygon([(tx * s, ty * s), (380 * s, (H + 40) * s), (760 * s, (H + 40) * s)], fill=255))
    haz = suavizar(haz, 10) * (0.35 + 0.65 * ruido(rng, H, W, 120, 4))
    img = sumar(img, color("#cfeccc"), haz * 0.45)
    img = sumar(img, color("#f2ffe8"), radial(H, W, tx, ty - 9, 40, 16) * 1.6)
    # barreras con franjas de peligro
    yb0, yb1 = H * 0.78, H * 0.86
    franjas = Image.new("RGB", (W, H), 0)
    dfr = ImageDraw.Draw(franjas)
    for x in range(-200, W + 200, 46):
        dfr.polygon([(x, yb0), (x + 23, yb0), (x + 23 - 60, yb1), (x - 60, yb1)], fill=(214, 168, 46))
    fr = np.asarray(franjas, np.float32) / 255
    barrera = mascara(W, H, lambda d, s: [d.rectangle([x * s, yb0 * s, (x + 250) * s, yb1 * s], fill=255) for x in (40, 330, 620, 910, 1200)])
    img = pintar(img, color("#1a1a17"), barrera)
    img = img + fr * barrera[..., None] * 0.55
    # alambrado en primer plano
    malla = Image.new("L", (W * SS, H * SS), 0)
    dm = ImageDraw.Draw(malla)
    for k in range(-H, W, 22):
        dm.line([(k * SS, 0), ((k + H) * SS, H * SS)], fill=200, width=SS)
        dm.line([((k + H) * SS, 0), (k * SS, H * SS)], fill=200, width=SS)
    for x in range(110, W, 380):
        dm.rectangle([(x - 7) * SS, 0, (x + 7) * SS, H * SS], fill=255)
    dm.rectangle([0, 34 * SS, W * SS, 44 * SS], fill=255)
    malla = np.asarray(malla.resize((W, H), Image.LANCZOS), np.float32) / 255
    img = pintar(img, color("#0d110e"), malla * 0.9)
    img = sumar(img, color("#9fd49a"), malla * radial(H, W, 600, 700, 700, 420) * 0.35)
    # luces ámbar intermitentes y reflejos en el piso mojado
    for bx in (180, 760, 1460):
        img = sumar(img, color("#ffb347"), radial(H, W, bx, yb0 - 10, 14) * 1.4 + radial(H, W, bx, yb0 - 10, 60, 40) * 0.35)
        img = sumar(img, color("#ffb347"), radial(H, W, bx, H * 0.93, 30, 60) * 0.18)
    img = bloom(img, 0.6, 0.5)
    img = terminar(img, rng, vineta=0.55, sombras="#0a1f14", luces="#c9f0c0")
    guardar(img, "mundo-2", [480, 960, 1600], "mundos", jpeg=960)
    return img


# ── 4. Mundo III · PvP: patio de contenedores de noche ──────
def mundo3(rng):
    W, H = 1600, 900
    hz = H * 0.66
    img = gradiente(H, W, [(0, "#05060a"), (0.5, "#151a24"), (0.66, "#5a2e22"), (0.70, "#181514"), (1, "#0a0909")])
    img = sumar(img, color("#ff6a2a"), radial(H, W, W * 0.3, hz, W * 0.45, H * 0.12) * 0.35)
    humo = ruido(rng, H, W, 160, 5, estirar=2.5)
    img = pintar(img, color("#3b2a26"), np.clip(humo - 0.4, 0, 1) * 0.6)
    # grúa pórtico al fondo
    grua = mascara(W, H, lambda d, s: (d.rectangle([980 * s, (hz - 330) * s, 1000 * s, hz * s], fill=255),
                                       d.rectangle([1250 * s, (hz - 330) * s, 1270 * s, hz * s], fill=255),
                                       d.rectangle([900 * s, (hz - 350) * s, 1460 * s, (hz - 322) * s], fill=255)))
    img = pintar(img, color("#22232a"), grua)
    # pilas de contenedores en tres planos
    for escala, y_base, tono, n in ((0.45, hz + 8, "#2a2b31", 14), (0.75, hz + 60, "#1b1c20", 9), (1.25, H * 0.98, "#0f0f12", 5)):
        cont = Image.new("L", (W * SS, H * SS), 0)
        dc = ImageDraw.Draw(cont)
        costillas = Image.new("L", (W * SS, H * SS), 0)
        dk = ImageDraw.Draw(costillas)
        x = float(rng.uniform(-120, 0))
        while x < W:
            ancho = 260 * escala * float(rng.uniform(0.8, 1.2))
            alto = 56 * escala
            pisos = int(rng.integers(1, 5))
            for p in range(pisos):
                y1 = y_base - p * alto
                desliz = float(rng.uniform(-14, 14)) * escala
                dc.rectangle([(x + desliz) * SS, (y1 - alto) * SS, (x + desliz + ancho) * SS, y1 * SS], fill=255)
                for rx in np.arange(x + desliz + 6, x + desliz + ancho - 4, 9 * escala):
                    dk.line([(rx * SS, (y1 - alto + 4) * SS), (rx * SS, (y1 - 3) * SS)], fill=255, width=max(1, int(SS * escala)))
            x += ancho + float(rng.uniform(10, 120)) * escala
        m = np.asarray(cont.resize((W, H), Image.LANCZOS), np.float32) / 255
        k = np.asarray(costillas.resize((W, H), Image.LANCZOS), np.float32) / 255
        img = pintar(img, color(tono), m)
        img = sumar(img, color("#6b4a3a"), k * m * 0.12 * escala)
    # reflectores cruzados con polvo
    polvo = ruido(rng, H, W, 60, 4)
    for ox, tx in ((-60, 1100), (W + 60, 480)):
        haz = mascara(W, H, lambda d, s, ox=ox, tx=tx: d.polygon([(ox * s, -30 * s), ((tx - 210) * s, (H + 60) * s), ((tx + 210) * s, (H + 60) * s)], fill=255))
        haz = suavizar(haz, 8) * np.clip(1.15 - np.arange(H)[:, None] / H, 0, 1)
        img = sumar(img, color("#f3e2c4"), haz * (0.25 + 0.5 * polvo) * 0.55)
        img = sumar(img, color("#fff3dc"), radial(H, W, ox if ox > 0 else 0, 0, 90, 60) * 1.2)
    # balizas rojas, chispas y charcos
    for bx, by in ((260, hz - 110), (720, hz - 40), (1180, hz - 140), (1430, hz - 60)):
        img = sumar(img, color("#ff2a1a"), radial(H, W, bx, by, 6) * 2 + radial(H, W, bx, by, 40, 30) * 0.4)
    chispas = Image.new("RGB", (W, H), 0)
    dch = ImageDraw.Draw(chispas)
    for _ in range(160):
        x, y = float(rng.uniform(500, 1100)), float(rng.uniform(H * 0.55, H * 0.95))
        a = float(rng.uniform(-2.6, -0.6))
        largo = float(rng.uniform(4, 18))
        dch.line([(x, y), (x + math.cos(a) * largo, y + math.sin(a) * largo)], fill=(255, 190, 90), width=1)
    ch = np.asarray(chispas, np.float32) / 255
    img = img + ch * 1.4 + suavizar(ch, 4) * 1.2
    img = sumar(img, color("#ff7a3a"), radial(H, W, 800, H * 0.95, 300, 30) * 0.25)
    img = bloom(img, 0.6, 0.6)
    img = terminar(img, rng, vineta=0.55, sombras="#101421", luces="#ffb07a")
    guardar(img, "mundo-3", [480, 960, 1600], "mundos", jpeg=960)
    return img


# ── 5. Mundo IV · Arena: coliseo conceptual ─────────────────
def mundo4(rng):
    W, H = 1600, 900
    cx, cy = W * 0.5, H * 0.60
    img = gradiente(H, W, [(0, "#06060d"), (0.40, "#191a33"), (0.58, "#7a5a3a"), (0.62, "#1a1720"), (1, "#08080c")])
    # haz central hacia el cielo
    pilar = np.exp(-((np.arange(W)[None, :] - cx) / 26) ** 2) * np.clip(1 - np.arange(H)[:, None] / cy, 0, 1) ** 0.6
    img = sumar(img, color("#ffe2b0"), pilar * 1.0 + suavizar(pilar, 8) * 0.8)
    img = sumar(img, color("#c9a06a"), radial(H, W, cx, cy - 40, 520, 200) * 0.35)

    def anillo(rx, ry, grosor, y0):
        return lambda d, s: (d.ellipse([(cx - rx) * s, (y0 - ry) * s, (cx + rx) * s, (y0 + ry) * s], fill=255),
                             d.ellipse([(cx - rx + grosor) * s, (y0 - ry + grosor * 0.4) * s, (cx + rx - grosor) * s, (y0 + ry - grosor * 0.4) * s], fill=0))
    # muro exterior con arcos romanos
    exterior = mascara(W, H, lambda d, s: d.ellipse([(cx - 760) * s, (cy - 150) * s, (cx + 760) * s, (cy + 300) * s], fill=255))
    exterior *= (np.arange(H)[:, None] > cy - 60)
    img = pintar(img, color("#141218"), exterior)
    arcos = Image.new("RGB", (W * SS, H * SS), 0)
    da = ImageDraw.Draw(arcos)
    for i in range(46):
        t = math.pi * (0.02 + 0.96 * i / 45)
        ax, ay = cx - 700 * math.cos(t), cy + 230 * math.sin(t) - 10
        aw, ah = 22 * (0.6 + 0.6 * math.sin(t)), 46 * (0.6 + 0.6 * math.sin(t))
        if ay < cy - 40:
            continue
        da.rectangle([(ax - aw / 2) * SS, (ay - ah * 0.55) * SS, (ax + aw / 2) * SS, (ay + ah * 0.45) * SS], fill=(150, 104, 58))
        da.ellipse([(ax - aw / 2) * SS, (ay - ah * 0.55 - aw / 2) * SS, (ax + aw / 2) * SS, (ay - ah * 0.55 + aw / 2) * SS], fill=(150, 104, 58))
    arcos = np.asarray(arcos.resize((W, H), Image.LANCZOS), np.float32) / 255
    img = img + arcos * 0.9 + suavizar(arcos, 6) * 0.5
    # gradas con luces del público
    for rx, ry, g, tono in ((640, 230, 70, "#1d1a22"), (520, 185, 60, "#24202a"), (400, 140, 50, "#2c2730")):
        y0 = cy + 40 - (rx - 400) * 0.22
        m = mascara(W, H, anillo(rx, ry, g, y0))
        img = pintar(img, color(tono), m)
        pts = rng.random((H, W)) > 0.985
        img = sumar(img, color("#f6d7a6"), (pts * m * rng.random((H, W))).astype(np.float32) * 1.2)
        borde = mascara(W, H, anillo(rx - g + 4, ry - g * 0.4 + 2, 3, y0))
        img = sumar(img, color("#9fc9b5"), borde * 0.9 + suavizar(borde, 4) * 0.6)
    # piso de la arena con anillo de bronce
    piso = mascara(W, H, lambda d, s: d.ellipse([(cx - 300) * s, (cy + 40 - 100) * s, (cx + 300) * s, (cy + 40 + 100) * s], fill=255))
    img = pintar(img, color("#3a2d22"), piso)
    aro = mascara(W, H, anillo(220, 74, 6, cy + 40))
    img = sumar(img, color("#ffb866"), aro * 1.4 + suavizar(aro, 6) * 1.0)
    img = sumar(img, color("#ffe7c2"), radial(H, W, cx, cy + 40, 60, 22) * 1.4)
    img = bloom(img, 0.6, 0.65)
    img = terminar(img, rng, vineta=0.55, sombras="#120f24", luces="#f0c28a")
    guardar(img, "mundo-4", [480, 960, 1600], "mundos", jpeg=960)
    return img


def portadas_novedades(mundos):
    """Portadas editoriales de 1200 × 630 a partir de las ilustraciones."""
    carpeta = SALIDA / "novedades"
    carpeta.mkdir(parents=True, exist_ok=True)
    fuentes = {
        "servidor": (mundos.get("mundo1"), (200, 80, 1400, 710)),
        "sitio": (mundos.get("hero"), (300, 120, 1500, 750)),
        "privacidad": (mundos.get("mundo4"), (200, 150, 1400, 780)),
    }
    for nombre, (img, caja) in fuentes.items():
        if img is None:
            continue
        im = Image.fromarray((np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)).crop(caja).resize((1200, 630), Image.LANCZOS)
        im.save(carpeta / f"novedad-{nombre}-1200.webp", "WEBP", quality=80, method=6)
        im.resize((600, 315), Image.LANCZOS).save(carpeta / f"novedad-{nombre}-600.webp", "WEBP", quality=80, method=6)
    print("   assets/img/novedades", ", ".join(f"novedad-{n}" for n in fuentes))


if __name__ == "__main__":
    pedidos = set(sys.argv[1:]) or {"hero", "mundo1", "mundo2", "mundo3", "mundo4"}
    hechos = {}
    for nombre, funcion, semilla in (("hero", portada, 7), ("mundo1", mundo1, 11), ("mundo2", mundo2, 23), ("mundo3", mundo3, 31), ("mundo4", mundo4, 47)):
        if nombre in pedidos:
            print(nombre)
            hechos[nombre] = funcion(np.random.default_rng(semilla))
    if {"mundo1", "mundo4"} <= pedidos:
        hero = Image.open(SALIDA / "portada" / "hero-completa-1280.webp").convert("RGB")
        hechos["hero"] = np.asarray(hero.resize((1600, 900), Image.LANCZOS), np.float32) / 255
        portadas_novedades(hechos)
