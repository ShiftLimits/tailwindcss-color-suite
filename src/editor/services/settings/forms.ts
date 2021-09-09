import { ColorSuiteSettings } from '../../../types'

export class UpdateSettingsForm implements Partial<ColorSuiteSettings> {
	open_button?:boolean
	float_panel?:boolean
	include_transparent?:boolean
	include_current?:boolean
}