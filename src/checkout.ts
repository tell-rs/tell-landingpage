// Stripe Checkout session creation (spec 060; hardened in spec 063 R-D1/R-D4).
//
// The landing page creates the session; tell-platform consumes the webhook
// directly from Stripe (spec 059) — there is no webhook here. The session
// carries `metadata { customer_id?, slug? }` naming the workspace the purchase
// targets, and the SAME keys are copied into `subscription_data.metadata` so
// renewals (invoice.paid) resolve the same target from the subscription.
//
// Spec 063 hardening (all server-side, defense-in-depth backstop to the UI
// guard in upgrade.tsx):
//   - C1: never create a SECOND subscription for a customer who already has an
//     active one — re-check `/me.has_billing` and redirect to the portal.
//   - M6: bind the Stripe `customer` server-side (resolve/create by the authed
//     `/me` email) instead of an editable `customer_email` prefill, so the
//     buyer cannot rebind the purchase to a different account. The platform
//     (R-A5) treats the metadata `customer_id` / bound `customer` as
//     authoritative and `customer_details.email` as advisory only.
//   - H1: unknown/enterprise tiers never reach here as a Pro checkout — the
//     caller (upgrade.tsx) routes them to `/contact`; this handler still
//     rejects a non-sellable tier.
//
// Secrets: STRIPE_SECRET_KEY is read only inside the server function handler —
// it never reaches config.ts or a client bundle. Price ids (non-secret) come
// from env and MUST match tell-platform's [[stripe.prices]] table.

import { createServerFn } from "@tanstack/react-start";
import { config } from "./config";

/** Checkout tiers the landing page can sell. Maps to a price-id env var. */
export const CHECKOUT_TIERS = ["pro", "pro-yearly"] as const;
export type CheckoutTier = (typeof CHECKOUT_TIERS)[number];

// Workspace slug rule (spec 059 / tell-rs is_valid_workspace_name):
// ASCII alphanumeric + underscore, leading ASCII letter, max 64 chars.
const SLUG_RE = /^[A-Za-z][A-Za-z0-9_]{0,63}$/;
// tell-platform customer ids are UUIDs. Resolved server-side from the authed
// `/me` session (spec 063 R-D1 L6) — never taken from a client-supplied param.
const UUID_RE =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/** Whether `value` is a well-formed workspace slug. */
export function isValidSlug(value: string): boolean {
  return SLUG_RE.test(value);
}

/** Whether `value` is a well-formed tell-platform customer id (UUID). */
export function isValidCustomerId(value: string): boolean {
  return UUID_RE.test(value);
}

/** Whether `value` names a sellable checkout tier. */
export function isCheckoutTier(value: string): value is CheckoutTier {
  return (CHECKOUT_TIERS as readonly string[]).includes(value);
}

/**
 * Validate a post-payment `return` target against the origin allowlist
 * (open-redirect guard). Accepts only an absolute http(s) URL whose exact
 * origin is allowlisted; anything else returns null and the caller falls back
 * to a safe default (see resolveSuccessUrl).
 */
export function validateReturnUrl(
  candidate: string | undefined,
  allowedOrigins: readonly string[],
): string | null {
  if (!candidate) return null;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!allowedOrigins.includes(url.origin)) return null;
  return url.toString();
}

/**
 * Resolve the Stripe `success_url` (spec 063 R-D4). Order:
 *   1. The supplied `return` target, if its origin is allowlisted (round-trips
 *      the buyer back to the exact app view they started from).
 *   2. A supplied-but-rejected `return` (present but not allowlisted — a
 *      misconfigured or newly-added app origin) falls back to the app's home
 *      (`config.appReturnUrl`) rather than the landing site's `/account`, so
 *      an app-initiated purchase never strands the buyer at a foreign session's
 *      login wall.
 *   3. No `return` at all (a landing-native `/upgrade` flow) lands on the
 *      landing account page in its pending/provisioning state.
 * The exact-match open-redirect guard is never weakened — an attacker origin is
 * still rejected at step 1 and routed to the trusted step-2/3 fallback.
 */
export function resolveSuccessUrl(
  returnUrl: string | undefined,
  allowedOrigins: readonly string[],
  appReturnUrl: string,
  siteUrl: string,
): string {
  const allowed = validateReturnUrl(returnUrl, allowedOrigins);
  if (allowed) return allowed;
  if (returnUrl) return appReturnUrl;
  return `${siteUrl}/account?pending=true`;
}

