import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card-effect';

interface Benefit {
  number: string;
  title: string;
  description: string;
}

export default function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <CardContainer containerClassName="py-0">
      <CardBody className="group/card relative h-auto w-full overflow-hidden rounded-3xl border border-white/10 bg-surface/70 p-7 backdrop-blur-sm transition-colors duration-500 hover:border-accent/40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl"
        />
        <CardItem
          translateZ={36}
          className="font-mono text-xs font-bold tracking-[0.2em] text-accent-hover"
        >
          {benefit.number}
        </CardItem>
        <CardItem
          as="h3"
          translateZ={52}
          className="mt-3 text-xl font-semibold text-ink-primary md:text-2xl"
        >
          {benefit.title}
        </CardItem>
        <CardItem
          as="p"
          translateZ={30}
          className="mt-3 text-sm leading-relaxed text-ink-secondary md:text-base"
        >
          {benefit.description}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
