import { createApp } from 'vue'
import App from './App.vue'

import SvgIcon from './components/SvgIcon.vue'
export function createColorSuiteApp() {
	const app = createApp(App)

	app.component('svg-icon', SvgIcon)
	return { app }
}