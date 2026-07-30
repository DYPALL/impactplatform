import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Manage Profile — IMPACT" },
      { name: "description", content: "Update your IMPACT profile and council details." },
      { property: "og:title", content: "Manage Profile — IMPACT" },
      { property: "og:description", content: "Update your IMPACT profile and council details." },
    ],
  }),
  component: ProfilePage,
});

type Profile = {
  full_name: string;
  council_name: string;
  country: string;
  city: string;
  council_role: string;
};

function ProfilePage() {
  const { user } = Route.useRouteContext() as { user: { id: string; email?: string } };
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    council_name: "",
    country: "",
    city: "",
    council_role: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase
      .from("profiles")
      .select("full_name, council_name, country, city, council_role")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile({
            full_name: data.full_name || "",
            council_name: data.council_name || "",
            country: data.country || "",
            city: data.city || "",
            council_role: data.council_role || "",
          });
        }
        setLoading(false);
      });
  }, [user.id]);

  const update = (field: keyof Profile, value: string) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        council_name: profile.council_name,
        country: profile.country,
        city: profile.city,
        council_role: profile.council_role,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      setMessage("Could not save profile. Please try again.");
    } else {
      setMessage("Profile saved successfully.");
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--impact-surface-muted,#f4f7f7)]">
      <section className="bg-[color:var(--impact-purple)] pb-12 pt-8">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center px-6 text-center lg:px-12">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/25 text-white">
            <User size={32} strokeWidth={1.5} />
          </div>
          <h1 className="mt-5 text-[26px] font-extrabold leading-tight text-white">
            Manage Profile
          </h1>
          <p className="mt-1 text-[14px] text-white/75">Update your details and council information.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[720px] px-6 py-12 lg:px-12">
        <a
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[color:var(--impact-purple)] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to My Assessments
        </a>

        {loading ? (
          <p className="text-center text-[14px] text-[color:var(--impact-ink-muted)]">Loading profile…</p>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Full name" value={profile.full_name} onChange={(v) => update("full_name", v)} />
              <Field label="Council / organisation name" value={profile.council_name} onChange={(v) => update("council_name", v)} />
              <Field label="Country" value={profile.country} onChange={(v) => update("country", v)} />
              <Field label="City" value={profile.city} onChange={(v) => update("city", v)} />
              <div className="md:col-span-2">
                <Field label="Role in the council" value={profile.council_role} onChange={(v) => update("council_role", v)} />
              </div>
            </div>

            {message && (
              <p className={`mt-6 text-center text-[14px] font-medium ${message.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
                {message}
              </p>
            )}

            <div className="mt-8 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--impact-purple)] px-6 py-3 text-[14px] font-bold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Saving…" : "Save profile"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-semibold text-[color:var(--impact-ink)]">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-black/10 bg-[color:var(--impact-surface-muted,#f4f7f7)] px-4 py-3 text-[14px] text-[color:var(--impact-ink)] outline-none focus:border-[color:var(--impact-purple)] focus:ring-2 focus:ring-[color:var(--impact-purple)]/20"
      />
    </div>
  );
}
