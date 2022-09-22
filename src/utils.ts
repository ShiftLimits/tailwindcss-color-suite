import { fitCubic } from 'fit-curve'
import { ColorHSVA, hexToHSVA } from './editor/lib/color'
import colors from 'tailwindcss/colors'
import { ColorSuiteColors, ColorSuiteConfig, ColorSuiteResolvedColors, CSColorScale, TailwindColors } from './types'
import { colorToTailwind } from './editor/lib/utils.tailwind'

export function getDefaultsFromTailwind() {
	const color_suite_colors:ColorSuiteColors = {}

	for (let key of Object.keys(colors)) {
		const descriptor = Object.getOwnPropertyDescriptor(colors, key)

		if (descriptor) {
			if (descriptor.get) {
				// Attempt to extract alias target
				const matched = descriptor.get.toString().match(/return\sthis.([a-z0-9_]+)/)
				if (matched) color_suite_colors[key] = matched[1]
			} else {
				const color = descriptor.value
				if (typeof color == 'object') {
					const color_config = createDefaultsFromColorGroup(color)
					if (color_config) color_suite_colors[key] = color_config
				}
			}
		}
	}

	return color_suite_colors
}

export function createDefaultsFromColorGroup(group:TailwindColors):CSColorScale|undefined {
	const middle_key = 500

	const error = 50

	let is_scale = true, scale_lowest = 1000, scale_highest = 0
	let scale:[number, ColorHSVA][] = []

	// First pass
	for (let [key, value] of Object.entries(group)) {
		if (typeof value != 'string') continue // Don't handle deep recursion

		const i = parseInt(key)
		if (isNaN(i)) {
			is_scale = false
			break
		}

		if (i > scale_highest) scale_highest = i
		if (i < scale_lowest) scale_lowest = i

		const hsva = hexToHSVA(value)

		scale.push([i, hsva])
	}

	if (!is_scale) return undefined

	const hue_tints_points:number[][] = []
	const hue_shades_points:number[][] = []
	const saturation_tints_points:number[][] = []
	const saturation_shades_points:number[][] = []
	const value_tints_points:number[][] = []
	const value_shades_points:number[][] = []

	// Second pass
	for (let [i, hsva] of scale) {
		const hue_point = [hsva.h/360, i/scale_highest]
		const saturation_point = [hsva.s/100, i/scale_highest]
		const value_point = [hsva.v/100, i/scale_highest]

		if (i <= middle_key) {
			hue_tints_points.push(hue_point)
			saturation_tints_points.push(saturation_point)
			value_tints_points.push(value_point)
		}
		if (i >= middle_key) {
			hue_shades_points.push(hue_point)
			saturation_shades_points.push(saturation_point)
			value_shades_points.push(value_point)
		}
	}

	const hue_left_tangent = createTangent(hue_tints_points[1], hue_tints_points[0])
	const hue_right_tangent = createTangent(hue_shades_points[hue_shades_points.length-2], hue_shades_points[hue_shades_points.length-1])
	const hue_center_vector = subtractVectors(hue_tints_points[hue_tints_points.length-1], hue_shades_points[1])
	const hue_to_center_tangent = normalizeVector(hue_center_vector)
	const hue_from_center_tangent = multiplyScalar(hue_to_center_tangent, -1)

	const hue_tint_bezier = fitCubic(hue_tints_points, hue_left_tangent, hue_to_center_tangent, error)[0] //fitCurve(hue_tints_points, error)[0]
	const hue_shade_bezier = fitCubic(hue_shades_points, hue_from_center_tangent, hue_right_tangent, error)[0]//fitCurve(hue_shades_points, error)[0]

	const hue_curve = {
		start: hue_tint_bezier[0][0],
		mid: hue_tint_bezier[3][0],
		end: hue_shade_bezier[3][0],
		controls: [
			{ x: hue_tint_bezier[1][0] - hue_tint_bezier[0][0], y: hue_tint_bezier[1][1] - hue_tint_bezier[0][1] },
			{ x: hue_tint_bezier[2][0] - hue_tint_bezier[3][0], y: hue_tint_bezier[2][1] - hue_tint_bezier[3][1] },
			{ x: hue_shade_bezier[1][0] - hue_shade_bezier[0][0], y: hue_shade_bezier[1][1] - hue_shade_bezier[0][1] },
			{ x: hue_shade_bezier[2][0] - hue_shade_bezier[3][0], y: hue_shade_bezier[2][1] - hue_shade_bezier[3][1] },
		]
	}

	const saturation_left_tangent = createTangent(saturation_tints_points[1], saturation_tints_points[0])
	const saturation_right_tangent = createTangent(saturation_shades_points[saturation_shades_points.length-2], saturation_shades_points[saturation_shades_points.length-1])
	const saturation_center_vector = subtractVectors(saturation_tints_points[saturation_tints_points.length-1], saturation_shades_points[1])
	const saturation_to_center_tangent = normalizeVector(saturation_center_vector)
	const saturation_from_center_tangent = multiplyScalar(saturation_to_center_tangent, -1)

	const saturation_tint_bezier = fitCubic(saturation_tints_points, saturation_left_tangent, saturation_to_center_tangent, error)[0]
	const saturation_shade_bezier = fitCubic(saturation_shades_points, saturation_from_center_tangent, saturation_right_tangent, error)[0]

	const saturation_curve = {
		start: saturation_tint_bezier[0][0],
		mid: saturation_tint_bezier[3][0],
		end: saturation_shade_bezier[3][0],
		controls: [
			{ x: saturation_tint_bezier[1][0] - saturation_tint_bezier[0][0], y: saturation_tint_bezier[1][1] - saturation_tint_bezier[0][1] },
			{ x: saturation_tint_bezier[2][0] - saturation_tint_bezier[3][0], y: saturation_tint_bezier[2][1] - saturation_tint_bezier[3][1] },
			{ x: saturation_shade_bezier[1][0] - saturation_shade_bezier[0][0], y: saturation_shade_bezier[1][1] - saturation_shade_bezier[0][1] },
			{ x: saturation_shade_bezier[2][0] - saturation_shade_bezier[3][0], y: saturation_shade_bezier[2][1] - saturation_shade_bezier[3][1] },
		]
	}

	const value_left_tangent = createTangent(value_tints_points[1], value_tints_points[0])
	const value_right_tangent = createTangent(value_shades_points[value_shades_points.length-2], value_shades_points[value_shades_points.length-1])
	const value_center_vector = subtractVectors(value_tints_points[value_tints_points.length-1], value_shades_points[1])
	const value_to_center_tangent = normalizeVector(value_center_vector)
	const value_from_center_tangent = multiplyScalar(value_to_center_tangent, -1)

	const value_tint_bezier = fitCubic(value_tints_points, value_left_tangent, value_to_center_tangent, error)[0]
	const value_shade_bezier = fitCubic(value_shades_points, value_from_center_tangent, value_right_tangent, error)[0]

	const value_curve = {
		start: value_tint_bezier[0][0],
		mid: value_tint_bezier[3][0],
		end: value_shade_bezier[3][0],
		controls: [
			{ x: value_tint_bezier[1][0] - value_tint_bezier[0][0], y: value_tint_bezier[1][1] - value_tint_bezier[0][1] },
			{ x: value_tint_bezier[2][0] - value_tint_bezier[3][0], y: value_tint_bezier[2][1] - value_tint_bezier[3][1] },
			{ x: value_shade_bezier[1][0] - value_shade_bezier[0][0], y: value_shade_bezier[1][1] - value_shade_bezier[0][1] },
			{ x: value_shade_bezier[2][0] - value_shade_bezier[3][0], y: value_shade_bezier[2][1] - value_shade_bezier[3][1] },
		]
	}

	return {
		hue_offset: 0,
		use_hue_curve: true,
		hue_curve: hue_curve as any,
		saturation_curve: saturation_curve as any,
		value_curve: value_curve as any,
		start: 50,
		end: 900,
		steps: 18
	}
}

