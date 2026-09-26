# watchplug.ng

A warm, editorial ecommerce storefront for watchplug.ng. The site showcases watches, cufflinks, scarves, sneakers, brogues, and jewellery, with dedicated product pages and Stripe-hosted checkout in Nigerian naira.

## Technology

- TanStack Start and React 19
- TanStack Router file-based routes
- Tailwind CSS 4 plus a custom responsive design system
- Stripe Checkout through a server function
- Netlify Image CDN for optimized product imagery
- Netlify deployment adapter

## Local development

Use Node.js 22 and pnpm.

```bash
pnpm install
pnpm dev
```

The local app runs at `http://localhost:3000`. Set `STRIPE_SECRET_KEY` in your local environment to enable checkout. Without it, the catalog remains available and purchase buttons clearly indicate that checkout is not connected.

## Store content

Product names, copy, pricing, and image assignments live in `src/data/products.ts`. Product imagery is stored in `public/img` and delivered through Netlify Image CDN URLs.

The optional `scripts/generate-product-images.mjs` script documents how the current editorial imagery was created through Netlify AI Gateway. It is not used by the live storefront.
