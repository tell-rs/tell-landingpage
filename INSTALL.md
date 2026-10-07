# Tell Landing Page - Installation

## Vercel Environment Variables

```bash
# tell-platform API (your Hetzner server)
PLATFORM_API_URL=https://platform.tell.rs
PLATFORM_API_KEY=<from tell-platform data/api.key>

# Stripe payments (server-only secret — never in src/config.ts)
STRIPE_SECRET_KEY=<sk_live_... from Stripe → Developers → API keys>

# Stripe price ids. MUST match tell-platform's [[stripe.prices]] table —
# the platform resolves the tier from the price id on the webhook.
STRIPE_PRICE_PRO_MONTHLY=<price_... for Pro, monthly>
STRIPE_PRICE_PRO_YEARLY=<price_... for Pro, annual>

# Optional overrides (defaults shown)
# SITE_URL=https://tell.rs
# CHECKOUT_RETURN_ORIGINS=https://app.tell.rs,https://cloud.tell.rs
```

## Stripe Setup

1. **Create the Pro prices** (Products → Tell Pro)
   - Monthly and annual recurring prices; copy each `price_...` id into the
     env vars above.

2. **Mirror the prices in tell-platform** (`config.toml`):

   ```toml
   [[stripe.prices]]
   id = "price_..."        # = STRIPE_PRICE_PRO_MONTHLY
   tier = "pro"
   interval = "monthly"

   [[stripe.prices]]
   id = "price_..."        # = STRIPE_PRICE_PRO_YEARLY
   tier = "pro"
   interval = "annual"
   ```

3. **Webhook** — configured on tell-platform, NOT here. The landing page only
   creates Checkout sessions; tell-platform consumes
   `checkout.session.completed` / `invoice.paid` directly from Stripe.

## Checkout flow

- `/pricing` Pro CTA → `/upgrade?tier=pro|pro-yearly` → login (magic link)
  → Stripe Checkout → back to `/account?pending=true` (license polling).
- Deep link from the app: `/upgrade?slug=<workspace>&customer=<uuid>&tier=pro&return=<url>`.
  `slug`/`customer` ride the session metadata so the platform upgrades that
  exact workspace; `return` is honored only for allowlisted origins
  (`CHECKOUT_RETURN_ORIGINS`).

## Deploy

```bash
vercel deploy --prod
```
