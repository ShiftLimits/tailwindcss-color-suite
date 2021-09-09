<template>
	<div class="__cs-cursor-pointer  __cs-relative __cs-overflow-hidden __cs-rounded-full __cs-w-8 __cs-h-4 __cs-bg-gray-500 focus-within:__cs-ring-2 __cs-text-black">
		<div class="__cs-h-full __cs-flex __cs-items-stretch __cs-transition-transform __cs-duration-100 __cs-ease-in-out __cs-transform" :class="{ '__cs--translate-x-1/2': !value }" style="width: 200%">
			<div class="__cs-w-1/2 __cs-bg-green-500"></div>
			<div class="__cs-w-1/2 __cs-bg-red-500"></div>
		</div>
		<div class="__cs-absolute __cs-inset-0 __cs-transition-transform __cs-duration-100 __cs-ease-in-out __cs-transform" :class="{ '__cs-translate-x-full': value }">
			<div class="__cs-w-4 __cs-h-4 __cs-bg-white __cs-rounded-full __cs-transition-transform __cs-duration-100 __cs-ease-in-out __cs-transform" :class="{ '__cs--translate-x-full': value }"></div>
		</div>
		<input class="__cs-opacity-0 __cs-absolute __cs-inset-0 __cs-cursor-pointer __cs-outline-none" type="checkbox" v-model="value" />
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, nextTick, ref, watch } from 'vue'

	export default defineComponent({
		props: ['modelValue'],
		setup (props, { emit }) {
			const value = ref<string>('')

			const flush = 'sync'
			let syncing = false
			watch(() => props.modelValue, (new_value) => {
				syncing = true // Mark as syncing so when we set the internal value it doesn't also emit again
				value.value = new_value
				nextTick(() => syncing = false) // Mark as not syncing on the next tick; since flush is 'sync' both watches will be processed at once; after that we need not be marked as syncing
			}, { flush, immediate: true })
			watch(value, (new_value) => {
				if (syncing) syncing = false
				else emit('update:modelValue', new_value)
			}, { flush, immediate: false })

			return {
				value
			}
		}
	})
</script>
