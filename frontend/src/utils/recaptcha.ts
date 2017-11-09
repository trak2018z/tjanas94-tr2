import config from "config"

export default function renderCaptcha(element: string | HTMLElement) {
  return new Promise<number>(resolve => {
    window.shouldRenderCaptcha = () => {
      delete window.shouldRenderCaptcha
      const id = grecaptcha.render(element, {
        sitekey: config.recaptchaSiteKey
      })
      resolve(id)
    }
    if (window.recaptchaLoaded) {
      window.shouldRenderCaptcha()
    }
  })
}
