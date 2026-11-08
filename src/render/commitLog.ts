import { COMMIT_TYPE_COLORS } from '../data/commits';
import type { CommitLane, CommitRow } from '../model/types';
import { svg } from '../utils/dom';

export interface ParsedSubject {
  type: string;
  /** Текст внутри скобок; undefined, если scope нет. */
  scope?: string;
  breaking: boolean;
  subject: string;
}

const SUBJECT_PATTERN = /^(\w+)(?:\(([^)]*)\))?(!)?:\s(.*)$/;

/** Разбирает заголовок формата `type(scope)!: subject`. */
export function parseCommitSubject(message: string): ParsedSubject | null {
  const match = SUBJECT_PATTERN.exec(message);
  if (!match) return null;
  const [, type = '', scope, bang, subject = ''] = match;
  return { type, ...(scope === undefined ? {} : { scope }), breaking: bang === '!', subject };
}

const MONO = 'JetBrains Mono, monospace';
const TYPE_COLORS: Readonly<Record<string, string>> = COMMIT_TYPE_COLORS;
const LANE_X: Record<CommitLane, number> = { main: 22, feat: 46, hot: 70 };
const LANE_COLOR: Record<CommitLane, string> = {
  main: 'var(--main)',
  feat: 'var(--feat)',
  hot: 'var(--fix)',
};
const ROW_HEIGHT = 24;
const TOP_OFFSET = 14;

const rowY = (index: number): number => TOP_OFFSET + index * ROW_HEIGHT;

const curve = (x1: number, y1: number, x2: number, y2: number): string =>
  `M${x1} ${y1} C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`;

function drawLanes(root: SVGSVGElement): void {
  const { main, feat, hot } = LANE_X;
  const paths = [
    [`M${main} ${rowY(0)} V${rowY(9)}`, 'var(--main)'],
    [`M${feat} ${rowY(2)} V${rowY(6)}`, 'var(--feat)'],
    [curve(main, rowY(8), feat, rowY(6)), 'var(--feat)'],
    [curve(feat, rowY(2), main, rowY(1)), 'var(--feat)'],
    [curve(main, rowY(7), hot, rowY(4)), 'var(--fix)'],
    [curve(hot, rowY(4), main, rowY(3)), 'var(--fix)'],
  ] as const;
  for (const [d, stroke] of paths) {
    root.append(
      svg('path', { d, fill: 'none', stroke, 'stroke-width': 2.5, 'stroke-linecap': 'round' }),
    );
  }
}

function drawMessage(index: number, row: CommitRow): SVGTextElement {
  const text = svg('text', {
    x: 108,
    y: rowY(index) + 3.5,
    'font-family': MONO,
    'font-size': 10.5,
  });
  const part = (content: string, attrs: Readonly<Record<string, string | number>>): void => {
    text.append(svg('tspan', attrs, content));
  };

  part(`${row.hash}  `, { fill: 'var(--muted)' });
  const parsed = parseCommitSubject(row.message);
  if (parsed) {
    part(parsed.type, { fill: TYPE_COLORS[parsed.type] ?? 'var(--fg)', 'font-weight': 700 });
    if (parsed.scope !== undefined) part(`(${parsed.scope})`, { fill: 'var(--rel)' });
    if (parsed.breaking) part('!', { fill: 'var(--warn)' });
    part(`: ${parsed.subject}`, { fill: 'var(--fg)' });
  } else {
    part(row.message, { fill: 'var(--muted)' });
  }
  return text;
}

function drawTag(group: SVGGElement, index: number, tag: string): void {
  const width = tag.length * 6.4 + 12;
  const x = 736 - width;
  group.append(
    svg('rect', {
      x,
      y: rowY(index) - 8,
      width,
      height: 16,
      rx: 3,
      fill: 'none',
      stroke: 'var(--tag)',
      'stroke-width': 1,
    }),
    svg(
      'text',
      {
        x: x + 6,
        y: rowY(index) + 3.5,
        fill: 'var(--tag)',
        'font-family': MONO,
        'font-size': 9.5,
        'font-weight': 700,
      },
      tag,
    ),
  );
}

function drawRow(index: number, row: CommitRow): SVGGElement {
  const group = svg('g', {
    class: 'row',
    tabindex: 0,
    role: 'button',
    'aria-label': `Скопировать: ${row.message}`,
  });
  group.dataset.copy = row.message;
  group.append(
    svg('rect', {
      class: 'hl',
      x: 100,
      y: rowY(index) - 10,
      width: 636,
      height: 20,
      rx: 3,
      fill: 'transparent',
    }),
    svg('circle', {
      cx: LANE_X[row.lane],
      cy: rowY(index),
      r: row.merge ? 6 : 5,
      fill: row.merge ? LANE_COLOR[row.lane] : 'var(--sheet)',
      stroke: LANE_COLOR[row.lane],
      'stroke-width': 2.5,
    }),
    drawMessage(index, row),
  );
  if (row.tag) drawTag(group, index, row.tag);
  return group;
}

export function renderCommitLog(root: SVGSVGElement, rows: readonly CommitRow[]): void {
  drawLanes(root);
  rows.forEach((row, index) => root.append(drawRow(index, row)));
}
