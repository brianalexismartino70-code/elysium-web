#!/usr/bin/env python3
"""
ELYSIUM | ES — genera las imágenes optimizadas del sitio a partir de los originales.

Uso (desde la raíz del repositorio):
    python3 tools/optimizar_imagenes.py

Necesita Pillow 11.2 o superior (con soporte AVIF y WebP):
    pip install --upgrade pillow

Los originales (ELYSIUM*.png, E*.png) no se modifican: este script solo escribe
en assets/img/ y en los íconos de la raíz. Si cambiás un original, volvé a
ejecutarlo y subí los archivos generados.
"""
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "assets" / "img"
TINTA = (11, 15, 13)


def guardar_variantes(img, destino, anchos, calidad_webp=78, calidad_avif=52, jpg=None):
    """Guarda la imagen en AVIF y WebP para cada ancho (y opcionalmente un JPEG)."""
    destino.parent.mkdir(parents=True, exist_ok=True)
    for ancho in anchos:
        alto = round(img.height * ancho / img.width)
        r = img.resize((ancho, alto), Image.LANCZOS)
        r.save(f"{destino}-{ancho}.webp", "WEBP", quality=calidad_webp, method=6)
        r.save(f"{destino}-{ancho}.avif", "AVIF", quality=calidad_avif, speed=4)
        if jpg and ancho == jpg:
            r.save(f"{destino}-{ancho}.jpg", "JPEG", quality=80, optimize=True, progressive=True)


def logo_recortado():
    """Recorta el logotipo transparente (E2.png) a su contenido."""
    logo = Image.open(RAIZ / "E2.png").convert("RGBA")
    return logo.crop(logo.getchannel("A").getbbox())


def icono_cuadrado(logo, lado, margen=0.18):
    """Logotipo centrado sobre fondo tinta, para favicons e íconos de la app."""
    fondo = Image.new("RGBA", (lado, lado), TINTA + (255,))
    interior = round(lado * (1 - 2 * margen))
    escala = min(interior / logo.width, interior / logo.height)
    l = logo.resize((max(1, round(logo.width * escala)), max(1, round(logo.height * escala))), Image.LANCZOS)
    fondo.alpha_composite(l, ((lado - l.width) // 2, (lado - l.height) // 2))
    return fondo


def main():
    # Portada: ELYSIUM3.png (1920x1080), arte de marca sin texto
    portada = Image.open(RAIZ / "ELYSIUM3.png").convert("RGB")
    guardar_variantes(portada, SALIDA / "portada" / "elysium-portada", [768, 1280, 1920], jpg=1280)

    # Galería: ELYSIUM.png (arte de marca con el logotipo)
    arte = Image.open(RAIZ / "ELYSIUM.png").convert("RGB")
    guardar_variantes(arte, SALIDA / "galeria" / "elysium-arte", [640, 1280])

    # Vista previa para redes (Open Graph): 1200x630 desde ELYSIUM2.png
    og = ImageOps.fit(Image.open(RAIZ / "ELYSIUM2.png").convert("RGB"), (1200, 630), Image.LANCZOS)
    (SALIDA / "og").mkdir(parents=True, exist_ok=True)
    og.save(SALIDA / "og" / "elysium-og.jpg", "JPEG", quality=82, optimize=True, progressive=True)

    # Logotipo para la barra superior (alto de 96 px: nítido a 32 px en pantallas 3x)
    logo = logo_recortado()
    (SALIDA / "marca").mkdir(parents=True, exist_ok=True)
    alto = 96
    barra = logo.resize((round(logo.width * alto / logo.height), alto), Image.LANCZOS)
    barra.save(SALIDA / "marca" / "elysium-logo.png", "PNG", optimize=True)
    barra.save(SALIDA / "marca" / "elysium-logo.webp", "WEBP", quality=90, method=6)

    # Íconos
    icono_cuadrado(logo, 180, 0.16).convert("RGB").save(RAIZ / "apple-touch-icon.png", "PNG", optimize=True)
    icono_cuadrado(logo, 192).save(SALIDA / "marca" / "icono-192.png", "PNG", optimize=True)
    icono_cuadrado(logo, 512).save(SALIDA / "marca" / "icono-512.png", "PNG", optimize=True)
    icono_cuadrado(logo, 32, 0.08).save(SALIDA / "marca" / "favicon-32.png", "PNG", optimize=True)
    base = icono_cuadrado(logo, 256, 0.08)
    base.save(RAIZ / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])


if __name__ == "__main__":
    main()
