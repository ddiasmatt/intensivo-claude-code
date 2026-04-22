import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Activity, CheckCircle2, Loader2 } from 'lucide-react';
import { CONFIG } from './config';
import {
  StippleGrid,
  PlusMark,
  Asterisk,
  Constellation,
  CornerBracket,
} from './VectorDecor';

interface ImersaoHeroSectionProps {
  onOpenModal: () => void;
}

/**
 * AgentSwarmAnimation
 *
 * Grid de agentes de IA trabalhando autonomamente em paralelo.
 * Cada tile é um mini-terminal que:
 *  - rotaciona tarefas a cada ~3s,
 *  - alterna entre running / done / idle,
 *  - exibe cursor piscando e status dot.
 * Os ciclos são defasados (staggered) para criar a sensação de
 * atividade simultânea e distribuída.
 */
type AgentStatus = 'running' | 'done' | 'idle';

interface AgentDef {
  id: string;
  label: string;
  tasks: string[];
}

const AGENTS: AgentDef[] = [
  {
    id: 'a1',
    label: 'squad-conteudo',
    tasks: ['escrevendo roteiro', 'criando post', 'editando copy', 'gerando thumbnail'],
  },
  {
    id: 'a2',
    label: 'squad-vendas',
    tasks: ['qualificando lead', 'redigindo follow-up', 'agendando reunião', 'atualizando pipeline'],
  },
  {
    id: 'a3',
    label: 'squad-entrega',
    tasks: ['enviando onboarding', 'monitorando churn', 'sincronizando ChatFunnel', 'atualizando docs'],
  },
  {
    id: 'a4',
    label: 'squad-gestao',
    tasks: ['atualizando dashboard', 'gerando relatório KPI', 'checando alertas', 'conferindo receita'],
  },
  {
    id: 'a5',
    label: 'squad-pesquisa',
    tasks: ['coletando tendências', 'analisando concorrentes', 'transcrevendo aulas', 'resumindo mercado'],
  },
  {
    id: 'a6',
    label: 'squad-midia',
    tasks: ['otimizando anúncio', 'testando variações', 'escrevendo briefing', 'alocando verba'],
  },
  {
    id: 'a7',
    label: 'squad-suporte',
    tasks: ['respondendo cliente', 'triando ticket', 'atualizando FAQ', 'sincronizando inbox'],
  },
  {
    id: 'a8',
    label: 'squad-email',
    tasks: ['disparando sequência', 'segmentando lista', 'testando assunto', 'revisando template'],
  },
  {
    id: 'a9',
    label: 'squad-analytics',
    tasks: ['calculando KPIs', 'gerando insight', 'exportando relatório', 'validando dados'],
  },
  {
    id: 'a10',
    label: 'squad-criativos',
    tasks: ['gerando variação', 'ajustando thumbnail', 'criando story', 'revisando post'],
  },
];

