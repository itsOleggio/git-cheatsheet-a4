import type { Command } from '../model/types';
import type { CommandLookup } from '../render/sections';
import { el } from '../utils/dom';

const ERA_SUFFIX = { new: ' · новый способ', old: ' · старый способ' } as const;

function heading(command: Command): string {
  const { label, era } = command;
  return label.charAt(0).toUpperCase() + label.slice(1) + (era ? ERA_SUFFIX[era] : '');
}

function content(command: Command, description: string | undefined): HTMLElement[] {
  const nodes = [
    el('code', { text: command.command }),
    el('div', { className: 'tl', text: heading(command) }),
    el('div', { text: description || command.hint || '' }),
  ];
  if (command.hint && description) {
    nodes.push(el('div', { className: 'ex', text: `→ ${command.hint}` }));
  }
  if (command.warning) nodes.push(el('div', { className: 'w', text: `⚠ ${command.warning}` }));
  return nodes;
}

export function initTooltip(
  grid: HTMLElement,
  tip: HTMLElement,
  lookup: CommandLookup,
  descriptions: Readonly<Record<string, string>>,
): void {
  grid.addEventListener('mousemove', (event) => {
    const found = lookup(event.target);
    if (!found) {
      tip.hidden = true;
      return;
    }
    tip.replaceChildren(...content(found.command, descriptions[found.command.command]));
    tip.hidden = false;

    const rect = tip.getBoundingClientRect();
    let x = event.clientX + 14;
    let y = event.clientY + 14;
    if (x + rect.width > innerWidth - 8) x = event.clientX - rect.width - 14;
    if (y + rect.height > innerHeight - 8) y = event.clientY - rect.height - 14;
    tip.style.left = `${Math.max(8, x)}px`;
    tip.style.top = `${Math.max(8, y)}px`;
  });
  grid.addEventListener('mouseleave', () => {
    tip.hidden = true;
  });
}
