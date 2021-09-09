import { Connect, ViteDevServer } from 'vite'
import { ColorSuiteConfig } from '../types'
import { ServerResponse } from 'http'
import { json } from 'body-parser'
import { join } from 'path'
import { promises as fs } from 'fs'
import { COLOR_CREATE_PATH, SETTINGS_UPDATE_PATH, COLOR_CONFIG_ID, SETTINGS_CONFIG_ID } from '../constants';
import { inspect } from 'util'

const bodyParser = json()
const parseBody = <T={[key:string]:any}>(req:Connect.IncomingMessage, res:ServerResponse):Promise<T> => new Promise((resolve, reject) => {
  try {
    bodyParser(req, res, resolve)
  } catch(e) {
    reject(e)
  }
}).then((e) => {
	if (e) throw e
	return (req as any).body
})

export function createColorSuiteServer(server:ViteDevServer, color_config:ColorSuiteConfig, color_config_path:string) {
	async function saveConfig(reload:boolean = false) {
		await fs.writeFile(color_config_path, `module.exports = ${ inspect(color_config) }`)

		let config_module = server.moduleGraph.getModuleById(COLOR_CONFIG_ID)
		if(config_module) server.moduleGraph.invalidateModule(config_module)

		let settings_module = server.moduleGraph.getModuleById(SETTINGS_CONFIG_ID)
		if(settings_module) server.moduleGraph.invalidateModule(settings_module)

		if (reload) {
			const time = new Date()
			await fs.utimes(join(process.cwd(), './tailwind.config.js'), time, time)
		}
	}

	//
	// Colors Endpoints

	// Create color

	// ---
	//

	//
	// Settings Endpoints

	// Update Settings

	// ---
	//
}