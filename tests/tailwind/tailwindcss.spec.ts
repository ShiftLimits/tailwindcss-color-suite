import tailwindcss from 'tailwindcss'
import postcss from 'postcss'
import cssMatcher from 'jest-matcher-css'
import { Config as TailwindConfig } from 'tailwindcss'
import { tailwindColors } from '../../src'
import { ColorSuiteColors } from '../../src/types'

function configureColors(colors:ColorSuiteColors) {
	return {
		colors,
		settings: {
			open_button: false,
			float_panel: false,
			include_current: false,
			include_transparent: false,
			include_inherit: false
		}
	}
}

expect.extend({
	toMatchCss: cssMatcher
})

function generateUtilityCSS(config:Partial<TailwindConfig&{safelist:string[]}> = {}) {
	config = Object.assign({}, { safelist: [{ pattern: /.*/ }], theme: {}, corePlugins: [] }, config)

	return postcss(
		tailwindcss({
			...config as TailwindConfig,
		})
	).process('@tailwind utilities;', {
		from: undefined,
	}).then(result => {
		return result.css
	})
}

describe('Tailwind CSS color configuration', () => {
	describe('Default configuration', () => {
		it('should generate an object for all non-color CSS values', () => {
			const colors = tailwindColors()

			expect(colors).toMatchObject({
				transparent: 'transparent',
				current: 'currentColor',
				inherit: 'inherit'
			})
		})

		it('should generate background color utilities for all non-color CSS values when the object is given to Tailwind', () => {
			const output = `
				.bg-transparent {
					background-color: transparent;
				}
				.bg-current {
					background-color: currentColor;
				}
				.bg-inherit {
					background-color: inherit;
				}
			`

			return generateUtilityCSS({
				theme: {
					colors: tailwindColors(),
					opacity: {}
				},
				corePlugins: ['backgroundColor']
			}).then(result => {
				expect(result).toMatchCss(output)
			})
		})
	})

	describe('Color configuration', () => {
		const solid_colors = tailwindColors(configureColors({
			'red': { h: 0, s: 100, v: 100, a: 100 }
		}))

		describe('Solid color configuration', () => {
			it('should generate an object with a single solid red color function', () => {
				expect(solid_colors).toHaveProperty('red')
				expect(typeof solid_colors.red).toBe('function')
			})

			it('should generate a single background color utility that uses a CSS variable which defaults to the red color value in RGB format', () => {
				const output = `
					.bg-red {
						background-color: rgb(var(--color-red, 255, 0, 0))
					}
				`

				return generateUtilityCSS({
					theme: {
						colors: solid_colors,
						opacity: {}
					},
					corePlugins: ['backgroundColor']
				}).then(result => {
					expect(result).toMatchCss(output)
				})
			})
		})
	})
})