<template>
	<abstract-button
		v-bind="$attrs"
		v-slot="{ isActive, href, navigate }"
	>
		<a
			:href="href"
			@click="navigate"
			class="__cs-inline-block __cs-px-2 __cs-py-1 __cs-border __cs-border-gray-900 hover:__cs-bg-gray-900 __cs-rounded-sm"
		>
			<slot />
		</a>
	</abstract-button>
</template>

<script lang="ts">
	import { defineComponent } from 'vue'

	export default defineComponent({
		setup () {
			return {}
		}
	})
</script>
