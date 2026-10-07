import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/security")({
  component: () => <Navigate to="/legal/$slug" params={{ slug: "security" }} />,
});
