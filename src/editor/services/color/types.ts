import { App } from "vue";
import { ColorSuiteColors } from '../../../types'
import { CreateColorForm, UpdateColorForm } from './forms'

export interface ColorService {
	colors:ColorSuiteColors,
	createColor(data:CreateColorForm):Promise<any>
	updateColor(token:string, data:UpdateColorForm):Promise<any>
	deleteColor(token:string):Promise<any>
	install(app:App):void
}