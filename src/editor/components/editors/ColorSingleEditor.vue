<template>
	<form class="__cs-p-4 __cs-space-y-4">
		<form-field label="Color Token" help="Must be a valid JavaScript object key string.">
			<text-input v-model="data.token" />
		</form-field>
		<form-field label="Color Value">
			<color-picker v-model="data.value" />
		</form-field>
	</form>
</template>

<script lang="ts">
	import { computed, defineComponent, reactive, watch, nextTick, PropType } from 'vue'
	import ColorPicker from '../ColorPicker.vue'
	import { CreateColorForm, UpdateColorForm } from '../../services/color'
	import { CSColorSolid } from '../../../types'
	import { Point } from '../../lib/point'

	export default defineComponent({
		components: { ColorPicker },
		props: {
			modelValue: {
				type: [Object, CreateColorForm, UpdateColorForm] as PropType<CreateColorForm|UpdateColorForm>,
				default: () => ({}),
				required: true
			}
		},
		setup (props, { emit }) {
			const DEFAULT_DATA:{ token:string, value:CSColorSolid } = {
				token: '',
				value: { h: 0, s: 100, v: 100, a: 100 }
			}
			const data = reactive<{ token:string, value:CSColorSolid }>(DEFAULT_DATA)

			const flush = 'sync'
			let syncing = false
			watch(() => props.modelValue, (new_value) => {
				if (!syncing) {
					syncing = true
					if (!new_value.token) new_value.token = DEFAULT_DATA.token
					if (!new_value.value) new_value.value = DEFAULT_DATA.value
					Object.assign(data, new_value)
					nextTick(() => syncing = false)
				}
			}, { flush, immediate: true })
			watch(data, (new_value) => {
				if (!syncing) {
					emit('update:modelValue', new_value)
				}
			}, { flush, immediate: false })

			return {
				data
			}
		}
	})
</script>
