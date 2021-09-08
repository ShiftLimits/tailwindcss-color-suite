import { App, inject } from 'vue'
import { ShortcutListener, KeyboardService, ShortcutKeys, ShortcutCallback } from './types'
import { createShortcutKeys, debounce, normalizeKey, matchShortcutKeys } from './utils'

const keyboard_service_key = Symbol('__KEYBOARD_SERVICE__')
const all_modifiers = ['ctrl', 'shift', 'alt', 'meta']

export function useKeyboardService() {
	const keyboard_service = inject<KeyboardService>(keyboard_service_key)
	if (!keyboard_service) throw new Error('Unable to inject Keyboard Service.')
	return keyboard_service
}

export function createKeyboardService() {
	const listeners:ShortcutListener[] = []
	const debounce_time = 500

	let buffer:ShortcutKeys = []
	const clearBufferDebounced = debounce(() => buffer = [], debounce_time)

	function keyDownListener(event:KeyboardEvent) {
		if (event.repeat) return
		if (event.getModifierState(event.key)) return
		clearBufferDebounced()

		const description = { [normalizeKey(event.key)]: true }
		all_modifiers.forEach((m:string) => event[`${m}Key`] ? description[m] = true : null)

		buffer.push(description)

		for (let listener of listeners) {
			if (matchShortcutKeys(buffer, listener.shortcut_keys)) listener.callback(event)
		}
	}

	function enable() {
		document.addEventListener('keydown', keyDownListener)
	}

	function disable() {
		document.removeEventListener('keydown', keyDownListener)
	}

	function registerShortcut(shortcut:string, callback:ShortcutCallback) {
		listeners.push({ shortcut_keys: createShortcutKeys(shortcut), callback })
	}

	function unregisterShortcut(shortcut:string, callback:Function) {

	}

	let keyboard_service:KeyboardService = {
		registerShortcut,
		unregisterShortcut,
		enable,
		disable,
		install(app:App) {
			app.provide(keyboard_service_key, keyboard_service)
			enable()
		}
	}

	return keyboard_service
}