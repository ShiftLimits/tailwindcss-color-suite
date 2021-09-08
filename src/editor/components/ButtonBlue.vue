<template>
	<abstract-button v-bind="$attrs" class="__cs-inline-block __cs-px-2 __cs-py-1 __cs-bg-blue-500 hover:__cs-bg-blue-400 __cs-text-white __cs-rounded-sm">
		<slot />
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
