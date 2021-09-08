<template>
	<component :is="to ? 'router-link' : 'button'" v-bind="$attrs" :to="to" v-slot="slot" :custom="!!to && !$attrs.class">
		<slot
			:isActive="slot ? slot.isActive : null"
			:href="slot ? slot.href : null"
			:navigate="slot ? slot.navigate : () => {}"
		/>
	</component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: ['to'],
	setup() {
		return {}
	}
})
</script>