export function resolveColorConfig(color_config:ColorSuiteConfig):ColorSuiteResolvedColors {
	const { include_current, include_transparent, include_inherit } = color_config.settings

	let tailwind_color_config:ColorSuiteResolvedColors = {}
	for (let [token, value] of Object.entries(color_config.colors)) {
		tailwind_color_config[token] = {}
		const scale = colorToTailwind(token, value, color_config.colors)
		for (let [degree, colorFunction] of Object.entries(scale)) {
			tailwind_color_config[token][degree] = colorFunction()
		}
	}

  if (include_transparent) tailwind_color_config['transparent'] = 'transparent'
  if (include_current) tailwind_color_config['current'] = 'currentColor'
  if (include_inherit) tailwind_color_config['inherit'] = 'inherit'

	return tailwind_color_config
}

function vectorLength(v:number[]) {
	return Math.hypot(...v)
}
function normalizeVector(v:number[]) {
	const len = vectorLength(v)
	return [
		v[0]/len,
		v[1]/len
	]
}
function subtractVectors(a:number[], b:number[]) {
	return [
		a[0] - b[0],
		a[1] - b[1],
	]
}
function multiplyVectors(a:number[], b:number[]) {
	return [
		a[0] * b[0],
		a[1] * b[1],
	]
}
function multiplyScalar(a:number[], scalar:number) {
	return [
		a[0] * scalar,
		a[1] * scalar,
	]
}
function createTangent(a:number[], b:number[]) {
	return normalizeVector(subtractVectors(a, b))
}