import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Polygon } from "@/components/Polygon";

export const Route = createFileRoute("/send-us-a-message")({
  head: () => ({
    meta: [
      { title: "Send us a message — IMPACT" },
      { name: "description", content: "Get in touch with the IMPACT consortium." },
      { property: "og:title", content: "Send us a message — IMPACT" },
      { property: "og:description", content: "Get in touch with the IMPACT consortium." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", organisation: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Layout only — no backend submission yet
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative w-full overflow-hidden bg-[color:var(--impact-purple)]">
          <Polygon size={46} rotate={-22} color="rgba(244,162,97,0.75)" style={{ top: 104, right: 120 }} />
          <Polygon size={35} rotate={-18} color="rgba(233,75,138,0.6)" style={{ top: 111, left: "62%" }} />
          <Polygon size={23} rotate={10} color="rgba(255,255,255,0.6)" style={{ top: 133, left: "72%" }} />
          <Polygon size={77} rotate={-22} color="rgba(244,162,97,0.6)" style={{ top: 155, right: 220 }} />
          <Polygon size={57} rotate={10} color="rgba(233,75,138,0.55)" style={{ top: 184, left: "68%" }} />
          <Polygon size={44} rotate={12} color="rgba(255,255,255,0.5)" style={{ top: 210, left: "58%" }} />
          <Polygon size={29} rotate={14} color="rgba(33,156,158,0.7)" style={{ top: 260, right: 120 }} />
          <Polygon size={54} rotate={-8} color="rgba(255,255,255,0.4)" style={{ top: 292, right: 240 }} />
          <Polygon size={137} rotate={28} color="rgba(244,162,97,0.5)" style={{ top: 275, left: "65%" }} />

          <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-14 lg:px-[120px] lg:py-[56px]">
            <h1 className="text-4xl font-extrabold leading-[1.1] text-white lg:text-[48px]">
              Send us a message
            </h1>
            <p className="mt-3 max-w-[760px] text-[18px] leading-[1.6] text-white/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </section>

        {/* Form card */}
        <section className="mx-auto max-w-[1440px] px-6 py-12 lg:px-[120px]">
          <div className="mx-auto max-w-[720px] rounded-[20px] border border-[#e5e7eb] bg-white p-8 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.05)] lg:p-10">
            {/* Top colored border */}
            <div className="mb-8 flex h-1 w-full overflow-hidden rounded-full">
              <div className="h-full flex-1 bg-[#502181]" />
              <div className="h-full flex-1 bg-[#f4a261]" />
              <div className="h-full flex-1 bg-[#e84393]" />
              <div className="h-full flex-1 bg-[#219c9e]" />
            </div>

            <div className="mb-6 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 100 100" aria-hidden>
                <polygon points="50,5 95,80 5,80" fill="#502181" />
              </svg>
              <h2 className="text-[24px] font-bold text-[color:var(--impact-purple)]">Get in Touch</h2>
            </div>

            <p className="mb-8 text-[15px] leading-[1.6] text-[#6b7280]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="border-l-4 border-[#502181] pl-3 text-[14px] font-bold text-[#111827]">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Lorem ipsum"
                  className="h-[52px] rounded-[12px] border border-[#e5e7eb] px-4 text-[15px] text-[#111827] placeholder-[#9ca3af] outline-none focus:border-[color:var(--impact-purple)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="border-l-4 border-[#f4a261] pl-3 text-[14px] font-bold text-[#111827]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="lorem@ipsum.com"
                  className="h-[52px] rounded-[12px] border border-[#e5e7eb] px-4 text-[15px] text-[#111827] placeholder-[#9ca3af] outline-none focus:border-[color:var(--impact-orange)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="border-l-4 border-[#e84393] pl-3 text-[14px] font-bold text-[#111827]">
                  Organisation / Institution
                </label>
                <input
                  type="text"
                  name="organisation"
                  value={form.organisation}
                  onChange={handleChange}
                  placeholder="Lorem ipsum"
                  className="h-[52px] rounded-[12px] border border-[#e5e7eb] px-4 text-[15px] text-[#111827] placeholder-[#9ca3af] outline-none focus:border-[color:var(--impact-pink)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="border-l-4 border-[#219c9e] pl-3 text-[14px] font-bold text-[#111827]">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                  rows={5}
                  className="rounded-[12px] border border-[#e5e7eb] p-4 text-[15px] text-[#111827] placeholder-[#9ca3af] outline-none focus:border-[color:var(--impact-green)]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 h-[56px] w-full rounded-full bg-[color:var(--impact-purple)] text-[15px] font-bold text-white transition hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
