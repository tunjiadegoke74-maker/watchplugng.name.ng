# watchplug.ng project guide

## Architecture

This is a TanStack Start ecommerce site deployed on Netlify. React renders the catalog and product pages, TanStack Router provides file-based routing, and a TanStack server function creates Stripe Checkout sessions. The catalog is intentionally code-managed because it is a small, curated collection rather than an inventory management system.

## Key directories

- `src/routes/` contains the home, product detail, and checkout result routes.
- `src/components/` contains shared interactive UI, currently the checkout button.
- `src/data/products.ts` is the single source of truth for products and naira formatting.
- `src/lib/stripe.ts` contains server-only Stripe session creation.
- `src/styles.css` contains the global visual system and responsive rules.
- `public/img/` contains original product imagery. Pages request optimized derivatives through Netlify Image CDN.
- `scripts/` contains the optional static image-generation utility; it does not run at build time.

## Conventions

- Use TypeScript and the existing `@/` import alias.
- Keep route components in `src/routes` and reusable UI in `src/components`.
- Preserve the warm editorial direction: parchment, ink, burnt clay, Fraunces display type, asymmetrical compositions, and restrained motion.
- Use semantic HTML, descriptive alt text, visible focus/disabled states, and reduced-motion support.
- Format customer prices with `formatNaira`; Stripe amounts use naira minor units.
- Serve local raster images through `/.netlify/images` rather than directly at full resolution.
- Do not expose Stripe secrets to client code. Checkout session creation remains inside the server function.

## Environment

`STRIPE_SECRET_KEY` enables online checkout. Netlify supplies `URL` in production for checkout redirects. The AI Gateway variables are only needed if intentionally regenerating static imagery.

## Non-obvious decisions

Several categories share a coordinated editorial image and use deliberate object positioning for distinct crops. This keeps the initial asset set cohesive and lightweight at delivery because Netlify Image CDN produces appropriately sized WebP files.

Checkout is disabled gracefully when Stripe is not configured, so the deployed catalog never fails merely because payment credentials are absent.
