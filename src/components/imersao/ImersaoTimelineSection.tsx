import { CONFIG } from './config';
import { StippleGrid, PlusMark, DashArc, OrbitTicks, Asterisk } from './VectorDecor';

export const ImersaoTimelineSection = () => {
  return (
    <section className="py-16 md:py-24 bg-[#FAF9F7] relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 26, 26, 0.04) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(26, 26, 26, 0.04) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      {/* Vector decoration */}
      <OrbitTicks
        count={32}
        innerR={32}
        outerR={46}
        className="absolute top-14 left-6 lg:left-16 w-24 h-24 md:w-32 md:h-32 text-[#E07A3A]/30 pointer-events-none hidden md:block"
        style={{ animation: 'orbit-spin 80s linear infinite' }}
      />
      <OrbitTicks
        count={32}
        innerR={32}
        outerR={46}
        className="absolute bottom-14 right-6 lg:right-16 w-24 h-24 md:w-32 md:h-32 text-[#E07A3A]/30 pointer-events-none hidden md:block"
        style={{ animation: 'orbit-spin-reverse 80s linear infinite' }}
      />
      <StippleGrid
        cols={7}
        rows={7}
        className="absolute top-8 right-8 w-24 h-24 md:w-32 md:h-32 text-[#E07A3A]/20 pointer-events-none"
      />
      <StippleGrid
        cols={7}
        rows={7}
        className="absolute bottom-8 left-8 w-24 h-24 md:w-32 md:h-32 text-[#E07A3A]/20 pointer-events-none"
      />
      <DashArc
        flip
        className="absolute top-0 left-1/2 -translate-x-1/2 w-80 md:w-[500px] h-auto text-[#E07A3A]/30 pointer-events-none hidden md:block"
      />
      <DashArc
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 md:w-[500px] h-auto text-[#E07A3A]/30 pointer-events-none hidden md:block"
      />
      <PlusMark className="absolute top-20 left-1/4 w-3 h-3 text-[#C85D25]/40 pointer-events-none hidden lg:block" />
      <PlusMark className="absolute bottom-20 right-1/4 w-3 h-3 text-[#C85D25]/40 pointer-events-none hidden lg:block" />
      <Asterisk className="absolute top-1/2 left-10 w-4 h-4 text-[#E07A3A]/45 pointer-events-none hidden xl:block" />
      <Asterisk className="absolute top-1/2 right-10 w-4 h-4 text-[#E07A3A]/45 pointer-events-none hidden xl:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <p className="text-[#E07A3A] text-xs font-semibold tracking-widest mb-4">
            {CONFIG.TIMELINE_TAG}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-[1.15] tracking-tight mb-4">
            {CONFIG.TIMELINE_TITLE}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#4A4A4A] leading-relaxed max-w-2xl mx-auto">
            {CONFIG.TIMELINE_SUBTITLE}
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-[#E07A3A]/30 to-transparent md:-translate-x-px" />

          <ol className="space-y-6 md:space-y-8">
            {CONFIG.TIMELINE_BLOCKS.map((block, index) => {
              const isEven = index % 2 === 0;
              return (
                <li
                  key={index}
                  className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-8 md:items-center`}
                >
                  {/* Node dot */}
                  <div
                    className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 w-3 h-3 rounded-full bg-[#E07A3A] ring-4 ring-[#FAF9F7] shadow-[0_0_0_1px_rgba(224,122,58,0.35)] z-10"
                    aria-hidden="true"
                  />

                  {/* Card */}
                  <div
                    className={`bg-[#F0EDE8] border border-black/[0.06] rounded-2xl p-5 md:p-6 hover:border-[#E07A3A]/25 transition-colors duration-300 ${
                      isEven ? 'md:col-start-1 md:pr-8 md:text-right' : 'md:col-start-2 md:pl-8'
                    }`}
                  >
                    <p className="text-[#E07A3A] text-xs font-semibold tracking-widest uppercase mb-2">
                      {block.time}
                    </p>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#1A1A1A] mb-2 leading-snug">
                      {block.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-[#4A4A4A] leading-relaxed">
                      {block.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Footer caption */}
        <p className="text-center text-xs sm:text-sm text-[#7A7A7A] mt-12 md:mt-16 font-medium">
          {CONFIG.TIMELINE_FOOTER}
        </p>
      </div>
    </section>
  );
};
