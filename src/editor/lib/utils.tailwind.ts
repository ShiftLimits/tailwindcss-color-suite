import { CSColor, ColorSuiteColors } from '../../types';
import { isColorSolid, isColorAlias, isColorAliasResolutionError, isColorScale } from './utils.color-suite'
import { resolveAlias } from './color-alias'
import { colorScaleTokens, colorScaleRGBAValues } from './color-scale/utils';
import { hsvaToRGBA } from './color/utils';

export function createTailwindColorFunction(name:string, default_value?:string) {
	return (options?:{ opacityVariable:string, opacityValue:number }) => {
		let css_variable = `var(--${ name }${ default_value ? `, ${ default_value}` : '' })`
		if (!options) return `rgb(${ css_variable })`
		if (options.opacityValue != undefined) return `rgba(${ css_variable }, ${ options.opacityValue })`
		if (options.opacityVariable != undefined) return `rgba(${ css_variable }, var(${ options.opacityVariable }))`
		return `rgb(${ css_variable })`
	}
}

export function colorToTailwind(token:string, color:CSColor, colors:ColorSuiteColors, use_rgba?:boolean) {
	let resolved_color = isColorAlias(color) ? resolveAlias(color, colors) : color
	if (isColorAliasResolutionError(resolved_color)) return console.warn(`[Color Suite] ${ token } - ${ resolved_color.message }`) // If we failed to resolve the alias, warn the user and return

	if (isColorSolid(resolved_color)) {
		const { r, g, b, a } = hsvaToRGBA(resolved_color)
		if (use_rgba) return a == 100 ? `rgb(${[r,g,b].join(',')})` : `rgba(${[r,g,b,a].join(',')})`
		return createTailwindColorFunction(`color-${ token }`, [r,g,b].join(','))
	}
	if (isColorScale(resolved_color)) {
		let tailwind_color_object = {}
		let rgba_scale = colorScaleRGBAValues(resolved_color)
		for (let [modifier, { r, g, b, a }] of Object.entries(rgba_scale)) {
			if (use_rgba) tailwind_color_object[modifier] = a == 100 ? `rgb(${[r,g,b].join(',')})` : `rgba(${[r,g,b,a].join(',')})`
			else tailwind_color_object[modifier] = createTailwindColorFunction(`color-${ token }-${ modifier }`, [r,g,b].join(','))
		}
		return tailwind_color_object
	}
}