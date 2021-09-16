import { CSColorAlias, CSColor, CSColorAliasResolutionError, ColorSuiteColors } from '../../types'
import { isColorSolid, isColorAlias, isColorScale, isColorAliasResolutionError } from './utils.color-suite'
import { colorScaleHSVAValues } from './color-scale/utils'

const tokens_looked_up:string[] = []
export function resolveAlias(alias:CSColorAlias, colors:ColorSuiteColors, deep:boolean = false):CSColor|CSColorAliasResolutionError {
	if (!deep) tokens_looked_up.length = 0 // reset tokens looked up

	let alias_keys:string[] = alias.split('.')

	// Shallow look up
	let token = alias_keys.shift() // the first item in the array will be the root level color token
	if (!token) throw new Error('Unable to resolve alias: the alias does not contain a valid token reference')

	if (tokens_looked_up.includes(token)) return { message: 'Unable to resolve alias: cyclic token reference encountered' }
	else tokens_looked_up.push(token)

	let resolved_color:CSColor|CSColorAliasResolutionError = colors[token]
	if (!resolved_color) return { message: `Unable to resolve alias: ${token} does not exist in the colors config` }

	if (isColorAlias(resolved_color)) resolved_color = resolveAlias(resolved_color, colors, true) // We resolved to an alias, which itself needs to be resolved
	if (isColorAliasResolutionError(resolved_color)) return resolved_color // If the alias resolved an error let's just pass it along

	// Deep look up
	while (alias_keys.length) { // We have to drill down further
		let next_token = alias_keys.shift()
		if (!next_token) throw new Error(`Unable to resolve alias: improperly formatted alias`)

		if (isColorAliasResolutionError(resolved_color)) return resolved_color
		if (isColorSolid(resolved_color)) return { message: `Unable to resolve alias: ${alias} does not exist in the colors config` }
		if (isColorScale(resolved_color)) {
			let hsva_scale = colorScaleHSVAValues(resolved_color)
			resolved_color = hsva_scale[next_token] // If it exists in the scale, resolve to it or resolve an alias resolution error message
			if (!resolved_color) return { message: `Unable to resolve alias: ${token} does not exist in the color scale` }
		}
	}

	return resolved_color

}
