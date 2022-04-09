import { CSComponentCurve, ColorSuiteColors, CSColorScale, CSColor, CSColorAlias, CSColorSolid, CSColorAliasResolutionError } from '../../types'
import { isHSVAColor, hsvaToRGBA } from './color/utils'
import { Point } from './point'
import { colorScaleRGBAValues } from './color-scale/utils'
import { resolveAlias } from './color-alias'

export function isColorSolid(color:CSColor):color is CSColorSolid {
	return isHSVAColor(color)
}
export function isColorScale(color:CSColor):color is CSColorScale {
	return typeof color == "object" && (color as any).hue_curve != undefined && (color as any).start != undefined
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

let color_suite_sheet:CSSStyleSheet
function getColorSuiteSheet() {
	if (!color_suite_sheet) {
		const style = document.createElement("style")
		style.id = 'color_suite_variables'
		document.head.appendChild(style)

		let sheet = style.sheet
		if (!sheet) throw new Error('Color Suite stylesheet could not be created.')

		color_suite_sheet = sheet
	}

	return color_suite_sheet
}

const root_variable_sheet_indexes = new Map<string, number>()
export function setRootVariable(token:string, value:string) {
	const sheet = getColorSuiteSheet()
	let existing_index:number|undefined
	if (root_variable_sheet_indexes.has(token)) {
		existing_index = root_variable_sheet_indexes.get(token)
		if (existing_index) {
			sheet.deleteRule(existing_index)
			root_variable_sheet_indexes.set(token, sheet.insertRule(`:root{ --${ token }: ${ value } }`, existing_index))
		}
	} else {
		let new_index = sheet.insertRule(`:root{ --${ token }: ${ value } }`, sheet.rules.length)
		root_variable_sheet_indexes.set(token, new_index)
	}
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