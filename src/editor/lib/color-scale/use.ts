import { Ref, watch, onMounted, isRef, onUnmounted, nextTick } from 'vue'
import { createHueCurveShader, createSaturationCurveShader, createValueCurveShader } from './webgl'
import { CSColorScale } from '../../../types'
import { componentCurveToBezierPoints } from '../component-curve'

export function useHueCurveShader(canvas:Ref<HTMLCanvasElement>, scale:CSColorScale) {
	let shader:ReturnType<typeof createHueCurveShader>

	watch(scale, () => {
		const { start: saturation_start_points, end: saturation_end_points } = componentCurveToBezierPoints(scale.saturation_curve)
		const { start: value_start_points, end: value_end_points } = componentCurveToBezierPoints(scale.value_curve)
		if (shader) shader.render(saturation_start_points, saturation_end_points, value_start_points, value_end_points)
	}, { immediate: true })

	watch(canvas, (new_canvas) => {
		if (shader) shader.destroy()
		if (new_canvas) {
			shader = createHueCurveShader(new_canvas)

			const { start: saturation_start_points, end: saturation_end_points } = componentCurveToBezierPoints(scale.saturation_curve)
			const { start: value_start_points, end: value_end_points } = componentCurveToBezierPoints(scale.value_curve)
			shader.render(saturation_start_points, saturation_end_points, value_start_points, value_end_points)
		}
	}, {
		flush: 'post',
		immediate: true
	})
	// onMounted(() => {
	// 	if (shader) shader.destroy()
	// 	if (canvas.value) {
	// 		shader = createHueCurveShader(canvas.value)

	// 		const { start: saturation_start_points, end: saturation_end_points } = componentCurveToBezierPoints(scale.saturation_curve)
	// 		const { start: value_start_points, end: value_end_points } = componentCurveToBezierPoints(scale.value_curve)
	// 		shader.render(saturation_start_points, saturation_end_points, value_start_points, value_end_points)
	// 	}
	// })

	onUnmounted(() => {
		if (shader) shader.destroy()
	})
}

export function useSaturationCurveShader(canvas:Ref<HTMLCanvasElement>, scale:CSColorScale) {
	let shader:ReturnType<typeof createSaturationCurveShader>

	watch(scale, () => {
		const { start: hue_start_points, end: hue_end_points } = componentCurveToBezierPoints(scale.hue_curve)
		const { start: value_start_points, end: value_end_points } = componentCurveToBezierPoints(scale.value_curve)
		if (shader) shader.render(hue_start_points, hue_end_points, value_start_points, value_end_points)
	}, { immediate: true })

	onMounted(() => {
		watch(canvas, (new_canvas) => {
			if (shader) shader.destroy()

			if (new_canvas) {
				shader = createSaturationCurveShader(new_canvas)

				const { start: hue_start_points, end: hue_end_points } = componentCurveToBezierPoints(scale.hue_curve)
				const { start: value_start_points, end: value_end_points } = componentCurveToBezierPoints(scale.value_curve)
				shader.render(hue_start_points, hue_end_points, value_start_points, value_end_points)
			}
		}, { immediate: true })
	})

	onUnmounted(() => {
		if (shader) shader.destroy()
	})
}

export function useValueCurveShader(canvas:Ref<HTMLCanvasElement>, scale:CSColorScale) {
	let shader:ReturnType<typeof createValueCurveShader>

	watch(scale, () => {
		const { start: hue_start_points, end: hue_end_points } = componentCurveToBezierPoints(scale.hue_curve)
		const { start: saturation_start_points, end: saturation_end_points } = componentCurveToBezierPoints(scale.saturation_curve)
		if (shader) shader.render(hue_start_points, hue_end_points, saturation_start_points, saturation_end_points)
	}, { immediate: true })

	onMounted(() => {
		watch(canvas, (new_canvas) => {
			if (shader) shader.destroy()

			if (new_canvas) {
				shader = createValueCurveShader(new_canvas)

				const { start: hue_start_points, end: hue_end_points } = componentCurveToBezierPoints(scale.hue_curve)
				const { start: saturation_start_points, end: saturation_end_points } = componentCurveToBezierPoints(scale.saturation_curve)
				shader.render(hue_start_points, hue_end_points, saturation_start_points, saturation_end_points)
			}
		}, { immediate: true })
	})

	onUnmounted(() => {
		if (shader) shader.destroy()
	})
}