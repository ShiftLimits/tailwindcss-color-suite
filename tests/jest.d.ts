declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchCss(css:string):R
    }
  }
}

export {}