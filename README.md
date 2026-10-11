# QRForge

A live QR code generator for links with print-ready export, customizable colors, caption text, size controls, and synchronized preview updates.

## Features

- Live QR preview with no Generate button needed
- Real-time updates for:
  - link
  - QR size
  - print padding
  - QR color
  - background color
  - caption text
  - style preset
- Download QR as PNG
- Print using the same export layout as download
- Caption text included in exported image
- Padding preserved in exported image and print output
- Clean static frontend built with HTML, CSS, and JavaScript
- Hosted on Cloudflare Pages

## What makes it different

QRForge is designed to be more useful for actual printing and sharing, not just basic on-screen QR generation.

Unlike a simple generator, this project includes:
- print-aware padding controls
- caption support under the QR code
- synchronized live preview
- matching output between preview, downloaded PNG, and print layout

## Tech stack

- HTML
- CSS
- JavaScript
- [QRCode.js](https://davidshimjs.github.io/qrcodejs/)

## Live site

[https://qr.foxesvx.dev](https://qr.foxesvx.dev)

## Repository

Replace this with your actual repo link if needed:

[https://github.com/foxfoxesfox/qrforge](https://github.com/foxfoxesfox/qrforge)

## Current behavior

### Live preview

The preview updates automatically when changing:
- the link
- QR size
- padding
- QR color
- background color
- caption
- preset

There is no longer a separate Generate QR button.

### Export behavior

Both **Download PNG** and **Print** use the same composed export result, so they stay visually consistent.

That means exported output includes:
- QR code
- selected background color
- selected padding
- caption text
- caption color matching the QR color

## Padding options

The padding control has been simplified to:

- Small
- Medium
- Large

These options are intentionally spaced far enough apart to make the difference noticeable in preview, download, and print.

## Project structure

```text
qrforge/
├── index.html
├── style.css
├── script.js
└── README.md
