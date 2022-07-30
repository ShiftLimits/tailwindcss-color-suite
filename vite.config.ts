import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'

import { colorSuiteDevPlugin } from './src/dev'

export default defineConfig({
  server: {
    port: 5080
  },
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/editor/assets/icons')],
      customDomId: '__cs_icons__'
    }),
    colorSuiteDevPlugin()
  ],
  build: {
    lib: {
      entry: './src/app.main.ts',
      name: 'ColorSuiteEditorApp',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        dir: './dist/app.main',
        entryFileNames: 'index.js'
      },
      external: ['@tailwindcss-color-suite/colors/config', '@tailwindcss-color-suite/settings/config'],
    }
  }
})
