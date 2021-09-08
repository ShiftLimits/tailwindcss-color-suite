import { createRouter as createVueRouter, createMemoryHistory, RouteRecordRaw } from 'vue-router'

export function createRouter() {
	const routes:RouteRecordRaw[] = [
	]

	const history = createMemoryHistory()
	const router = createVueRouter({
		history,
		routes
	})

	return router
}