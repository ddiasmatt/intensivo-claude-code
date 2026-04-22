import dep01 from '@/assets/depoimentos/depoimento-01.png';
import dep02 from '@/assets/depoimentos/depoimento-02.png';
import dep03 from '@/assets/depoimentos/depoimento-03.png';
import dep04 from '@/assets/depoimentos/depoimento-04.png';
import dep05 from '@/assets/depoimentos/depoimento-05.png';
import dep06 from '@/assets/depoimentos/depoimento-06.png';
import dep07 from '@/assets/depoimentos/depoimento-07.png';
import dep08 from '@/assets/depoimentos/depoimento-08.png';
import dep09 from '@/assets/depoimentos/depoimento-09.png';
import dep10 from '@/assets/depoimentos/depoimento-10.png';
import dep11 from '@/assets/depoimentos/depoimento-11.png';
import dep12 from '@/assets/depoimentos/depoimento-12.png';
import dep13 from '@/assets/depoimentos/depoimento-13.png';
import dep14 from '@/assets/depoimentos/depoimento-14.png';
import dep15 from '@/assets/depoimentos/depoimento-15.png';
import dep16 from '@/assets/depoimentos/depoimento-16.png';
import dep17 from '@/assets/depoimentos/depoimento-17.png';
import dep18 from '@/assets/depoimentos/depoimento-18.png';
import dep19 from '@/assets/depoimentos/depoimento-19.png';
import { useState } from 'react';
import { X } from 'lucide-react';
import { PlusMark, Asterisk } from './VectorDecor';

const row1 = [dep01, dep07, dep18, dep04, dep05];
const row2 = [dep06, dep08, dep09, dep14, dep16];
const row3 = [dep10, dep15, dep11, dep12, dep02];
const row4 = [dep17, dep13, dep03, dep19];

export const ImersaoTestimonialsSection = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const MarqueeRow = ({
    items,
    direction = 'left',
    speed = 40,
  }: {
    items: string[];
    direction?: 'left' | 'right';
    speed?: number;
  }) => {
    const doubled = [...items, ...items];
    const animName = direction === 'left' ? 'marquee-left' : 'marquee-right';

    return (
      <div className="relative overflow-hidden group/marquee">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[#FAF9F7] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[#FAF9F7] to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-4 w-max group-hover/marquee:[animation-play-state:paused]"
          style={{
            animation: `${animName} ${speed}s linear infinite`,
          }}
        >
          {doubled.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 bg-[#F0EDE8] border border-black/[0.06] rounded-xl p-2.5 hover:border-[#E07A3A]/40 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
              onClick={() => setExpanded(src)}
            >
              <img
                src={src}
                alt="Depoimento"
                className="h-[80px] sm:h-[110px] md:h-[140px] w-auto min-w-[70px] rounded-lg object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 md:py-20 bg-[#FAF9F7] overflow-hidden relative">
      {/* Vector decoration */}
      <PlusMark className="absolute top-10 left-10 w-3.5 h-3.5 text-[#C85D25]/55 pointer-events-none" />
      <PlusMark className="absolute top-10 right-10 w-3.5 h-3.5 text-[#C85D25]/55 pointer-events-none" />
      <Asterisk className="absolute top-14 left-1/3 w-4 h-4 text-[#E07A3A]/40 pointer-events-none hidden lg:block" />
      <Asterisk className="absolute top-14 right-1/3 w-4 h-4 text-[#E07A3A]/40 pointer-events-none hidden lg:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mb-12 relative z-10">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-3 animate-fade-in"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          Veja o que quem participou está dizendo
        </h2>
        <p
          className="text-center text-[#4A4A4A] text-sm sm:text-base max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: '0.15s', animationFillMode: 'both' }}
        >
          Depoimentos reais de participantes de imersões anteriores do Grupo VUK
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <MarqueeRow items={row1} direction="left" speed={90} />
        <MarqueeRow items={row2} direction="right" speed={100} />
        <MarqueeRow items={row3} direction="left" speed={85} />
        <div className="block md:hidden">
          <MarqueeRow items={row4} direction="right" speed={95} />
        </div>
      </div>

      {expanded !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setExpanded(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setExpanded(null)}
            aria-label="Fechar depoimento"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={expanded}
            alt="Depoimento ampliado"
            className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};
