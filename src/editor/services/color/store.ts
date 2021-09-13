import { Module } from 'vuex'
import { ColorSuiteColors } from '../../../types';
import { CreateColorForm, UpdateColorForm } from './forms';
import { hydrateColorConfig } from '../../lib/utils.color-suite'
import colors_config from '@tailwindcss-color-suite/colors/config'

interface UpdatePayload {
	token: string
	form: UpdateColorForm
}
interface DeletePayload {
	token: string
}

export const color_store:Module<ColorSuiteColors, any> = {
	namespaced: true,
	state() {
		return hydrateColorConfig(colors_config)
	},
	mutations: {
		create(state, form:CreateColorForm) {
			state[form.token] = form.value
		},
		update(state, { token, form }:UpdatePayload) {
			if (form.token != token) delete state[token] // this token is being renamed, delete old one
			state[form.token] = form.value
		},
		delete(state, { token }:DeletePayload) {
			delete state[token]
		},
		hotReload(state, colors:ColorSuiteColors) {
			let remaining_tokens = Object.keys(state)
			for (let [token, color] of Object.entries(colors)) {
				let current_token = remaining_tokens.shift()

				if (current_token && token != current_token) { // There is a token in this position but it does not match the one from our new config
					let remaining_index = remaining_tokens.indexOf(token)
					if (remaining_index >= 0) { // The new token does exist already in a different spot
						remaining_tokens.splice(remaining_index, 1) // take the current token out of the remaining tokens list as we are using it again in the current spot
						remaining_tokens.unshift(current_token) // put the mismatched token back in for the next round
					}
				}

				delete state[token]
				state[token] = color
			}

			for (let token of remaining_tokens) delete state[token] // delete any remaining tokens from the state as they are no longer in the config
		}
	},
	actions: {
		async create(context, form:CreateColorForm) {
			let result = await fetch('/@tailwindcss-color-suite/color/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form)
			})

			if (result.ok) {
				context.commit('create', form)
				return { success: true }
			}
			return { success: false }
		},
		async update(context, { token, form }:UpdatePayload) {
			let result = await fetch(`/@tailwindcss-color-suite/color/update?token=${token}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form)
			})

			if (result.ok) {
				context.commit('update', { token, form })
				return { success: true }
			}
			return { success: false }
		},
		async delete(context, { token }:DeletePayload) {
			let result = await fetch(`/@tailwindcss-color-suite/color/delete?token=${token}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				}
			})

			if (result.ok) {
				context.commit('delete', { token })
				return { success: true }
			}
			return { success: false }
		}
	}
}