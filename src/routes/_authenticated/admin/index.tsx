import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, Pencil, Trash2, Users, ClipboardCheck, Activity, ListChecks, ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — IMPACT" },
      { name: "description", content: "Manage resources and monitor platform metrics." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

type Period = "3d" | "7d" | "30d" | "2m" | "3m" | "1y" | "custom";
const PERIODS: { key: Period; label: string }[] = [
  { key: "3d", label: "3 Days" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "2m", label: "2 Months" },
  { key: "3m", label: "3 Months" },
  { key: "1y", label: "Yearly" },
  { key: "custom", label: "Custom" },
];

const AREA_COLORS: Record<string, string> = {
  representativeness: "#502181",
  governance: "#f4a261",
  empowerment: "#e84393",
  results: "#219c9e",
  general: "#94a3b8",
};

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

function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  positive = true,
}: {
  label: string;
  value: string | number;
  delta: string;
  icon: React.ComponentType<{ className?: string }>;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-[#6b7280]">{label}</p>
        <Icon className="h-4 w-4 text-[#9ca3af]" />
      </div>
      <p className="mt-3 text-[34px] font-extrabold leading-none text-[#111827]">{value}</p>
      <p className={"mt-3 text-[12px] font-semibold " + (positive ? "text-[#219c9e]" : "text-[#e84393]")}>
        {positive ? "↗" : "↘"} {delta}
      </p>
    </div>
  );
}

function AdminDashboard() {
  const [period, setPeriod] = useState<Period>("30d");

  const { data: kpis } = useQuery({
    queryKey: ["admin-kpis"],
    queryFn: async () => {
      const [{ count: accounts }, { count: resourcesCount }] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("resources").select("id", { count: "exact", head: true }),
      ]);
      return {
        accounts: accounts ?? 0,
        resources: resourcesCount ?? 0,
      };
    },
  });

  const { data: signupSeries } = useQuery({
    queryKey: ["admin-signup-series"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("created_at")
        .order("created_at", { ascending: true });
      const buckets: Record<string, number> = {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets[months[d.getMonth()]] = 0;
      }
      (data ?? []).forEach((row) => {
        const d = new Date(row.created_at);
        const key = months[d.getMonth()];
        if (key in buckets) buckets[key]++;
      });
      const colors = ["#502181", "#219c9e", "#e84393", "#f4a261", "#502181", "#219c9e"];
      return Object.entries(buckets).map(([name, value], i) => ({ name, value, fill: colors[i % colors.length] }));
    },
  });

  const { data: resourceAreaSlices } = useQuery({
    queryKey: ["admin-resource-areas"],
    queryFn: async () => {
      const { data } = await supabase.from("resources").select("area");
      const counts: Record<string, number> = {};
      (data ?? []).forEach((r) => {
        counts[r.area] = (counts[r.area] ?? 0) + 1;
      });
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      return {
        total,
        slices: Object.entries(counts).map(([area, count]) => ({
          area,
          count,
          pct: total ? Math.round((count / total) * 100) : 0,
          color: AREA_COLORS[area] ?? "#94a3b8",
          label: AREA_LABEL[area] ?? area,
        })),
      };
    },
  });

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-extrabold text-[#111827]">Admin Dashboard</h1>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-[#f5f5f7]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[13px] font-medium text-[#6b7280]">Period:</span>
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={
              "rounded-full px-4 py-1.5 text-[13px] font-medium transition " +
              (period === p.key
                ? "bg-[color:var(--impact-purple)] text-white"
                : "bg-white text-[#6b7280] hover:bg-[#eef0f4]")
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Accounts" value={kpis?.accounts ?? "—"} delta="live from database" icon={Users} />
        <KpiCard label="Questionnaires Completed" value={0} delta="feature coming soon" icon={ClipboardCheck} positive={false} />
        <KpiCard label="Total Resources" value={kpis?.resources ?? "—"} delta="published + drafts" icon={Activity} />
        <KpiCard label="Action Plans Created" value={0} delta="feature coming soon" icon={ListChecks} positive={false} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-bold text-[#111827]">Signups Over Time</h3>
          <div className="mt-6 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signupSeries ?? []}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip cursor={{ fill: "rgba(80,33,129,0.04)" }} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-bold text-[#111827]">Resources by Area</h3>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-[160px] w-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceAreaSlices?.slices ?? []}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={2}
                  >
                    {(resourceAreaSlices?.slices ?? []).map((s) => (
                      <Cell key={s.area} fill={s.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[22px] font-extrabold text-[#111827]">{resourceAreaSlices?.total ?? 0}</span>
                <span className="text-[10px] text-[#6b7280]">Total</span>
              </div>
            </div>
            <ul className="flex-1 space-y-2">
              {(resourceAreaSlices?.slices ?? []).map((s) => (
                <li key={s.area} className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-2 truncate text-[#374151]">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="truncate">{s.label}</span>
                  </span>
                  <span className="font-bold text-[#111827]">{s.pct}%</span>
                </li>
              ))}
              {(resourceAreaSlices?.slices ?? []).length === 0 && (
                <li className="text-[12px] text-[#6b7280]">No resources yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <ManageResources />
    </div>
  );
}

type AdminResource = {
  id: string;
  title: string;
  resource_type: string;
  area: string;
  created_at: string;
  published: boolean;
};

function ManageResources() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [sort, setSort] = useState<"date" | "title">("date");

  const { data: resources = [] } = useQuery({
    queryKey: ["admin-resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("id,title,resource_type,area,created_at,published")
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
    <section className="mt-8 rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#111827]">Manage Resources</h2>
        <Link
          to="/admin/resources/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--impact-purple)] px-4 py-2.5 text-[13px] font-bold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add New Resource
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 min-w-[260px]">
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
              <th className="py-3 pr-4 font-semibold">Title</th>
              <th className="py-3 pr-4 font-semibold">Type</th>
              <th className="py-3 pr-4 font-semibold">Area</th>
              <th className="py-3 pr-4 font-semibold">Date Added</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-[#f1f2f4]">
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
                      className="rounded-md p-1.5 text-[#e84393] hover:bg-[#fdecf3]"
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
                <td colSpan={6} className="py-8 text-center text-[13px] text-[#6b7280]">
                  No resources match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

