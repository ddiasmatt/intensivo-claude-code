import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CONFIG } from './config';
import { StippleGrid, PlusMark, Asterisk } from './VectorDecor';

export const ImersaoFAQSection = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#F0EDE8] border-t border-black/[0.06] relative overflow-hidden">
      {/* Vector decoration */}
      <StippleGrid
        cols={7}
        rows={7}
        className="absolute top-8 right-8 w-24 h-24 md:w-32 md:h-32 text-[#E07A3A]/22 pointer-events-none"
      />
      <StippleGrid
        cols={7}
        rows={7}
        className="absolute bottom-8 left-8 w-24 h-24 md:w-32 md:h-32 text-[#E07A3A]/22 pointer-events-none"
      />
      <PlusMark className="absolute top-10 left-10 w-3.5 h-3.5 text-[#C85D25]/50 pointer-events-none" />
      <PlusMark className="absolute bottom-10 right-10 w-3.5 h-3.5 text-[#C85D25]/50 pointer-events-none" />
      <Asterisk className="absolute top-1/2 left-6 w-4 h-4 text-[#E07A3A]/40 pointer-events-none hidden xl:block" />
      <Asterisk className="absolute top-1/2 right-6 w-4 h-4 text-[#E07A3A]/40 pointer-events-none hidden xl:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[#C85D25] text-xs font-semibold tracking-widest uppercase mb-3">
              {CONFIG.FAQ_TAG}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] tracking-tight leading-[1.15] mb-3">
              {CONFIG.FAQ_TITLE}
            </h2>
            <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed max-w-xl mx-auto">
              {CONFIG.FAQ_SUBTITLE}
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {CONFIG.FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-[#FAF9F7] border border-black/[0.06] rounded-2xl px-5 md:px-6 data-[state=open]:border-[#E07A3A]/35 data-[state=open]:shadow-[0_6px_24px_-8px_rgba(224,122,58,0.18)] transition-all duration-300"
              >
                <AccordionTrigger className="text-left py-5 md:py-6 hover:no-underline text-sm sm:text-base md:text-lg font-semibold text-[#1A1A1A] leading-snug gap-4 [&[data-state=open]>svg]:text-[#C85D25] [&>svg]:text-[#4A4A4A] [&>svg]:transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 md:pb-6 text-sm sm:text-[15px] text-[#4A4A4A] leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
