import { App } from 'vue';
import { ColorSuiteSettings } from '../../../types'

export interface SettingsService {
	settings:ColorSuiteSettings,
	install(app:App):void
}