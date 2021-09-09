<template>
	<router-link :to="`/colors/${token}`" class="__cs-p-2 __cs-flex __cs-space-x-2 __cs-border-b __cs-border-black hover:__cs-bg-gray-600">
		<div class="__cs-rounded-sm __cs-bg-gray-800 __cs-w-3 __cs-cursor-move"></div>
		<div class="__cs-flex-grow __cs-flex __cs-flex-col">
			<div class="__cs-flex __cs-h-7 __cs-border-2 __cs-border-black __cs-bg-transparency-grid  __cs-rounded-md __cs-overflow-hidden">
				<div v-if="typeof color == 'string'" class="__cs-flex-1" :style="`background-color: ${ color };`"></div>
				<div v-if="typeof color == 'object'" class="__cs-flex-1 __cs-flex">
				</div>
			</div>
			<div class="flex space-x-2">
				<div class="flex-1">{{ token }}</div>
				<div><slot /></div>
			</div>
		</div>
	</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		token:String,
		color:[String, Object, Function]
	},
	setup() {
		return {}
	}
})
</script>
