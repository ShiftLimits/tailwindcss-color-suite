<template>
	<form class="__cs-p-4 __cs-space-y-4">
		<form-field label="Color Token" help="Must be a valid JavaScript object key string.">
			<text-input v-model="data.token" />
		</form-field>
		<form-field label="References Existing Color">
			<color-select v-model="data.value" :omit="omit" />
		</form-field>
	</form>
</template>

<script lang="ts">
	import { defineComponent, reactive, watch, nextTick, PropType, computed } from 'vue';
import { CSColorAlias } from '../../../types';
	import { CreateColorForm, UpdateColorForm } from '../../services/color'
	import ColorSelect from '../ColorSelect.vue'

	export default defineComponent({
		props: {
			modelValue: {
				type: [Object, CreateColorForm, UpdateColorForm] as PropType<CreateColorForm|UpdateColorForm>,
				required: true
			}
		},
		components: { ColorSelect },
		setup (props, { emit }) {
			const DEFAULT_DATA:{ token:string, value:CSColorAlias } = {
				token: '',
				value: ''
			}
			const data = reactive<{ token:string, value:CSColorAlias }>(DEFAULT_DATA)

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

			const omit = computed(() => {
				if (props.modelValue) return [props.modelValue.token]
			})

			return {
				data,
				omit
			}
		}
	})
</script>
