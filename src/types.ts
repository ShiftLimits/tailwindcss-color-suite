export interface CSColorScale {

	start:number
	end:number
	steps:number
}

export interface CSColorAlias {
	value:string
}

export type CSColor = CSColorAlias|CSColorScale|string

export interface ColorSuiteSettings {
	open_button:boolean
	float_panel:boolean
	include_transparent:boolean
	include_current:boolean
}

export type ColorSuiteColors = CSColor[]

export interface ColorSuiteConfig {
	colors: ColorSuiteColors,
	settings: ColorSuiteSettings
}