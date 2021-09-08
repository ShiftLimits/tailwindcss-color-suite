import { App } from 'vue'

export type ShortcutKey = {[key:string]:boolean}
export type ShortcutKeys = ShortcutKey[]
export type ShortcutCallback = (event:KeyboardEvent)=>any

export interface ShortcutListener {
	shortcut_keys:ShortcutKeys
	callback:ShortcutCallback
}

export interface KeyboardService {
	registerShortcut(shortcut:string, callback:ShortcutCallback):void
	unregisterShortcut(shortcut:string, callback:ShortcutCallback):void
	enable():void
	disable():void
	install(app:App):void
}