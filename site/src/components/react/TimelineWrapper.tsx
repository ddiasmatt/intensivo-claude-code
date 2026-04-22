import { Timeline } from '@/components/ui/timeline';

interface Block {
  time: string;
  title: string;
  description: string;
}

interface Props {
  blocks: Block[];
}

export default function TimelineWrapper({ blocks }: Props) {
  const data = blocks.map((b) => ({
    title: b.time,
    content: (
      <div>
        <h3 className="mb-2 text-xl font-semibold text-ink-primary md:text-2xl">{b.title}</h3>
        <p className="text-sm leading-relaxed text-ink-secondary md:text-base">{b.description}</p>
      </div>
    ),
  }));

  return <Timeline data={data} />;
}
