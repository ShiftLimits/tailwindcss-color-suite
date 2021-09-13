<template>
	<div class="__cs-space-y-4">
		<div class="__cs-p-1 __cs-h-10 __cs-bg-black __cs-rounded-md __cs-grid __cs-grid-stack">
			<div class="__cs-w-full __cs-h-full __cs-rounded-sm  __cs-bg-transparency-grid"></div>
			<div class="__cs-w-full __cs-h-full __cs-rounded-sm" :style="{ background: color.hex }"></div>
		</div>
		<div class="__cs-flex __cs-space-x-4">
			<slider-xy v-model:x.number="color.s" :x-max="100" v-model:y.number="color.v" :y-max="100" class="__cs-p-1 __cs-flex-grow __cs-bg-black __cs-rounded-md __cs-overflow-hidden __cs-relative">
				<div class="__cs-w-full __cs-rounded-sm __cs-relative __cs-bg-transparency-grid" style="padding-bottom: 100%;">
					<canvas ref="color_space_background" class="__cs-absolute __cs-inset-0 __cs-w-full __cs-h-full __cs-rounded-sm" />
				</div>
			</slider-xy>
			<slider v-model.number="color.h" :max="360" vertical class="__cs-p-1 __cs-w-6 __cs-bg-black __cs-rounded-md __cs-relative">
				<template #handle>
					<div class="__cs-w-6">
						<svg viewBox="0 0 1 1" class="__cs-w-3">
							<path d="M0,0 L1,0.5 L0,1" class="__cs-fill-black" />
							<path d="M0,0.25 L0.75,0.5 L0,0.75" class="__cs-fill-white" />
						</svg>
					</div>
				</template>
				<div class="__cs-w-full __cs-h-full __cs-rounded-sm __cs-relative __cs-bg-transparency-grid">
					<canvas ref="hue_background" class="__cs-absolute __cs-inset-0 __cs-w-full __cs-h-full __cs-rounded-sm" />
				</div>
			</slider>
			<slider v-model.number="color.a" :max="100" vertical class="__cs-p-1 __cs-w-6 __cs-bg-black __cs-rounded-md __cs-relative">
				<template #handle>
					<div class="__cs-w-6">
						<svg viewBox="0 0 1 1" class="__cs-w-3">
							<path d="M0,0 L1,0.5 L0,1" class="__cs-fill-black" />
							<path d="M0,0.25 L0.75,0.5 L0,0.75" class="__cs-fill-white" />
						</svg>
					</div>
				</template>
				<div class="__cs-w-full __cs-h-full __cs-rounded-sm __cs-relative __cs-bg-transparency-grid">
					<canvas ref="alpha_background" class="__cs-absolute __cs-inset-0 __cs-w-full __cs-h-full __cs-rounded-sm" />
				</div>
			</slider>
		</div>
		<div class="__cs-flex __cs-space-x-4">
			<div class="__cs-flex-grow __cs-flex __cs-flex-col __cs-space-y-4">
				<form-field label="HEX">
					<text-input v-model="color.hex" />
				</form-field>
				<form-field class="__cs-w-12 __cs-self-end" label="A">
					<text-input v-model.number="color.a" />
				</form-field>
			</div>
			<div class="__cs-space-y-4">
				<div class="__cs-flex __cs-space-x-4">
					<form-field class="__cs-w-12" label="H">
						<text-input v-model.number="color.h" />
					</form-field>
					<form-field class="__cs-w-12" label="S">
						<text-input v-model.number="color.s" />
					</form-field>
					<form-field class="__cs-w-12" label="V">
						<text-input v-model.number="color.v" />
					</form-field>
				</div>
				<div class="__cs-flex __cs-space-x-4">
					<form-field class="__cs-w-12" label="R">
						<text-input v-model.number="color.r" />
					</form-field>
					<form-field class="__cs-w-12" label="G">
						<text-input v-model.number="color.g" />
					</form-field>
					<form-field class="__cs-w-12" label="B">
						<text-input v-model.number="color.b" />
					</form-field>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { ref, computed, defineComponent, watch, toRefs, onUnmounted, PropType } from 'vue'
	import { Color, ColorAny, ColorHEX, hsvaToRGBA } from '../lib/color'
	import { useAlphaWheelShader, useColorSpaceShader, useHueWheelShader } from '../lib/color-picker'

	export default defineComponent({
		props: {
			modelValue: {
				type: [String, Object] as PropType<ColorAny>,
				default: '#ff0000'
			}
		},
		setup (props, { emit }) {
			const color_space_background = ref()
			const hue_background = ref()
			const alpha_background = ref()

			const color = Color(props.modelValue)
			const { h, s, v, a } = toRefs(color);

			watch(color, () => emit('update:modelValue', { h: h.value, s: s.value, v: v.value, a: a.value }), { immediate: true })

			useColorSpaceShader(color_space_background, h)
			useHueWheelShader(hue_background, s, v)
			useAlphaWheelShader(alpha_background, h, s, v)

			return {
				color_space_background,
				hue_background,
				alpha_background,
				color
			}
		}
	})
</script>

