import { describe, expect, it } from 'vitest';
import { BRANCH_TYPES } from '../src/data/branches';
import { SECTIONS } from '../src/data/commands';
import { COMMIT_EXAMPLES, COMMIT_HISTORY, COMMIT_TYPES } from '../src/data/commits';
import { DESCRIPTIONS } from '../src/data/descriptions';
import type { Command, Section } from '../src/model/types';

const sections: readonly Section[] = SECTIONS;
const commands: readonly Command[] = sections.flatMap((section) => section.commands);
const names = commands.map((command) => command.command);

describe('команды', () => {
  it('9 разделов и 71 команда, как указано в README', () => {
    expect(sections).toHaveLength(9);
    expect(commands).toHaveLength(71);
  });

  it('у каждой команды есть подробное описание', () => {
    const descriptions: Readonly<Record<string, string>> = DESCRIPTIONS;
    expect(names.filter((name) => !descriptions[name]?.trim())).toEqual([]);
  });

  it('нет описаний для несуществующих команд', () => {
    expect(Object.keys(DESCRIPTIONS).filter((key) => !names.includes(key))).toEqual([]);
  });

  it('команды не дублируются', () => {
    expect(new Set(names).size).toBe(names.length);
  });

  it('у каждой команды есть короткая подпись', () => {
    expect(commands.filter((command) => !command.label.trim())).toEqual([]);
  });

  it('пометки NEW/OLD принимают только допустимые значения', () => {
    const eras = commands.flatMap((command) => (command.era ? [command.era] : []));
    expect(new Set(eras)).toEqual(new Set(['new', 'old']));
  });

  it('разделы с парами «старая → новая» содержат и старые, и новые команды', () => {
    for (const section of sections.filter(({ pairs }) => pairs?.length)) {
      const eras = section.commands.map((command) => command.era);
      expect(eras, section.title).toContain('new');
      expect(eras, section.title).toContain('old');
    }
  });
});

describe('таблицы и история', () => {
  it('полнота данных совпадает с исходной вёрсткой', () => {
    expect(BRANCH_TYPES).toHaveLength(9);
    expect(COMMIT_TYPES).toHaveLength(12);
    expect(COMMIT_EXAMPLES).toHaveLength(5);
    expect(COMMIT_HISTORY).toHaveLength(10);
  });

  it('хэши коммитов в истории уникальны', () => {
    const hashes = COMMIT_HISTORY.map((row) => row.hash);
    expect(new Set(hashes).size).toBe(hashes.length);
  });
});
