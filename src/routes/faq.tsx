import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: "Frequently asked questions — IMPACT" },
    { name: "description", content: "Answers about Local Youth Councils, IMPACT assessments, action plans and resources." },
    { property: "og:title", content: "Frequently asked questions — IMPACT" },
    { property: "og:description", content: "Answers about Local Youth Councils, IMPACT assessments, action plans and resources." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: FAQPage,
});
const questions = [
  ["What is a Local Youth Council?", "A Local Youth Council (LYC) is a group or participatory body through which young people represent their perspectives, discuss local priorities and contribute to decisions in their community. Its structure and relationship with the municipality vary from place to place."],
  ["What is IMPACT?", "IMPACT brings together a self-assessment tool, tailored guidance, an Action Plan builder and a public Resource Hub to help strengthen Local Youth Councils and meaningful youth participation."],
  ["Who can use the platform?", "The assessment is designed for Local Youth Councils and the people supporting them. The Resource Hub is also open to youth workers, municipalities, educators, researchers and anyone interested in youth participation."],
  ["Do I need an account?", "You can start an assessment and see its visual overview without an account. Sign-up unlocks detailed feedback, reflection questions and the Action Plan builder, and saves your assessment to My Assessments."],
  ["Where are my results saved?", "Completed assessments are saved automatically to My Assessments when you are logged in. Before Log-in, progress stays in the browser you used. After you Log-in or complete Sign-up, that progress can be saved to your account."],
  ["Can I change my answers?", "Yes. Choose Edit your answers on your results page, or edit a completed assessment from My Assessments. Your scores update when you save your changes."],
  ["How do I create an Action Plan?", "Choose up to three action steps for each indicator in your full results. The selected steps appear in the Action Plan builder, where you can add your goal, responsibilities, timing and resources. An editable blank spreadsheet template is also available."],
  ["Can I use resources without an account?", "Yes. The Resource Hub is public. Each resource opens at its original source, where access and download availability are determined by the publisher."],
];
function FAQPage() { return <div className="bg-background"><main><section className="bg-primary px-6 py-14 text-primary-foreground"><div className="mx-auto max-w-[1200px]"><h1 className="text-4xl">Frequently asked questions</h1><p className="mt-3 text-base">Local Youth Councils, assessments and your next steps.</p></div></section><section className="mx-auto max-w-[960px] px-6 py-12">{questions.map(([q,a]) => <details key={q} className="border-b border-border py-5"><summary className="cursor-pointer text-lg font-bold text-primary">{q}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p></details>)}<p className="mt-8 text-sm text-muted-foreground">Still have a question? <Link to="/send-us-a-message" className="font-bold text-primary underline">Send us a message</Link></p></section></main><Footer /></div>; }