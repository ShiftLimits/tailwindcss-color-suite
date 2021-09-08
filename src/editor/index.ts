import { createApp } from 'vue'
import App from './App.vue'

import { createKeyboardService } from './services/keyboard'
import { createSettingsService } from './services/settings'

import SvgIcon from './components/SvgIcon.vue'
export function createColorSuiteApp() {
	const app = createApp(App)

	const keyboard_service = createKeyboardService()
	app.use(keyboard_service)

	const settings_service = createSettingsService()
	app.use(settings_service)

	app.component('svg-icon', SvgIcon)
	return { app }
}