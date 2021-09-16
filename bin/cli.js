#!/usr/bin/env node

const { existsSync, writeFileSync } = require('fs')
const { join } = require('path')
const chalk = require('chalk')
const { configToTailwindColors } = require('../dist')
const { inspect } = require('util')

const PREFIX = '[Color Suite]'
function logInfo(...args) {
	console.log(...args.map(arg => chalk.blue(arg)))
}
function logSuccess(...args) {
	console.log(...args.map(arg => chalk.green(arg)))
}
function logError(...args) {
	console.error(...args.map(arg => chalk.red(arg)))
}
function logErrorAndExit(...args) {
	logError(...args)
	process.exit(1)
}

const config_file = 'colors.config.js'
const output_file = 'tailwindcss.colors.config.js'

let color_config_path = join(process.cwd(), config_file)
logInfo(`${PREFIX} Attempting to export the color config file at '${ color_config_path }'.`)

let color_config
try {
	color_config = require(color_config_path)
} catch(e) {	
	if (existsSync(color_config_path)) {
		logError(`${PREFIX} ${e.message}`)
		logErrorAndExit(`${PREFIX} ❌ A color config file exists at '${ color_config_path}' but it could not be required.`)
	} else {
		logErrorAndExit(`${PREFIX} ❌ The config file '${ color_config_path}' does not exist.`)
	}
}

if (!color_config || typeof color_config != "object") logErrorAndExit(`${PREFIX} ❌ The color config does not export an object.`)

try {
	let color_object = configToTailwindColors(color_config, true)
	writeFileSync(output_file, `module.exports = ${ inspect(color_object, false, Infinity) }`)
} catch(e) {
	logError(`${PREFIX} ${e.message}`)
	logErrorAndExit(`${PREFIX} ❌ Unable to write to output file ${ output_file }.`)
}

logSuccess(`${PREFIX} ✔ Exported ${config_file} to ${output_file} successfully.`)