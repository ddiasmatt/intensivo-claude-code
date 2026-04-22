/**
 * VectorDecor
 *
 * Biblioteca de vetores decorativos no estilo Anthropic:
 * line-art fino, patterns de pontos, plus marks, arcs tracejados,
 * constellations e hatches. Todos usam currentColor para permitir
 * tintar pela classe Tailwind (ex: text-[#E07A3A]/25).
 *
 * Uso:
 *   <StippleGrid className="absolute top-6 left-6 w-40 h-40 text-[#E07A3A]/25" />
 *   <PlusMark className="absolute top-10 right-10 w-4 h-4 text-[#C85D25]/40" />
 */

import type { SVGProps } from 'react';

type BaseProps = Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'fill' | 'stroke'> & {
  className?: string;
};

/**
 * StippleGrid
 * Matriz de pontos com fade radial. Bom para fundos/cantos.
 */
export const StippleGrid = ({
  cols = 10,
  rows = 10,
  spacing = 14,
  size = 1.3,
  fade = true,
  className,
  ...rest
}: BaseProps & {
  cols?: number;
  rows?: number;
  spacing?: number;
  size?: number;
  fade?: boolean;
}) => {
  const width = cols * spacing;
  const height = rows * spacing;
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.hypot(cx, cy);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const px = c * spacing + spacing / 2;
          const py = r * spacing + spacing / 2;
          const dist = Math.hypot(px - cx, py - cy);
          const opacity = fade ? Math.max(0.15, 1 - dist / maxDist) : 1;
          return <circle key={`${r}-${c}`} cx={px} cy={py} r={size} opacity={opacity} />;
        })
      )}
    </svg>
  );
};

/**
 * PlusMark
 * Cross "+" fino. Usar em cantos como âncora visual.
 */
export const PlusMark = ({ className, ...rest }: BaseProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    <line x1="8" y1="1" x2="8" y2="15" />
    <line x1="1" y1="8" x2="15" y2="8" />
  </svg>
);

/**
 * Asterisk
 * "*" 6 pontas sutil. Marcador pequeno.
 */
export const Asterisk = ({ className, ...rest }: BaseProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    <line x1="8" y1="2" x2="8" y2="14" />
    <line x1="2.5" y1="4.5" x2="13.5" y2="11.5" />
    <line x1="13.5" y1="4.5" x2="2.5" y2="11.5" />
  </svg>
);

/**
 * DashArc
 * Arco tracejado 180. Decoração curvada, bom pra cercar seções.
 */
export const DashArc = ({
  className,
  strokeWidth = 1,
  dashArray = '3 7',
  flip = false,
  ...rest
}: BaseProps & { strokeWidth?: number; dashArray?: string; flip?: boolean }) => (
  <svg
    viewBox="0 0 200 110"
    fill="none"
    stroke="currentColor"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    <path
      d={flip ? 'M 10 10 A 95 95 0 0 0 190 10' : 'M 10 100 A 95 95 0 0 1 190 100'}
      strokeWidth={strokeWidth}
      strokeDasharray={dashArray}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * HatchLines
 * Linhas diagonais paralelas. Bom pra fundo de blocos.
 */
export const HatchLines = ({
  className,
  count = 12,
  angle = 45,
  strokeWidth = 0.6,
  ...rest
}: BaseProps & { count?: number; angle?: number; strokeWidth?: number }) => {
  void angle;
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {Array.from({ length: count }).map((_, i) => {
        const offset = (i * 120) / count - 20;
        return (
          <line
            key={i}
            x1={-20}
            y1={offset + 40}
            x2={offset + 120}
            y2={-60 + offset}
            strokeWidth={strokeWidth}
          />
        );
      })}
    </svg>
  );
};

/**
 * Constellation
 * Pontos conectados por linhas finas tracejadas. Decoração orgânica.
 */
export const Constellation = ({ className, ...rest }: BaseProps) => {
  const points: Array<[number, number]> = [
    [15, 25],
    [48, 12],
    [85, 30],
    [70, 58],
    [92, 82],
    [40, 70],
    [10, 55],
  ];
  return (
    <svg
      viewBox="0 0 100 95"
      fill="currentColor"
      stroke="currentColor"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {points.slice(0, -1).map(([x1, y1], i) => {
        const [x2, y2] = points[i + 1];
        return (
          <line
            key={`l-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth="0.5"
            strokeDasharray="1.5 3"
            fill="none"
            opacity="0.7"
          />
        );
      })}
      {points.map(([cx, cy], i) => (
        <circle key={`c-${i}`} cx={cx} cy={cy} r={i === 0 || i === points.length - 1 ? 1.8 : 1.2} />
      ))}
    </svg>
  );
};

/**
 * OrbitTicks
 * Pequenas marcas radiais saindo de um centro. Pseudo-radar/instrumento.
 */
export const OrbitTicks = ({
  className,
  count = 24,
  innerR = 30,
  outerR = 45,
  strokeWidth = 0.6,
  ...rest
}: BaseProps & {
  count?: number;
  innerR?: number;
  outerR?: number;
  strokeWidth?: number;
}) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    {Array.from({ length: count }).map((_, i) => {
      const angle = (i * 360) / count;
      const rad = (angle * Math.PI) / 180;
      const x1 = 50 + innerR * Math.cos(rad);
      const y1 = 50 + innerR * Math.sin(rad);
      const x2 = 50 + outerR * Math.cos(rad);
      const y2 = 50 + outerR * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={strokeWidth} />;
    })}
  </svg>
);

/**
 * WaveLine
 * Onda senoidal tracejada horizontal. Bom pra separadores.
 */
export const WaveLine = ({
  className,
  strokeWidth = 1,
  dashArray = '4 6',
  ...rest
}: BaseProps & { strokeWidth?: number; dashArray?: string }) => (
  <svg
    viewBox="0 0 300 40"
    fill="none"
    stroke="currentColor"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    <path
      d="M 0 20 Q 37 4, 75 20 T 150 20 T 225 20 T 300 20"
      strokeWidth={strokeWidth}
      strokeDasharray={dashArray}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * CornerBracket
 * L-bracket no canto. Anthropic usa pra "marcar" blocos/frames.
 */
export const CornerBracket = ({
  className,
  corner = 'tl',
  size = 24,
  strokeWidth = 1.2,
  ...rest
}: BaseProps & { corner?: 'tl' | 'tr' | 'bl' | 'br'; size?: number; strokeWidth?: number }) => {
  const paths: Record<string, string> = {
    tl: `M 2 ${size} L 2 2 L ${size} 2`,
    tr: `M ${32 - size} 2 L 30 2 L 30 ${size}`,
    bl: `M 2 ${32 - size} L 2 30 L ${size} 30`,
    br: `M 30 ${32 - size} L 30 30 L ${32 - size} 30`,
  };
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <path d={paths[corner]} />
    </svg>
  );
};
