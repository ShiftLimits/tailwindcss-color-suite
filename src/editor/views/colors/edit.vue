<template>
	<div class="__cs-h-full __cs-flex __cs-flex-col">
		<div class="__cs-p-2 __cs-bg-gray-700 __cs-text-white __cs-flex">
			<div class="__cs-flex-grow"><h2 class="__cs-text-lg __cs-font-semibold">Edit {{ type_name }}</h2></div>
			<label class="__cs-flex __cs-items-center __cs-space-x-2">
				<div class="__cs-text-gray-400">Preview</div>
				<toggle v-model="preview" />
			</label>
		</div>
		<div class="__cs-flex-1 __cs-flex __cs-flex-col __cs-overflow-auto __cs-overscroll-contain">
			<color-single-editor v-if="isColorSolid(data.value)" :modelValue="data" @update:modelValue="new_value => Object.assign(data, new_value)" />
			<color-scale-editor v-else-if="isColorScale(data.value)" :modelValue="data" @update:modelValue="new_value => Object.assign(data, new_value)" class="__cs-flex-1 __cs-overflow-hidden" />
			<color-alias-editor v-else-if="isColorAlias(data.value)" :modelValue="data" @update:modelValue="new_value => Object.assign(data, new_value)" class="__cs-flex-1" />
		</div>
		<div class="__cs-p-2 __cs-flex __cs-space-x-2  __cs-bg-gray-700">
			<div class="__cs-flex-grow">
				<button-red @click="deleteSelf">Delete</button-red>
			</div>
			<div class="__cs-flex __cs-space-x-2">
				<button-neutral @click="cancel">Cancel</button-neutral>
				<button-blue @click="submit">Save</button-blue>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, reactive, readonly, ref, toRaw, watch } from 'vue'
	import { useRouter } from 'vue-router'
	import ColorSingleEditor from '../../components/editors/ColorSingleEditor.vue'
	import ColorScaleEditor from '../../components/editors/ColorScaleEditor.vue'
	import ColorAliasEditor from '../../components/editors/ColorAliasEditor.vue'
	import { UpdateColorForm } from '../../services/color/forms'
	import { useColorService } from '../../services/color'
	import { debounceAnimationFrame, reactiveCloneDeep } from '../../lib/utils'
import { isColorScale, isColorAlias, isColorSolid } from '../../lib/utils.color-suite';

	export default defineComponent({
		components: { ColorSingleEditor, ColorScaleEditor, ColorAliasEditor },
		setup () {
			const type_name = computed(() => {
				switch (currentRoute.value.query.type) {
					case 'scale': return 'Color Scale'
					case 'alias': return 'Color Alias'
					default: return 'Solid Color'
				}
			})

			const preview = ref(true)
			const data = reactive({} as UpdateColorForm)
			const { colors, updateColor, deleteColor } = useColorService()
			const { push, currentRoute } = useRouter()

			const token = currentRoute.value.params.token as string // Get the token from the current route
			const color = colors[token] // Use the token to look up the color value
			if (!token || !color) push('/') // Token or color by that token doesn't exist so just send 'em home

			data.token = token
			if (isColorScale(color)) data.value = reactiveCloneDeep(color)
			else data.value = color

			async function submit() {
				let result = await updateColor(token, data)
				if (result.success) push('/')
			}

			function cancel() {
				// updateRootVariables(token, color)
				push('/')
			}

			async function deleteSelf() {
				let result = await deleteColor(token)
				if (result.success) push('/')
			}

			watch(preview, (new_value) => {
				// if (new_value) return updateRootVariables(token, data.value)
				// updateRootVariables(token, color)
			})
			watch(data, debounceAnimationFrame(() => {
				// if (preview.value) updateRootVariables(token, data.value)
			}))

			return {
				preview,
				type_name,
				deleteSelf,
				cancel,
				submit,
				data,
				isColorAlias,
				isColorScale,
				isColorSolid
			}
		}
	})
</script>
