declare module 'virtual:color-suite/colors' {
  const colors: {[key: string]: string | {[key: string]: string }}
  export default colors
}

declare module 'virtual:color-suite/config/colors' {
  const colors: {[key: string]: string | {[key: string]: string }}
  export default colors
}

declare module 'virtual:color-suite/config/settings' {
  const settings: {[key: string]: any}
  export default settings
}