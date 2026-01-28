# Tell Landing Page - Installation

## Vercel Environment Variables

```bash
# tell-platform API (your Hetzner server)
PLATFORM_API_URL=https://platform.tell.rs
PLATFORM_API_KEY=<from tell-platform data/api.key>

# Polar.sh payments
POLAR_ACCESS_TOKEN=<from Polar → Settings → Access Tokens>
POLAR_WEBHOOK_SECRET=<from Polar → Webhooks>
```

## Polar Dashboard Setup

1. **Create Access Token**
   - Go to: Settings → Access Tokens → Create
   - Scopes: `checkouts:write`
   - Expiration: Pick longest available

2. **Create Product**
   - Name: "Tell Pro"
   - Price: $299/month (subscription)
   - Copy product ID → already in `src/config.ts`

3. **Create Webhook**
   - URL: `https://tell.rs/api/webhook/polar`
   - Events: `order.paid`
   - Copy secret → `POLAR_WEBHOOK_SECRET`

## Deploy

```bash
vercel deploy --prod
```
