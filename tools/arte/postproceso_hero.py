#!/usr/bin/env python3
"""
ELYSIUM | ES — post-proceso de la portada renderizada con escena_hero.py.

Agrega resplandor, gradación, viñeta y grano, y exporta las capas de la
portada, la versión completa, los formatos para redes y la portada de la
novedad «sitio».

Uso:  python3 tools/arte/postproceso_hero.py <carpeta_del_render> [vista]
"""
import pathlib
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from generar_arte import SALIDA, bloom, guardar, recorte, terminar  # noqa: E402


def cargar(ruta):
    a = np.asarray(Image.open(ruta)).astype(np.float32)
    return a / (65535.0 if a.max() > 255 else 255.0)


def main(carpeta, final=True):
    rng = np.random.default_rng(7)
    fondo = cargar(f"{carpeta}/fondo.png")[..., :3]
    fr = cargar(f"{carpeta}/frente.png")
    color, alfa = fr[..., :3], fr[..., 3]
    base = terminar(bloom(fondo, 0.62, 0.7), rng, vineta=0.42, grano=0.02)
    frente = np.clip(color, 0, 1)
    completa = base * (1 - alfa[..., None]) + frente * alfa[..., None]
    if not final:
        Image.fromarray((completa * 255 + 0.5).astype(np.uint8)).save(f"{carpeta}/vista.jpg", quality=88)
        return
    guardar(base, "hero-fondo", [768, 1280, 1920, 2560], "portada", jpeg=1280)
    guardar(frente, "hero-frente", [768, 1280, 1920, 2560], "portada", alfa=alfa)
    guardar(completa, "hero-completa", [1280], "portada", jpeg=1280)
    im = Image.fromarray((completa * 255 + 0.5).astype(np.uint8))
    k = im.width / 3200

    def caja(x, y, w, h):
        return tuple(int(v * k) for v in (x, y, x + w, y + h))
    redes = SALIDA / "redes"
    recorte(im, caja(240, 260, 2752, 1445), (1200, 630)).save(redes / "elysium-og-1200x630.jpg", quality=86, optimize=True, progressive=True)
    recorte(im, caja(1180, 220, 1560, 1560), (1080, 1080)).save(redes / "elysium-cuadrado-1080.jpg", quality=86, optimize=True)
    recorte(im, caja(1520, 0, 1012, 1800), (1080, 1920)).save(redes / "elysium-vertical-1080x1920.jpg", quality=86, optimize=True)
    nov = SALIDA / "novedades"
    c = im.resize((1600, 900), Image.LANCZOS).crop((300, 120, 1500, 750))
    c.save(nov / "novedad-sitio-1200.webp", "WEBP", quality=80, method=6)
    c.resize((600, 315), Image.LANCZOS).save(nov / "novedad-sitio-600.webp", "WEBP", quality=80, method=6)
    print("   portada, redes y novedad «sitio» exportadas")


if __name__ == "__main__":
    main(sys.argv[1], final=not (len(sys.argv) > 2 and sys.argv[2] == "vista"))
