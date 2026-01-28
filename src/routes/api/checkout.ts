import { Checkout } from "@polar-sh/tanstack-start";
import { createFileRoute } from "@tanstack/react-router";
import { config } from "../../config";

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      GET: Checkout({
        accessToken: process.env.POLAR_ACCESS_TOKEN!,
        successUrl: config.polar.successUrl,
        server: config.polar.server,
      }),
    },
  },
});
