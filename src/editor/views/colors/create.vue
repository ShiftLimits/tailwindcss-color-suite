<template>
	<div class="__cs-h-full __cs-flex __cs-flex-col">
		<div class="__cs-p-2 __cs-bg-gray-700 __cs-text-white">
			<h2 class="__cs-text-lg __cs-font-semibold">New {{ type_name }}</h2>
		</div>
		<div class="__cs-flex-1 __cs-flex __cs-flex-col __cs-overflow-auto __cs-overscroll-contain">
			<color-single-editor v-if="!$route.query.type || $route.query.type == 'single'" :modelValue="data" @update:modelValue="new_value => Object.assign(data, new_value)" />
			<color-scale-editor v-else-if="$route.query.type == 'scale'" :modelValue="data" @update:modelValue="new_value => Object.assign(data, new_value)" class="__cs-flex-1 __cs-overflow-hidden" />
			<color-alias-editor v-else-if="$route.query.type == 'alias'" :modelValue="data" @update:modelValue="new_value => Object.assign(data, new_value)" />
		</div>
		<div class="__cs-p-2 __cs-flex __cs-space-x-2  __cs-bg-gray-700">
			<div class="__cs-flex-grow"></div>
			<div class="__cs-flex __cs-space-x-2">
				<button-neutral to="/">Cancel</button-neutral>
				<button-blue @click="submit">Create</button-blue>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, reactive, ref } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import ColorSingleEditor from '../../components/editors/ColorSingleEditor.vue'
	import ColorScaleEditor from '../../components/editors/ColorScaleEditor.vue'
	import ColorAliasEditor from '../../components/editors/ColorAliasEditor.vue'
	import { useColorService, CreateColorForm } from '../../services/color'

	export default defineComponent({
		components: { ColorSingleEditor, ColorScaleEditor, ColorAliasEditor },
		setup () {
			const data = reactive<CreateColorForm>(new CreateColorForm())
			const { createColor } = useColorService()
			const { push, currentRoute } = useRouter()

			async function submit() {
				let result = await createColor(data)
				if (result.success) push('/')
			}

			const type_name = computed(() => {
				switch (currentRoute.value.query.type) {
					case 'scale': return 'Color Scale'
					case 'alias': return 'Color Alias'
					default: return 'Solid Color'
				}
			})

			return {
				type_name,
				submit,
				data
			}
		}
	})
</script>
