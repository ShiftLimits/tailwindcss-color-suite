<template>
	<div
		class="__cs-flex __cs-rounded-t-sm __cs-bg-white __cs-text-black __cs-border-b-2 focus-within:__cs-border-blue-500 focus-within:__cs-ring-2 focus-within:__cs-ring-blue-500 focus-within:__cs-ring-opacity-30 __cs-ring-opacity-30"
		:class="{
			'__cs-border-gray-500': !validation,
			'__cs-border-red-500 __cs-ring-1 __cs-ring-red-500': validation == 'invalid',
			'__cs-border-green-500 __cs-ring-1 __cs-ring-green-500': validation == 'valid',
		}"
	>
		<div class="__cs-flex-1 __cs-px-2 __cs-py-1 __cs-cursor-text">
			<input type="text" v-bind="$attrs" v-model="text" size="1" class="__cs-w-full __cs-bg-transparent __cs-outline-none" />
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, watch, nextTick } from 'vue';

	export default defineComponent({
		props: {
			modelValue: [String, Number],
			validation: String
		},
		emits: ['update:modelValue'],
		setup (props, {emit}) {
			const text = ref<string|number|undefined>('')

			const flush = 'sync'
			let syncing = false
			watch(() => props.modelValue, (new_value) => {
				syncing = true // Mark as syncing so when we set the internal value it doesn't also emit again
				text.value = new_value
				nextTick(() => syncing = false) // Mark as not syncing on the next tick; since flush is 'sync' both watches will be processed at once; after that we need not be marked as syncing
			}, { flush, immediate: true })
			watch(text, (new_value) => {
				if (syncing) syncing = false
				else emit('update:modelValue', new_value)
			}, { flush, immediate: false })

			return {
				text
			}
		}
	})
</script>
