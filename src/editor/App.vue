<template>
	<div class="__cs-z-panel __cs-fixed __cs-inset-y-0 __cs-left-0 __cs-w-full __cs-max-w-20 __cs-pr-1 __cs-flex __cs-flex-col __cs-pointer-events-auto __cs-transform __cs-transition-transform __cs-ease-out-brisk __cs-duration-300 __cs-text-gray-50" :class="{ '__cs--translate-x-full': !open }" :style=" max_width != null ? `max-width: ${ max_width }px !important;` : ''">

		<!-- Right Resize Handle -->
		<div class="__cs-group __cs-absolute __cs-inset-y-0 __cs-right-0 __cs-w-2" style="cursor: ew-resize;" ref="resize_handle">
			<div class="__cs-ml-1 __cs-w-1 __cs-h-full __cs-transition-colors __cs-duration-150 __cs-ease-out-brisk group-hover:__cs-bg-blue-500" :class="{ '__cs-bg-black': !resizing, '__cs-bg-blue-500': resizing }"></div>
		</div>

		<!-- Hovering Open Button -->
		<div v-if="settings.open_button" @click="open ? closePanel() : openPanel()" class="__cs-cursor-pointer __cs-z-bg __cs-w-10 __cs-h-16 __cs-rounded-r-md __cs-bg-black hover:__cs-bg-gray-800 __cs-absolute __cs-right-1 __cs-top-1/2 __cs-transform __cs-translate-x-full __cs-transition-transform __cs-ease-out-brisk __cs-duration-300 __cs-flex __cs-items-center __cs-justify-center" :class="{'__cs-translate-x-0': open}"><div class="__cs-transform __cs--rotate-90 __cs-font-bold __cs-text-gray-300 __cs-leading-4">Color</div></div>

		<!-- Panel -->
		<div class="__cs-flex __cs-p-2 __cs-items-center __cs-bg-gradient-to-br __cs-from-gray-700 __cs-to-gray-800 __cs-text-gray-50 __cs-space-x-2">
			<div class="__cs-flex-grow"><h2 class="__cs-font-bold">Color Suite</h2></div>
			<button class="__cs-h-8 __cs-w-8 __cs-p-1 __cs-rounded-full __cs-text-gray-400 hover:__cs-text-white hover:__cs-bg-gray-700 __cs-font-semibold focus:__cs-outline-none focus:__cs-ring-2" @click="closePanel">
				<svg-icon name="close" class="__cs-fill-current" />
			</button>
		</div>
		<div class="__cs-flex __cs-px-2 __cs-pt-2 __cs-space-x-2 __cs-bg-gray-900 __cs-text-white">
			<button-tab to="/colors">Color Palette</button-tab>
			<button-tab to="/settings">Settings</button-tab>
		</div>
		<div class="__cs-flex-1 __cs-overflow-auto __cs-overscroll-contain __cs-bg-gray-900 __cs-text-white">
			<router-view />
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, onUnmounted, ref, nextTick, watch } from 'vue'
	import { useKeyboardService } from './services/keyboard'
	import { useSettingsService } from './services/settings'

	export default defineComponent({
		name: '__cs-panel',
		setup () {
			const SIZE_MAX = 540
			const SIZE_MIN = 360

			const resize_handle = ref<HTMLDivElement>()
			const max_width = ref(SIZE_MAX)
			const open = ref(false)

			const { settings } = useSettingsService()

			function unsetBodyTransitionClasses() {
				document.body.classList.remove('__cs-transition-all', '__cs-ease-out-brisk', '__cs-duration-300')
				document.body.removeEventListener("transitionend", unsetBodyTransitionClasses)
			}

			let original_body_padding_left:string = 'initial'
			let original_body_padding_left_calculated:number = 0
			watch(max_width, () => {
				if (!settings.float_panel && open.value) document.body.style.paddingLeft = `${original_body_padding_left_calculated + max_width.value}px`
			})
			watch(() => settings.float_panel, () => {
				if (settings.float_panel) document.body.style.paddingLeft = original_body_padding_left
				else if(max_width.value < window.innerWidth) document.body.style.paddingLeft = `${original_body_padding_left_calculated + max_width.value}px`
			})

			function openPanel() {
				open.value = true
				if (!settings.float_panel && max_width.value < window.innerWidth) {
					original_body_padding_left = document.body.style.paddingLeft
					original_body_padding_left_calculated = parseFloat(window.getComputedStyle(document.body).getPropertyValue('padding-left'))

					document.body.classList.add('__cs-transition-all', '__cs-ease-out-brisk', '__cs-duration-300')
					document.body.style.paddingLeft = `${ original_body_padding_left_calculated + max_width.value }px`
					document.body.addEventListener("transitionend", unsetBodyTransitionClasses)
				}
			}

			function closePanel() {
				open.value = false
				if (!settings.float_panel && max_width.value < window.innerWidth) {
					document.body.classList.add('__cs-transition-all', '__cs-ease-out-brisk', '__cs-duration-300')
					document.body.style.paddingLeft = original_body_padding_left
					document.body.addEventListener("transitionend", unsetBodyTransitionClasses)
				}
			}

			// Keyboard Shortcuts
			const { registerShortcut } = useKeyboardService()
			registerShortcut('ctrl+shift+F', (e) => {
				e.preventDefault()

				if (open.value) closePanel()
				else openPanel()
			})

			// Resize Handle
			const resizing = ref(false)
			let original_cursor:string
			let cursor_offset:number[]
			function pointerDown(e:PointerEvent) {
				resizing.value = true
				original_cursor = document.body.style.cursor
				document.body.style.cursor = 'ew-resize'

				let { x, y } = resize_handle.value!.getBoundingClientRect()
				cursor_offset = [e.clientX - x, e.clientY - y]

				document.addEventListener('pointermove', pointerMove)
				document.addEventListener('pointerup', pointerUp)
				e.preventDefault()
			}
			function pointerMove({ clientX }:PointerEvent) {
				let [x,y] = cursor_offset
				max_width.value = Math.min(Math.max(clientX + x, SIZE_MIN), SIZE_MAX)
			}
			function pointerUp(e:PointerEvent) {
				resizing.value = false
				document.body.style.cursor = original_cursor

				document.removeEventListener('pointermove', pointerMove)
				document.removeEventListener('pointerup', pointerUp)
			}

			onMounted(() => {
				if (resize_handle.value) resize_handle.value.addEventListener('pointerdown', pointerDown)
			})

			onUnmounted(() => {
				if (resize_handle.value) {
					resize_handle.value.removeEventListener('pointerdown', pointerDown)
					document.removeEventListener('pointermove', pointerMove)
					document.removeEventListener('pointerup', pointerUp)
					if (original_cursor) {
						document.body.style.cursor = original_cursor
					}
				}
			})

			return {
				settings,
				resize_handle,
				resizing,
				openPanel,
				closePanel,
				max_width,
				open
			}
		}
	})
</script>
