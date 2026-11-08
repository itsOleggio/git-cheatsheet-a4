import type { Lane, Section } from '../model/types';

export const LANE_COLORS = {
  main: 'var(--main)',
  feat: 'var(--feat)',
  fix: 'var(--fix)',
  rel: 'var(--rel)',
} satisfies Record<Lane, string>;

export const SECTIONS = [
  {
    title: 'Настройка',
    lane: 'main',
    commands: [
      { command: 'git config --global user.name "Имя"', label: 'имя автора' },
      { command: 'git config --global user.email "a@b.c"', label: 'почта автора' },
      { command: 'git config --global init.defaultBranch main', label: 'ветка по умолч.' },
      { command: 'git init', label: 'новый репозиторий' },
      { command: 'git clone <url>', label: 'скопировать репо' },
      {
        command: 'git clone --depth 1 <url>',
        label: 'только последний',
        hint: 'Shallow clone: без истории, быстро для CI',
      },
      {
        command: 'git clone --filter=blob:none <url>',
        label: 'partial clone',
        era: 'new',
        hint: 'Файлы подкачиваются по требованию — быстро для больших репо',
      },
    ],
  },
  {
    title: 'Изменения',
    lane: 'main',
    commands: [
      { command: 'git status -sb', label: 'краткий статус' },
      { command: 'git add <file>', label: 'в индекс' },
      {
        command: 'git add -p',
        label: 'по кусочкам',
        hint: 'Интерактивно выбираешь, какие ханки добавить',
      },
      { command: 'git commit -m "msg"', label: 'коммит' },
      {
        command: 'git commit --amend',
        label: 'поправить последний',
        warning: 'Меняет хэш — не делай после push',
      },
      { command: 'git diff', label: 'рабочая vs индекс' },
      { command: 'git diff --staged', label: 'индекс vs HEAD' },
      { command: 'git rm --cached <file>', label: 'убрать из git' },
    ],
  },
  {
    title: 'Ветки',
    lane: 'feat',
    pairs: [
      ['git checkout <br>', 'git switch <br>'],
      ['git checkout -b <br>', 'git switch -c <br>'],
    ],
    commands: [
      { command: 'git switch <branch>', label: 'перейти', era: 'new' },
      {
        command: 'git checkout <branch>',
        label: 'перейти',
        era: 'old',
        hint: 'Перегружена смыслами — используй switch/restore',
      },
      { command: 'git switch -c <new>', label: 'создать+перейти', era: 'new' },
      { command: 'git checkout -b <new>', label: 'создать+перейти', era: 'old' },
      { command: 'git switch -', label: 'предыдущая ветка', era: 'new' },
      { command: 'git branch -vv', label: 'список + upstream' },
      { command: 'git branch -m <new>', label: 'переименовать' },
      { command: 'git branch -d <br>', label: 'удалить (смерж.)' },
      {
        command: 'git branch -D <br>',
        label: 'удалить силой',
        warning: 'Несмерженные коммиты останутся только в reflog',
      },
    ],
  },
  {
    title: 'Отмена',
    lane: 'fix',
    pairs: [
      ['git checkout -- f', 'git restore f'],
      ['git reset HEAD f', 'git restore --staged f'],
    ],
    commands: [
      {
        command: 'git restore <file>',
        label: 'сбросить файл',
        era: 'new',
        warning: 'Несохранённые правки файла пропадут',
      },
      {
        command: 'git checkout -- <file>',
        label: 'сбросить файл',
        era: 'old',
        warning: 'Несохранённые правки файла пропадут',
      },
      { command: 'git restore --staged <file>', label: 'из индекса', era: 'new' },
      { command: 'git reset HEAD <file>', label: 'из индекса', era: 'old' },
      { command: 'git restore -s HEAD~1 <file>', label: 'версия из коммита', era: 'new' },
      { command: 'git reset --soft HEAD~1', label: 'откат, правки в индексе' },
      { command: 'git reset --mixed HEAD~1', label: 'откат, правки в файлах' },
      {
        command: 'git reset --hard HEAD~1',
        label: 'откат начисто',
        warning: 'Удаляет коммит и все правки',
      },
      {
        command: 'git revert <sha>',
        label: 'анти-коммит',
        hint: 'Безопасно для общих веток — история не переписывается',
      },
      {
        command: 'git clean -fd',
        label: 'удалить untracked',
        warning: 'Удаляет неотслеживаемые файлы безвозвратно. Сначала git clean -n',
      },
    ],
  },
  {
    title: 'Слияние',
    lane: 'feat',
    commands: [
      { command: 'git merge <br>', label: 'влить ветку' },
      { command: 'git merge --no-ff <br>', label: 'всегда merge-коммит' },
      { command: 'git merge --squash <br>', label: 'одним коммитом' },
      {
        command: 'git rebase main',
        label: 'перенести на main',
        warning: 'Переписывает историю ветки',
      },
      {
        command: 'git rebase -i HEAD~3',
        label: 'squash / reword',
        hint: 'pick, squash, fixup, reword, drop',
      },
      {
        command: 'git rebase --update-refs',
        label: 'двигать стек веток',
        era: 'new',
        hint: 'Git 2.38+: обновляет все ветки стека при rebase',
      },
      { command: 'git cherry-pick <sha>', label: 'взять коммит' },
      { command: 'git merge --abort', label: 'отменить merge' },
    ],
  },
  {
    title: 'Удалённые',
    lane: 'rel',
    commands: [
      { command: 'git remote -v', label: 'список remote' },
      { command: 'git fetch --prune', label: 'скачать, без слияния' },
      { command: 'git pull --rebase', label: 'забрать + rebase' },
      { command: 'git push -u origin <br>', label: 'первый push' },
      {
        command: 'git push --force-with-lease',
        label: 'безопасный force',
        era: 'new',
        hint: 'Не затрёт чужие коммиты, в отличие от --force',
      },
      {
        command: 'git push --force',
        label: 'перезаписать',
        era: 'old',
        warning: 'Может затереть чужую работу на сервере',
      },
      { command: 'git push origin --delete <br>', label: 'удалить ветку' },
      { command: 'git push --tags', label: 'отправить теги' },
    ],
  },
  {
    title: 'Stash',
    lane: 'rel',
    commands: [
      { command: 'git stash push -m "wip"', label: 'спрятать', era: 'new' },
      {
        command: 'git stash save "wip"',
        label: 'спрятать',
        era: 'old',
        hint: 'Устарело с 2.16 — используй stash push',
      },
      { command: 'git stash -u', label: '+ untracked' },
      { command: 'git stash list', label: 'список' },
      { command: 'git stash pop', label: 'достать и удалить' },
      { command: 'git stash apply stash@{1}', label: 'достать копию' },
    ],
  },
  {
    title: 'История',
    lane: 'main',
    commands: [
      { command: 'git log --oneline --graph --all', label: 'граф веток' },
      { command: 'git log -p <file>', label: 'история файла' },
      { command: 'git show <sha>', label: 'что в коммите' },
      { command: 'git blame -L 10,20 <f>', label: 'кто писал строки' },
      {
        command: 'git reflog',
        label: 'найти потерянное',
        hint: 'Все перемещения HEAD — тут найдёшь «потерянное»',
      },
      { command: 'git bisect start', label: 'поиск бага' },
      { command: 'git grep "TODO"', label: 'поиск в коде' },
      { command: 'git tag -a v1.0 -m "…"', label: 'тег релиза' },
    ],
  },
  {
    title: 'Современный Git',
    lane: 'fix',
    commands: [
      {
        command: 'git worktree add ../hf hotfix',
        label: '2-я рабочая папка',
        era: 'new',
        hint: 'Две ветки открыты одновременно, без stash',
      },
      { command: 'git sparse-checkout set src/', label: 'часть монорепо', era: 'new' },
      { command: 'git maintenance start', label: 'фоновая оптимизация', era: 'new' },
      { command: 'git switch --detach <sha>', label: 'detached HEAD', era: 'new' },
      { command: 'git range-diff A...B', label: 'сравнить версии PR', era: 'new' },
      {
        command: 'git commit --fixup=<sha>',
        label: 'фикс к коммиту',
        hint: 'Потом git rebase -i --autosquash',
      },
      { command: 'git config rerere.enabled true', label: 'помнить конфликты' },
    ],
  },
] satisfies Section[];
