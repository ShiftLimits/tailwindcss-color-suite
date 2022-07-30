import { createColorSuiteApp } from './editor'
import { EDITOR_APP_MOUNT_ID } from './constants'
import 'virtual:svg-icons-register'

import editor_stylesheet from './app.main.css?inline'

const { app } = createColorSuiteApp()

const shadow = document.getElementById(EDITOR_APP_MOUNT_ID)?.attachShadow({ mode: 'open' })
if (shadow) {
	const app_css = document.createElement('style')
	app_css.textContent = editor_stylesheet

	shadow.appendChild(app_css)

	const icons_root = document.getElementById('__cs_icons__')
	shadow.appendChild(icons_root)

	const app_root = document.createElement('div')
	app_root.style.display = 'none'

	shadow.appendChild(app_root)

	const instance = app.mount(app_root)
	instance.$nextTick(() => app_root.style.display = '')
} else {
  console.error('[Color Suite] Unable to create shadow root.')
}