#!/usr/bin/env python3
"""Generate tasteful abstract placeholder JPEGs for Azure Sands Boracay Condotel.

These are soft layered-gradient "beach light" images meant to be replaced with
real photography later. Re-run any time:  python3 scripts/generate-placeholders.py
"""
import math
import os
import random
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(OUT, exist_ok=True)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def multi_lerp(stops, t):
    """stops: list of (pos, color). t in [0,1]."""
    for i in range(len(stops) - 1):
        p0, c0 = stops[i]
        p1, c1 = stops[i + 1]
        if p0 <= t <= p1:
            local = (t - p0) / (p1 - p0) if p1 > p0 else 0
            return lerp(c0, c1, local)
    return stops[-1][1]


def vertical_gradient(w, h, stops):
    col = Image.new("RGB", (1, h))
    px = col.load()
    for y in range(h):
        px[0, y] = multi_lerp(stops, y / (h - 1))
    return col.resize((w, h), Image.BILINEAR)


def soft_circle(img, cx, cy, r, color, opacity=160, blur=60):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (opacity,))
    overlay = overlay.filter(ImageFilter.GaussianBlur(blur))
    img.alpha_composite(overlay)


def wave_bands(img, y_start, y_end, color, count=4, opacity=46, blur=8, seed=1):
    rnd = random.Random(seed)
    w, h = img.size
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for i in range(count):
        base_y = y_start + (y_end - y_start) * (i / max(count - 1, 1))
        amp = rnd.randint(6, 18)
        phase = rnd.uniform(0, math.tau)
        thickness = rnd.randint(10, 26)
        pts_top = [(x, base_y + amp * math.sin(phase + x / rnd.uniform(90, 160)))
                   for x in range(0, w + 20, 20)]
        pts_bot = [(x, y + thickness) for x, y in reversed(pts_top)]
        d.polygon(pts_top + pts_bot, fill=color + (opacity,))
    overlay = overlay.filter(ImageFilter.GaussianBlur(blur))
    img.alpha_composite(overlay)


def bokeh(img, colors, count=7, seed=2, rmin=60, rmax=220, opacity=48):
    rnd = random.Random(seed)
    w, h = img.size
    for i in range(count):
        soft_circle(
            img,
            rnd.randint(0, w),
            rnd.randint(0, h),
            rnd.randint(rmin, rmax),
            rnd.choice(colors),
            opacity=rnd.randint(opacity - 18, opacity + 18),
            blur=rnd.randint(40, 90),
        )


def vignette(img, strength=70):
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse([-w * 0.25, -h * 0.25, w * 1.25, h * 1.25], fill=strength)
    mask = mask.filter(ImageFilter.GaussianBlur(120))
    dark = Image.new("RGBA", (w, h), (12, 20, 26, strength))
    inv = mask.point(lambda p: strength - p)
    dark.putalpha(inv)
    img.alpha_composite(dark)


def beach(name, w, h, sky, sea, sand, sun=None, seed=3):
    stops = [
        (0.0, sky[0]), (0.42, sky[1]),
        (0.46, sea[0]), (0.68, sea[1]),
        (0.72, sand[0]), (1.0, sand[1]),
    ]
    img = vertical_gradient(w, h, stops).convert("RGBA")
    wave_bands(img, int(h * 0.47), int(h * 0.70), (255, 255, 255), count=5,
               opacity=42, seed=seed)
    wave_bands(img, int(h * 0.70), int(h * 0.76), (255, 255, 255), count=2,
               opacity=80, blur=5, seed=seed + 1)
    vignette(img, 46)
    if sun:
        cx, cy, r, color, opacity, blur = sun
        soft_circle(img, cx, cy, int(r * 1.9), color, opacity=90, blur=blur * 2)
        soft_circle(img, cx, cy, r, color, opacity=min(opacity + 60, 255), blur=blur // 2)
    save(img, name)


def interior(name, w, h, palette, accent_colors, seed=5):
    img = vertical_gradient(w, h, palette).convert("RGBA")
    bokeh(img, accent_colors, count=8, seed=seed)
    # soft "window light" panel
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.polygon([(w * 0.55, 0), (w * 0.95, 0), (w * 0.75, h), (w * 0.35, h)],
              fill=(255, 252, 240, 26))
    overlay = overlay.filter(ImageFilter.GaussianBlur(90))
    img.alpha_composite(overlay)
    vignette(img, 60)
    save(img, name)


def save(img, name):
    img = img.convert("RGB")
    path = os.path.join(OUT, name)
    img.save(path, "JPEG", quality=84, optimize=True, progressive=True)
    print("wrote", name, img.size)


W, H = 1600, 1067

# NOTE: boracay-hero.jpg and property-exterior.jpg are real photography now —
# they are intentionally NOT generated here so re-running this script can't
# overwrite them.

# ---- Beach / location scenes -------------------------------------------------
beach("beach-sunset.jpg", W, H,
      sky=[(244, 156, 96), (250, 208, 148)],
      sea=[(196, 110, 88), (110, 70, 84)],
      sand=[(94, 66, 70), (66, 48, 56)],
      sun=(800, 420, 130, (255, 214, 150), 210, 70), seed=12)

beach("white-beach.jpg", W, H,
      sky=[(138, 200, 220), (208, 236, 242)],
      sea=[(70, 168, 192), (36, 126, 154)],
      sand=[(244, 232, 208), (232, 214, 184)],
      sun=(300, 240, 120, (255, 250, 230), 130, 80), seed=13)

beach("bulabog-beach.jpg", W, H,
      sky=[(108, 172, 200), (180, 216, 228)],
      sea=[(52, 140, 170), (28, 100, 130)],
      sand=[(228, 214, 186), (212, 194, 164)],
      sun=None, seed=14)

beach("willys-rock.jpg", W, H,
      sky=[(150, 204, 222), (214, 238, 242)],
      sea=[(80, 172, 194), (42, 130, 156)],
      sand=[(240, 228, 202), (226, 208, 178)],
      sun=(1250, 300, 110, (255, 248, 224), 120, 80), seed=15)

beach("boracay-location.jpg", W, H,
      sky=[(126, 192, 214), (198, 230, 236)],
      sea=[(58, 150, 178), (30, 110, 140)],
      sand=[(236, 222, 196), (222, 202, 172)],
      sun=(500, 260, 130, (255, 248, 222), 130, 85), seed=16)

beach("beach-day.jpg", W, H,
      sky=[(132, 198, 220), (204, 234, 240)],
      sea=[(66, 162, 188), (34, 120, 150)],
      sand=[(242, 230, 206), (228, 210, 180)],
      sun=(1150, 220, 140, (255, 250, 228), 140, 88), seed=17)

# Room, pool, and exterior photos are real images now — only the beach /
# location backdrops above are still generated.

print("done")
