<template>
	<line :x1="from.x * 100" :y1="from.y * 100" :x2="to.x * 100" :y2="to.y * 100" class="__cs-stroke-black" stroke-width="0.1875rem" vector-effect="non-scaling-stroke"></line>
	<line :x1="from.x * 100" :y1="from.y * 100" :x2="to.x * 100" :y2="to.y * 100" class="__cs-stroke-blue-300" stroke-width="0.0625rem" vector-effect="non-scaling-stroke"></line>
</template>

<script lang="ts">
	import { defineComponent } from 'vue'
	import { Point } from '../../point'

	export default defineComponent({
		props: {
			from: { type: Object as () => { x:number, y: number }, required: true },
			to: { type: Object as () => { x:number, y: number }, required: true }
		},
		setup () {
			return {}
		}
	})
</script>
