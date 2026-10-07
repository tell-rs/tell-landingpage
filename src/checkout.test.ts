import { describe, expect, test } from "bun:test";

import {
  BILLING_UNAVAILABLE,
  isCheckoutTier,
  isValidCustomerId,
  isValidSlug,
  resolveCustomerBinding,
  resolveSuccessUrl,
  validateReturnUrl,
} from "./checkout";

const EMAIL = "buyer@example.com";
const CUS = "cus_live123";
const META_ID = "11111111-2222-3333-4444-555555555555";

describe("resolveCustomerBinding (spec 063 F1)", () => {
  test("a resolved Stripe customer locks the email (customer=<id>)", () => {
    // Common path: Stripe renders the email read-only, so there is no
    // editable-email hijack even when no metadata customer_id is present.
    expect(resolveCustomerBinding(CUS, undefined, EMAIL)).toEqual({
      field: "customer",
      value: CUS,
    });
    // A resolved customer wins even when a metadata id is also present.
    expect(resolveCustomerBinding(CUS, META_ID, EMAIL)).toEqual({
      field: "customer",
      value: CUS,
    });
  });

  test("no locked customer but a metadata customer_id degrades to a prefill", () => {
    // Acceptable: the platform binds authoritatively by the metadata id (R-A5),
    // so an editable customer_email prefill cannot redirect the purchase.
    expect(resolveCustomerBinding(null, META_ID, EMAIL)).toEqual({
      field: "customer_email",
      value: EMAIL,
    });
  });

  test("FAILS CLOSED: no locked customer AND no metadata customer_id", () => {
    // The exact fail-closed condition: the only binding signal would be an
    // editable email — never create such a session.
    expect(() => resolveCustomerBinding(null, undefined, EMAIL)).toThrow(
      BILLING_UNAVAILABLE,
    );
    // An empty-string customer id is treated as "not resolved" → still closed.
    expect(() => resolveCustomerBinding("", undefined, EMAIL)).toThrow(
      BILLING_UNAVAILABLE,
    );
  });
});

describe("validateReturnUrl / resolveSuccessUrl (regression guards)", () => {
  const origins = ["https://app.tell.cloud"] as const;

  test("allowlisted origin round-trips; foreign origin is rejected", () => {
    expect(validateReturnUrl("https://app.tell.cloud/x", origins)).toBe(
      "https://app.tell.cloud/x",
    );
    expect(validateReturnUrl("https://evil.example/x", origins)).toBeNull();
  });

  test("rejected-but-present return falls back to the app home", () => {
    expect(
      resolveSuccessUrl(
        "https://evil.example/x",
        origins,
        "https://app.tell.cloud/home",
        "https://tell.dev",
      ),
    ).toBe("https://app.tell.cloud/home");
  });
});

describe("validators", () => {
  test("slug / customer-id / tier validators", () => {
    expect(isValidSlug("acme_ws")).toBe(true);
    expect(isValidSlug("1bad")).toBe(false);
    expect(isValidCustomerId(META_ID)).toBe(true);
    expect(isValidCustomerId("not-a-uuid")).toBe(false);
    expect(isCheckoutTier("pro")).toBe(true);
    expect(isCheckoutTier("enterprise")).toBe(false);
  });
});
