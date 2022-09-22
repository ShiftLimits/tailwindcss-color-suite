import { CSColorScale, CSColor } from '../../../types';
import { ColorHSV, ColorHSVA, ColorHEX, ColorRGBA, hsvaToHex, hsvaToRGBA } from '../color'
import { sampleComponentCurve } from '../component-curve'

export function colorScaleTokens(color_scale:CSColorScale) {
	let tokens:string[] = []

	for (let i = 0; i < color_scale.steps; i++) {
		let step = i / (color_scale.steps-1)
		let interval = Math.round(step * color_scale.start + (1-step) * color_scale.end)

		tokens.push(interval.toString())
	}
	return tokens
}

export function samplePanelColorScale(color_scale:CSColorScale, y:number):ColorHSV {
	let hue = (sampleComponentCurve(color_scale.hue_curve , y, 360) + (color_scale.hue_offset ?? 0)) % 360
	let saturation = sampleComponentCurve(color_scale.saturation_curve, y)
	let value = sampleComponentCurve(color_scale.value_curve, y)

	return { h: hue, s: saturation, v: value }
}

export function colorScaleHSVAValues(color_scale:CSColorScale):{[interval:number]:ColorHSVA} {
	let scale = {}

	for (let i = 0; i < color_scale.steps; i++) {
		let step = i / (color_scale.steps-1)
		let interval = Math.round(step * color_scale.start + (1-step) * color_scale.end)

		scale[interval] = { ...samplePanelColorScale(color_scale, 1-step), a: 100 }
	}

	return scale
}

export function colorScaleRGBAValues(color_scale:CSColorScale):{[interval:number]:ColorRGBA} {
	let scale = {}

	for (let i = 0; i < color_scale.steps; i++) {
		let step = i / (color_scale.steps-1)
		let interval = Math.round(step * color_scale.start + (1-step) * color_scale.end)

		scale[interval] = hsvaToRGBA(samplePanelColorScale(color_scale, 1-step) as ColorHSVA)
	}

	return scale
}

export function colorScaleHexValues(color_scale:CSColorScale):{[interval:number]:ColorHEX} {
	let scale = {}

	for (let i = 0; i < color_scale.steps; i++) {
		let step = i / (color_scale.steps-1)
		let interval = Math.round(step * color_scale.start + (1-step) * color_scale.end)

		scale[interval] = hsvaToHex(samplePanelColorScale(color_scale, 1-step) as ColorHSVA)
	}

	return scale
}

export function colorScaleSteps(color_scale:CSColorScale, scale_values:ReturnType<typeof colorScaleHexValues>) {
	let steps:{step:number, color:string}[] = []

	for (let i = 0; i < color_scale.steps; i++) {
		let step = i / (color_scale.steps-1)
		let interval = Math.round(step * color_scale.start + (1-step) * color_scale.end)


		steps.push({ step, color: scale_values[interval] })
	}

	return steps
}
