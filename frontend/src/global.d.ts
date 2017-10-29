interface Window {
  store: any
  recaptchaLoaded: boolean
  shouldRenderCaptcha?: () => void
  onLoadRecaptcha: () => void
}

declare module "*style"
