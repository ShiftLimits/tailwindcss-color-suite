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
	import { defineComponent, ref, watch } from 'vue'

	export default defineComponent({
		props: {
			modelValue: [String, Number],
			validation: String
		},
		emits: ['update:modelValue'],
		setup (props, {emit}) {
			const text = ref<string|number>('')

			const flush = 'sync'
			watch(() => props.modelValue, (new_value) => {
				text.value = new_value as string | number
			}, { flush, immediate: true })
			watch(text, (new_value) => {
				emit('update:modelValue', new_value)
			}, { flush, immediate: true })

			return {
				text
			}
		}
	})
</script>
