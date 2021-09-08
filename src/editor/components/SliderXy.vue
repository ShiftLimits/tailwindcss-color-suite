<template>
	<div @pointerdown.prevent="pointerDown" @touchstart.prevent class="__cs-grid __cs-grid-stack">
		<div ref="plane" class="__cs-relative __cs-w-full __cs-h-full __cs-z-50">
			<div class="__cs-absolute __cs-transform __cs--translate-x-1/2 __cs--translate-y-1/2 __cs-top-0 __cs-left-0" :style="`left: ${ point.x * 100 }% !important; top: ${ point.y * 100 }% !important;`">
				<slot name="handle">
					<div class="__cs-w-5 __cs-h-5 __cs-border-2 __cs-border-black __cs-rounded-full"></div>
					<div class="__cs-w-4 __cs-h-4 __cs-border __cs-border-white __cs-rounded-full __cs-absolute __cs-left-1/2 __cs-top-1/2 __cs-transform __cs--translate-x-1/2 __cs--translate-y-1/2"></div>
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
			x: {
				type: Number,
				default: 0
			},
			y: {
				type: Number,
				default: 0
			},
			xMin: {
				type:Number,
				default: 0
			},
			xMax: {
				type:Number,
				default: 1
			},
			yMin: {
				type:Number,
				default: 0
			},
			yMax: {
				type:Number,
				default: 1
			},
			origin: {
				type: String as () => 'top-left'|'top-right'|'bottom-left'|'bottom-right',
				default: 'bottom-left',
				validator: (value:string) => ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(value)
			}
		},
		setup (props, { emit }) {
			const plane_origin = computed(() => {
				if (props.origin == 'top-left') return { x: 0, y: 0 }
				if (props.origin == 'top-right') return { x: 1, y: 0 }
				if (props.origin == 'bottom-right') return { x: 1, y: 1 }
				return { x: 0, y: 1 }
			})

			function transformXComponent(x:number) {
				return x * (props.xMax - props.xMin) + props.xMin
			}
			function transformYComponent(y:number) {
				return y * (props.yMax - props.yMin) + props.yMin
			}
			function normalizeXComponent(x:number) {
				return (x - props.xMin) / (props.xMax - props.xMin)
			}
			function normalizeYComponent(y:number) {
				return (y - props.yMin) / (props.yMax - props.yMin)
			}

			const point = reactive({
				x: plane_origin.value.x ? 1 - normalizeXComponent(props.x) : normalizeXComponent(props.x),
				y: plane_origin.value.y ? 1 - normalizeYComponent(props.y) : normalizeYComponent(props.y)
			})
			const plane = ref<HTMLDivElement>()
			const moving = ref(false)

			watch(() => [props.x, props.y], () => {
				point.x = plane_origin.value.x ? 1 - normalizeXComponent(props.x) : normalizeXComponent(props.x)
				point.y = plane_origin.value.y ? 1 - normalizeYComponent(props.y) : normalizeYComponent(props.y)
			})

			function updatePointByClientCoords(clientX:number, clientY:number) {
				if (plane.value) {
					let { x: plane_x, width: plane_width, y: plane_y, height: plane_height } = plane.value.getBoundingClientRect()

					point.x = Math.max(0, Math.min(1, (clientX - plane_x) / plane_width))
					point.y = Math.max(0, Math.min(1, (clientY - plane_y) / plane_height))
					emit('update:x', transformXComponent(plane_origin.value.x ? 1 - point.x : point.x))
					emit('update:y', transformYComponent(plane_origin.value.y ? 1 - point.y : point.y))
				}
			}

			function pointerDown(e:PointerEvent) {
				document.addEventListener("pointermove", pointerMove)
				document.addEventListener("pointerup", pointerUp)
				moving.value = true

				updatePointByClientCoords(e.clientX, e.clientY)
			}
			function pointerMove(e:PointerEvent) {
				updatePointByClientCoords(e.clientX, e.clientY)
			}
			function pointerUp({}:PointerEvent) {
				document.removeEventListener("pointermove", pointerMove)
				document.removeEventListener("pointerup", pointerUp)
				moving.value = false
			}

			return {
				pointerDown,
				plane,
				point
			}
		}
	})
</script>

