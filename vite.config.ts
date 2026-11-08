import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/git-cheatsheet-a4/',
  test: {
    environment: 'jsdom',
    include: ['tests/*.test.ts'],
  },
});
