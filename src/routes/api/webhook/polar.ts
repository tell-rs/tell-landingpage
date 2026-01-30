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
                product_id: order.product_id,
                months: 12,
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
          } catch (err) {
            console.error("Error generating license:", err);
          }
        },

        // When a subscription is created (for recurring billing)
        onSubscriptionActive: async (payload) => {
          console.log("Subscription active:", payload.data.id);
        },

        // When a subscription is canceled, revoke licenses
        onSubscriptionCanceled: async (payload) => {
          const subscription = payload.data;
          const customerEmail = subscription.customer?.email;

          console.log("Subscription canceled:", {
            subscriptionId: subscription.id,
            customerEmail,
          });

          if (!customerEmail) {
            console.error("No customer email on canceled subscription");
            return;
          }

          const apiKey = process.env.PLATFORM_API_KEY;
          if (!apiKey) {
            console.error("PLATFORM_API_KEY not configured");
            return;
          }

          try {
            const res = await fetch(`${config.apiUrl}/api/v1/licenses/revoke`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                email: customerEmail,
              }),
            });

            if (!res.ok) {
              const error = await res.text();
              console.error("Failed to revoke licenses:", error);
              return;
            }

            const result = await res.json();
            console.log("Licenses revoked:", result);
          } catch (err) {
            console.error("Error revoking licenses:", err);
          }
        },
      }),
    },
  },
});
