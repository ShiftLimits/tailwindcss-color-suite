import { createRouter as createVueRouter, createMemoryHistory, RouteRecordRaw } from 'vue-router'

export function createRouter() {
	const routes:RouteRecordRaw[] = [
		{ path: '/', redirect: '/colors' },
		{ path: '/colors', component: () => import('./views/colors.vue'), name: 'colors' },
	]

	const history = createMemoryHistory()
	const router = createVueRouter({
		history,
		routes
	})

	return router
}