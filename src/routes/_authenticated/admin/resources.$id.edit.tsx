import { createFileRoute } from "@tanstack/react-router";
import { ResourceForm } from "@/components/admin/ResourceForm";

export const Route = createFileRoute("/_authenticated/admin/resources/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Resource — IMPACT Admin" },
      { name: "description", content: "Update resource details in the IMPACT Resource Hub." },
      { property: "og:title", content: "Edit Resource — IMPACT Admin" },
      { property: "og:description", content: "Update resource details in the IMPACT Resource Hub." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  return <ResourceForm mode="edit" resourceId={id} />;
}
