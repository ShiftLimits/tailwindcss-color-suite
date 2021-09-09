import { Module } from 'vuex'
import { ColorSuiteSettings } from '../../../types'
import { UpdateSettingsForm } from './forms'
import settings_config from '@tailwindcss-color-suite/settings/config'

export const settings_store:Module<ColorSuiteSettings, any> = {
	namespaced: true,
	state() {
		return settings_config
	},
	mutations: {
		update(state, form:UpdateSettingsForm) {
			Object.assign(state, form)
		}
	},
	actions: {
		async update(context, form:UpdateSettingsForm) {
			const memento = Object.keys(form).reduce((memento, key) => {
				return {...memento, [key]: context.state[key] }
			}, {}) // Construct a memento of the values being updated from the current state

			context.commit('update', form) // eager commit

			try {
				let result = await fetch('/@tailwindcss-color-suite/settings/update', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(form)
				})

				if (!result.ok) throw new Error('Failed to updated settings')
			} catch(e) {
				context.commit('update', memento) // revert eager commit
			}
		}
	}
}