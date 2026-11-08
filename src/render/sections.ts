import { LANE_COLORS } from '../data/commands';
import type { Command, Section } from '../model/types';
import { el } from '../utils/dom';
import type { LaneHighlighter } from './branchGraph';

export interface RenderedCommand {
  button: HTMLButtonElement;
  command: Command;
}

export interface RenderedSection {
  root: HTMLElement;
  commands: readonly RenderedCommand[];
  pairs: readonly HTMLElement[];
}

export type CommandLookup = (target: EventTarget | null) => RenderedCommand | undefined;

function renderCommand(command: Command): RenderedCommand {
  const button = el('button', { className: `cmd${command.warning ? ' danger' : ''}` });
  button.dataset.t = command.era ?? '';
  button.append(el('code', { text: command.command }));
  if (command.era) {
    button.append(
      el('span', { className: `badge ${command.era}`, text: command.era.toUpperCase() }),
    );
  }
  button.append(el('span', { className: 'd', text: command.label }));
  return { button, command };
}

function renderPair([before, after]: readonly [string, string]): HTMLElement {
  return el(
    'div',
    { className: 'pair' },
    el('span', { text: before }),
    ' ',
    el('span', { className: 'arrow', text: '→' }),
    ' ',
    el('span', { text: after, attrs: { style: 'color:var(--fg)' } }),
  );
}

export function renderSections(
  grid: HTMLElement,
  sections: readonly Section[],
  graph: LaneHighlighter,
): RenderedSection[] {
  return sections.map((section) => {
    const root = el('section', { className: 'sec' });
    root.style.setProperty('--c', LANE_COLORS[section.lane]);
    root.dataset.l = section.lane;
    root.append(el('h2', { text: section.title }));

    const commands = section.commands.map(renderCommand);
    root.append(...commands.map(({ button }) => button));
    const pairs = (section.pairs ?? []).map(renderPair);
    root.append(...pairs);

    root.addEventListener('mouseenter', () => graph.highlight(section.lane));
    root.addEventListener('mouseleave', () => graph.clear());
    grid.append(root);
    return { root, commands, pairs };
  });
}

export function createCommandLookup(sections: readonly RenderedSection[]): CommandLookup {
  const byButton = new Map<Element, RenderedCommand>(
    sections.flatMap(({ commands }) => commands.map((item) => [item.button, item] as const)),
  );
  return (target) => {
    if (!(target instanceof Element)) return undefined;
    const button = target.closest('.cmd');
    return button ? byButton.get(button) : undefined;
  };
}
