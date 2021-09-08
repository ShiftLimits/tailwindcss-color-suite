import { inject, reactive } from 'vue'
import { SettingsService } from './types'
import { ColorSuiteSettings } from '../../../types'

const settings_service_key = Symbol('__SETTINGS_SERVICE__')

export function useSettingsService() {
	const settings_service = inject<SettingsService>(settings_service_key)
	if (!settings_service) throw new Error('Unable to inject Settings Service.')
	return settings_service
}

export function createSettingsService() {
	const settings = reactive<ColorSuiteSettings>({
		open_button: true,
		float_panel: false,
		include_transparent: true,
		include_current: true
	})

	const settings_service:SettingsService = {
		settings,
		install(app) {
			app.provide(settings_service_key, settings_service)
		}
	}
	return settings_service
}