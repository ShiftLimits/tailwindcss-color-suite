<template>
	<div class="__cs-grid __cs-grid-stack">
		<svg class="__cs-relative __cs-w-full __cs-h-full __cs-z-40" viewBox="-0.5 0 100.5 100" preserveAspectRatio="none">
			<path :d="curve_path" stroke="rgba(0,0,0,0.8)" stroke-width="0.1875rem" vector-effect="non-scaling-stroke" fill="none" />
			<path :d="curve_path" stroke="rgba(255,255,255,0.8)" stroke-width="0.0625rem" vector-effect="non-scaling-stroke" fill="none" />
			<point-connection :from="{ x: curve.start, y: 0 }" :to="{ x: start_control_x, y: start_control_y }" />
			<point-connection :from="{ x: curve.mid, y: 0.5 }" :to="{ x: mid_start_control_x, y: mid_start_control_y }" />
			<point-connection :from="{ x: curve.mid, y: 0.5 }" :to="{ x: mid_end_control_x, y: mid_end_control_y }" />
			<point-connection :from="{ x: curve.end, y: 1 }" :to="{ x: end_control_x, y: end_control_y }" />
		</svg>
		<div class="__cs-relative __cs-w-full __cs-h-full __cs-z-50" v-if="scale_points">
			<div v-for="(step, i) in scale_points" :key="`step${i}`" class="__cs-absolute __cs-w-3 __cs-h-3 __cs-rounded-full __cs-transform __cs--translate-x-1/2 __cs--translate-y-1/2"	style="box-shadow: 0 0 0px 1px rgba(0,0,0,0.8), inset 0 0 0px 1px rgba(255,255,255,0.4);" :style="`left: ${ step.x }%; top: ${ step.y }%; background: ${ step.color };`"></div>
		</div>
		<div class="__cs-relative __cs-w-full __cs-h-full __cs-z-50">
			<point-handle v-model:x="curve.start"	:y="0"		horizontal :color="'white'" />
			<point-handle v-model:x="start_control_x" v-model:y="start_control_y" :color="'white'" />

			<point-handle v-model:x="mid_start_control_x" v-model:y="mid_start_control_y" :color="'white'" />
			<point-handle v-model:x="curve.mid"		:y="0.5"	horizontal :color="'white'" />
			<point-handle v-model:x="mid_end_control_x" v-model:y="mid_end_control_y" :color="'white'" />

			<point-handle v-model:x="end_control_x" v-model:y="end_control_y" :color="'white'" />
			<point-handle v-model:x="curve.end"		:y="1"		horizontal :color="'white'" />
		</div>
		<slot />
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue'
	import { sampleComponentCurve } from '../../component-curve'
	import { Point } from '../../point'
	import { CSComponentCurve } from '../../../../types'
	import PointHandle from './PointHandle.vue'
	import PointConnection from './PointConnection.vue'

	export default defineComponent({
	components: { PointHandle, PointConnection },
		props: {
			modelValue: {
				type: Object as () => CSComponentCurve,
				default: () => ({ start: 0, mid: 0, end: 0, controls: [ new Point(0, 0.15), new Point(0, -0.15), new Point(0, 0.15), new Point(0, -0.15) ] })
			},
			scaleSteps: {
				type: Array as () => { step:number, color:string }[]
			}
		},
		setup(props, { emit }) {
			const curve = computed<CSComponentCurve>({
				get() {
					return props.modelValue
				},
				set(value) {
					emit('update:modelValue', value)
				}
			})

			const start_control_x = computed({
				get: () => Math.max(0, Math.min(1, curve.value.start + curve.value.controls[0].x)),
				set(value) {
					curve.value.controls[0].x = value - curve.value.start
				}
			})
			const start_control_y = computed({
				get: () => curve.value.controls[0].y,
				set(value) {
					curve.value.controls[0].y = Math.min(0.5, value)
				}
			})

			const mid_start_control_x = computed({
				get: () => Math.max(0, Math.min(1, curve.value.mid + curve.value.controls[1].x)),
				set(value) {
					curve.value.controls[1].x = value - curve.value.mid

					let mid_end_control_length = curve.value.controls[2].length()
					let normal = Point.normalize(curve.value.controls[1])
					curve.value.controls[2].x = -normal.x * mid_end_control_length
					curve.value.controls[2].y = -normal.y * mid_end_control_length
				}
			})
			const mid_start_control_y = computed({
				get: () => Math.max(0, Math.min(1, 0.5 + curve.value.controls[1].y)),
				set(value) {
					curve.value.controls[1].y = Math.min(0, value - 0.5)

					let mid_end_control_length = curve.value.controls[2].length()
					let normal = Point.normalize(curve.value.controls[1])
					curve.value.controls[2].x = -normal.x * mid_end_control_length
					curve.value.controls[2].y = -normal.y * mid_end_control_length
				}
			})

			const mid_end_control_x = computed({
				get: () => Math.max(0, Math.min(1, curve.value.mid + curve.value.controls[2].x)),
				set(value) {
					curve.value.controls[2].x = value - curve.value.mid

					let mid_start_control_length = curve.value.controls[1].length()
					let normal = Point.normalize(curve.value.controls[2])
					curve.value.controls[1].x = -normal.x * mid_start_control_length
					curve.value.controls[1].y = -normal.y * mid_start_control_length
				}
			})
			const mid_end_control_y = computed({
				get: () => Math.max(0, Math.min(1, 0.5 + curve.value.controls[2].y)),
				set(value) {
					curve.value.controls[2].y = Math.max(0, value - 0.5)

					let mid_start_control_length = curve.value.controls[1].length()
					let normal = Point.normalize(curve.value.controls[2])
					curve.value.controls[1].x = -normal.x * mid_start_control_length
					curve.value.controls[1].y = -normal.y * mid_start_control_length
				}
			})

			const end_control_x = computed({
				get: () => Math.max(0, Math.min(1, curve.value.end + curve.value.controls[3].x)),
				set(value) {
					curve.value.controls[3].x = value - curve.value.end
				}
			})
			const end_control_y = computed({
				get: () => Math.max(0, Math.min(1, 1 + curve.value.controls[3].y)),
				set(value) {
					curve.value.controls[3].y = Math.max(-0.5, value - 1)
				}
			})

			const curve_path = computed<string>(() => {
				// return props.modelValue.points.map((point, i) => (['M', SVG_PATH_CURVE_CHAR.get(props.modelValue.type)][i] || '') + pointToPathString(point)).join(' ')
				return `M${ curve.value.start * 100 },0 C${ start_control_x.value * 100 },${ start_control_y.value * 100 } ${ mid_start_control_x.value * 100 },${ mid_start_control_y.value * 100 } ${ curve.value.mid * 100 },50 C${ mid_end_control_x.value * 100 },${ mid_end_control_y.value * 100 } ${ end_control_x.value * 100 },${ end_control_y.value * 100 } ${ curve.value.end * 100 },100 `
			})

			const scale_points = computed(() => {
				if (props.scaleSteps) {
					return props.scaleSteps.map(({ step, color }) => ({
						x: sampleComponentCurve(curve.value, 1-step),
						y: (1-step) * 100,
						color
					}))
				}
			})

			return {
				curve,
				start_control_x,
				start_control_y,
				mid_start_control_x,
				mid_start_control_y,
				mid_end_control_x,
				mid_end_control_y,
				end_control_x,
				end_control_y,
				curve_path,
				scale_points
			}
		}
	})
</script>
