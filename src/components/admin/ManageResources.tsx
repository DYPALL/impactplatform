import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AREA_LABEL: Record<string, string> = {
  representativeness: "Representativeness & Inclusion",
  governance: "Governance & Transparency",
  empowerment: "Empowerment & Resources",
  results: "Results & Impact",
  general: "General",
};

const TYPE_LABEL: Record<string, string> = {
  publication: "Publication",
  video: "Video",
  template: "Template",
  session_outline: "Session Outline",
  document: "Document",
};

type AdminResource = {
  id: string;
  title: string;
  resource_type: string;
  area: string;
  created_at: string;
  published: boolean;
  image_url: string | null;
};

export function ManageResources() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [sort, setSort] = useState<"date" | "title">("date");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["admin-resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("id,title,resource_type,area,created_at,published,image_url")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AdminResource[];
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-resources"] });
      qc.invalidateQueries({ queryKey: ["admin-kpis"] });
      qc.invalidateQueries({ queryKey: ["admin-resource-areas"] });
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = resources;
    if (areaFilter !== "all") list = list.filter((r) => r.area === areaFilter);
    if (q) list = list.filter((r) => r.title.toLowerCase().includes(q));
    if (sort === "title") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [resources, search, areaFilter, sort]);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#111827]">
          Manage Resources{" "}
          <span className="ml-1 text-[13px] font-semibold text-[#9ca3af]">
            {resources.length} total
          </span>
        </h2>
        <Link
          to="/admin/resources/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--impact-purple)] px-4 py-2.5 text-[13px] font-bold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add New Resource
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-3 py-2">
          <Search className="h-4 w-4 text-[#9ca3af]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#9ca3af]"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-[#374151]">
          <Filter className="h-4 w-4 text-[#9ca3af]" />
          <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="bg-transparent outline-none">
            <option value="all">All Areas</option>
            {Object.entries(AREA_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-[#374151]">
          Sort by:
          <select value={sort} onChange={(e) => setSort(e.target.value as "date" | "title")} className="bg-transparent outline-none">
            <option value="date">Date Added</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-[#9ca3af]">
              <th className="py-3 pr-4 font-semibold">Cover</th>
              <th className="py-3 pr-4 font-semibold">Title</th>
              <th className="py-3 pr-4 font-semibold">Type</th>
              <th className="py-3 pr-4 font-semibold">Area</th>
              <th className="py-3 pr-4 font-semibold">Date Added</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-[#f1f2f4]">
                <td className="py-3 pr-4">
                  {r.image_url ? (
                    <img
                      src={r.image_url}
                      alt=""
                      className="h-[42px] w-[42px] rounded-md object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-[42px] w-[42px] rounded-md bg-[#eef0f4]" />
                  )}
                </td>
                <td className="py-3 pr-4 font-bold text-[#111827]">{r.title}</td>
                <td className="py-3 pr-4">
                  <span className="rounded-md bg-[#eef0f4] px-2 py-1 text-[11px] font-medium text-[#374151]">
                    {TYPE_LABEL[r.resource_type] ?? r.resource_type}
                  </span>
                </td>
                <td className="py-3 pr-4 text-[#374151]">{AREA_LABEL[r.area] ?? r.area}</td>
                <td className="py-3 pr-4 text-[#6b7280]">
                  {new Date(r.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td className="py-3 pr-4">
                  {r.published ? (
                    <span className="rounded-md bg-[#dcf5f2] px-2 py-1 text-[11px] font-bold text-[#0f766e]">Published</span>
                  ) : (
                    <span className="rounded-md bg-[#fee2e6] px-2 py-1 text-[11px] font-bold text-[#be185d]">Draft</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to="/admin/resources/$id/edit"
                      params={{ id: r.id }}
                      className="rounded-md p-1.5 text-[color:var(--impact-purple)] hover:bg-[#f3f0f8]"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${r.title}"? This cannot be undone.`)) remove.mutate(r.id);
                      }}
                      disabled={remove.isPending}
                      className="rounded-md p-1.5 text-[#e84393] hover:bg-[#fdecf3] disabled:opacity-50"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[13px] text-[#6b7280]">
                  {isLoading ? "Loading resources…" : "No resources match your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
