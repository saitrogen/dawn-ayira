# Ayira Homepage Image Dimensions

This document defines the production dimensions and composition rules for images used by Ayira's custom homepage sections. These are separate theme-editor images; they are not Shopify product media.

## Asset standards

| Placement | Source dimensions | Aspect ratio | Preferred format | Target file size | Rendering |
| --- | ---: | ---: | --- | ---: | --- |
| Vertical category banner | 1080 × 1920 px | 9:16 | WebP or JPG | 300–500 KB | `object-fit: cover` |
| Hero banner, Medium | 2640 × 1200 px | 2.2:1 | WebP or JPG | 500 KB or less | `object-fit: cover` |

Do not embed category titles, headings, subtitles, or buttons in these images. Shopify renders that content separately, which keeps it responsive, translatable, and accessible.

## Vertical category banners

The section uses one image for desktop and mobile. Each banner is 220 × approximately 391 px on desktop. Mobile width is `(100vw - 40px) / 2.7`, and height follows the 9:16 aspect ratio.

- Keep the upper 30% visually quiet for the category title and fixed dark gradient.
- Place the principal subject within the middle and lower portions of the frame.
- Keep essential product details at least 10% away from the left and right edges.
- Use the exact 9:16 ratio to avoid unintended cropping.
- The default crop position is centered. Shopify image focal points are honored when available.

The card radius is 16 px on desktop and 12 px on mobile. The fixed overlay transitions from black at 55% opacity at the top, to 15% opacity at 35% of the height, and then to transparent at 60%.

## Hero banners

The active homepage hero sections use the Medium height setting. Medium renders at 2.2:1 on both desktop and mobile, using the same image at every breakpoint.

- Keep essential subjects within the central 80% of the canvas.
- Keep important details at least 10% away from every edge.
- If theme text is positioned on the left, place the subject on the right, and vice versa.
- Keep the text side visually quiet; do not bake text into the artwork.
- An exact 2.2:1 source avoids `object-fit: cover` cropping.
- The default crop position is centered. Shopify image focal points are honored when available.

With the current 1280 px theme page width, the maximum rendered hero image area is approximately 1180 × 536 px. On mobile, its width is approximately the viewport width minus 30 px, with height calculated at 2.2:1.

## Upload checklist

- Export in the sRGB color space.
- Prefer WebP for generated or photographic artwork; use JPG when WebP is unavailable.
- Avoid PNG for full-bleed photography unless transparency is required.
- Compress images to the target file size without visible artifacts.
- Verify the subject and quiet area at desktop and mobile widths.
- Assign a Shopify focal point when the subject is not centered.
- Confirm that no important content is obscured by section text or controls.
