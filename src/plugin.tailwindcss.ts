import { ColorSuiteConfig } from './types'
import { join, isAbsolute } from 'path'
import { existsSync, writeFileSync } from 'fs';
import { DEFAULT_COLOR_CONFIG } from './constants'
import { inspect } from 'util'
import { colorToTailwind } from './editor/lib/utils.tailwind'

export function configToTailwindColors(color_config:ColorSuiteConfig, use_rgba?:boolean) {
	const { include_current, include_transparent, include_inherit } = color_config.settings

	let tailwind_color_config = {}
	for (let [token, value] of Object.entries(color_config.colors)) {
		tailwind_color_config[token] = colorToTailwind(token, value, color_config.colors, use_rgba)
	}

  if (include_transparent) tailwind_color_config['transparent'] = 'transparent'
  if (include_current) tailwind_color_config['current'] = 'currentColor'
  if (include_inherit) tailwind_color_config['inherit'] = 'inherit'

	return tailwind_color_config
}

export function configureColors(options:{ config?:string } = {}) {
	let { config } = Object.assign({ config: 'colors.config.js' }, options)

  let color_config_path = isAbsolute(config) ? config : join(process.cwd(), config)
  let color_config:ColorSuiteConfig
  try {
    color_config = require(color_config_path)
  } catch(e) {
    if (existsSync(color_config_path)) {
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

  return configToTailwindColors(color_config)
}