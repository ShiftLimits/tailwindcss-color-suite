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
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      output: [
        {
          format: 'es',
          dir: './dist/app.main',
          entryFileNames: 'index.mjs'
        },
        {
          format: 'cjs',
          dir: './dist/app.main',
          entryFileNames: 'index.js'
        }
      ],
      external: [
        'virtual:color-suite/config/colors',
        'virtual:color-suite/config/settings'
      ],
    }
  }
})
