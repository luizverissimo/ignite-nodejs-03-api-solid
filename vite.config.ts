import { defineConfig } from 'vitest/config'
import tsconfingPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfingPaths()],
})
