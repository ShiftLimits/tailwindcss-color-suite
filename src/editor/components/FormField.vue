<template>
	<div>
		<label v-if="label">
			<div class="__cs-text-sm __cs-font-bold __cs-mb-2">{{ label }}</div>
			<slot :validation="validation" :errors="errors" />
		</label>
		<template v-else><slot /></template>
		<div v-if="help" class="__cs-text-sm __cs-text-gray-400">{{ help }}</div>
		<div class="text-sm text-red-500" v-if="errors && (noErrors == false || noErrors == undefined) && errors.length">{{ errors[0] }}</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, inject, ref, watch } from 'vue'

	export default defineComponent({
		props: {
			formKey:String,
			label:String, // Text label to display
			help:String,
			optional:[Boolean,String],
			noErrors:[Boolean,String],
			maxErrors:[Number,String]
		},
		setup(props) {
			const validation = ref<''|'valid'|'invalid'>('')
			const errors = ref([])

			return {
				validation,
				errors
			}
		}
	})
</script>
