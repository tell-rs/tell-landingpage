// Magic-link auth server functions (proxy to tell-platform).
// Shared by /login and /upgrade. The PLATFORM_API_KEY stays server-side.

import { createServerFn } from "@tanstack/react-start";
import { config } from "./config";

/** Send a 6-digit login code to `email`. */
export const sendMagicLink = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.PLATFORM_API_KEY;
    if (!apiKey) throw new Error("Server configuration error");

    const res = await fetch(`${config.apiUrl}/api/v1/auth/magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ email: data.email }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Failed to send magic link" }));
      throw new Error(error.error || "Failed to send magic link");
    }

    return res.json();
  });

/** Verify the emailed code; returns access/refresh tokens on success. */
export const verifyCode = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; code: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.PLATFORM_API_KEY;
    if (!apiKey) throw new Error("Server configuration error");

    const res = await fetch(`${config.apiUrl}/api/v1/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ email: data.email, code: data.code }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Invalid code" }));
      throw new Error(error.error || "Invalid code");
    }

    return res.json();
  });
