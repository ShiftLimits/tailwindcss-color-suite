import { ColorSuiteConfig } from './types';
export const EDITOR_APP_MOUNT_ID = '__cs-app'

export const COLOR_SUITE_ID = '@tailwindcss-color-suite'
export const COLOR_SUITE_PATH = `/${COLOR_SUITE_ID}`

// Color config
export const COLOR_CONFIG_ID = `${COLOR_SUITE_ID}/colors/config`
export const COLOR_CONFIG_PATH = `/${COLOR_CONFIG_ID}`

// Settings config
export const SETTINGS_CONFIG_ID = `${COLOR_SUITE_ID}/settings/config`
export const SETTINGS_CONFIG_PATH = `/${SETTINGS_CONFIG_ID}`

// Server end points for mutations on config
export const COLOR_CREATE_PATH = `/${COLOR_SUITE_ID}/color/create`
export const COLOR_UPDATE_PATH = `/${COLOR_SUITE_ID}/color/update`
export const COLOR_UPDATE_ALL_PATH = `/${COLOR_SUITE_ID}/color/updateAll`
export const COLOR_DELETE_PATH = `/${COLOR_SUITE_ID}/color/delete`

export const SETTINGS_UPDATE_PATH = `/${COLOR_SUITE_ID}/settings/update`

// Default config file
export const DEFAULT_COLOR_CONFIG:ColorSuiteConfig = {
	colors: {},
	settings: {
		open_button: true,
		float_panel: false,
		include_current: true,
		include_transparent: true,
		include_inherit: true
	}
}