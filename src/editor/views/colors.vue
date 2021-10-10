<template>
	<div class="__cs-h-full __cs-flex __cs-flex-col">
		<div class="__cs-p-2 __cs-bg-gray-700 __cs-text-white __cs-flex __cs-items-center __cs-space-x-2">
			<div class="__cs-flex-grow"></div>
			<div class="__cs-text-gray-400">Create</div>
			<div class="__cs-rounded-group __cs-border-group">
				<button-ghost to="/colors/create">Solid</button-ghost>
				<button-ghost to="/colors/create?type=scale">Scale</button-ghost>
				<button-ghost to="/colors/create?type=alias">Alias</button-ghost>
			</div>
		</div>
		<div v-if="color_list.length || settings.include_transparent || settings.include_current || settings.include_inherit" class="__cs-flex-1 __cs-flex __cs-flex-col __cs-overflow-auto __cs-overscroll-contain">
			<draggable v-if="color_list.length" v-model="color_list" item-key="0" handle=".handle">
				<template #item="{ element: [token, color] }">
					<color-palette-item :color="color" :token="token.toString()">
						<div class="__cs-flex __cs-items-center __cs-justify-center __cs-pr-2">
							<button @click.prevent="confirmDeleteColor(token.toString())" class="__cs-p-2 hover:__cs-bg-gray-700 hover:__cs-rounded-t-md __cs-text-gray-300 hover:__cs-text-white"><svg-icon name="delete" class="__cs-fill-current __cs-h-4" /></button>
							<button @click.prevent="duplicateColor(token.toString())" class="__cs-p-2 hover:__cs-bg-gray-700 hover:__cs-rounded-t-md __cs-text-gray-300 hover:__cs-text-white"><svg-icon name="copy" class="__cs-fill-current __cs-h-4" /></button>
						</div>
					</color-palette-item>
				</template>
			</draggable>
			<color-palette-item v-if="settings.include_transparent" color="transparent" token="transparent" css locked help="CSS `transparent` value. Configure in settings." />
			<color-palette-item v-if="settings.include_current" color="currentColor" token="current" css locked help="CSS `currentColor` value. Configure in settings." />
			<color-palette-item v-if="settings.include_inherit" color="inherit" token="inherit" css locked help="CSS `inherit` value. Configure in settings." />
		</div>
		<div v-else class="__cs-flex-1 __cs-flex __cs-items-center __cs-justify-center __cs-text-gray-600">
			Your palette is empty.
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { useColorService } from '../services/color'
import { useSettingsService } from '../services/settings'
import ColorPaletteItem from '../components/ColorPaletteItem.vue'
import Draggable from 'vuedraggable'
import { CSColor } from '../../types';

export default defineComponent({
	components: { ColorPaletteItem, Draggable },
	setup() {
		const { settings } = useSettingsService()
		const { colors, createColor, updateAll, deleteColor } = useColorService()

		async function duplicateColor(token:string) {
			let match_last_number = token.match(/(.*)-([0-9]*)$/)
			let base_token = match_last_number ? match_last_number[1] : token

			let duplicate_number = match_last_number ? parseInt(match_last_number[2]) + 1 : 2
			let duplicate_token = `${base_token}-${duplicate_number}`
			while(colors[duplicate_token] != undefined) duplicate_token = `${base_token}-${duplicate_number++}`

			await createColor({
				token: duplicate_token,
				value: colors[token]
			})
		}
		function confirmDeleteColor(token:string) {
			const confirmed = confirm(`Are you sure you want to delete the color ${token}?`)
			if (confirmed) deleteColor(token)
		}

		const color_list = computed<[string, CSColor][]>({
			get() {
				return Object.entries(colors)
			},
			set(value) {
				updateAll(Object.fromEntries(value))
			}
		})

		return {
			duplicateColor,
			confirmDeleteColor,
			colors,
			color_list,
			settings
		}
	}
})
</script>
