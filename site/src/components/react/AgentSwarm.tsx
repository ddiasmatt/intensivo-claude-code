import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Loader2 } from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';

type AgentStatus = 'running' | 'done' | 'idle';

interface AgentDef {
  id: string;
  label: string;
  tasks: string[];
}

const AGENTS: AgentDef[] = [
  { id: 'a1', label: 'squad-conteudo', tasks: ['escrevendo roteiro', 'criando post', 'editando copy', 'gerando thumbnail'] },
  { id: 'a2', label: 'squad-vendas', tasks: ['qualificando lead', 'redigindo follow-up', 'agendando reuniao', 'atualizando pipeline'] },
  { id: 'a3', label: 'squad-entrega', tasks: ['enviando onboarding', 'monitorando churn', 'sincronizando ChatFunnel', 'atualizando docs'] },
  { id: 'a4', label: 'squad-gestao', tasks: ['atualizando dashboard', 'gerando relatorio KPI', 'checando alertas', 'conferindo receita'] },
  { id: 'a5', label: 'squad-pesquisa', tasks: ['coletando tendencias', 'analisando concorrentes', 'transcrevendo aulas', 'resumindo mercado'] },
  { id: 'a6', label: 'squad-midia', tasks: ['otimizando anuncio', 'testando variacoes', 'escrevendo briefing', 'alocando verba'] },
  { id: 'a7', label: 'squad-suporte', tasks: ['respondendo cliente', 'triando ticket', 'atualizando FAQ', 'sincronizando inbox'] },
  { id: 'a8', label: 'squad-email', tasks: ['disparando sequencia', 'segmentando lista', 'testando assunto', 'revisando template'] },
  { id: 'a9', label: 'squad-analytics', tasks: ['calculando KPIs', 'gerando insight', 'exportando relatorio', 'validando dados'] },
  { id: 'a10', label: 'squad-criativos', tasks: ['gerando variacao', 'ajustando thumbnail', 'criando story', 'revisando post'] },
];

function AgentTile({ agent, seed }: { agent: AgentDef; seed: number }) {
  const [taskIndex, setTaskIndex] = useState(seed % agent.tasks.length);
  const [status, setStatus] = useState<AgentStatus>('idle');

  useEffect(() => {
    let mounted = true;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const step = () => {
      if (!mounted) return;
      timers.push(
        setTimeout(() => {
          if (!mounted) return;
          setStatus('running');
          timers.push(
            setTimeout(() => {
              if (!mounted) return;
              setStatus('done');
              timers.push(
                setTimeout(() => {
                  if (!mounted) return;
                  setTaskIndex((i) => (i + 1) % agent.tasks.length);
                  setStatus('idle');
                  timers.push(setTimeout(step, 400 + (seed % 3) * 120));
                }, 650),
              );
            }, 1900 + (seed % 5) * 160),
          );
        }, 280),
      );
    };

    timers.push(setTimeout(step, seed * 430));
    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, [agent.tasks.length, seed]);

  const isRunning = status === 'running';
  const isDone = status === 'done';

  return (
    <div
      className={`relative overflow-hidden rounded-lg border bg-page/80 px-3 py-2.5 font-mono transition-colors duration-500 ${
        isRunning
          ? 'border-accent/60 shadow-[0_0_0_1px_rgba(224,122,58,0.3),0_6px_24px_-10px_rgba(224,122,58,0.6)]'
          : isDone
          ? 'border-emerald-400/40'
          : 'border-white/10'
      }`}
    >
      {isRunning && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 rounded-lg bg-accent/10 blur-md"
        />
      )}
      <div className="relative mb-1.5 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
              isRunning ? 'animate-live-pulse bg-accent' : isDone ? 'bg-emerald-400' : 'bg-white/30'
            }`}
          />
          <span className="truncate text-[9px] tracking-wider text-white/55 sm:text-[10px]">
            {agent.label}
          </span>
        </div>
        <span className="ml-2 flex-shrink-0 text-[9px] text-white/35">
          {isRunning ? (
            <Loader2 className="h-3 w-3 animate-spin text-accent" />
          ) : isDone ? (
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          ) : (
            <Activity className="h-3 w-3" />
          )}
        </span>
      </div>
      <div className="relative flex min-h-[26px] items-start sm:min-h-[30px]">
        <span className="mr-1 select-none text-[10px] text-accent sm:text-xs">$</span>
        <span
          key={`${agent.id}-${taskIndex}-${status}`}
          className="inline-flex items-center gap-1 break-words text-[10px] leading-snug text-white/90 sm:text-xs"
        >
          <span className={isDone ? 'text-white/40 line-through' : ''}>{agent.tasks[taskIndex]}</span>
          {isRunning && (
            <span className="inline-block h-3 w-1 animate-live-pulse bg-accent align-middle" />
          )}
          {isDone && <span className="text-emerald-400">✓</span>}
        </span>
      </div>
    </div>
  );
}

export default function AgentSwarm() {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-ink-secondary sm:text-[11px]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-live-ring rounded-full bg-emerald-500" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold uppercase tracking-widest text-ink-primary">
            {AGENTS.length} agentes online
          </span>
        </div>
        <span className="tabular-nums font-semibold text-accent">
          <NumberTicker value={214} className="text-accent" /> tarefas concluidas hoje
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-4 lg:grid-cols-5">
        {AGENTS.map((agent, idx) => (
          <AgentTile key={agent.id} agent={agent} seed={idx + 1} />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-accent/25 bg-surface/70 px-4 py-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/15">
          <span className="font-mono text-xs font-bold text-accent">YOU</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent sm:text-[11px]">
            Mission Control
          </p>
          <p className="text-[11px] leading-snug text-ink-secondary sm:text-xs">
            Uma instrucao sua. 10 agentes trabalhando em paralelo pra voce.
          </p>
        </div>
      </div>
    </div>
  );
}
