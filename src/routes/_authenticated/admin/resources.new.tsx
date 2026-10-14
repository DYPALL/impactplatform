import { createFileRoute } from "@tanstack/react-router";
import { ResourceForm } from "@/components/admin/ResourceForm";

export const Route = createFileRoute("/_authenticated/admin/resources/new")({
  head: () => ({
    meta: [
      { title: "Add New Resource — IMPACT Admin" },
      { name: "description", content: "Add a publication, video or template to the IMPACT Resource Hub." },
      { property: "og:title", content: "Add New Resource — IMPACT Admin" },
      { property: "og:description", content: "Add a publication, video or template to the IMPACT Resource Hub." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ResourceForm mode="create" />,
});
