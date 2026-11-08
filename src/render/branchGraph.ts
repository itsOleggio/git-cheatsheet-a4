import { LANE_COLORS } from '../data/commands';
import type { Lane } from '../model/types';
import { svg } from '../utils/dom';

export interface LaneHighlighter {
  highlight(lane: Lane): void;
  clear(): void;
}

interface LaneShape {
  path: string;
  dots: readonly (readonly [x: number, y: number])[];
  label: string;
  labelX: number;
  labelY: number;
}

const MONO = 'JetBrains Mono, monospace';

const DRAW_ORDER = ['feat', 'fix', 'rel', 'main'] as const satisfies readonly Lane[];

const LANE_SHAPES = {
  main: {
    path: 'M10 60 H510',
    dots: [
      [30, 60],
      [90, 60],
      [160, 60],
      [250, 60],
      [330, 60],
      [400, 60],
      [480, 60],
    ],
    label: 'main',
    labelX: 14,
    labelY: 52,
  },
  feat: {
    path: 'M90 60 C110 60 110 100 130 100 H230 C250 100 250 60 250 60',
    dots: [
      [150, 100],
      [190, 100],
      [220, 100],
    ],
    label: 'feature/login',
    labelX: 132,
    labelY: 118,
  },
  fix: {
    path: 'M330 60 C345 60 345 135 360 135 H380 C395 135 400 60 400 60',
    dots: [[365, 135]],
    label: 'hotfix/42',
    labelX: 300,
    labelY: 145,
  },
  rel: {
    path: 'M250 60 C265 60 265 20 280 20 H440 C460 20 460 60 480 60',
    dots: [
      [300, 20],
      [360, 20],
      [420, 20],
    ],
    label: 'release/1.2',
    labelX: 282,
    labelY: 12,
  },
} satisfies Record<Lane, LaneShape>;

function drawLane(lane: Lane): SVGGElement {
  const shape: LaneShape = LANE_SHAPES[lane];
  const color = LANE_COLORS[lane];
  const group = svg('g', { class: 'lane', 'data-l': lane });
  group.append(
    svg('path', {
      d: shape.path,
      fill: 'none',
      stroke: color,
      'stroke-width': 3,
      'stroke-linecap': 'round',
    }),
  );
  for (const [cx, cy] of shape.dots) {
    group.append(
      svg('circle', { cx, cy, r: 5, fill: 'var(--sheet)', stroke: color, 'stroke-width': 2.5 }),
    );
  }
  group.append(
    svg(
      'text',
      { x: shape.labelX, y: shape.labelY, fill: color, 'font-family': MONO, 'font-size': 9 },
      shape.label,
    ),
  );
  return group;
}

export function renderBranchGraph(root: SVGSVGElement): LaneHighlighter {
  for (const lane of DRAW_ORDER) root.append(drawLane(lane));

  const head = svg('g');
  head.append(
    svg('rect', { x: 462, y: 66, width: 38, height: 14, rx: 3, fill: 'var(--fg)' }),
    svg(
      'text',
      {
        x: 468,
        y: 76,
        fill: 'var(--bg)',
        'font-family': MONO,
        'font-size': 8.5,
        'font-weight': 700,
      },
      'HEAD',
    ),
  );
  const tag = svg(
    'text',
    { x: 394, y: 52, fill: 'var(--tag)', 'font-family': MONO, 'font-size': 8.5 },
    '◆ v1.1.1',
  );
  root.append(head, tag);

  return {
    highlight(lane) {
      root.classList.add('dim');
      root.querySelector(`[data-l="${lane}"]`)?.classList.add('on');
    },
    clear() {
      root.classList.remove('dim');
      root.querySelectorAll('.on').forEach((node) => node.classList.remove('on'));
    },
  };
}
