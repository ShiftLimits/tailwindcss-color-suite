<template>
	<div class="__cs-flex">
		<div class="__cs-flex __cs-p-4 __cs-pr-0">
			<div class="__cs-flex __cs-rounded-md __cs-overflow-hidden" :class="{'__cs-flex-col': scale.start < scale.end, '__cs-flex-col-reverse': scale.start > scale.end }">
				<div v-for="(color_value, color_modifier) in scale_colors" :key="`scale-${color_modifier}`" class="__cs-relative __cs-flex-grow __cs-w-12" :style="`background-color: ${color_value}; `">
					<div class="__cs-absolute __cs-right-0 __cs-bottom-0 __cs-p-2 __cs-text-xs" :class="{ '__cs-text-black': !isDarkColor(color_value) }">
						{{ color_modifier }}
					</div>
				</div>
			</div>
		</div>
		<div class="__cs-flex-1 __cs-p-4 __cs-space-y-4 __cs-overflow-y-auto __cs-overflow-x-hidden">
			<form-field label="Color Token" help="Must be a valid JavaScript object key string.">
				<text-input v-model="data.token" />
			</form-field>
			<form-field label="Base Color">
				<div class="__cs-flex">
					<text-input class="__cs-flex-1" v-model="base_hex" />
				</div>
			</form-field>
			<form-field>
				<div class="__cs-block __cs-space-y-2">
					<div class="__cs-flex __cs-space-x-2">
						<div class="__cs-font-medium __cs-flex-grow">{{ use_hue_curve ? 'Hue Curve' : 'Hue' }}</div>
						<div class="__cs-flex __cs-gap-1/2 __cs-divide-x __cs-divide-neutral-600">
							<label class="__cs-flex __cs-items-center __cs-space-x-2 __cs-px-2">
								<text-input v-model.number="hue_offset" class="__cs-w-10" />
								<div>Offset</div>
							</label>
							<label class="__cs-flex __cs-items-center __cs-space-x-2 __cs-px-2">
								<toggle v-model="use_hue_curve" />
								<div>Use curve</div>
							</label>
						</div>
					</div>
					<component-curve v-if="use_hue_curve" v-model="scale.hue_curve" :scale-steps="scale_steps" class="__cs-p-1 __cs-rounded-md __cs-bg-black">
						<div class="__cs-w-full __cs-rounded-sm __cs-relative __cs-bg-transparency-grid" style="padding-bottom: 100%;">
							<canvas ref="hue_curve_background" class="__cs-absolute __cs-inset-0 __cs-w-full __cs-h-full __cs-rounded-sm" />
						</div>
					</component-curve>
					<slider v-else v-model.number="hue_slider_value" class="__cs-p-1 __cs-h-8 __cs-bg-black __cs-rounded-md __cs-relative">
						<template #handle>
							<div class="__cs-h-6">
								<svg viewBox="0 0 1 1" class="__cs-h-3">
									<path d="M0,0 L0.5,1 L1,0" class="__cs-fill-black" />
									<path d="M0.25,0 L0.5,0.75 L0.75,0" class="__cs-fill-white" />
								</svg>
							</div>
						</template>
						<div class="__cs-w-full __cs-h-full __cs-rounded-sm __cs-relative __cs-bg-transparency-grid">
							<canvas ref="hue_curve_background" class="__cs-absolute __cs-inset-0 __cs-w-full __cs-h-full __cs-rounded-sm" />
						</div>
					</slider>
				</div>
			</form-field>
			<form-field label="Saturation Curve">
				<component-curve v-model="scale.saturation_curve" :scale-steps="scale_steps" class="__cs-p-1 __cs-rounded-md __cs-bg-black">
					<div class="__cs-w-full __cs-rounded-sm __cs-relative __cs-bg-transparency-grid" style="padding-bottom: 100%;">
						<canvas ref="saturation_curve_background" class="__cs-absolute __cs-inset-0 __cs-w-full __cs-h-full __cs-rounded-sm" />
					</div>
				</component-curve>
			</form-field>
			<form-field label="Value Curve">
				<component-curve v-model="scale.value_curve" :scale-steps="scale_steps" class="__cs-p-1 __cs-rounded-md __cs-bg-black">
					<div class="__cs-w-full __cs-rounded-sm __cs-relative __cs-bg-transparency-grid" style="padding-bottom: 100%;">
						<canvas ref="value_curve_background" class="__cs-absolute __cs-inset-0 __cs-w-full __cs-h-full __cs-rounded-sm" />
					</div>
				</component-curve>
			</form-field>
			<div class="__cs-flex __cs-space-x-2">
				<form-field label="Steps">
					<text-input v-model.number="scale.steps" />
					<!-- min 3, step 2
					scale start - 50
					scale end - 900 -->
				</form-field>
				<form-field label="Start">
					<text-input v-model.number="scale.start" />
					<!-- number -->
				</form-field>
				<form-field label="End">
					<text-input v-model.number="scale.end" />
					<!-- number -->
				</form-field>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, reactive, ref, watch, nextTick, toRef, PropType } from 'vue'
	import { Color, hexToHSVA, isDarkColor } from '../../lib/color'
	import { colorScaleSteps, colorScaleHexValues, useHueCurveShader, useSaturationCurveShader, useValueCurveShader } from '../../lib/color-scale'
	import { Point } from '../../lib/point'
	import { CreateColorForm, UpdateColorForm } from '../../services/color/forms'
	import { CSColorScale } from '../../../types'

	import ComponentCurve from '../../lib/color-scale/components/ComponentCurve.vue'
	import ColorPicker from '../ColorPicker.vue'

	export default defineComponent({
		components: { ColorPicker, ComponentCurve },
		props: {
			modelValue: {
				type: [Object, CreateColorForm, UpdateColorForm] as PropType<CreateColorForm|UpdateColorForm>,
				required: true
			}
		},
		setup (props, { emit }) {
			const DEFAULT_DATA:{ token:string, value:CSColorScale } = {
				token: '',
				value: {
					hue_offset: 0,
					use_hue_curve: false,
					hue_curve: { start: 0, mid: 0, end: 0, controls: [  new Point(0, 0.15), new Point(0, -0.15), new Point(0, 0.15), new Point(0, -0.15) ] },
					saturation_curve: {
						start: 0.0712608397302399,
						mid: 0.8939969161958811,
						end: 0.9710982667456752,
						controls: [
							new Point(0.3005780148198412, 0.17693278356613767),
							new Point(-0.23085268257000924, -0.1309309904379728),
							new Point(0.08255608502161456, 0.04682271766663773),
							new Point(0, -0.15)
						]
					},
					value_curve: {
						start: 0.9884393360986335,
						mid: 0.8920399545058777,
						end: 0,
						controls: [
							new Point(0, 0.15),
							new Point(0.07047001579825886, -0.13241592379088396),
							new Point(-0.0828818295022945, 0.1557382085799962),
							new Point(0.15603926830139547, -0.10184859195044504)
						]
					},

					start: 50,
					end: 900,
					steps: 18,
				}
			}
			const data = reactive<{ token:string, value:CSColorScale }>(DEFAULT_DATA)

			const flush = 'sync'
			let syncing = false
			watch(() => props.modelValue, (new_value) => {
				if (!syncing) {
					syncing = true
					if (!new_value.token) new_value.token = DEFAULT_DATA.token
					if (!new_value.value) new_value.value = DEFAULT_DATA.value
					data.token = new_value.token
					Object.assign(data.value, new_value.value)
					nextTick(() => syncing = false)
				}
			}, { flush, immediate: true })
			watch(data, (new_value) => {
				if (!syncing) {
					emit('update:modelValue', new_value)
				}
			}, { flush, immediate: false })

			const hue_offset = toRef(data.value, 'hue_offset', 0)
			const use_hue_curve = toRef(data.value, 'use_hue_curve')
			const hue_slider_background = ref()
			const hue_curve_background = ref()
			const saturation_curve_background = ref()
			const value_curve_background = ref()

			const hue_slider_value = computed({
				get: () => data.value.hue_curve.mid,
				set(value) {
					data.value.hue_curve.start = value
					data.value.hue_curve.mid = value
					data.value.hue_curve.end = value
				}
			})
			watch(use_hue_curve, (value) => {
				if (!value) {
					data.value.hue_curve.start = data.value.hue_curve.mid
					data.value.hue_curve.end = data.value.hue_curve.mid
					data.value.hue_curve.controls = [  new Point(0, 0.15), new Point(0, -0.15), new Point(0, 0.15), new Point(0, -0.15) ]
				}
			}, { immediate: true })

			const base_color = Color({ h: (data.value.hue_curve.mid * 360 + data.value.hue_offset) % 360, s: data.value.saturation_curve.mid * 100, v: data.value.value_curve.mid * 100 })
			const base_hex = computed({
				get: () => base_color.hex,
				set(new_hex) {
					let { h, s, v } = hexToHSVA(new_hex)
					h = ((h + data.value.hue_offset) % 360) / 360
					s /= 100
					v /= 100

					data.value.hue_curve.mid = h
					data.value.saturation_curve.mid = s
					data.value.value_curve.mid = v

					if (!data.value.use_hue_curve) {
						data.value.hue_curve.start = h
						data.value.hue_curve.end = h
					}
				}
			})
			watch(() => data.value.hue_curve.mid, () => base_color.h = (data.value.hue_curve.mid * 360 + data.value.hue_offset) % 360)
			watch(() => data.value.saturation_curve.mid, () => base_color.s = data.value.saturation_curve.mid * 100)
			watch(() => data.value.value_curve.mid, () => base_color.v = data.value.value_curve.mid * 100)

			const scale_colors = computed(() => {
				return colorScaleHexValues(data.value)
			})
			const scale_steps = computed(() => {
				return colorScaleSteps(data.value, scale_colors.value)
			})

			useHueCurveShader(hue_curve_background, data.value)
			useSaturationCurveShader(saturation_curve_background, data.value)
			useValueCurveShader(value_curve_background, data.value)

			return {
				isDarkColor,
				base_hex,
				base_color,
				hue_slider_background,
				hue_curve_background,
				saturation_curve_background,
				value_curve_background,
				data,
				scale: data.value,
				scale_colors,
				scale_steps,
				hue_offset,
				use_hue_curve,
				hue_slider_value
			}
		}
	})
</script>
