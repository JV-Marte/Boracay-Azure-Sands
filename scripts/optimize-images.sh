#!/usr/bin/env bash
# Downscale and convert generated PNGs to web-sized JPEGs.
#
# The image generator emits ~2.5 MB 1536x1024 PNGs. Shipping those straight
# into public/ would add ~75 MB to the repo, so every generated PNG is resized
# to 1400px on its long edge, saved as JPEG, and the PNG is removed.
#
#   ./scripts/optimize-images.sh                 # every PNG under public/images
#   ./scripts/optimize-images.sh public/images/cafe   # just one directory
#
# Uses sips, which ships with macOS. Safe to re-run: it only touches PNGs.
#
# public/images/brand is skipped on purpose: the logo lockups rely on alpha, and
# JPEG has no transparency, so converting them would fill the background white.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-$ROOT/public/images}"
MAX_EDGE=1400

if ! command -v sips >/dev/null 2>&1; then
  echo "sips not found — this script expects macOS." >&2
  exit 1
fi

count=0
while IFS= read -r -d '' png; do
  jpg="${png%.png}.jpg"
  sips --resampleHeightWidthMax "$MAX_EDGE" \
       --setProperty format jpeg \
       --setProperty formatOptions 80 \
       "$png" --out "$jpg" >/dev/null
  rm "$png"
  printf '  %-56s %s\n' "$(basename "$jpg")" "$(du -h "$jpg" | cut -f1)"
  count=$((count + 1))
done < <(find "$TARGET" -type f -name '*.png' -not -path '*/brand/*' -print0)

echo "Optimized $count image(s) under $TARGET"
