import type { LucideIcon } from 'lucide-react';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';

interface UseCase {
  name: string;
  description: string;
  Icon: LucideIcon;
  href: string;
  cta: string;
  className: string;
}

export default function UseCasesGrid({ cards }: { cards: UseCase[] }) {
  return (
    <BentoGrid>
      {cards.map((card) => (
        <BentoCard
          key={card.name}
          name={card.name}
          description={card.description}
          Icon={card.Icon}
          href={card.href}
          cta={card.cta}
          className={card.className}
          background={
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-deep/5" />
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
            </div>
          }
        />
      ))}
    </BentoGrid>
  );
}
