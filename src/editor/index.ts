import { createApp } from 'vue'
import App from './App.vue'

import { createRouter } from './router'
import { createKeyboardService } from './services/keyboard'
import { createSettingsService } from './services/settings'

import SvgIcon from './components/SvgIcon.vue'
import AbstractButton from './components/AbstractButton.vue'
import ButtonTab from './components/ButtonTab.vue'
import ButtonGhost from './components/ButtonGhost.vue'
import ButtonNeutral from './components/ButtonNeutral.vue'
import ButtonBlue from './components/ButtonBlue.vue'
import Toggle from './components/Toggle.vue'

export function createColorSuiteApp() {
	const app = createApp(App)

	const router = createRouter()
	app.use(router)

	const keyboard_service = createKeyboardService()
	app.use(keyboard_service)

	const settings_service = createSettingsService()
	app.use(settings_service)

	app.component('svg-icon', SvgIcon)
	app.component('abstract-button', AbstractButton)
	app.component('button-tab', ButtonTab)
	app.component('button-ghost', ButtonGhost)
	app.component('button-neutral', ButtonNeutral)
	app.component('button-blue', ButtonBlue)
	app.component('toggle', Toggle)

	return { app, router }
}