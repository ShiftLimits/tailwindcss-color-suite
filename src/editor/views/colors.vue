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
		<div v-if="Object.keys(colors).length || settings.include_transparent || settings.include_current" class="__cs-flex-1 __cs-flex __cs-flex-col __cs-overflow-auto">
			<template v-if="Object.keys(colors).length">
				<router-link v-for="(color, token) in colors" :key="token" :to="`/colors/${token}`" class="__cs-p-2 __cs-flex __cs-space-x-2 __cs-border-b __cs-border-black hover:__cs-bg-gray-600">
					<div class="__cs-rounded-sm __cs-bg-gray-800 __cs-w-3 __cs-cursor-move"></div>
					<div class="__cs-flex-grow __cs-flex __cs-flex-col">
						<!-- Color List Item Content -->
					</div>
				</router-link>
			</template>
			<color-list-item v-if="settings.include_transparent" color="transparent" token="transparent"></color-list-item>
			<color-list-item v-if="settings.include_current" color="currentColor" token="current"></color-list-item>
		</div>
		<div v-else class="__cs-flex-1 __cs-flex __cs-items-center __cs-justify-center __cs-text-gray-600">
			Your palette is empty.
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import ColorListItem from '../components/ColorListItem.vue'
import { useSettingsService } from '../services/settings'

export default defineComponent({
	components: { ColorListItem },
	setup() {
		const { settings } = useSettingsService()
		const colors = reactive({})
		return {
			colors,
			settings
		}
	}
})
</script>
