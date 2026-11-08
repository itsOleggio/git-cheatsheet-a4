import type { BranchType } from '../model/types';
import template from '../templates/sheet1.html?raw';
import { byId, el } from '../utils/dom';

function branchRow({ prefix, description, example, color }: BranchType): HTMLTableRowElement {
  return el(
    'tr',
    { attrs: { style: `--c:${color}` } },
    el('td', { text: prefix }),
    el('td', { text: description }),
    el('td', { className: 'ex', text: example }),
  );
}

export function renderSheet1(root: HTMLElement, branchTypes: readonly BranchType[]): void {
  root.innerHTML = template;
  byId('ntab', HTMLTableElement).append(el('tbody', {}, ...branchTypes.map(branchRow)));
}
