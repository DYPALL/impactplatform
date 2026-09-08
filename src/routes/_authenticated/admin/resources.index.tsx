import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ManageResources } from "@/components/admin/ManageResources";

export const Route = createFileRoute("/_authenticated/admin/resources/")({
  head: () => ({
    meta: [
      { title: "Manage Resources — IMPACT Admin" },
      { name: "description", content: "Review, edit and delete published resources in the IMPACT library." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Manage Resources — IMPACT Admin" },
      { property: "og:description", content: "Review, edit and delete published resources in the IMPACT library." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminResourcesPage,
});

function AdminResourcesPage() {
  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[32px] font-extrabold text-[#111827]">Resources</h1>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-[#f5f5f7]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </Link>
      </div>
      <ManageResources />
    </div>
  );
}
