import type { CommitExample, CommitType } from '../model/types';
import template from '../templates/sheet2.html?raw';
import { byId, el } from '../utils/dom';

function typeRow({ name, description, bump, color, bumpColor }: CommitType): HTMLTableRowElement {
  const style = bumpColor ? `--c:${color};--c2:${bumpColor}` : `--c:${color}`;
  return el(
    'tr',
    { attrs: { style } },
    el('td', { text: name }),
    el('td', { text: description }),
    el('td', { text: bump }),
  );
}

function exampleLine(kind: 'no' | 'ok', mark: string, text: string): HTMLDivElement {
  const attrs: Record<string, string> = kind === 'ok' ? { tabindex: '0', role: 'button' } : {};
  return el(
    'div',
    { className: `e ${kind}`, attrs },
    el('i', { text: mark }),
    el('span', { text }),
  );
}

function examplePair({ bad, why, good }: CommitExample): HTMLDivElement {
  return el(
    'div',
    { className: 'pairx' },
    exampleLine('no', '✗', bad),
    el('div', { className: 'why', text: why }),
    exampleLine('ok', '✓', good),
  );
}

export function renderSheet2(
  root: HTMLElement,
  types: readonly CommitType[],
  examples: readonly CommitExample[],
): void {
  root.innerHTML = template;
  byId('ttab', HTMLTableElement).append(el('tbody', {}, ...types.map(typeRow)));
  byId('ex-list', HTMLDivElement).append(...examples.map(examplePair));
}
