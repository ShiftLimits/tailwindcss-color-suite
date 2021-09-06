import { Plugin } from 'vite'
import { ColorSuiteConfig } from './types'
import { COLOR_SUITE_PATH, COLOR_CONFIG_ID, DEFAULT_COLOR_CONFIG, EDITOR_APP_MOUNT_ID } from './constants';
import { writeFileSync, existsSync } from 'fs'
import { inspect } from 'util'
import { join } from 'path'

export function colorSuitePlugin(options:{ config?:string } = {}):Plugin {
  let { config } = Object.assign(options, { config: 'colors.config.js' })

  let color_config_path = join(process.cwd(), config)
  let color_config:ColorSuiteConfig
  try {
    color_config = require(color_config_path)
    color_config = Object.assign(color_config, DEFAULT_COLOR_CONFIG)
  } catch(e) {
    // There was a problem requiring the color config
    if (existsSync(color_config_path)) {
      // The file exists so it has been created, most likely malformatted. We cannot fix this automatically so just throw an error
      throw new Error(`[Color Suite] A color config file exists at '${ color_config_path}' but it could not be required.`)
    } else try {
      // Color config file doesn't exist so we can try to make a new one
      writeFileSync(color_config_path, `module.exports = ${ inspect(DEFAULT_COLOR_CONFIG) }`)
    } catch(e) {
      console.error(e)
      throw new Error(`[Color Suite] Unable to create the color config file at '${ color_config_path}'.`)
    }
  }

	return {
		name: 'tailwindcss-color-suite',
    apply: 'serve',
		resolveId(id) {
      // Virtual File: /@tailwindcss-color-suite
      if (id == COLOR_SUITE_PATH) return COLOR_SUITE_PATH

      // Virtual Import: @tailwindcss-color-suite/color/config
      if (id == COLOR_CONFIG_ID) return COLOR_CONFIG_ID
    },
    load(id) {
      // Virtual File: /@tailwindcss-color-suite
      // Main entry point to scaffold the editor application.
      if (id === COLOR_SUITE_PATH) return `/* import "tailwindcss-color-suite/dist/main"; import "tailwindcss-color-suite/dist/main/style.css */";`

      // Virtual Import: @tailwindcss-color-suite/color/config
      // Returns the current color config object
      if (id === COLOR_CONFIG_ID) return `export default ${ JSON.stringify(color_config) }`
    },

	}
}