import type { CommitExample, CommitRow, CommitType } from '../model/types';

export const COMMIT_TYPE_COLORS = {
  feat: 'var(--feat)',
  fix: 'var(--fix)',
  refactor: '#2dd4bf',
  perf: '#facc15',
  test: '#a3e635',
  docs: 'var(--rel)',
  ci: 'var(--muted)',
  chore: 'var(--muted)',
  build: 'var(--muted)',
  style: 'var(--muted)',
  revert: 'var(--warn)',
} satisfies Record<string, string>;

export const COMMIT_HISTORY = [
  { lane: 'main', hash: 'e41b7d2', message: 'chore(release): 1.5.0 [skip ci]', tag: 'v1.5.0' },
  {
    lane: 'main',
    hash: '9c03a1f',
    message: 'Merge pull request #142 from feature/SHOP-142-cart-promo-code',
    merge: true,
  },
  { lane: 'feat', hash: '5d2e8b0', message: 'test(cart): cover promo code validation' },
  {
    lane: 'main',
    hash: '77af3c4',
    message: 'Merge pull request #151 from hotfix/1.4.1-payment-timeout',
    tag: 'v1.4.1',
    merge: true,
  },
  { lane: 'hot', hash: 'b18f6e9', message: 'fix(payment): retry request on gateway timeout' },
  { lane: 'feat', hash: 'c4a9e12', message: 'refactor(cart): extract usePromoCode hook' },
  { lane: 'feat', hash: '0f6d3ab', message: 'feat(cart): add promo code field' },
  { lane: 'main', hash: '3e8c5a7', message: 'chore(release): 1.4.0 [skip ci]', tag: 'v1.4.0' },
  { lane: 'main', hash: 'a29d4f1', message: 'ci: cache npm dependencies in GitHub Actions' },
  { lane: 'main', hash: '1b7e0c3', message: 'chore: init project with Vite + React' },
] satisfies CommitRow[];

export const COMMIT_TYPES = [
  {
    name: 'feat',
    description: 'новая функциональность',
    bump: 'MINOR',
    color: 'var(--feat)',
    bumpColor: 'var(--main)',
  },
  {
    name: 'fix',
    description: 'исправление бага',
    bump: 'PATCH',
    color: 'var(--fix)',
    bumpColor: 'var(--rel)',
  },
  { name: 'refactor', description: 'код без смены поведения', bump: '—', color: '#2dd4bf' },
  {
    name: 'perf',
    description: 'производительность',
    bump: 'PATCH*',
    color: '#facc15',
    bumpColor: 'var(--rel)',
  },
  { name: 'test', description: 'тесты', bump: '—', color: '#a3e635' },
  { name: 'docs', description: 'документация, README', bump: '—', color: 'var(--rel)' },
  { name: 'style', description: 'форматирование кода', bump: '—', color: 'var(--muted)' },
  { name: 'build', description: 'сборка, зависимости', bump: '—', color: 'var(--muted)' },
  { name: 'ci', description: 'пайплайны CI/CD', bump: '—', color: 'var(--muted)' },
  { name: 'chore', description: 'рутина, конфиги', bump: '—', color: 'var(--muted)' },
  {
    name: 'revert',
    description: 'откат коммита',
    bump: 'PATCH*',
    color: 'var(--warn)',
    bumpColor: 'var(--rel)',
  },
  {
    name: 'type!',
    description: 'или футер BREAKING CHANGE:',
    bump: 'MAJOR',
    color: 'var(--warn)',
    bumpColor: 'var(--warn)',
  },
] satisfies CommitType[];

export const COMMIT_EXAMPLES = [
  {
    bad: 'added password reset',
    why: 'нет типа, прошедшее время',
    good: 'feat(auth): add password reset via email',
  },
  {
    bad: 'fix bug',
    why: 'какой баг? не ясно без открытия diff',
    good: 'fix(cart): prevent negative quantity',
  },
  {
    bad: 'Refactoring and some fixes.',
    why: 'два изменения сразу, заглавная, точка',
    good: 'refactor(api): move fetch to useQuery',
  },
  {
    bad: 'wip / asdf / правки / final2',
    why: 'ничего не говорит — squash перед PR',
    good: 'chore(deps): bump react to 19.1',
  },
  {
    bad: 'feat(api): drop v1 endpoints',
    why: 'ломает API, но нет «!» и футера BREAKING CHANGE — версия не станет 2.0.0',
    good: 'feat(api)!: drop v1 endpoints',
  },
] satisfies CommitExample[];
