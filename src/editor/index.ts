import { createApp } from 'vue'
import App from './App.vue'

import { createStore } from './store'
import { createRouter } from './router'
import { createKeyboardService } from './services/keyboard'
import { createSettingsService } from './services/settings'

import SvgIcon from './components/SvgIcon.vue'
import AbstractButton from './components/AbstractButton.vue'
import ButtonTab from './components/ButtonTab.vue'
import ButtonGhost from './components/ButtonGhost.vue'
import ButtonNeutral from './components/ButtonNeutral.vue'
import ButtonBlue from './components/ButtonBlue.vue'
import ButtonRed from './components/ButtonRed.vue'
import FormField from './components/FormField.vue'
import Toggle from './components/Toggle.vue'
import TextInput from './components/TextInput.vue'
import Slider from './components/Slider.vue'
import SliderXY from './components/SliderXY.vue'

export function createColorSuiteApp() {
	const app = createApp(App)

	const store = createStore()
	app.use(store)

	const router = createRouter()
	app.use(router)

	const keyboard_service = createKeyboardService()
	app.use(keyboard_service)

	const settings_service = createSettingsService(store)
	app.use(settings_service)

	app.component('svg-icon', SvgIcon)
	app.component('abstract-button', AbstractButton)
	app.component('button-tab', ButtonTab)
	app.component('button-ghost', ButtonGhost)
	app.component('button-neutral', ButtonNeutral)
	app.component('button-blue', ButtonBlue)
	app.component('button-red', ButtonRed)
	app.component('form-field', FormField)
	app.component('text-input', TextInput)
	app.component('toggle', Toggle)
	app.component('slider', Slider)
	app.component('slider-xy', SliderXY)

	return { app, store, router }
}