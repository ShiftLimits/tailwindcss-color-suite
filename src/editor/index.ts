import { createApp } from 'vue'
import App from './App.vue'

export function createColorSuiteApp() {
	const app = createApp(App)

	return { app }
}