import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: () => <Navigate to="/legal/$slug" params={{ slug: "terms" }} />,
});
