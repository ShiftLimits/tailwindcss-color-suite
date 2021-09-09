import { inject, reactive, computed, toRaw, triggerRef, toRef } from 'vue'
import { SettingsService } from './types'
import { ColorSuiteSettings } from '../../../types'
import { Store } from 'vuex'
import { settings_store } from './store'
import { COLOR_SUITE_ID, DEFAULT_COLOR_CONFIG } from '../../../constants';

const settings_service_key = Symbol('__SETTINGS_SERVICE__')

export function useSettingsService() {
	const settings_service = inject<SettingsService>(settings_service_key)
	if (!settings_service) throw new Error('Unable to inject Settings Service.')
	return settings_service
}

export function createSettingsService(store:Store<any>) {
	const settings = new Proxy<ColorSuiteSettings>({} as ColorSuiteSettings, {
		get(target, prop) {
			return store.state.settings[prop]
		},
		set(target, prop, value) {
			store.dispatch('settings/update', { [prop]: value })
			return true
		}
	})

	if (import.meta.hot) {
		import.meta.hot.on(`${ COLOR_SUITE_ID }:config-updated` as any, (config:any) => {
			Object.assign(settings, config.settings)
		})
	}

	const settings_service:SettingsService = {
		settings,
		install(app) {
			store.registerModule('settings', settings_store)
			app.provide(settings_service_key, settings_service)
		}
	}
	return settings_service
}

export * from './forms'