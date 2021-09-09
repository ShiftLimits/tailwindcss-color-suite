import { createStore as createVuexStore } from 'vuex'

export function createStore() {
	const store = createVuexStore({})

	return store
}