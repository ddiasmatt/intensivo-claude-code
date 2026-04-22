import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQList({ items }: { items: FAQItem[] }) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-0"
      className="overflow-hidden rounded-3xl border border-white/10 bg-surface/60 backdrop-blur-sm"
    >
      {items.map((item, idx) => (
        <AccordionItem
          key={idx}
          value={`item-${idx}`}
          className="border-b border-white/10 px-6 last:border-b-0"
        >
          <AccordionTrigger className="text-left text-base font-semibold text-ink-primary hover:no-underline md:text-lg">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-ink-secondary md:text-base">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
