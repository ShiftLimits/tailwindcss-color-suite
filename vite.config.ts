import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteSvgIcons from 'vite-plugin-svg-icons'
import { resolve } from 'path'

import { colorSuiteDevPlugin } from './src/dev'

export default defineConfig({
  server: {
    port: 5080
  },
  plugins: [
    vue(),
    viteSvgIcons({
      iconDirs: [resolve(process.cwd(), 'src/editor/assets/icons')]
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
      external: ['vue', '@tailwindcss-color-suite/color/config'],
    }
  }
})
