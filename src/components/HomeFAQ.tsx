import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { FAQ_QUESTIONS } from "@/lib/faq";

export function HomeFAQ() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  return <section id="home-faq" className="bg-muted/40">
    <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-[120px]">
      <h2 className="section-title text-primary">Frequently asked questions</h2>
      <div className="mt-8 border-t border-border">
        {FAQ_QUESTIONS.map(([question, answer], index) => {
          const open = openQuestion === index;
          return <div key={question} className="border-b border-border">
            <h3 className="m-0 text-lg">
              <button type="button" id={`home-faq-q-${index}`} aria-expanded={open} aria-controls={`home-faq-a-${index}`} data-state={open ? "open" : "closed"} onClick={() => setOpenQuestion(open ? null : index)} className="group flex w-full cursor-pointer items-center justify-between gap-5 py-6 text-left text-lg font-bold text-primary transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {question}
                <svg viewBox="0 0 24 24" aria-hidden="true" className="home-faq-chevron h-6 w-6 shrink-0 fill-secondary"><path d="M4 7 Q3 7 3.5 8 L11 19 Q12 20 13 19 L20.5 8 Q21 7 20 7 Z" /></svg>
              </button>
            </h3>
            <div id={`home-faq-a-${index}`} role="region" aria-labelledby={`home-faq-q-${index}`} aria-hidden={!open} inert={!open} className="home-faq-answer" data-state={open ? "open" : "closed"}>
              <div className="min-h-0 overflow-hidden"><p className="home-faq-copy max-w-3xl pb-6 text-base leading-relaxed text-muted-foreground">{answer}</p></div>
            </div>
          </div>;
        })}
      </div>
      <p className="mt-7 text-sm text-muted-foreground">Still have a question? <Link to="/send-us-a-message" className="font-bold text-primary underline">Send us a message</Link></p>
    </div>
  </section>;
}
