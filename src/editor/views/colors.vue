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
		<div v-if="Object.keys(colors).length || settings.include_transparent || settings.include_current" class="__cs-flex-1 __cs-flex __cs-flex-col __cs-overflow-auto __cs-overscroll-contain">
			<template v-if="Object.keys(colors).length">
				<color-palette-item v-for="(color, token) in colors" :key="token" :color="color" :token="token.toString()">
					<div class="__cs-flex __cs-items-center __cs-justify-center __cs-pr-2">
						<button @click.prevent="confirmDeleteColor(token.toString())" class="__cs-p-2 hover:__cs-bg-gray-700 hover:__cs-rounded-t-md __cs-text-gray-300 hover:__cs-text-white"><svg-icon name="delete" class="__cs-fill-current __cs-h-4" /></button>
						<button @click.prevent="duplicateColor(token.toString())" class="__cs-p-2 hover:__cs-bg-gray-700 hover:__cs-rounded-t-md __cs-text-gray-300 hover:__cs-text-white"><svg-icon name="copy" class="__cs-fill-current __cs-h-4" /></button>
					</div>
				</color-palette-item>
			</template>
			<!-- <color-palette-item v-if="settings.include_transparent" color="transparent" token="transparent"></color-palette-item>
			<color-palette-item v-if="settings.include_current" color="currentColor" token="current"></color-palette-item> -->
		</div>
		<div v-else class="__cs-flex-1 __cs-flex __cs-items-center __cs-justify-center __cs-text-gray-600">
			Your palette is empty.
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import ColorPaletteItem from '../components/ColorPaletteItem.vue'
import { useColorService } from '../services/color'
import { useSettingsService } from '../services/settings'

export default defineComponent({
	components: { ColorPaletteItem },
	setup() {
		const { settings } = useSettingsService()
		const { colors, createColor, deleteColor } = useColorService()

		async function duplicateColor(token:string) {
			let match_last_number = token.match(/(.*)-([0-9]*)$/)
			let base_token = match_last_number ? match_last_number[1] : token

			let duplicate_number = match_last_number ? parseInt(match_last_number[2]) + 1 : 2
			let duplicate_token = `${base_token}-${duplicate_number}`
			while(colors[duplicate_token] != undefined) duplicate_token = `${base_token}-${duplicate_number++}`
			console.log(token, {
				token: duplicate_token,
				value: colors[token]
			})

			await createColor({
				token: duplicate_token,
				value: colors[token]
			})
		}
		function confirmDeleteColor(token:string) {
			const confirmed = confirm(`Are you sure you want to delete the color ${token}?`)
			if (confirmed) deleteColor(token)
		}

		return {
			duplicateColor,
			confirmDeleteColor,
			colors,
			settings
		}
	}
})
</script>
