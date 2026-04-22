/**
 * ImersaoUseCasesSection
 *
 * Graph view estilo Obsidian: nodes oscilam organicamente em torno das
 * posições base (dois senoides defasados por node), edges recalculam
 * a cada frame via gsap.ticker.
 *
 * Centro = VOCÊ (Mission Control). 4 hubs (Conteúdo, Vendas, Entrega,
 * Gestão). 12 leaves (tarefas operacionais). Hover amplia o node,
 * destaca edges conectadas e aumenta seu label.
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { StippleGrid, PlusMark, Asterisk } from './VectorDecor';

type NodeType = 'center' | 'hub' | 'leaf';

interface GraphNode {
  id: string;
  bx: number;
  by: number;
  r: number;
  label: string;
  type: NodeType;
  phaseX: number;
  phaseY: number;
  freqX: number;
  freqY: number;
  amp: number;
  labelOffset: [number, number];
  labelAnchor: 'start' | 'middle' | 'end';
}

interface GraphEdge {
  from: number;
  to: number;
  opacity: number;
}

const VIEWBOX_W = 620;
const VIEWBOX_H = 460;
const CX = VIEWBOX_W / 2;
const CY = VIEWBOX_H / 2;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const buildGraph = (): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const HUB_RADIUS = 150;
  const LEAF_RADIUS = 85;

  const hubConfig = [
    { label: 'Conteúdo', angle: 210 }, // top-left
    { label: 'Vendas', angle: 330 }, // top-right
    { label: 'Entrega', angle: 150 }, // bottom-left
    { label: 'Gestão', angle: 30 }, // bottom-right
  ];

  const leavesPerHub: Record<string, string[]> = {
    Conteúdo: ['Roteiros', 'Posts', 'Copy ads'],
    Vendas: ['Leads', 'Follow-up', 'Pipeline'],
    Entrega: ['Onboarding', 'ChatFunnel', 'Atendimento'],
    Gestão: ['Dashboards', 'KPIs', 'Alertas'],
  };

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const makeMotion = (ampBase: number) => ({
    phaseX: rand(0, Math.PI * 2),
    phaseY: rand(0, Math.PI * 2),
    freqX: rand(0.35, 0.7),
    freqY: rand(0.35, 0.7),
    amp: ampBase,
  });

  // Center
  nodes.push({
    id: 'center',
    bx: CX,
    by: CY,
    r: 24,
    label: 'VOCÊ',
    type: 'center',
    ...makeMotion(3),
    labelOffset: [0, 5],
    labelAnchor: 'middle',
  });

  // Hubs
  hubConfig.forEach((h, i) => {
    const rad = (h.angle * Math.PI) / 180;
    nodes.push({
      id: `hub-${i}`,
      bx: CX + HUB_RADIUS * Math.cos(rad),
      by: CY + HUB_RADIUS * Math.sin(rad),
      r: 10,
      label: h.label,
      type: 'hub',
      ...makeMotion(9),
      labelOffset: [0, -16],
      labelAnchor: 'middle',
    });
  });

  // Leaves
  const centerIdx = 0;
  hubConfig.forEach((h, hi) => {
    const hubIdx = hi + 1;
    const leafList = leavesPerHub[h.label];
    const hubAngle = h.angle;
    const hubRad = (hubAngle * Math.PI) / 180;
    const hubX = CX + HUB_RADIUS * Math.cos(hubRad);
    const hubY = CY + HUB_RADIUS * Math.sin(hubRad);

    leafList.forEach((leafLabel, li) => {
      // espalha em arco em torno do hub, apontando pra fora do centro
      const baseAngle = hubAngle + (li - 1) * 28;
      const rad = (baseAngle * Math.PI) / 180;
      const lx = hubX + LEAF_RADIUS * Math.cos(rad);
      const ly = hubY + LEAF_RADIUS * Math.sin(rad);
      const isLeftSide = lx < CX;

      nodes.push({
        id: `leaf-${hi}-${li}`,
        bx: lx,
        by: ly,
        r: 4.5,
        label: leafLabel,
        type: 'leaf',
        ...makeMotion(14),
        labelOffset: [isLeftSide ? -9 : 9, 4],
        labelAnchor: isLeftSide ? 'end' : 'start',
      });

      const leafIdx = nodes.length - 1;
      edges.push({ from: hubIdx, to: leafIdx, opacity: 0.4 });
    });

    edges.push({ from: centerIdx, to: hubIdx, opacity: 0.55 });
  });

  // cross-hub edges (pra dar vibe Obsidian com malha interconectada)
  edges.push({ from: 1, to: 2, opacity: 0.14 });
  edges.push({ from: 3, to: 4, opacity: 0.14 });
  edges.push({ from: 1, to: 3, opacity: 0.1 });
  edges.push({ from: 2, to: 4, opacity: 0.1 });

  return { nodes, edges };
};

const InteractiveGraph = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const graphRef = useRef<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(null);
  if (graphRef.current === null) graphRef.current = buildGraph();
  const { nodes, edges } = graphRef.current;

  const nodeGroupRefs = useRef<(SVGGElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const positionsRef = useRef(nodes.map((n) => ({ x: n.bx, y: n.by })));
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!nodes.length) return;

    const tick = () => {
      if (startRef.current === null) startRef.current = performance.now() / 1000;
      const t = performance.now() / 1000 - startRef.current;

      // Atualiza posições orgânicas dos nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const p = positionsRef.current[i];
        p.x =
          n.bx +
          Math.sin(t * n.freqX + n.phaseX) * n.amp * 0.7 +
          Math.cos(t * n.freqX * 0.5 + n.phaseX * 1.3) * n.amp * 0.3;
        p.y =
          n.by +
          Math.cos(t * n.freqY + n.phaseY) * n.amp * 0.7 +
          Math.sin(t * n.freqY * 0.5 + n.phaseY * 1.3) * n.amp * 0.3;

        const g = nodeGroupRefs.current[i];
        if (g) g.setAttribute('transform', `translate(${p.x - n.bx} ${p.y - n.by})`);
      }

      // Atualiza edges
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const line = lineRefs.current[i];
        if (!line) continue;
        const a = positionsRef.current[e.from];
        const b = positionsRef.current[e.to];
        line.setAttribute('x1', String(a.x));
        line.setAttribute('y1', String(a.y));
        line.setAttribute('x2', String(b.x));
        line.setAttribute('y2', String(b.y));
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [nodes, edges]);

  // Entrada com stagger
  useEffect(() => {
    const timeline = gsap.timeline();
    timeline.fromTo(
      nodeGroupRefs.current.filter(Boolean) as SVGGElement[],
      { opacity: 0, scale: 0.4 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.04,
        ease: 'back.out(1.6)',
        transformOrigin: 'center',
      },
    );
    timeline.fromTo(
      lineRefs.current.filter(Boolean) as SVGLineElement[],
      { opacity: 0 },
      { opacity: 1, duration: 0.5, stagger: 0.02, ease: 'power2.out' },
      '<0.2',
    );
    return () => {
      timeline.kill();
    };
  }, []);

  // Hover glow/scale
  useEffect(() => {
    nodes.forEach((n, i) => {
      const g = nodeGroupRefs.current[i];
      if (!g) return;
      const targetScale = hoveredIdx === i ? 1.35 : 1;
      gsap.to(g, { scale: targetScale, duration: 0.3, ease: 'power2.out', transformOrigin: 'center' });
    });
  }, [hoveredIdx, nodes]);

  const getEdgeHighlight = (edgeIdx: number) => {
    if (hoveredIdx === null) return null;
    const e = edges[edgeIdx];
    return e.from === hoveredIdx || e.to === hoveredIdx;
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        className="w-full h-auto"
        role="img"
        aria-labelledby="usecases-title usecases-desc"
      >
        <title id="usecases-title">Mapa de operações dos agentes</title>
        <desc id="usecases-desc">
          Grafo interativo conectando o operador central às 4 frentes da operação e suas tarefas autônomas.
        </desc>

        <defs>
          <radialGradient id="graphCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E07A3A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#E07A3A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="graphHubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E07A3A" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#E07A3A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center ambient halo */}
        <circle cx={CX} cy={CY} r={80} fill="url(#graphCenterGlow)" />

        {/* Edges layer */}
        <g>
          {edges.map((edge, i) => {
            const highlighted = getEdgeHighlight(i);
            const dimmed = hoveredIdx !== null && !highlighted;
            return (
              <line
                key={`edge-${i}`}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                x1={nodes[edge.from].bx}
                y1={nodes[edge.from].by}
                x2={nodes[edge.to].bx}
                y2={nodes[edge.to].by}
                stroke={highlighted ? '#E07A3A' : '#C85D25'}
                strokeWidth={highlighted ? 1.4 : 1}
                strokeLinecap="round"
                opacity={dimmed ? edge.opacity * 0.25 : edge.opacity}
                style={{ transition: 'opacity 0.25s, stroke-width 0.25s, stroke 0.25s' }}
              />
            );
          })}
        </g>

        {/* Nodes layer */}
        <g>
          {nodes.map((node, i) => {
            const isHovered = hoveredIdx === i;
            const isDimmed = hoveredIdx !== null && !isHovered && !edges.some((e) => (e.from === hoveredIdx || e.to === hoveredIdx) && (e.from === i || e.to === i));
            const nodeFill =
              node.type === 'center' ? '#FAF9F7' : node.type === 'hub' ? '#E07A3A' : '#C85D25';
            const nodeStroke =
              node.type === 'center' ? '#E07A3A' : node.type === 'hub' ? '#FAF9F7' : 'none';
            const nodeStrokeWidth = node.type === 'center' ? 1.6 : node.type === 'hub' ? 2.5 : 0;
            const labelColor =
              node.type === 'center' ? '#C85D25' : node.type === 'hub' ? '#1A1A1A' : '#4A4A4A';
            const labelSize = node.type === 'center' ? 11 : node.type === 'hub' ? 13 : 11;
            const labelWeight = node.type === 'leaf' ? 500 : 700;

            return (
              <g
                key={node.id}
                ref={(el) => {
                  nodeGroupRefs.current[i] = el;
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  cursor: 'pointer',
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  opacity: isDimmed ? 0.4 : 1,
                  transition: 'opacity 0.25s',
                }}
              >
                {/* Halo for hub/center */}
                {(node.type === 'center' || node.type === 'hub') && (
                  <circle cx={node.bx} cy={node.by} r={node.r * 2.6} fill="url(#graphHubGlow)" />
                )}
                <circle
                  cx={node.bx}
                  cy={node.by}
                  r={node.r}
                  fill={nodeFill}
                  stroke={nodeStroke}
                  strokeWidth={nodeStrokeWidth}
                />
                {node.type === 'center' && (
                  <text
                    x={node.bx + node.labelOffset[0]}
                    y={node.by + node.labelOffset[1]}
                    textAnchor={node.labelAnchor}
                    fill={labelColor}
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="ui-monospace, Menlo, monospace"
                  >
                    {node.label}
                  </text>
                )}
                {node.type !== 'center' && (
                  <text
                    x={node.bx + node.labelOffset[0]}
                    y={node.by + node.labelOffset[1]}
                    textAnchor={node.labelAnchor}
                    fill={labelColor}
                    fontSize={labelSize}
                    fontWeight={labelWeight}
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                    style={{
                      textDecoration: node.type === 'leaf' ? 'underline' : 'none',
                      textDecorationColor: 'rgba(200, 93, 37, 0.3)',
                      textUnderlineOffset: '4px',
                    }}
                  >
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export const ImersaoUseCasesSection = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#FAF9F7] relative overflow-hidden">
      {/* Vector decoration */}
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
      <PlusMark className="absolute top-10 left-10 w-3.5 h-3.5 text-[#C85D25]/55 pointer-events-none" />
      <PlusMark className="absolute bottom-10 right-10 w-3.5 h-3.5 text-[#C85D25]/55 pointer-events-none" />
      <Asterisk className="absolute top-1/2 left-6 w-4 h-4 text-[#E07A3A]/40 pointer-events-none hidden xl:block" />
      <Asterisk className="absolute top-1/2 right-6 w-4 h-4 text-[#E07A3A]/40 pointer-events-none hidden xl:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[#C85D25] text-xs font-semibold tracking-widest uppercase mb-3">
              ONDE OS AGENTES OPERAM
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight leading-[1.1] mb-4">
              Tudo que costumava ser{' '}
              <span
                className="text-[#C85D25] italic"
                style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
              >
                gargalo
              </span>
              , agora roda sozinho.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#4A4A4A] leading-relaxed max-w-2xl mx-auto">
              Você instrui uma vez. 10 agentes distribuem o trabalho em 4 frentes
              da operação. Passe o mouse nos nodes pra ver o que eles fazem.
            </p>
          </div>

          <InteractiveGraph />

          <p className="text-center text-xs sm:text-sm text-[#7A7A7A] mt-10 md:mt-14 max-w-xl mx-auto leading-relaxed">
            16 frentes ativas · 1 instrução sua dispara o pipeline inteiro · Você no Mission Control.
          </p>
        </div>
      </div>
    </section>
  );
};
