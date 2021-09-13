<template>
	<abstract-button
		:to="to"
		custom="true"
		v-slot="{ isActive, href, navigate }"
	>
		<a
			:href="href"
			@click="navigate"
			v-bind="$attrs"
			class="__cs-px-2 __cs-py-1 __cs-rounded-t-sm __cs-cursor-pointer __cs-bg-gradient-to-t" 
			:class="{
				'__cs-bg-gray-700 __cs-from-gray-700 hover:__cs-to-gray-600 __cs-text-white': isActive,
				'__cs-bg-gray-800 __cs-from-gray-800 hover:__cs-to-gray-700 hover:__cs-text-white __cs-text-gray-300': !isActive
			}"
		>
			<slot />
		</a>
	</abstract-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props:['to'],
	setup() {
		
	}
})
</script>
