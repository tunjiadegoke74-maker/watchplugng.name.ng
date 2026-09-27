# Sales Tracker

A standalone sales + stock-intake app for your team. Runs entirely on Cloudflare
(Pages + D1 database) — no Claude account needed for anyone using it.

## What it does
- Owner creates the first account on first load.
- Owner adds worker accounts (username + password).
- Workers log in and log sales (category, item, price, quantity).
- Owner sees all sales with a running total, and can add stock records when
  a vendor delivers new inventory (category, item, vendor, quantity, cost price).

  ## One-time setup

  1. **Push this folder to your GitHub repo** (the one Cloudflare Pages watches).

  2. **Create a D1 database** (Cloudflare's built-in database — free tier is
     plenty for this). You'll need the `wrangler` CLI once for this step: