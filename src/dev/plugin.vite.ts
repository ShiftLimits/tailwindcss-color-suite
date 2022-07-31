import { ModuleNode, Plugin } from 'vite'
import { ColorSuiteConfig } from '../types'
import { DEFAULT_COLOR_CONFIG, COLOR_CONFIG_ID, SETTINGS_CONFIG_ID, COLOR_SUITE_ID, RESOLVED_COLORS_ID, PREFIXED_COLOR_CONFIG_ID, PREFIXED_SETTINGS_CONFIG_ID, PREFIXED_RESOLVED_COLORS_ID } from '../constants';
import { writeFileSync, existsSync } from 'fs'
import { inspect } from 'util'
import { join } from 'path'
import { createColorSuiteServer } from '../server'
import { getDefaultsFromTailwind, resolveColorConfig } from '../utils';

export function colorSuiteDevPlugin():Plugin {
  const DEFAULTS_WITH_COLORS = Object.assign({}, DEFAULT_COLOR_CONFIG, {
    colors: getDefaultsFromTailwind()
  })
  let color_config_path = join(process.cwd(), 'colors.config.js')
  let color_config:ColorSuiteConfig

  try {
    color_config = require(color_config_path)
  } catch(e) {
    // There was a problem requiring the color config
    if (existsSync(color_config_path)) {
      // The file exists so it has been created, most likely malformatted. We cannot fix this automatically so just throw an error
      throw new Error(`[Color Suite Dev] A color config file exists at '${ color_config_path}' but it could not be required.`)
    } else try {
      // Color config file doesn't exist so we can try to make a new one
      writeFileSync(color_config_path, `module.exports = ${ inspect(DEFAULTS_WITH_COLORS, false, Infinity) }`)
      color_config = DEFAULTS_WITH_COLORS
    } catch(e) {
      console.error(e)
      throw new Error(`[Color Suite Dev] Unable to create the color config file at '${ color_config_path}'.`)
    }
  }

  if (!color_config || typeof color_config != "object") throw new Error(`[Color Suite Dev] The color config does not export an object.`)
  color_config = Object.assign(DEFAULTS_WITH_COLORS, color_config)

	return {
		name: 'tailwindcss-color-suite-dev',
    apply: 'serve',
    configureServer: server => {
      server.watcher.add(color_config_path)
      return createColorSuiteServer(server, color_config, color_config_path)
    },
		resolveId(id) {
      // Virtual Import: Config colors object
      if (id == COLOR_CONFIG_ID) return PREFIXED_COLOR_CONFIG_ID

      // Virtual Import: Config settings object
      if (id == SETTINGS_CONFIG_ID) return PREFIXED_SETTINGS_CONFIG_ID

      // Virtual Import: Colors object resolved to CSS values
      if (id == RESOLVED_COLORS_ID) return PREFIXED_RESOLVED_COLORS_ID
    },
    load(id) {
      // Virtual Import: Config colors object
      // Returns the current color config object
      if (id === PREFIXED_COLOR_CONFIG_ID) return `export default ${ JSON.stringify(color_config.colors) }`

      // Virtual Import: Config settings object
      // Returns the current settings config object
      if (id === PREFIXED_SETTINGS_CONFIG_ID) return `export default ${ JSON.stringify(color_config.settings) }`

      // Virtual Import: Colors object resolved to CSS values
      // Returns the resolved color object
      if (id === PREFIXED_RESOLVED_COLORS_ID) return `export default ${ JSON.stringify(resolveColorConfig(color_config)) }`
    },
    handleHotUpdate({ file, server }) {
      if (file.match(/colors\.config\.js/g)) {
        delete require.cache[require.resolve(color_config_path)] // invalidate require
        color_config = require(color_config_path) // re-require
        color_config = Object.assign(DEFAULTS_WITH_COLORS, color_config) // make sure we've got all defaults

        let config_module = server.moduleGraph.getModuleById(COLOR_CONFIG_ID)
        if(config_module) server.moduleGraph.invalidateModule(config_module)

        let settings_module = server.moduleGraph.getModuleById(SETTINGS_CONFIG_ID)
        if(settings_module) server.moduleGraph.invalidateModule(settings_module)

        let resolved_colors_module = server.moduleGraph.getModuleById(RESOLVED_COLORS_ID)
        if(resolved_colors_module) server.moduleGraph.invalidateModule(resolved_colors_module)

        server.ws.send({
          type: 'custom',
          event: `${ COLOR_SUITE_ID }:config-updated`,
          data: color_config
        })

        return []
      }
    }
	}
}