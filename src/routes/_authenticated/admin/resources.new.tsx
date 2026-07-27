import { createFileRoute } from "@tanstack/react-router";
import { ResourceForm } from "@/components/admin/ResourceForm";

export const Route = createFileRoute("/_authenticated/admin/resources/new")({
  head: () => ({
    meta: [
      { title: "Add New Resource — IMPACT Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ResourceForm mode="create" />,
});
