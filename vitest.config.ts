import path from 'node:path'

import { defineConfig } from 'vitest/config'

/** Separate from Vite app config — avoids Vite 8 / Vitest plugin type clashes. */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
