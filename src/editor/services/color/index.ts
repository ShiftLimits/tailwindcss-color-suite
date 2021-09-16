import { inject, reactive } from 'vue';
import { Store } from 'vuex'
import { ColorService } from './types';
import { ColorSuiteColors, CSColor } from '../../../types'
import { CreateColorForm, UpdateColorForm } from './forms'
import { COLOR_SUITE_ID } from '../../../constants'
import { color_store } from './store'
import colors_config from '@tailwindcss-color-suite/colors/config'
import { updateRootVariables } from '../../lib/utils.color-suite'

const color_service_key = Symbol('__COLOR_SERVICE__')

export function useColorService() {
	const color_service = inject<ColorService>(color_service_key)
	if (!color_service) throw new Error('Unable to inject Color Service.')
	return color_service
}

export function createColorService(store:Store<any>) {
	const colors = new Proxy<ColorSuiteColors>(reactive(colors_config) as ColorSuiteColors, {
		get(target, prop) {
			return store.state.colors[prop]
		},
		set(target, prop, value) {
			// swallow the update (readonly)
			return true
		}
	})

	for (let [token, value] of Object.entries<CSColor>(colors_config)) {
		updateRootVariables(token, value, colors_config)
	}

	if (import.meta.hot) {
		import.meta.hot.on(`${ COLOR_SUITE_ID }:config-updated` as any, (config:any) => {
			store.commit('colors/updateAll', config.colors)

			for (let [token, value] of Object.entries<CSColor>(config.colors)) {
				updateRootVariables(token, value, config.colors)
			}
		})
	}


	function createColor(form:CreateColorForm) {
		return store.dispatch('colors/create', form)
	}

	function updateColor(token:string, form:UpdateColorForm) {
		return store.dispatch('colors/update', { token, form })
	}

	function updateAll(colors:ColorSuiteColors) {
		return store.dispatch('colors/updateAll', colors)
	}

	function deleteColor(token:string) {
		return store.dispatch('colors/delete', { token })
	}

	const color_service:ColorService = {
		colors,
		createColor,
		updateColor,
		updateAll,
		deleteColor,
		install(app) {
			store.registerModule('colors', color_store)
			app.provide(color_service_key, color_service)
		}
	}

	return color_service
}

export * from './forms'