/** Env-configured Stripe price id for a tier; empty/undefined when unset. */
function priceIdFor(tier: CheckoutTier): string | undefined {
  const byTier: Record<CheckoutTier, string | undefined> = {
    pro: process.env.STRIPE_PRICE_PRO_MONTHLY,
    "pro-yearly": process.env.STRIPE_PRICE_PRO_YEARLY,
  };
  const id = byTier[tier]?.trim();
  return id ? id : undefined;
}

/** Shape of the fields this module reads from the platform `/me` profile. */
type MeProfile = {
  email: string;
  has_billing?: boolean;
  customer_id?: string | null;
};

/** Fetch the authed profile from tell-platform; throws on a stale token. */
async function fetchProfile(accessToken: string): Promise<MeProfile> {
  const res = await fetch(`${config.apiUrl}/api/v1/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 401) throw new Error("Session expired");
  if (!res.ok) throw new Error("Failed to load profile");
  return (await res.json()) as MeProfile;
}

/**
 * Mint a Stripe customer-portal session for the authed caller via the platform
 * (spec 062 own-customer-only resolution — the customer is resolved by the
 * bearer, never a client id). Returns the hosted URL, or null when the platform
 * returns a url-less/failed response. Throws on a stale token so the caller can
 * re-auth.
 */
async function mintPortalUrl(accessToken: string): Promise<string | null> {
  const res = await fetch(`${config.apiUrl}/api/v1/me/billing/portal`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ return_url: `${config.siteUrl}/account` }),
  });
  if (res.status === 401) throw new Error("Session expired");
  if (!res.ok) return null;
  const body = (await res.json().catch(() => ({}))) as { url?: string };
  return body.url ?? null;
}

/**
 * Resolve (or create) the Stripe customer for the authed email so checkout can
 * bind `customer=<id>` server-side (spec 063 R-D1 M6). Own-email only — the
 * email comes from the platform `/me` session, never from the client. Returns
 * null when Stripe is unreachable; the caller then degrades to a
 * `customer_email` prefill ONLY when an authoritative metadata `customer_id` is
 * present (the platform still binds by it per R-A5), and otherwise fails closed
 * (spec 063 F1 — see {@link resolveCustomerBinding}).
 */
async function resolveStripeCustomer(
  secretKey: string,
  email: string,
): Promise<string | null> {
  const listRes = await fetch(
    `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`,
    { headers: { Authorization: `Bearer ${secretKey}` } },
  );
  if (listRes.ok) {
    const body = (await listRes.json().catch(() => ({}))) as {
      data?: { id?: string }[];
    };
    const existing = body.data?.[0]?.id;
    if (existing) return existing;
  }
  const createRes = await fetch("https://api.stripe.com/v1/customers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ email }).toString(),
  });
  if (!createRes.ok) return null;
  const created = (await createRes.json().catch(() => ({}))) as { id?: string };
  return created.id ?? null;
}

/**
 * How a checkout session binds its buyer identity to Stripe: either a locked
 * `customer` id (email uneditable at checkout) or an editable `customer_email`
 * prefill.
 */
export type CustomerBinding =
  | { field: "customer"; value: string }
  | { field: "customer_email"; value: string };

/** Thrown by {@link resolveCustomerBinding} when checkout must fail closed. */
export const BILLING_UNAVAILABLE =
  "Billing is temporarily unavailable. Please try again in a moment.";

/**
 * Decide the buyer-identity binding for a checkout session (spec 063 F1 —
 * fail-closed re-check). Precedence:
 *   1. A resolved Stripe customer → `customer=<id>`; Stripe renders the email
 *      read-only, so it cannot be edited to redirect the purchase.
 *   2. Else an authoritative server-set metadata `customer_id` → an editable
 *      `customer_email` prefill is safe: tell-platform binds by that metadata id
 *      (R-A5), never by the typed email.
 *   3. Else FAIL CLOSED: with neither a locked Stripe customer NOR a metadata
 *      customer_id, the ONLY binding signal would be an editable email — which a
 *      buyer could edit at Stripe to a victim whose platform account has no
 *      Stripe customer yet (the F1 own-customer-only violation). Throw a
 *      retryable error instead of creating such a session.
 */
export function resolveCustomerBinding(
  stripeCustomerId: string | null,
  metadataCustomerId: string | undefined,
  email: string,
): CustomerBinding {
  if (stripeCustomerId) return { field: "customer", value: stripeCustomerId };
  if (metadataCustomerId) return { field: "customer_email", value: email };
  throw new Error(BILLING_UNAVAILABLE);
}

type CheckoutInput = {
  accessToken: string;
  tier?: string;
  slug?: string;
  returnUrl?: string;
};

/** Result of a checkout attempt. `redirect:"manage"` means the caller already
 * has an active subscription and must be sent to `url` (the customer portal)
 * instead of a fresh checkout; `url` may be null if the portal could not be
 * minted, in which case the caller falls back to the account page. */
export type CheckoutResult = { url: string | null; redirect?: "manage" };

/**
 * Billing-status probe for the UI guard (spec 063 R-D1 C1). Lets upgrade.tsx
 * decide, before starting checkout, whether the caller is already subscribed.
 */
export const getBillingStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { accessToken: string }) => input)
  .handler(async ({ data }): Promise<{ has_billing: boolean }> => {
    const profile = await fetchProfile(data.accessToken);
    return { has_billing: profile.has_billing === true };
  });

/**
 * Mint a customer-portal session for the authed caller (spec 062 / 063 R-D1).
 * Used by upgrade.tsx to divert an already-subscribed customer to "Manage"
 * instead of a second checkout. Returns a possibly-null url so the caller can
 * fall back to the account page.
 */
export const openCustomerPortal = createServerFn({ method: "POST" })
  .inputValidator((input: { accessToken: string }) => input)
  .handler(async ({ data }): Promise<{ url: string | null }> => {
    return { url: await mintPortalUrl(data.accessToken) };
  });

/**
 * Create a Stripe Checkout session for the logged-in user and return its
 * hosted URL. The purchase binds to the authenticated session's Stripe customer
 * (resolved server-side from `/me`), never a caller-supplied address. If the
 * caller already holds an active subscription, NO new session is created —
 * `redirect:"manage"` is returned with a portal url instead (spec 063 R-D1 C1).
 */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((input: CheckoutInput) => input)
  .handler(async ({ data }): Promise<CheckoutResult> => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) throw new Error("Payments are not configured");

    // H1: only a sellable self-serve tier reaches checkout. An unknown or
    // enterprise tier is NOT silently coerced to Pro — the caller routes those
    // to /contact; here we hard-reject anything not sellable.
    if (!data.tier || !isCheckoutTier(data.tier)) {
      throw new Error("This plan is not available for self-serve checkout");
    }
    const tier = data.tier;
    const priceId = priceIdFor(tier);
    if (!priceId) throw new Error("This plan is not available for checkout");

    // Resolve the authenticated user's profile — binds the purchase to the
    // logged-in account and rejects stale tokens before touching Stripe.
    const profile = await fetchProfile(data.accessToken);

    // C1 authoritative backstop: never create a second subscription for a
    // customer who already has an active one. Divert to the portal instead.
    if (profile.has_billing === true) {
      const portalUrl = await mintPortalUrl(data.accessToken);
      return { url: portalUrl, redirect: "manage" };
    }

    // Defense in depth: drop malformed metadata (the platform re-validates
    // slug ownership server-side either way — spec 059 R3). The customer id is
    // resolved from the authed session, never a client param (spec 063 L6).
    const slug = data.slug && isValidSlug(data.slug) ? data.slug : undefined;
    const customerId =
      profile.customer_id && isValidCustomerId(profile.customer_id)
        ? profile.customer_id
        : undefined;

    const successUrl = resolveSuccessUrl(
      data.returnUrl,
      config.checkoutReturnOrigins,
      config.appReturnUrl,
      config.siteUrl,
    );

    const params = new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: successUrl,
      cancel_url: `${config.siteUrl}/pricing`,
    });
    // M6/F1: bind a concrete Stripe customer so the email is locked at checkout
    // and cannot be edited to redirect the purchase. Degrade to an editable
    // prefill ONLY when an authoritative metadata customer_id is present (the
    // platform still binds by it — R-A5). With neither a locked customer nor a
    // metadata customer_id, resolveCustomerBinding FAILS CLOSED (throws the
    // retryable BILLING_UNAVAILABLE) rather than ship an editable-email-only
    // session a buyer could redirect to a victim.
    const stripeCustomerId = await resolveStripeCustomer(secretKey, profile.email);
    const binding = resolveCustomerBinding(stripeCustomerId, customerId, profile.email);
    params.set(binding.field, binding.value);
    // Spec 059 contract: the SAME keys go on the session metadata (checkout
    // completion) and the subscription metadata (renewals via invoice.paid).
    if (slug) {
      params.set("metadata[slug]", slug);
      params.set("subscription_data[metadata][slug]", slug);
    }
    if (customerId) {
      params.set("metadata[customer_id]", customerId);
      params.set("subscription_data[metadata][customer_id]", customerId);
    }

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Stripe checkout session creation failed:", res.status, body);
      throw new Error("Could not start checkout. Please try again.");
    }
    const session = (await res.json()) as { url?: string };
    if (!session.url) throw new Error("Could not start checkout. Please try again.");
    return { url: session.url };
  });