const AgentTile = ({ agent, seed }: { agent: AgentDef; seed: number }) => {
  const [taskIndex, setTaskIndex] = useState(seed % agent.tasks.length);
  const [status, setStatus] = useState<AgentStatus>('idle');

  useEffect(() => {
    let mounted = true;
    let timers: ReturnType<typeof setTimeout>[] = [];

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
      className={`relative bg-[#141414] rounded-lg border px-3 py-2.5 font-mono overflow-hidden transition-colors duration-500 ${
        isRunning
          ? 'border-[#E07A3A]/70 shadow-[0_0_0_1px_rgba(224,122,58,0.25),0_4px_18px_-8px_rgba(224,122,58,0.55)]'
          : isDone
            ? 'border-emerald-400/40'
            : 'border-white/10'
      }`}
    >
      {/* ambient glow when running */}
      {isRunning && (
        <span
          aria-hidden="true"
          className="absolute -inset-1 bg-[#E07A3A]/8 rounded-lg blur-md pointer-events-none"
        />
      )}

      <div className="relative flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              isRunning
                ? 'bg-[#E07A3A]'
                : isDone
                  ? 'bg-emerald-400'
                  : 'bg-white/30'
            }`}
            style={isRunning ? { animation: 'live-pulse 1s ease-in-out infinite' } : undefined}
          />
          <span className="text-[9px] sm:text-[10px] text-white/55 tracking-wider truncate">
            {agent.label}
          </span>
        </div>
        <span className="text-[9px] text-white/30 flex-shrink-0 ml-2">
          {isRunning ? (
            <Loader2 className="w-3 h-3 animate-spin text-[#E07A3A]" />
          ) : isDone ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          ) : (
            <Activity className="w-3 h-3" />
          )}
        </span>
      </div>

      <div className="relative min-h-[26px] sm:min-h-[30px] flex items-start">
        <span className="text-[#E07A3A] text-[10px] sm:text-xs mr-1 select-none">$</span>
        <span
          key={`${agent.id}-${taskIndex}-${status}`}
          className="text-[10px] sm:text-xs text-white/90 leading-snug animate-fade-in inline-flex items-center gap-1 break-words"
        >
          <span className={isDone ? 'line-through text-white/40' : ''}>
            {agent.tasks[taskIndex]}
          </span>
          {isRunning && (
            <span className="inline-block w-1 h-3 bg-[#E07A3A] align-middle" style={{ animation: 'live-pulse 0.9s steps(2) infinite' }} />
          )}
          {isDone && <span className="text-emerald-400">✓</span>}
        </span>
      </div>
    </div>
  );
};

const AgentSwarmAnimation = () => {
  const [completedCount, setCompletedCount] = useState(142);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedCount((c) => c + Math.floor(1 + Math.random() * 3));
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Swarm header */}
      <div className="flex items-center justify-between mb-3 text-[10px] sm:text-[11px] font-mono text-[#4A4A4A]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-500"
              style={{ animation: 'live-ring 1.6s ease-out infinite' }}
            />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="uppercase tracking-widest text-[#1A1A1A] font-semibold">
            {AGENTS.length} agentes online
          </span>
        </div>
        <span className="tabular-nums text-[#C85D25] font-semibold">
          {completedCount} tarefas concluídas hoje
        </span>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
        {AGENTS.map((agent, idx) => (
          <AgentTile key={agent.id} agent={agent} seed={idx + 1} />
        ))}
      </div>

      {/* Swarm footer: você no mission control */}
      <div className="mt-4 flex items-center gap-3 bg-[#FAF9F7] border border-[#E07A3A]/25 rounded-xl px-4 py-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E07A3A]/15 flex items-center justify-center">
          <span className="text-xs font-bold text-[#C85D25] font-mono">YOU</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] tracking-widest uppercase text-[#C85D25] font-bold font-mono">
            Mission Control
          </p>
          <p className="text-[11px] sm:text-xs text-[#4A4A4A] leading-snug">
            Uma instrução sua. 10 agentes trabalhando em paralelo pra você.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ImersaoHeroSection = ({ onOpenModal }: ImersaoHeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F7] pt-12 pb-20 md:pt-20 md:pb-28 lg:pt-24 lg:pb-32">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.55] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 26, 26, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(26, 26, 26, 0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
        }}
      />

      {/* Ambient orb (lateral, fora do eixo central do texto) */}
      <div
        className="absolute bottom-0 right-[-120px] w-[380px] h-[380px] bg-[#1A1A1A]/[0.04] rounded-full blur-[110px] pointer-events-none hidden md:block"
      />

      {/* Vector decoration */}
      <StippleGrid
        className="absolute top-20 left-6 lg:left-16 w-28 h-28 md:w-36 md:h-36 text-[#E07A3A]/25 pointer-events-none hidden sm:block"
        cols={8}
        rows={8}
      />
      <StippleGrid
        className="absolute bottom-16 right-6 lg:right-16 w-28 h-28 md:w-36 md:h-36 text-[#E07A3A]/25 pointer-events-none hidden sm:block"
        cols={8}
        rows={8}
      />
      <Constellation className="absolute top-24 right-6 lg:right-16 w-28 h-24 md:w-36 md:h-28 text-[#C85D25]/35 pointer-events-none hidden xl:block" />
      <PlusMark className="absolute top-10 left-10 w-3.5 h-3.5 text-[#C85D25]/60 pointer-events-none" />
      <PlusMark className="absolute top-10 right-10 w-3.5 h-3.5 text-[#C85D25]/60 pointer-events-none" />
      <PlusMark className="absolute bottom-12 left-14 w-3.5 h-3.5 text-[#C85D25]/60 pointer-events-none hidden sm:block" />
      <PlusMark className="absolute bottom-12 right-14 w-3.5 h-3.5 text-[#C85D25]/60 pointer-events-none hidden sm:block" />
      <Asterisk className="absolute top-1/3 left-4 w-4 h-4 text-[#E07A3A]/50 pointer-events-none hidden lg:block" />
      <Asterisk className="absolute top-1/2 right-4 w-4 h-4 text-[#E07A3A]/50 pointer-events-none hidden lg:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge with live dot */}
          <div
            className="inline-flex items-center gap-2.5 bg-[#E07A3A]/10 border border-[#E07A3A]/25 rounded-full px-4 py-2 mb-4 animate-fade-in"
            style={{ animationDelay: '0s' }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-[#E07A3A]"
                style={{ animation: 'live-ring 1.8s ease-out infinite' }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2 bg-[#E07A3A]"
                style={{ animation: 'live-pulse 1.8s ease-in-out infinite' }}
              />
            </span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#C85D25]">
              {CONFIG.EVENT_BADGE}
            </span>
          </div>

          {/* Event wordmark */}
          <div
            className="flex items-center gap-3 mb-6 animate-fade-in"
            style={{ animationDelay: '0.06s' }}
          >
            <span className="h-px w-8 sm:w-10 bg-gradient-to-r from-transparent to-[#C85D25]/60" />
            <p className="text-[13px] sm:text-sm md:text-base font-bold tracking-[0.18em] uppercase text-[#C85D25] font-mono">
              {CONFIG.EVENT_NAME}
            </p>
            <span className="h-px w-8 sm:w-10 bg-gradient-to-l from-transparent to-[#C85D25]/60" />
          </div>

          {/* Headline */}
          <h1
            className="text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-[#1A1A1A] leading-[1.08] tracking-tight mb-6 animate-fade-in"
            style={{ animationDelay: '0.08s' }}
          >
            {CONFIG.HEADLINE_PART1}
            <span
              className="text-[#C85D25] italic"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              {CONFIG.HEADLINE_HIGHLIGHT}
            </span>
            {CONFIG.HEADLINE_PART2}
          </h1>

          {/* Subheadline */}
          <p
            className="text-base sm:text-lg md:text-xl text-[#3A3A3A] leading-relaxed mb-2 max-w-2xl animate-fade-in"
            style={{ animationDelay: '0.16s' }}
          >
            {CONFIG.SUBHEADLINE}
          </p>

          {/* ICP line */}
          <p
            className="text-sm sm:text-base text-[#7A7A7A] italic leading-relaxed mb-8 max-w-2xl animate-fade-in"
            style={{ animationDelay: '0.22s' }}
          >
            {CONFIG.ICP_LINE}
          </p>

          {/* Price micro-card pre-frame */}
          <div
            className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-[#E07A3A]/20 rounded-full pl-3 pr-5 py-2 mb-4 animate-fade-in shadow-[0_1px_2px_rgba(26,26,26,0.04)]"
            style={{ animationDelay: '0.28s' }}
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E07A3A]/12 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-[#C85D25]" strokeWidth={2.5} />
            </div>
            <p className="text-xs sm:text-sm text-[#1A1A1A] font-medium leading-tight text-left">
              <span className="font-bold text-[#C85D25]">Oferta única de R$27.</span>{' '}
              <span className="text-[#4A4A4A]">Entre no grupo para receber.</span>
            </p>
          </div>

          {/* CTA */}
          <div
            className="relative w-full sm:w-auto mb-4 animate-fade-in"
            style={{ animationDelay: '0.34s' }}
          >
            {/* Pulsing glow ring */}
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
                {CONFIG.CTA_TEXT}
                <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-white/30 group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                </span>
              </span>
            </Button>
          </div>

          {/* Reinforcement */}
          <p
            className="text-xs sm:text-sm text-[#7A7A7A] mb-8 animate-fade-in font-medium"
            style={{ animationDelay: '0.4s' }}
          >
            {CONFIG.CTA_REINFORCEMENT}
          </p>

          {/* Trust bar */}
          <div
            className="flex flex-col sm:flex-row sm:justify-center items-center gap-y-2 gap-x-6 mb-14 md:mb-16 animate-fade-in"
            style={{ animationDelay: '0.46s' }}
          >
            {CONFIG.OBJECTIONS.map((objection, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#E07A3A]" />
                <span className="text-xs sm:text-sm text-[#4A4A4A] font-medium leading-tight">
                  {objection}
                </span>
              </div>
            ))}
          </div>

          {/* Diagram */}
          <div
            className="w-full max-w-4xl animate-fade-in"
            style={{ animationDelay: '0.52s' }}
          >
            <div className="relative bg-[#F0EDE8] border border-black/[0.06] rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_20px_40px_-20px_rgba(26,26,26,0.08)]">
              {/* Corner brackets */}
              <CornerBracket corner="tl" className="absolute top-2.5 left-2.5 w-5 h-5 text-[#C85D25]/45" />
              <CornerBracket corner="tr" className="absolute top-2.5 right-2.5 w-5 h-5 text-[#C85D25]/45" />
              <CornerBracket corner="bl" className="absolute bottom-2.5 left-2.5 w-5 h-5 text-[#C85D25]/45" />
              <CornerBracket corner="br" className="absolute bottom-2.5 right-2.5 w-5 h-5 text-[#C85D25]/45" />

              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E07A3A]" />
                  <p className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#C85D25]">
                    O Sistema 10x
                  </p>
                </div>
                <p className="text-[10px] sm:text-[11px] font-mono text-[#7A7A7A] tracking-wider">
                  /live
                </p>
              </div>

              <AgentSwarmAnimation />

              <p className="text-sm text-[#4A4A4A] text-center mt-6 leading-relaxed max-w-md mx-auto">
                {CONFIG.DIAGRAM_CAPTION}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
