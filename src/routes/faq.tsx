import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { FAQ_QUESTIONS } from "@/lib/faq";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: "Frequently asked questions — IMPACT" },
    { name: "description", content: "Answers about Local Youth Councils, IMPACT assessments, action plans and resources." },
    { property: "og:title", content: "Frequently asked questions — IMPACT" },
    { property: "og:description", content: "Answers about Local Youth Councils, IMPACT assessments, action plans and resources." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: FAQPage,
});
function FAQPage() { return <div className="bg-background"><main><section className="bg-primary px-6 py-14 text-primary-foreground"><div className="mx-auto max-w-[1200px]"><h1 className="text-4xl">Frequently asked questions</h1><p className="mt-3 text-base">Local Youth Councils, assessments and your next steps.</p></div></section><section className="mx-auto max-w-[960px] px-6 py-12">{FAQ_QUESTIONS.map(([q,a]) => <details key={q} className="border-b border-border py-5"><summary className="cursor-pointer text-lg font-bold text-primary">{q}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p></details>)}<p className="mt-8 text-sm text-muted-foreground">Still have a question? <Link to="/send-us-a-message" className="font-bold text-primary underline">Send us a message</Link></p></section></main><Footer /></div>; }