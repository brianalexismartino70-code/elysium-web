#!/usr/bin/env bash
# ═════════════════════════════════════════════════════════════
#  Compila una COPIA del sitio con el acceso confirmado y un video de
#  portada de prueba, para correr tests/verificar-variante.mjs.
#  No modifica el repositorio ni publica nada.
#
#  Uso: bash tests/variante-acceso.sh [carpeta-de-salida]
# ═════════════════════════════════════════════════════════════
set -euo pipefail
SALIDA="$(realpath -m "${1:-_site-variante}")"
COPIA="$(mktemp -d)"
trap 'rm -rf "$COPIA"' EXIT
git ls-files -z --cached --others --exclude-standard | xargs -0 -I{} cp --parents {} "$COPIA"
sed -i \
  -e 's/^  publico: false/  publico: true/' \
  -e 's/^  codigo_confirmado: false/  codigo_confirmado: true/' \
  -e 's#^  video_mp4: ""#  video_mp4: "/assets/video/prueba.mp4"#' \
  "$COPIA/_data/sitio.yml"
grep -q 'codigo_confirmado: true' "$COPIA/_data/sitio.yml"
bundle exec jekyll build -s "$COPIA" -d "$SALIDA" --quiet
echo "Variante compilada en $SALIDA"
