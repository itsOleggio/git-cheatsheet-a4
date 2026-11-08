import { beforeEach, describe, expect, it } from 'vitest';
import { FILTER_STORAGE_KEY, applyFilter, initFilter, matchesFilter } from '../src/features/filter';
import type { Command } from '../src/model/types';
import type { RenderedSection } from '../src/render/sections';

const modern: Command = { command: 'git switch <branch>', label: 'перейти', era: 'new' };
const legacy: Command = {
  command: 'git checkout <branch>',
  label: 'перейти',
  era: 'old',
  hint: 'Перегружена смыслами',
};
const plain: Command = { command: 'git init', label: 'новый репозиторий' };

function section(...commands: Command[]): RenderedSection {
  return {
    root: document.createElement('section'),
    commands: commands.map((command) => ({
      button: document.createElement('button'),
      command,
    })),
    pairs: [document.createElement('div')],
  };
}

describe('matchesFilter', () => {
  it('режим all показывает все команды', () => {
    expect([modern, legacy, plain].every((c) => matchesFilter(c, 'all', ''))).toBe(true);
  });

  it('режимы new и old оставляют только свои команды', () => {
    expect([modern, legacy, plain].filter((c) => matchesFilter(c, 'new', ''))).toEqual([modern]);
    expect([modern, legacy, plain].filter((c) => matchesFilter(c, 'old', ''))).toEqual([legacy]);
  });

  it('поиск идёт по команде, подписи и подсказке без учёта регистра', () => {
    expect(matchesFilter(modern, 'all', '  SWITCH ')).toBe(true);
    expect(matchesFilter(plain, 'all', 'РЕПОЗИТОРИЙ')).toBe(true);
    expect(matchesFilter(legacy, 'all', 'перегружена')).toBe(true);
    expect(matchesFilter(plain, 'all', 'rebase')).toBe(false);
  });

  it('фильтр и поиск действуют вместе', () => {
    expect(matchesFilter(legacy, 'new', 'checkout')).toBe(false);
  });
});

describe('applyFilter', () => {
  it('скрывает раздел, в котором не осталось команд', () => {
    const empty = section(plain);
    const filled = section(modern, plain);
    applyFilter([empty, filled], 'new', '');
    expect(empty.root.hidden).toBe(true);
    expect(filled.root.hidden).toBe(false);
    expect(filled.commands.map(({ button }) => button.hidden)).toEqual([false, true]);
  });

  it('показывает пары только в режиме all и без поиска', () => {
    const target = section(modern);
    applyFilter([target], 'all', '');
    expect(target.pairs[0]?.hidden).toBe(false);
    applyFilter([target], 'all', 'switch');
    expect(target.pairs[0]?.hidden).toBe(true);
    applyFilter([target], 'new', '');
    expect(target.pairs[0]?.hidden).toBe(true);
  });
});

describe('initFilter', () => {
  const button = (mode: string): HTMLButtonElement => {
    const element = document.createElement('button');
    element.id = `f-${mode}`;
    element.dataset.f = mode;
    document.body.append(element);
    return element;
  };

  beforeEach(() => {
    document.body.replaceChildren();
    localStorage.clear();
  });

  it('запоминает выбор и переключает aria-pressed', () => {
    const buttons = [button('all'), button('new')];
    initFilter([section(modern)], document.createElement('input'), buttons);
    buttons[1]?.click();
    expect(localStorage.getItem(FILTER_STORAGE_KEY)).toBe('new');
    expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true']);
  });

  it('восстанавливает сохранённый режим при запуске', () => {
    localStorage.setItem(FILTER_STORAGE_KEY, 'old');
    const target = section(modern, legacy);
    initFilter([target], document.createElement('input'), [button('all'), button('old')]);
    expect(target.commands.map(({ button: b }) => b.hidden)).toEqual([true, false]);
  });
});
