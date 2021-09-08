<template>
	<div class="__cs-p-2 __cs-bg-gray-700 __cs-text-white">
		<h2 class="__cs-text-lg __cs-font-semibold">Settings</h2>
	</div>
	<settings-editor />
</template>

<script lang="ts">
	import { defineComponent } from 'vue'
	import SettingsEditor from '../components/editors/SettingsEditor.vue'

	export default defineComponent({
		components: { SettingsEditor },
		setup () {
			

			return {}
		}
	})
</script>
