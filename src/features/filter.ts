import type { Command } from '../model/types';
import type { RenderedSection } from '../render/sections';

export type FilterMode = 'all' | 'new' | 'old';

export const FILTER_STORAGE_KEY = 'gitcs-f';

const isFilterMode = (value: string | undefined): value is FilterMode =>
  value === 'all' || value === 'new' || value === 'old';

const normalizeQuery = (query: string): string => query.trim().toLowerCase();

export function matchesFilter(command: Command, mode: FilterMode, query: string): boolean {
  const normalized = normalizeQuery(query);
  const eraMatches = mode === 'all' || command.era === mode;
  const haystack = `${command.command} ${command.label} ${command.hint ?? ''}`.toLowerCase();
  return eraMatches && (!normalized || haystack.includes(normalized));
}

export function applyFilter(
  sections: readonly RenderedSection[],
  mode: FilterMode,
  query: string,
): void {
  const hasQuery = normalizeQuery(query) !== '';
  for (const { root, commands, pairs } of sections) {
    let anyVisible = false;
    for (const { button, command } of commands) {
      button.hidden = !matchesFilter(command, mode, query);
      if (!button.hidden) anyVisible = true;
    }
    for (const pair of pairs) pair.hidden = mode !== 'all' || hasQuery;
    root.hidden = !anyVisible;
  }
}

export function initFilter(
  sections: readonly RenderedSection[],
  input: HTMLInputElement,
  buttons: readonly HTMLButtonElement[],
): void {
  let mode: FilterMode = 'all';

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const selected = button.dataset.f;
      if (!isFilterMode(selected)) return;
      mode = selected;
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
      applyFilter(sections, mode, input.value);
      try {
        localStorage.setItem(FILTER_STORAGE_KEY, mode);
      } catch {
        // Хранилище может быть недоступно: фильтр работает и без него.
      }
    });
  }

  input.addEventListener('input', () => applyFilter(sections, mode, input.value));

  try {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (saved) document.getElementById(`f-${saved}`)?.click();
  } catch {
    // См. выше: без сохранённого значения остаётся фильтр «все».
  }
}
