import { createFragmentProgram } from '../webgl'
import HueCurveFragmentSource from './shaders/hue-curve.fragment'
import SaturationCurveFragmentSource from './shaders/saturation-curve.fragment'
import ValueCurveFragmentSource from './shaders/value-curve.fragment'
import { Point } from '../point'

export function createHueCurveShader(canvas:HTMLCanvasElement) {
	const { createUniform, render, destroy } = createFragmentProgram(canvas, HueCurveFragmentSource)

	const setStartSaturationCurve = createUniform('2fv', 'start_saturation_curve_points')
	const setEndSaturationCurve = createUniform('2fv', 'end_saturation_curve_points')

	const setStartValueCurve = createUniform('2fv', 'start_value_curve_points')
	const setEndValueCurve = createUniform('2fv', 'end_value_curve_points')

	return {
		render(saturation_start_points:[Point, Point, Point, Point], saturation_end_points:[Point, Point, Point, Point], value_start_points:[Point, Point, Point, Point], value_end_points:[Point, Point, Point, Point]) {
			setStartSaturationCurve(saturation_start_points.reduce((points, point) => [...points, ...point.toArray()], []))
			setEndSaturationCurve(saturation_end_points.reduce((points, point) => [...points, ...point.toArray()], []))
	
			setStartValueCurve(value_start_points.reduce((points, point) => [...points, ...point.toArray()], []))
			setEndValueCurve(value_end_points.reduce((points, point) => [...points, ...point.toArray()], []))
			render()
		},
		destroy
	}
}

export function createSaturationCurveShader(canvas:HTMLCanvasElement) {
	const { createUniform, render, destroy } = createFragmentProgram(canvas, SaturationCurveFragmentSource)

	// const setHue = createUniform('1f', 'hue')
	const setStartHueCurve = createUniform('2fv', 'start_hue_curve_points')
	const setEndHueCurve = createUniform('2fv', 'end_hue_curve_points')

	const setStartValueCurve = createUniform('2fv', 'start_value_curve_points')
	const setEndValueCurve = createUniform('2fv', 'end_value_curve_points')

	return {
		render(hue_start_points:[Point, Point, Point, Point], hue_end_points:[Point, Point, Point, Point], value_start_points:[Point, Point, Point, Point], value_end_points:[Point, Point, Point, Point]) {
			setStartHueCurve(hue_start_points.reduce((points, point) => [...points, ...point.toArray()], []))
			setEndHueCurve(hue_end_points.reduce((points, point) => [...points, ...point.toArray()], []))

			setStartValueCurve(value_start_points.reduce((points, point) => [...points, ...point.toArray()], []))
			setEndValueCurve(value_end_points.reduce((points, point) => [...points, ...point.toArray()], []))
			render()
		},
		destroy
	}
}

export function createValueCurveShader(canvas:HTMLCanvasElement) {
	const { createUniform, render, destroy } = createFragmentProgram(canvas, ValueCurveFragmentSource)

	// const setHue = createUniform('1f', 'hue')
	const setStartHueCurve = createUniform('2fv', 'start_hue_curve_points')
	const setEndHueCurve = createUniform('2fv', 'end_hue_curve_points')

	const setStartSaturationCurve = createUniform('2fv', 'start_saturation_curve_points')
	const setEndSaturationCurve = createUniform('2fv', 'end_saturation_curve_points')

	return {
		render(hue_start_points:[Point, Point, Point, Point], hue_end_points:[Point, Point, Point, Point], saturation_start_points:[Point, Point, Point, Point], saturation_end_points:[Point, Point, Point, Point]) {
			setStartHueCurve(hue_start_points.reduce((points, point) => [...points, ...point.toArray()], []))
			setEndHueCurve(hue_end_points.reduce((points, point) => [...points, ...point.toArray()], []))

			setStartSaturationCurve(saturation_start_points.reduce((points, point) => [...points, ...point.toArray()], []))
			setEndSaturationCurve(saturation_end_points.reduce((points, point) => [...points, ...point.toArray()], []))
			render()
		},
		destroy
	}
}