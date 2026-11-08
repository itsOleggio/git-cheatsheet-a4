import type { BranchType } from '../model/types';

export const BRANCH_TYPES = [
  {
    prefix: 'feature/',
    description: 'новая фича (feat/)',
    example: 'feature/SHOP-142-cart-promo-code',
    color: 'var(--feat)',
  },
  {
    prefix: 'bugfix/',
    description: 'баг до релиза (fix/)',
    example: 'bugfix/SHOP-201-price-rounding',
    color: 'var(--fix)',
  },
  {
    prefix: 'hotfix/',
    description: 'срочно в прод, от main',
    example: 'hotfix/1.4.1-payment-timeout',
    color: 'var(--warn)',
  },
  {
    prefix: 'release/',
    description: 'версия по SemVer',
    example: 'release/1.5.0',
    color: 'var(--rel)',
  },
  {
    prefix: 'task/',
    description: 'настройка, миграция',
    example: 'task/SHOP-88-migrate-to-vite',
    color: 'var(--muted)',
  },
  {
    prefix: 'refactor/',
    description: 'без смены поведения',
    example: 'refactor/SHOP-95-auth-hooks',
    color: 'var(--muted)',
  },
  {
    prefix: 'chore/',
    description: 'зависимости, CI, конфиги',
    example: 'chore/bump-react-19',
    color: 'var(--muted)',
  },
  {
    prefix: 'docs/ · test/',
    description: 'документация · тесты',
    example: 'docs/SHOP-77-api-readme',
    color: 'var(--muted)',
  },
  {
    prefix: 'main · develop',
    description: 'прод · интеграция',
    example: 'main',
    color: 'var(--main)',
  },
] satisfies BranchType[];
