import { CSComponentCurve, ColorSuiteConfig, ColorSuiteColors, CSColorScale, CSColor, CSColorAlias, CSColorSolid, CSColorAliasResolutionError } from '../../types';
import { isHSVAColor } from './color'
import { Point } from './point'

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