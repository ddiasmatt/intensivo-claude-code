import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CONFIG } from './config';
import mateusImage from '@/assets/imersao/mateus.webp';
import {
  StippleGrid,
  PlusMark,
  Constellation,
  OrbitTicks,
  CornerBracket,
  Asterisk,
} from './VectorDecor';

interface ImersaoFinalSectionProps {
  onOpenModal: () => void;
}

export const ImersaoFinalSection = ({ onOpenModal }: ImersaoFinalSectionProps) => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#FAF9F7] relative overflow-hidden">
      {/* Vector decoration */}
      <OrbitTicks
        count={48}
        innerR={36}
        outerR={48}
        className="absolute top-10 right-10 w-24 h-24 md:w-36 md:h-36 text-[#E07A3A]/30 pointer-events-none hidden md:block"
        style={{ animation: 'orbit-spin 100s linear infinite' }}
      />
      <Constellation className="absolute top-24 left-10 w-28 h-24 md:w-40 md:h-32 text-[#C85D25]/40 pointer-events-none hidden md:block" />
      <StippleGrid
        cols={8}
        rows={8}
        className="absolute bottom-10 right-10 w-28 h-28 md:w-40 md:h-40 text-[#E07A3A]/22 pointer-events-none hidden sm:block"
      />
      <StippleGrid
        cols={6}
        rows={6}
        className="absolute bottom-10 left-10 w-20 h-20 md:w-28 md:h-28 text-[#E07A3A]/22 pointer-events-none"
      />
      <PlusMark className="absolute top-10 left-10 w-3.5 h-3.5 text-[#C85D25]/55 pointer-events-none" />
      <Asterisk className="absolute top-1/2 left-6 w-4 h-4 text-[#E07A3A]/45 pointer-events-none hidden xl:block" />
      <Asterisk className="absolute top-1/2 right-6 w-4 h-4 text-[#E07A3A]/45 pointer-events-none hidden xl:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Presenter Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-10 md:mb-14 tracking-tight">
          <span className="text-[#E07A3A] italic" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>{CONFIG.PRESENTER_TITLE}</span>
        </h2>

        {/* Presenter Block */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-10 mb-14 md:mb-16 max-w-3xl mx-auto">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-[#E07A3A]/20 rounded-full blur-2xl scale-110" />
              <img
                src={mateusImage}
                alt={CONFIG.PRESENTER_NAME}
                className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-[#E07A3A]/40 shadow-lg"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="text-center md:text-left flex-1">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3 md:mb-4 tracking-tight">
              {CONFIG.PRESENTER_NAME}
            </h3>
            <div className="text-[#4A4A4A] text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {CONFIG.PRESENTER_BIO}
            </div>
          </div>
        </div>

        {/* Urgency Block */}
        <div className="text-center bg-[#F0EDE8] rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-black/[0.06] relative overflow-hidden max-w-3xl mx-auto">
          {/* Corner brackets */}
          <CornerBracket corner="tl" className="absolute top-2.5 left-2.5 w-5 h-5 text-[#C85D25]/45 z-10" />
          <CornerBracket corner="tr" className="absolute top-2.5 right-2.5 w-5 h-5 text-[#C85D25]/45 z-10" />
          <CornerBracket corner="bl" className="absolute bottom-2.5 left-2.5 w-5 h-5 text-[#C85D25]/45 z-10" />
          <CornerBracket corner="br" className="absolute bottom-2.5 right-2.5 w-5 h-5 text-[#C85D25]/45 z-10" />

          {/* Glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-28 bg-[#E07A3A]/15 rounded-full blur-[60px]" />

          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 tracking-tight">
              <span className="text-[#E07A3A] italic" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>{CONFIG.URGENCY_TITLE}</span>
            </h2>

            <p className="text-[#4A4A4A] text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-xl mx-auto leading-relaxed">
              {CONFIG.URGENCY_SUBTITLE}
            </p>

            <div className="relative inline-block w-full sm:w-auto">
              <div
                aria-hidden="true"
                className="absolute -inset-1 bg-gradient-to-r from-[#E07A3A] via-[#F59E53] to-[#E07A3A] rounded-2xl blur-lg opacity-60 pointer-events-none"
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
                  {CONFIG.FINAL_CTA}
                  <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-white/30 group-hover:translate-x-1">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                  </span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
