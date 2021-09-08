<template>
	<div class="__cs-cursor-pointer  __cs-relative __cs-overflow-hidden __cs-rounded-full __cs-w-8 __cs-h-4 __cs-bg-gray-500 focus-within:__cs-ring-2 __cs-text-black">
		<div class="__cs-h-full __cs-flex __cs-items-stretch __cs-transition-transform __cs-duration-100 __cs-ease-in-out __cs-transform" :class="{ '__cs--translate-x-1/2': !value }" style="width: 200%">
			<div class="__cs-w-1/2 __cs-bg-green-500"></div>
			<div class="__cs-w-1/2 __cs-bg-red-500"></div>
		</div>
		<div class="__cs-absolute __cs-inset-0 __cs-transition-transform __cs-duration-100 __cs-ease-in-out __cs-transform" :class="{ '__cs-translate-x-full': value }">
			<div class="__cs-w-4 __cs-h-4 __cs-bg-white __cs-rounded-full __cs-transition-transform __cs-duration-100 __cs-ease-in-out __cs-transform" :class="{ '__cs--translate-x-full': value }"></div>
		</div>
		<input class="__cs-opacity-0 __cs-absolute __cs-inset-0 __cs-cursor-pointer __cs-outline-none" type="checkbox" v-bind="$attrs" v-model="value" />
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue'

	export default defineComponent({
		props: ['modelValue'],
		setup (props, { emit }) {
			const value = computed<string>({
				get() {
					return props.modelValue
				},
				set(value) {
					emit('update:modelValue', value)
				}
			})
			return {
				value
			}
		}
	})
</script>
