import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { CONFIG } from './config';
import { StippleGrid, PlusMark, HatchLines, Asterisk } from './VectorDecor';

interface ImersaoBenefitsSectionProps {
  onOpenModal: () => void;
}

export const ImersaoBenefitsSection = ({ onOpenModal }: ImersaoBenefitsSectionProps) => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#F0EDE8] relative overflow-hidden">
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E07A3A]/40 to-transparent" />

      {/* Vector decoration */}
      <HatchLines
        count={14}
        className="absolute top-0 right-0 w-64 h-64 text-[#E07A3A]/12 pointer-events-none hidden md:block"
      />
      <StippleGrid
        cols={6}
        rows={6}
        className="absolute bottom-4 left-4 w-20 h-20 md:w-28 md:h-28 text-[#E07A3A]/22 pointer-events-none"
      />
      <PlusMark className="absolute top-8 left-8 w-3 h-3 text-[#C85D25]/45 pointer-events-none" />
      <PlusMark className="absolute bottom-10 right-10 w-3 h-3 text-[#C85D25]/45 pointer-events-none" />
      <Asterisk className="absolute top-16 right-16 w-4 h-4 text-[#E07A3A]/45 pointer-events-none hidden lg:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Tag */}
        <div className="text-center mb-3">
          <span className="text-[#E07A3A] text-xs sm:text-sm font-semibold tracking-widest uppercase">
            {CONFIG.BENEFITS_TAG}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A1A] text-center mb-10 md:mb-14 max-w-2xl mx-auto leading-tight tracking-tight">
          {CONFIG.BENEFITS_TITLE}
        </h2>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-10 md:mb-14">
          {CONFIG.BENEFITS.map((benefit, index) => (
            <Card
              key={index}
              className="bg-[#FAF9F7] border-black/[0.06] hover:border-[#E07A3A]/35 transition-all duration-300 group hover:shadow-[0_14px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1"
            >
              <CardContent className="p-5 md:p-6">
                {/* Number */}
                <div className="text-3xl md:text-4xl font-bold text-[#E07A3A] mb-3 tracking-tighter" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
                  {benefit.number}
                </div>

                {/* Title */}
                <h3 className="text-base md:text-lg font-semibold text-[#1A1A1A] mb-2.5 leading-snug tracking-tight">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-[#4A4A4A] text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <div className="relative w-full sm:w-auto">
            <div
              aria-hidden="true"
              className="absolute -inset-1 bg-gradient-to-r from-[#E07A3A] via-[#F59E53] to-[#E07A3A] rounded-2xl blur-lg opacity-55 pointer-events-none"
              style={{ animation: 'glow-pulse 2.6s ease-in-out infinite' }}
            />
            <Button
              onClick={onOpenModal}
              className="group relative overflow-hidden bg-gradient-to-b from-[#E87F3D] via-[#E07A3A] to-[#C85D25] hover:from-[#E87F3D] hover:via-[#D4692A] hover:to-[#B04A1A] text-white font-bold text-lg sm:text-xl md:text-2xl px-10 sm:px-12 md:px-16 py-7 sm:py-8 md:py-9 w-full sm:w-auto transition-all duration-300 shadow-[0_12px_40px_-10px_rgba(224,122,58,0.7),0_4px_0_0_rgba(168,70,20,0.25)] hover:shadow-[0_18px_60px_-8px_rgba(224,122,58,0.85),0_4px_0_0_rgba(168,70,20,0.35)] hover:scale-[1.03] active:scale-[0.97] rounded-2xl border border-white/15 tracking-wide"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 -left-1/4 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none"
                style={{ animation: 'cta-shimmer 4s ease-in-out 1.2s infinite' }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none"
              />
              <span className="relative inline-flex items-center gap-3 sm:gap-4">
                {CONFIG.BENEFITS_CTA}
                <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-white/30 group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                </span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
