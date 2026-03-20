import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: () => <Navigate to="/legal/privacy" />,
});
