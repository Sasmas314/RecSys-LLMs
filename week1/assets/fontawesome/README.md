# Font Awesome Free 6.4.0

Unmodified files from https://github.com/FortAwesome/Font-Awesome/tree/6.4.0:

- `css/fontawesome.min.css` — icon definitions and core styles.
- `css/solid.min.css` — Free Solid font-face and styles.
- `webfonts/fa-solid-900.woff2` and `webfonts/fa-solid-900.ttf` — local fonts.
- `LICENSE.txt` — upstream license (fonts: SIL OFL 1.1; code: MIT).

Only the solid style used by the original application is bundled. Keeping these
files local removes the runtime dependency on cdnjs. Keep the directory structure:
`solid.min.css` resolves its fonts using `../webfonts/`.
