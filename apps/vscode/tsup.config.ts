import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  platform: 'node',
  target: 'node18',
  external: ['vscode'],
  clean: true,
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
})
