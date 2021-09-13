<template>
	<abstract-button is="button" :to="to" v-bind="$attrs" class="__cs-inline-block __cs-px-2 __cs-py-1 __cs-bg-gray-500 hover:__cs-bg-gray-400 __cs-text-white __cs-rounded-sm">
		<slot />
	</abstract-button>
</template>

<script lang="ts">
	import { defineComponent } from 'vue'

	export default defineComponent({
		props:['to'],
		setup () {
			return {}
		}
	})
</script>
