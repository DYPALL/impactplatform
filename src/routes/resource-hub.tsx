import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/resource-hub")({
  component: ResourceHubLayout,
});

// The hub list renders at /resource-hub and each resource's own page renders at
// /resource-hub/$id, so this layout must hand the matched child route to <Outlet />.
function ResourceHubLayout() {
  return <Outlet />;
}
