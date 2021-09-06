export const EDITOR_APP_MOUNT_ID = '__cs-app'

export const COLOR_SUITE_ID = '@tailwindcss-color-suite'
export const COLOR_SUITE_PATH = `/${COLOR_SUITE_ID}`

// Color config
export const COLOR_CONFIG_ID = `${COLOR_SUITE_ID}/color/config`
export const COLOR_CONFIG_PATH = `/${COLOR_CONFIG_ID}`

// Server end points for mutations on the color config
export const COLOR_CREATE_PATH = `/${COLOR_SUITE_ID}/color/create`
export const COLOR_UPDATE_PATH = `/${COLOR_SUITE_ID}/color/update`
export const COLOR_DELETE_PATH = `/${COLOR_SUITE_ID}/color/delete`

// Default config file
export const DEFAULT_COLOR_CONFIG = {
	colors: {},
	settings: {}
}