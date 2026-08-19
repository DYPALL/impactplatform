import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Manage your profile — IMPACT" },
      { name: "description", content: "Update your personal details, role, entity, email and password on IMPACT." },
      { property: "og:title", content: "Manage your profile — IMPACT" },
      { property: "og:description", content: "Update your personal details, role, entity, email and password on IMPACT." },
    ],
  }),
  component: ProfilePage,
});

const ROLE_OPTIONS = [
  "Youth councillor",
  "Youth worker",
  "Local authority officer",
  "Elected representative",
  "NGO representative",
  "Researcher",
  "Student",
  "Other",
];

type Profile = {
  first_name: string;
  surname: string;
  council_role: string;
  council_name: string;
  avatar_url: string | null;
};

function ProfilePage() {
  const { user } = Route.useRouteContext() as { user: { id: string; email?: string } };
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile>({
    first_name: "",
    surname: "",
    council_role: "",
    council_name: "",
    avatar_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("first_name, surname, full_name, council_name, council_role, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const parts = (data.full_name || "").trim().split(" ");
          setProfile({
            first_name: data.first_name || parts[0] || "",
            surname: data.surname || parts.slice(1).join(" ") || "",
            council_role: data.council_role || "",
            council_name: data.council_name || "",
            avatar_url: data.avatar_url || null,
          });
        }
        setLoading(false);
      });
  }, [user.id]);

  const update = (field: keyof Profile, value: string) => setProfile((p) => ({ ...p, [field]: value }));

  const handleAvatar = async (file: File) => {
    setUploading(true);
    setMessage(null);
    const ext = file.name.split(".").pop() || "png";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) {
      setUploading(false);
      setMessage({ text: "Could not upload the picture. Please try again.", ok: false });
      return;
    }
    const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    const url = data?.signedUrl ?? null;
    await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
    setProfile((p) => ({ ...p, avatar_url: url }));
    setUploading(false);
    setMessage({ text: "Profile picture updated.", ok: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const fullName = `${profile.first_name} ${profile.surname}`.trim();
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name,
        surname: profile.surname,
        full_name: fullName,
        council_role: profile.council_role,
        council_name: profile.council_name,
      })
      .eq("id", user.id);
    setSaving(false);
    setMessage(
      error
        ? { text: "Could not save your profile. Please try again.", ok: false }
        : { text: "Changes saved successfully.", ok: true },
    );
  };

  const handleEmailChange = async () => {
    if (!newEmail) return;
    setEmailBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setEmailBusy(false);
    setMessage(
      error
        ? { text: error.message, ok: false }
        : { text: "Check your new inbox to confirm the email change.", ok: true },
    );
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) return;
    setPwBusy(true);
    setMessage(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email ?? "",
      password: oldPassword,
    });
    if (signInError) {
      setPwBusy(false);
      setMessage({ text: "Your old password is not correct.", ok: false });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwBusy(false);
    if (error) {
      setMessage({ text: error.message, ok: false });
    } else {
      setOldPassword("");
      setNewPassword("");
      setMessage({ text: "Password updated successfully.", ok: true });
    }
  };

  const displayName = `${profile.first_name} ${profile.surname}`.trim() || user.email || "Your profile";

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <section className="mx-auto max-w-[1120px] px-6 py-10 lg:px-10">
        <BackLink />

        <h1 className="mt-5 text-[32px] font-extrabold leading-tight text-[color:var(--impact-purple)]">
          Manage your profile
        </h1>
        <p className="mt-2 text-[15px] text-[color:var(--impact-ink-muted,#6b7280)]">
          Update your personal details, role, entity, email preferences, and password to keep your IMPACT account secure.
        </p>

        <div className="mt-8 rounded-[28px] bg-white p-7 shadow-[0_2px_14px_rgba(0,0,0,0.05)] lg:p-10">
          {loading ? (
            <p className="py-10 text-center text-[14px] text-[color:var(--impact-ink-muted)]">Loading profile…</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="flex h-[86px] w-[86px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[color:var(--impact-purple)] text-[color:var(--impact-purple)]">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile picture" className="h-full w-full object-cover" />
                  ) : (
                    <User size={38} strokeWidth={1.6} />
                  )}
                </div>
                <div>
                  <p className="text-[17px] font-extrabold text-[color:var(--impact-ink)]">{displayName}</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleAvatar(f);
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="mt-2 inline-flex items-center rounded-full border border-[color:var(--impact-purple)] px-4 py-2 text-[13px] font-bold text-[color:var(--impact-purple)] transition hover:bg-[color:var(--impact-purple)] hover:text-white disabled:opacity-60"
                  >
                    {uploading ? "Uploading…" : "Change profile picture"}
                  </button>
                </div>
              </div>

              <Section title="Name" color="var(--impact-purple)">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="First name / Nickname*" value={profile.first_name} onChange={(v) => update("first_name", v)} />
                  <Field label="Surname*" value={profile.surname} onChange={(v) => update("surname", v)} />
                </div>
              </Section>

              <Section title="Role" color="var(--impact-orange)">
                <label className="text-[13px] font-bold text-[color:var(--impact-ink)]">Change role*</label>
                <select
                  value={profile.council_role}
                  onChange={(e) => update("council_role", e.target.value)}
                  className="mt-2 w-full appearance-none rounded-xl border border-black/10 bg-[#FAFAFB] px-4 py-3 text-[14px] text-[color:var(--impact-ink)] outline-none focus:border-[color:var(--impact-purple)]"
                >
                  <option value="">Select your role</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Section>

              <Section title="Entity" color="var(--impact-green)">
                <Field
                  label="Change entity*"
                  value={profile.council_name}
                  placeholder="Define your entity"
                  onChange={(v) => update("council_name", v)}
                />
              </Section>

              <Section title="Email" color="#E5217F">
                <Field label="Type your previous email*" value={user.email ?? ""} onChange={() => {}} disabled />
                <div className="mt-4">
                  <Field
                    label="Type your new email*"
                    value={newEmail}
                    placeholder="example@gmail.com"
                    onChange={setNewEmail}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleEmailChange}
                  disabled={emailBusy || !newEmail}
                  className="mt-4 inline-flex items-center rounded-full border border-[#E5217F] px-5 py-2.5 text-[13px] font-bold text-[#E5217F] transition hover:bg-[#E5217F] hover:text-white disabled:opacity-50"
                >
                  {emailBusy ? "Sending…" : "Change email"}
                </button>
              </Section>

              <Section title="Password" color="var(--impact-orange)">
                <Field
                  label="Type your old password*"
                  value={oldPassword}
                  placeholder="Your old password here"
                  type="password"
                  onChange={setOldPassword}
                />
                <div className="mt-4">
                  <Field
                    label="Type your new password*"
                    value={newPassword}
                    placeholder="Your new password here"
                    type="password"
                    onChange={setNewPassword}
                  />
                </div>
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={pwBusy || !oldPassword || !newPassword}
                  className="mt-4 inline-flex items-center rounded-full border border-[color:var(--impact-orange)] px-5 py-2.5 text-[13px] font-bold text-[color:var(--impact-orange)] transition hover:bg-[color:var(--impact-orange)] hover:text-white disabled:opacity-50"
                >
                  {pwBusy ? "Updating…" : "Change password"}
                </button>
              </Section>

              {message && (
                <p
                  className={`mt-8 text-center text-[14px] font-semibold ${
                    message.ok ? "text-[color:var(--impact-green)]" : "text-red-500"
                  }`}
                >
                  {message.text}
                </p>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center rounded-full bg-[color:var(--impact-purple)] px-10 py-3.5 text-[14px] font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <BackLink />
        </div>
      </section>
    </div>
  );
}

function BackLink() {
  return (
    <a
      href="/dashboard"
      className="inline-flex items-center gap-2 text-[14px] font-bold text-[color:var(--impact-purple)] hover:underline"
    >
      <ArrowLeft size={17} />
      Back to Dashboard
    </a>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mt-9 border-l-[3px] pl-5" style={{ borderColor: color }}>
      <h2 className="text-[17px] font-extrabold" style={{ color }}>
        {title}
      </h2>
      <div className="mb-1 mt-3 border-b border-black/5" />
      <div className="pt-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-bold text-[color:var(--impact-ink)]">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-black/10 bg-[#FAFAFB] px-4 py-3 text-[14px] text-[color:var(--impact-ink)] outline-none transition focus:border-[color:var(--impact-purple)] disabled:text-[color:var(--impact-ink-muted,#6b7280)]"
      />
    </div>
  );
}
