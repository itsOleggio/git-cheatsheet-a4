import type { CommitRow } from '../model/types';

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
