<template>
	<div @pointerdown="pointerDown" @touchstart.prevent class="__cs-grid __cs-grid-stack" :class="{ '__cs-w-full __cs-h-6': !vertical, '__cs-w-6': vertical }">
		<div ref="plane" class="__cs-relative __cs-w-full __cs-h-full __cs-z-50">
			<div class="__cs-absolute __cs-transform __cs--translate-x-1/2 __cs--translate-y-1/2 __cs-top-0 __cs-left-0" :style="`left: ${ vertical ? 50 : value * 100 }% !important; top: ${ vertical ? value * 100 : 50 }% !important;`">
				<slot name="handle">
					<div class="__cs-w-5 __cs-h-5 __cs-bg-blue-500 __cs-rounded-md"></div>
				</slot>
			</div>
		</div>
		<slot />
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'

	export default defineComponent({
		props: {
			modelValue: {
				type: Number,
				default: 0
			},
			min: {
				type:Number,
				default: 0
			},
			max: {
				type:Number,
				default: 1
			},
			vertical: Boolean
		},
		setup (props, { emit }) {
			function transformValue(value:number) {
				return value * (props.max - props.min) + props.min
			}
			function normalizeValue(value:number) {
				return (value - props.min) / (props.max - props.min)
			}

			const value = ref(props.vertical ? 1 - normalizeValue(props.modelValue) : normalizeValue(props.modelValue))
			const plane = ref<HTMLDivElement>()
			const moving = ref(false)

			watch(() => props.modelValue, (new_value) => {
				value.value = props.vertical ? 1 - normalizeValue(new_value) : normalizeValue(new_value)
			})

			function updatePointByClientCoords(clientX:number, clientY:number) {
				if (plane.value) {
					let { x: plane_x, width: plane_width, y: plane_y, height: plane_height } = plane.value.getBoundingClientRect()

					value.value = props.vertical ? Math.max(0, Math.min(1, (clientY - plane_y) / plane_height)) : Math.max(0, Math.min(1, (clientX - plane_x) / plane_width))
					emit('update:modelValue', transformValue(props.vertical ? 1 - value.value : value.value))
				}
			}

			function pointerDown(e:PointerEvent) {
				document.addEventListener("pointermove", pointerMove)
				document.addEventListener("pointerup", pointerUp)
				moving.value = true

				updatePointByClientCoords(e.clientX, e.clientY)

				e.preventDefault()
			}
			function pointerMove({ clientX, clientY }:PointerEvent) {
				updatePointByClientCoords(clientX, clientY)
			}
			function pointerUp({}:PointerEvent) {
				document.removeEventListener("pointermove", pointerMove)
				document.removeEventListener("pointerup", pointerUp)
				moving.value = false
			}

			return {
				pointerDown,
				plane,
				value
			}
		}
	})
</script>

