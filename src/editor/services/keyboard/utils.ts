import { ShortcutKeys, ShortcutKey } from './types'

export function debounce(fn:Function, time:number) {
	let timeout:number;
	return () => {
		clearTimeout(timeout)
		timeout = setTimeout(fn, time)
	}
}

export function normalizeKey(key:string) {
	if (key == ' ') return '[space]'
	if (key == '+') return '[plus]'
	return key;
}

export function createShortcutKeys(shortcut:string) {
	return shortcut.split(' ').map(part => part.split('+').reduce((obj, key) => ({ ...obj, [key]: true }), {}))
}

function isEqualShortcutKeys(a:ShortcutKey, b:ShortcutKey) {
	const a_keys = Object.keys(a)

	if (a_keys.length != Object.keys(b).length) return false
	return a_keys.every(key => (b as object).hasOwnProperty(key) && a[key] == b[key])
}

export function matchShortcutKeys(a:ShortcutKeys, shortcut_keys:ShortcutKeys) {
	if (a.length < shortcut_keys.length) return false

	const index_diff = a.length - shortcut_keys.length
	for (let i = shortcut_keys.length - 1; i >= 0; i--) {
		if (!isEqualShortcutKeys(a[index_diff + i], shortcut_keys[i])) return false
	}

	return true
}