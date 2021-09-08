<template>
	<section>
		<div class="__cs-p-2 __cs-bg-gray-800">
			<h3 class="__cs-font-bold">Panel Settings</h3>
		</div>
		<div class="__cs-p-4 __cs-space-y-4">
			<label class="__cs-flex __cs-items-center __cs-space-x-2">
				<toggle v-model="settings.open_button" />
				<div>Show color suite button</div>
			</label>
			<label class="__cs-flex __cs-items-center __cs-space-x-2">
				<toggle v-model="settings.float_panel" />
				<div>Float over content</div>
			</label>
		</div>
		<div class="__cs-p-2 __cs-bg-gray-800">
			<h3 class="__cs-font-bold">Palette Settings</h3>
		</div>
		<div class="__cs-p-4 __cs-space-y-4">
			<label class="__cs-flex __cs-items-center __cs-space-x-2">
				<toggle v-model="settings.include_transparent" />
				<div>Include transparent color</div>
			</label>
			<label class="__cs-flex __cs-items-center __cs-space-x-2">
				<toggle v-model="settings.include_current" />
				<div>Include currentColor color</div>
			</label>
		</div>
	</section>
</template>

<script lang="ts">
	import { defineComponent } from 'vue'
	import { useSettingsService } from '../../services/settings'

	export default defineComponent({
		setup () {
			const { settings } = useSettingsService()

			return {
				settings
			}
		}
	})
</script>
