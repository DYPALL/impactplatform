import { Link, useNavigate } from "@tanstack/react-router";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UploadCloud, X, ChevronRight, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ResourceType = "publication" | "video" | "template" | "session_outline" | "document";
type ResourceArea = "representativeness" | "governance" | "empowerment" | "results" | "general";

const AREAS: { key: ResourceArea; label: string }[] = [
  { key: "representativeness", label: "Representativeness & Inclusion" },
  { key: "governance", label: "Governance & Transparency" },
  { key: "empowerment", label: "Empowerment & Resources" },
  { key: "results", label: "Results & Impact" },
  { key: "general", label: "General" },
];

const TYPES: { key: ResourceType; label: string }[] = [
  { key: "publication", label: "Publication" },
  { key: "video", label: "Video" },
  { key: "template", label: "Template" },
  { key: "session_outline", label: "Session Outline" },
  { key: "document", label: "Document" },
];

export function ResourceForm({ mode, resourceId }: { mode: "create" | "edit"; resourceId?: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [area, setArea] = useState<ResourceArea | "">("");
  const [type, setType] = useState<ResourceType | "">("");
  const [topics, setTopics] = useState<string[]>([]);
  const [topicDraft, setTopicDraft] = useState("");
  const [publicationDate, setPublicationDate] = useState<string>("");
  const [url, setUrl] = useState("");
  const [published, setPublished] = useState(true);

  useQuery({
    queryKey: ["resource-edit", resourceId],
    enabled: mode === "edit" && !!resourceId,
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("*").eq("id", resourceId!).maybeSingle();
      if (error) throw error;
      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setImageUrl(data.image_url);
        setArea(data.area as ResourceArea);
        setType(data.resource_type as ResourceType);
        setTopics((data.topics as string[]) ?? []);
        setPublicationDate(data.publication_date ?? "");
        setUrl(data.url ?? "");
        setPublished(data.published);
      }
      return data;
    },
  });

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("resource-images").upload(path, file, {
        contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data: signed, error: signErr } = await supabase.storage
        .from("resource-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signErr) throw signErr;
      setImageUrl(signed.signedUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function addTopic(value?: string) {
    const v = (value ?? topicDraft).trim();
    if (!v) return;
    if (!topics.includes(v)) setTopics([...topics, v]);
    setTopicDraft("");
  }

  async function handleSubmit(e: FormEvent, publish: boolean) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !description.trim() || !area || !type) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      image_url: imageUrl,
      area,
      resource_type: type,
      topics,
      publication_date: publicationDate || null,
      url: url.trim() || null,
      published: publish,
    };
    try {
      if (mode === "create") {
        const { error } = await supabase.from("resources").insert(payload);
        if (error) throw error;
      } else if (resourceId) {
        const { error } = await supabase.from("resources").update(payload).eq("id", resourceId);
        if (error) throw error;
      }
      qc.invalidateQueries({ queryKey: ["admin-resources"] });
      qc.invalidateQueries({ queryKey: ["admin-kpis"] });
      qc.invalidateQueries({ queryKey: ["admin-resource-areas"] });
      qc.invalidateQueries({ queryKey: ["resources"] });
      navigate({ to: "/admin" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const labelClass = "block text-[13px] font-bold text-[#111827]";
  const requiredMark = <span className="text-[#e84393]">*</span>;
  const inputClass =
    "mt-2 w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[color:var(--impact-purple)] focus:ring-2 focus:ring-[color:var(--impact-purple)]/15";

  return (
    <div className="mx-auto max-w-[1100px]">
      <nav className="flex items-center gap-2 text-[13px]">
        <Link to="/admin" className="font-bold text-[color:var(--impact-purple)] hover:underline">
          Resource Hub
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#9ca3af]" />
        <span className="text-[#6b7280]">{mode === "create" ? "Add New Resource" : "Edit Resource"}</span>
      </nav>
      <h1 className="mt-2 text-[32px] font-extrabold text-[#111827]">
        {mode === "create" ? "Add New Resource" : "Edit Resource"}
      </h1>

      <form onSubmit={(e) => handleSubmit(e, published)} className="mt-6 rounded-2xl bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Resource Title {requiredMark}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Youth Advocacy & Governance Handbook"
              className={inputClass}
              maxLength={200}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description {requiredMark}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed summary of what this resource covers, who it is for, and how to utilize it..."
              rows={5}
              maxLength={2000}
              required
              className={inputClass + " resize-y"}
            />
          </div>

          <div>
            <label className={labelClass}>Featured Resource Image</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e5e7eb] bg-[#fafbfc] px-6 py-10 text-center transition hover:border-[color:var(--impact-purple)]"
            >
              {imageUrl ? (
                <div className="relative">
                  <img src={imageUrl} alt="Featured" className="max-h-[180px] rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl(null);
                    }}
                    className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow-md"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5 text-[#e84393]" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--impact-purple)]/10 text-[color:var(--impact-purple)]">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-[14px] font-bold text-[#111827]">
                    {uploading ? "Uploading…" : "Drag and drop an image or click to browse"}
                  </p>
                  <p className="mt-1 text-[12px] text-[#9ca3af]">Supported formats: PNG, JPG (Max size: 10MB)</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Area {requiredMark}</label>
              <select value={area} onChange={(e) => setArea(e.target.value as ResourceArea)} required className={inputClass}>
                <option value="">Select area</option>
                {AREAS.map((a) => (
                  <option key={a.key} value={a.key}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Type {requiredMark}</label>
              <select value={type} onChange={(e) => setType(e.target.value as ResourceType)} required className={inputClass}>
                <option value="">Select type</option>
                {TYPES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Topic {requiredMark}</label>
              <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-3 py-2">
                {topics.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-[color:var(--impact-purple)]/10 px-2.5 py-1 text-[12px] font-bold text-[color:var(--impact-purple)]"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => setTopics(topics.filter((x) => x !== t))}
                      aria-label={`Remove ${t}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  value={topicDraft}
                  onChange={(e) => setTopicDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTopic();
                    }
                  }}
                  onBlur={() => topicDraft && addTopic()}
                  placeholder={topics.length ? "Add more..." : "Add a topic..."}
                  className="flex-1 min-w-[120px] bg-transparent py-1 text-[13px] outline-none placeholder:text-[#9ca3af]"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Publication Date</label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="date"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  className={inputClass + " pl-10"}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>External URL (optional)</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Status {requiredMark}</label>
            <div className="mt-2 flex items-center gap-6">
              <label className="flex items-center gap-2 text-[13px] text-[#374151]">
                <input
                  type="radio"
                  name="status"
                  checked={!published}
                  onChange={() => setPublished(false)}
                  className="accent-[color:var(--impact-purple)]"
                />
                Draft
              </label>
              <label className="flex items-center gap-2 text-[13px] text-[#374151]">
                <input
                  type="radio"
                  name="status"
                  checked={published}
                  onChange={() => setPublished(true)}
                  className="accent-[color:var(--impact-purple)]"
                />
                Published
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-[#fdecf3] px-4 py-3 text-[13px] font-medium text-[#be185d]">{error}</div>
        )}

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-[#f1f2f4] pt-6">
          <button
            type="button"
            disabled={saving}
            onClick={(e) => handleSubmit(e, false)}
            className="rounded-xl border border-[#e5e7eb] bg-white px-5 py-2.5 text-[13px] font-bold text-[#374151] hover:bg-[#f5f5f7] disabled:opacity-60"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[color:var(--impact-purple)] px-5 py-2.5 text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : mode === "create" ? "Publish Resource" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
