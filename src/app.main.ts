import { createColorSuiteApp } from './editor'
import { EDITOR_APP_MOUNT_ID } from './constants'
import './app.main.css'

const { app } = createColorSuiteApp()
app.mount(`#${ EDITOR_APP_MOUNT_ID }`)
