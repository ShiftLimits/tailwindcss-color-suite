<template>
	<div ref="point_handle" @pointerdown.prevent="pointerDown" @touchstart.prevent class="__cs-z-50 __cs-absolute __cs-top-0 __cs-left-0 __cs-origin-center" :style="`left: ${ point.x * 100 }% !important; top: ${ point.y * 100 }% !important;`">
		<svg
			viewBox="0 0 1 1"
			class="__cs-absolute __cs-w-4 __cs-h-4 __cs-transform __cs--translate-x-1/2 __cs--translate-y-1/2"
			:class="{
				'__cs-rounded-full': !horizontal && !vertical,
				'__cs-px-2 __cs-rounded-md': horizontal && !vertical,
				'__cs-py-2 __cs-rounded-md': !horizontal && vertical,
			}"
			style="box-shadow: 0 0 0px 1px rgba(0,0,0,0.8), inset 0 0 0px 1px rgba(255,255,255,0.4);"
			:style="`${ color ? `background-color: ${ color };`: '' }`"
		/>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, onMounted, onUnmounted, reactive, computed, watch } from 'vue'

	export default defineComponent({
		props: {
			x: {
				type: Number,
				default: 0
			},
			y: {
				type: Number,
				default: 0
			},
			color:String,
			horizontal:Boolean,
			vertical:Boolean
		},
		setup (props, { emit }) {
			const point_handle = ref<HTMLDivElement>()
			const point = reactive({ x: Math.max(0, Math.min(1, props.x)), y: Math.max(0, Math.min(1, props.y)) })

			watch(() => props.x, () => point.x = Math.max(0, Math.min(1, props.x)))
			watch(() => props.y, () => point.y = Math.max(0, Math.min(1, props.y)))

			const moving = ref(false)
			const cursor = computed(() => {
				if (moving.value == true) return `grabbing`
				return `grab`
			})

			function updatePointValue(prop:'x'|'y', value:number) {
				// point[prop] = Math.max(Math.min(value, 1), 0)
				emit(`update:${prop}`, Math.max(0, Math.min(1, value)))
			}

			let offset
			function pointerDown(e:PointerEvent) {
				document.addEventListener("pointermove", pointerMove)
				document.addEventListener("pointerup", pointerUp)

				let { x, y } = point_handle.value!.getBoundingClientRect()
				offset = [e.clientX - x, e.clientY - y]
				moving.value = true

				e.preventDefault()
			}
			function pointerMove({ clientX, clientY }:PointerEvent) {
				let { x: parent_x, width: parent_width, y: parent_y, height: parent_height } = point_handle.value!.parentElement!.getBoundingClientRect()
				let [ offset_x, offset_y ] = offset

				if (!props.vertical) updatePointValue('x', (clientX - offset_x - parent_x) / parent_width)
				if (!props.horizontal) updatePointValue('y', (clientY - offset_y - parent_y) / parent_height)
			}
			function pointerUp({}:PointerEvent) {
				document.removeEventListener("pointermove", pointerMove)
				document.removeEventListener("pointerup", pointerUp)
				moving.value = false
			}

			return {
				pointerDown,
				point_handle,
				point,
				cursor
			}
		}
	})
</script>
