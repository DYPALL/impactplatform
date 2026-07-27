import { createFileRoute, Link, Outlet, redirect, useRouterState, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, FolderOpen, Settings, LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoWhite from "@/assets/IMPACT_Logo_white.png.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/auth" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    if (!isAdmin) throw redirect({ to: "/dashboard" });
    return { user: userData.user };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext() as { user: { id: string; email?: string } };
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const router = useRouter();
  const [profileName, setProfileName] = useState<string>("");

  useEffect(() => {
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfileName((data?.full_name as string) || user.email || "Admin"));
  }, [user.id, user.email]);

  const [pendingCount, setPendingCount] = useState<number>(0);
  useEffect(() => {
    supabase
      .from("community_feedback")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .then(({ count }) => setPendingCount(count ?? 0));
  }, [pathname]);

  const items = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, match: (p: string) => p === "/admin" },
    { to: "/admin/resources/new", label: "Resource Hub", icon: FolderOpen, match: (p: string) => p.startsWith("/admin/resources") },
    { to: "/admin", label: "Feedback Moderation", icon: MessageCircle, match: () => false, badge: pendingCount },
    { to: "/admin", label: "Settings", icon: Settings, match: () => false },
  ] as const;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f7]">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-[260px] flex-col bg-[color:var(--impact-purple)] text-white">
        <div className="px-6 pt-7 pb-8">
          <img src={logoWhite.url} alt="IMPACT" className="h-9 w-auto" />
        </div>

        <nav className="flex-1 px-3">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = item.match(pathname);
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={
                      "flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-[14px] font-medium transition " +
                      (active ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10")
                    }
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-[18px] w-[18px]" />
                      {item.label}
                    </span>
                    {"badge" in item && item.badge ? (
                      <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#e84393] px-1.5 text-[11px] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              {profileName.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-[13px] font-bold text-white">{profileName}</p>
              <p className="truncate text-[11px] text-white/60">Administrator</p>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-[260px] flex-1 px-10 py-10">
        <Outlet />
      </main>
    </div>
  );
}
