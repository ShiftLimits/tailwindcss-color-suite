import { Plugin } from 'vite'
import { ColorSuiteConfig } from './types'
import { COLOR_SUITE_PATH, COLOR_CONFIG_ID, DEFAULT_COLOR_CONFIG, EDITOR_APP_MOUNT_ID, SETTINGS_CONFIG_ID, COLOR_SUITE_ID } from './constants';
import { createColorSuiteServer } from './server/index'
import { writeFileSync, existsSync } from 'fs'
import { inspect } from 'util'
import { join, isAbsolute } from 'path'

export function colorSuitePlugin(options:{ config?:string } = {}):Plugin {
  let { config } = Object.assign({ config: 'colors.config.js' }, options)

  let color_config_path = isAbsolute(config) ? config : join(process.cwd(), config)
  let color_config:ColorSuiteConfig
  try {
    color_config = require(color_config_path)
  } catch(e) {
    // There was a problem requiring the color config
    if (existsSync(color_config_path)) {
      // The file exists so it has been created, most likely malformatted. We cannot fix this automatically so just throw an error
      throw new Error(`[Color Suite] A color config file exists at '${ color_config_path}' but it could not be required.`)
    } else try {
      // Color config file doesn't exist so we can try to make a new one
      writeFileSync(color_config_path, `module.exports = ${ inspect(DEFAULT_COLOR_CONFIG, false, Infinity) }`)
      color_config = DEFAULT_COLOR_CONFIG
    } catch(e) {
      console.error(e)
      throw new Error(`[Color Suite] Unable to create the color config file at '${ color_config_path}'.`)
    }
  }

  if (!color_config || typeof color_config != "object") throw new Error(`[Color Suite] The color config does not export an object.`)
  color_config = Object.assign(DEFAULT_COLOR_CONFIG, color_config)

	return {
		name: 'tailwindcss-color-suite',
    apply: 'serve',
    enforce: 'pre',
    configureServer: server => {
      server.watcher.add(color_config_path)
      return createColorSuiteServer(server, color_config, color_config_path)
    },
    config(config) {
      const exclude = [COLOR_CONFIG_ID, SETTINGS_CONFIG_ID]
      if (!config.optimizeDeps) config.optimizeDeps = { exclude }
      else {
        if (!config.optimizeDeps.exclude) config.optimizeDeps.exclude = exclude
        else {
          config.optimizeDeps.exclude = [...config.optimizeDeps.exclude, ...exclude]
        }
      }

      return config
    },
		resolveId(id) {
      // Virtual File: /@tailwindcss-color-suite
      if (id == COLOR_SUITE_PATH) return COLOR_SUITE_PATH

      // Virtual Import: @tailwindcss-color-suite/color/config
      if (id == COLOR_CONFIG_ID) return COLOR_CONFIG_ID

      // Virtual Import: @tailwindcss-color-suite/settings/config
      if (id == SETTINGS_CONFIG_ID) return SETTINGS_CONFIG_ID
    },
    load(id) {
      // Virtual File: /@tailwindcss-color-suite
      // Main entry point to scaffold the editor application.
      if (id === COLOR_SUITE_PATH) return `import "tailwindcss-color-suite/dist/app.main"; import "tailwindcss-color-suite/dist/app.main/style.css";`

      // Virtual Import: @tailwindcss-color-suite/color/config
      // Returns the current color config object
      if (id === COLOR_CONFIG_ID) return `export default ${ JSON.stringify(color_config.colors) }`

      // Virtual Import: @tailwindcss-color-suite/settings/config
      // Returns the current settings config object
      if (id === SETTINGS_CONFIG_ID) return `export default ${ JSON.stringify(color_config.settings) }`
    },
    handleHotUpdate({ file, server }) {
      if (file.match(/colors\.config\.js/g)) {
        if (require.resolve) delete require.cache[require.resolve(color_config_path)] // invalidate require on cjs
        color_config = require(color_config_path) // re-require
        color_config = Object.assign(DEFAULT_COLOR_CONFIG, color_config) // make sure we've got all defaults

        let config_module = server.moduleGraph.getModuleById(COLOR_CONFIG_ID)
        if(config_module) server.moduleGraph.invalidateModule(config_module)

        let settings_module = server.moduleGraph.getModuleById(SETTINGS_CONFIG_ID)
        if(settings_module) server.moduleGraph.invalidateModule(settings_module)

        server.ws.send({
          type: 'custom',
          event: `${ COLOR_SUITE_ID }:config-updated`,
          data: color_config
        })

        return []
      }
    },
    transformIndexHtml(html) {
      return {
        html,
        tags: [

          // Add script to `head` that loads the editor application entry point
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              type: 'module',
              src: COLOR_SUITE_PATH
            }
          },

          // Add root `div` to the `body` so the editor application can be embedded
          {
            injectTo: 'body-prepend',
            tag: 'div',
            attrs: { id: EDITOR_APP_MOUNT_ID }
          }
        ]
      }
    }
	}
}