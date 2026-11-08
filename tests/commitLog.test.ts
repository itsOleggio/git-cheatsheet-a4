import { describe, expect, it } from 'vitest';
import { parseCommitSubject } from '../src/render/commitLog';

describe('parseCommitSubject', () => {
  it('разбирает полный формат type(scope)!: subject', () => {
    expect(parseCommitSubject('feat(api)!: drop v1 endpoints')).toEqual({
      type: 'feat',
      scope: 'api',
      breaking: true,
      subject: 'drop v1 endpoints',
    });
  });

  it('scope и ! необязательны', () => {
    expect(parseCommitSubject('ci: cache npm dependencies')).toEqual({
      type: 'ci',
      breaking: false,
      subject: 'cache npm dependencies',
    });
  });

  it('! работает без scope', () => {
    expect(parseCommitSubject('feat!: drop node 18')).toMatchObject({
      type: 'feat',
      breaking: true,
    });
  });

  it('сохраняет двоеточия и скобки в subject', () => {
    expect(parseCommitSubject('chore(release): 1.5.0 [skip ci]')).toMatchObject({
      scope: 'release',
      subject: '1.5.0 [skip ci]',
    });
  });

  it.each([
    'Merge pull request #142 from feature/SHOP-142-cart-promo-code',
    'feat add field',
    'feat:no space',
    '',
  ])('не считает заголовком: %j', (message) => {
    expect(parseCommitSubject(message)).toBeNull();
  });
});
