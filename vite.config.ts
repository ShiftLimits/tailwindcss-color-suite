import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    port: 5080
  },
  plugins: [
    vue(),
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
