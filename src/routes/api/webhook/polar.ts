import { Webhooks } from "@polar-sh/tanstack-start";
import { createFileRoute } from "@tanstack/react-router";
import { config } from "../../../config";

export const Route = createFileRoute("/api/webhook/polar")({
  server: {
    handlers: {
      POST: Webhooks({
        webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

        // When an order is paid, generate a license
        onOrderPaid: async (payload) => {
          const order = payload.data;
          const customer = order.customer;

          console.log("Order paid:", {
            orderId: order.id,
            customerEmail: customer.email,
            productId: order.product_id,
          });

          // Call tell-platform to generate license
          const apiKey = process.env.PLATFORM_API_KEY;
          if (!apiKey) {
            console.error("PLATFORM_API_KEY not configured");
            return;
          }

          try {
            const res = await fetch(`${config.apiUrl}/api/v1/licenses`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                email: customer.email,
                customer_name: customer.name || customer.email.split("@")[0],
                company_name: customer.organization?.name || customer.name,
                tier: "pro", // Polar purchases are Pro tier
                months: 12, // 1 year license
              }),
            });

            if (!res.ok) {
              const error = await res.text();
              console.error("Failed to generate license:", error);
              return;
            }

            const license = await res.json();
            console.log("License generated:", {
              customerId: license.customer_id,
              tier: license.tier,
              expires: license.expires,
            });

            // License key is now stored - user can view it in their account
            // The key is returned in the response but we don't email it (security)
          } catch (err) {
            console.error("Error generating license:", err);
          }
        },

        // When a subscription is created (for recurring billing)
        onSubscriptionActive: async (payload) => {
          console.log("Subscription active:", payload.data.id);
          // Could extend license validity here
        },

        // When a subscription is canceled
        onSubscriptionCanceled: async (payload) => {
          console.log("Subscription canceled:", payload.data.id);
          // License continues until expiry, no action needed
        },
      }),
    },
  },
});
