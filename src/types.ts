import { Point } from './editor/lib/point'
import { ColorHSVA } from './editor/lib/color'


export type CSColorSolid = ColorHSVA // Store Solid as HSVA representation

export interface CSColorScale {
	use_hue_curve:boolean
	hue_curve:CSComponentCurve
	saturation_curve:CSComponentCurve
	value_curve:CSComponentCurve

	start:number
	end:number
	steps:number
}

export type CSColorAlias = string // `colors.example.500`
export interface CSColorAliasResolutionError {
	message?:string
}

export type CSColor = CSColorAlias|CSColorScale|CSColorSolid

export interface ColorSuiteSettings {
	open_button:boolean
	float_panel:boolean
	include_transparent:boolean
	include_current:boolean
}

export type ColorSuiteColors = {[key:string]:CSColor}

export interface ColorSuiteConfig {
	colors: ColorSuiteColors,
	settings: ColorSuiteSettings
}