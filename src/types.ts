import { Config } from 'tailwindcss'
import { Point } from './editor/lib/point'
import { ColorHSVA } from './editor/lib/color'

export type TailwindColor = string | TailwindColorObject
export type TailwindColorObject = { [key:string]:string }
export interface CSComponentCurve {
	start:number
	mid:number
	end:number
	controls:[Point, Point, Point, Point]
}

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
	include_inherit:boolean
}

export type ColorSuiteColors = {[key:string]:CSColor}

export interface ColorSuiteConfig {
	colors: ColorSuiteColors,
	settings: ColorSuiteSettings
}

export type ColorSuiteResolvedColors = {[key: string]: string | {[key: string]: string }}

// Union utils by SE12938683 from https://stackoverflow.com/questions/52931116/decompose-a-typescript-union-type-into-specific-types
export type UnionToParm<U> = U extends any ? (k: U) => void : never
export type UnionToSect<U> = UnionToParm<U> extends ((k: infer I) => void) ? I : never
export type ExtractParm<F> = F extends { (a: infer A): void } ? A : never

export type SpliceOne<Union> = Exclude<Union, ExtractOne<Union>>
export type ExtractOne<Union> = ExtractParm<UnionToSect<UnionToParm<Union>>>

export type TailwindColors = SpliceOne<Required<Required<Config>['theme']>['colors']>
export type TailwindColorFunction = (options:{opacityValue:number, opacityVariable:string})=>string
export type TailwindColorValue = TailwindColorFunction|string