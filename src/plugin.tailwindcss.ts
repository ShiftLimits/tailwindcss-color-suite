import { ColorSuiteConfig } from './types'
import { DEFAULT_COLOR_CONFIG } from './constants'
import { colorToTailwind } from './editor/lib/utils.tailwind'
import { TailwindColorValue } from 'tailwindcss/tailwind-config'

export function configToTailwindColors(color_config:ColorSuiteConfig, use_rgba?:boolean) {
	const { include_current, include_transparent, include_inherit } = color_config.settings

	let tailwind_color_config:{ [key:string]:TailwindColorValue } = {}
	for (let [token, value] of Object.entries(color_config.colors)) {
		tailwind_color_config[token] = colorToTailwind(token, value, color_config.colors, use_rgba)
	}

  if (include_transparent) tailwind_color_config['transparent'] = 'transparent'
  if (include_current) tailwind_color_config['current'] = 'currentColor'
  if (include_inherit) tailwind_color_config['inherit'] = 'inherit'

	return tailwind_color_config
}

export function tailwindColors(color_config?:ColorSuiteConfig) {
  color_config = Object.assign({}, DEFAULT_COLOR_CONFIG, color_config)
  return configToTailwindColors(color_config)
}