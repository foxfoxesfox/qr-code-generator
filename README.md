# QRForge

QRForge is a browser-based QR code generator that you host as your own web tool.

## What it does

- Generates QR codes for links
- Lets users customize size
- Lets users choose QR and background colors
- Adds print padding
- Supports optional caption text
- Exports PNG
- Includes a print-friendly layout
- Includes dark mode

## Stack

- HTML
- CSS
- JavaScript
- QRCode.js via CDN

## Project files

- `index.html` - main app
- `style.css` - styling and print styles
- `script.js` - QR generation logic
- `404.html` - optional custom not-found page

## Local preview

You can open `index.html` directly in a browser.

Or run a local server:

```bash
python3 -m http.server 8080
