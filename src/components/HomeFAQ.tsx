import * as Accordion from "@radix-ui/react-accordion";
import { Link } from "@tanstack/react-router";
import { FAQ_QUESTIONS } from "@/lib/faq";

export function HomeFAQ() {
  return <section id="home-faq" className="bg-muted/40">
    <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-[120px]">
      <h2 className="text-3xl text-primary">Frequently asked questions</h2>
      <p className="mt-3 text-base text-muted-foreground">Local Youth Councils, assessments and your next steps.</p>
      <Accordion.Root type="single" collapsible className="mt-8 border-t border-border">
        {FAQ_QUESTIONS.map(([question, answer], index) => <Accordion.Item key={question} value={`faq-${index}`} className="border-b border-border">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-5 py-6 text-left text-lg font-bold text-primary transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {question}
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 shrink-0 fill-secondary transition-transform duration-300 group-data-[state=open]:rotate-180 motion-reduce:transition-none"><path d="M4 7 Q3 7 3.5 8 L11 19 Q12 20 13 19 L20.5 8 Q21 7 20 7 Z" /></svg>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="home-faq-answer overflow-hidden"><p className="max-w-3xl pb-6 text-base leading-relaxed text-muted-foreground">{answer}</p></Accordion.Content>
        </Accordion.Item>)}
      </Accordion.Root>
      <p className="mt-7 text-sm text-muted-foreground">Still have a question? <Link to="/send-us-a-message" className="font-bold text-primary underline">Send us a message</Link></p>
    </div>
  </section>;
}