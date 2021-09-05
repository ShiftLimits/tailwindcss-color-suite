# Color Suite for Tailwind CSS and Vite

An in-browser editor for real time color design of your [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) and [Vite](https://github.com/vitejs/vite) projects.

**Note:** This is under active development and may be subject to breaking changes until it reaches a stable version 1.0.0.

## What is this?

Color Suite is a color design utility that allows you to create a color palette and edit it in real time while working on your web project. It consists of a configurator for Tailwind CSS that uses Color Suite's color config file, `colors.config.js`, to configure Tailwind's `theme.colors` object; and a Vite plugin that injects a self-contained editor app in to the web page during development.

The editor allows you to build and tweak your project's palette in real time. Included are some useful tools to rapidly design your palette, including a 

## Installation

Install with your favorite NodeJS package manager:

```bash
$ npm install tailwindcss-color-suite

$ yarn add tailwindcss-color-suite
```

Add the Color Suite plugin to your Vite configuration:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { colorSuitePlugin } from 'tailwindcss-color-suite'

export default defineConfig({
  plugins: [
		...
		colorSuitePlugin()
	]
})

```

Finally, use the Color Suite configuration function in your Tailwind CSS config:

```js
// tailwind.config.js
const { configureColors } = require('tailwindcss-color-suite')

module.exports = {
	theme: {
		colors: configureColors(),
		...
	}
}
```

## Usage

Start Vite in development mode with `vite dev` and load your project in the browser. By default there will now be a "Colors" tab anchored to the right side of the window. Clicking this will open the editor for you to begin creating colors.

### Creating A Solid Color

Solid colors are a single token name with a single corresponding color value.

### Creating A Color Scale

Color scales are created with a curve editor that takes a base color value and create tints and shades from it. The output is a numeric scale with customizable ranges and interval sizes.

### Creating A Color Alias

Color aliases allow you to create arbitrary token names that map to existing color values.

*Example:* 

## Exporting Your Palette

If you would like to get rid of Color Suite but keep your palette, you can export the object for pasting in to your Tailwind config. You can use the export button found within the settings tab of the Color Suite panel, or you can use the following command in the same directory as your color config file:

```bash
npx tailwindcss-color-suite export [/destination/path]
```

This command will create a file named `tailwind.colors.config.js` containing the exported color object which you can then copy and paste as the value to the `theme.colors` key in your `tailwind.config.js` file.

## Contributing

Feedback is welcome, please use GitHub issues appropriately. If suggesting any major changes please make sure it is well reasoned and in line with the core principles of this project. Understand I am one busy person and require a description of the problem and a compelling argument for the proposed solution in order to consider it properly.

## License

Gridlines for Tailwind CSS is [MIT](LICENSE) licensed.