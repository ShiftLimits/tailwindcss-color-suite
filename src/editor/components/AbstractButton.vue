<template>
	<component :is="resolved_is" v-bind="$attrs" v-slot="slot" :to="to" :custom="custom">
		<slot
			v-if="(is && !to) || !is"
			:isActive="slot ? slot.isActive : null"
			:href="slot ? slot.href : null"
			:navigate="slot ? slot.navigate : () => {}"
		/>
		<component v-else :is="is" v-bind="$attrs" @click="slot.navigate">
			<slot
				:isActive="slot ? slot.isActive : null"
				:href="slot ? slot.href : null"
				:navigate="slot ? slot.navigate : () => {}"
			/>
		</component>
	</component>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
	props: ['to', 'is', 'custom'],
	setup(props, { attrs }) {
		const resolved_is = computed(() => {
			if(props.to) return 'router-link' // If we have a `to` prop then we are building a `router-link`
			if (props.is) return props.is
			return 'button' // Default case will be a normal button element
		})

		const custom = computed(() => { // Is the `router-link` a custom element?
			if (props.to) { // We have a `to` prop so this is definitely going to be a `router-link`
				if (props.custom) return true // `custom` prop was passed so it is definitely custom
				if (props.is) return true // We have an `is` prop so it is definitely going to render a custom element
			}
		})
		return {
			resolved_is,
			custom,
			test() {
				console.log('test')
			}
		}
	}
})
</script>
