// Configuration for tell-landingpage
// This is safe to commit - no secrets here
// Secrets (STRIPE_SECRET_KEY, PLATFORM_API_KEY) are in environment variables
// (set in Vercel dashboard) and read only inside server functions.

export const config = {
  // tell-platform API URL
  apiUrl: process.env.PLATFORM_API_URL || "http://localhost:3001",

  // Public origin of this site, used to build absolute Stripe return URLs.
  siteUrl: process.env.SITE_URL || "https://tell.rs",

  // Origins the post-payment `return` param may point at (open-redirect
  // guard for /upgrade, spec 062 / 063 R-D4). EXACT-origin match — an origin
  // that is not byte-identical to one of these is rejected. The default set
  // MUST list every real app origin that starts a checkout (`app.tell.rs`,
  // `cloud.tell.rs`); add more via the comma-separated `CHECKOUT_RETURN_ORIGINS`
  // env override (e.g. a preview/staging app origin). Widening this list is the
  // only supported way to accept a new return origin — the guard never accepts
  // an arbitrary origin.
  checkoutReturnOrigins: (
    process.env.CHECKOUT_RETURN_ORIGINS || "https://app.tell.rs,https://cloud.tell.rs"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // Safe fallback destination when a checkout was started from the app but the
  // supplied `return` origin did not match the allowlist above (misconfigured
  // or newly-added app origin). Returning here keeps the buyer in the app
  // rather than stranding them on the landing site's `/account` — a different
  // session that would bounce them to `/login` (spec 063 R-D4). This is a
  // trusted, operator-configured destination, NOT a caller-supplied value, so
  // it does not weaken the exact-match open-redirect guard.
  appReturnUrl: process.env.APP_RETURN_URL || "https://app.tell.rs",
};
