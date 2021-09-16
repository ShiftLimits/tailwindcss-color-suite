import { CSComponentCurve, ColorSuiteColors, CSColorScale, CSColor, CSColorAlias, CSColorSolid, CSColorAliasResolutionError } from '../../types'
import { isHSVAColor, hsvaToRGBA } from './color/utils'
import { Point } from './point'
import { colorScaleRGBAValues } from './color-scale/utils'
import { resolveAlias } from './color-alias'

export function isColorSolid(color:CSColor):color is CSColorSolid {
	return isHSVAColor(color)
}
export function isColorScale(color:CSColor):color is CSColorScale {
	return typeof color == "object" && color.hue_curve != undefined && color.start != undefined
}

export function isColorAlias(color:CSColor):color is CSColorAlias {
	return typeof color == "string"
}

export function isColorAliasResolutionError(object:any):object is CSColorAliasResolutionError {
	return typeof object == "object" && !!object.message
}

export function convertPoints(curve:CSComponentCurve) {
	for (let i in curve.controls) {
		if (!(curve.controls[i] instanceof Point)) curve.controls[i] = new Point(curve.controls[i])
	}
}

export function hydrateColorConfig(colors:ColorSuiteColors) {
	for (let [_, value] of Object.entries(colors)) {
		if (isColorScale(value)) {
			convertPoints(value.hue_curve)
			convertPoints(value.saturation_curve)
			convertPoints(value.value_curve)
		}
	}
	return colors
}

export function setRootVariable(token:string, value:string) {
	document.documentElement.style.setProperty(`--${ token }`, value)
}

export function updateRootVariables(token:string, color:CSColor, colors:ColorSuiteColors) {
	let resolved_color = isColorAlias(color) ? resolveAlias(color, colors) : color
	if (isColorAliasResolutionError(resolved_color)) return

	if (isColorSolid(resolved_color)) {
		let {r,g,b} = hsvaToRGBA(resolved_color)
		let value = isColorAlias(color) ? `var(--color-${ color.replace('.', '-') }, ${[r,g,b].join(',')})` : [r,g,b].join(',')
		setRootVariable(token, value)
	}
	if (isColorScale(resolved_color)) {
		let scale_values = colorScaleRGBAValues(resolved_color)
		for (let [modifier, { r, g, b }] of Object.entries(scale_values)) {
			let value = isColorAlias(color) ? `var(--color-${ color.replace('.', '-') }-${ modifier }, ${[r,g,b].join(',')})` : [r,g,b].join(',')
			setRootVariable(`color-${ token }-${ modifier }`, value)
		}
	}
}