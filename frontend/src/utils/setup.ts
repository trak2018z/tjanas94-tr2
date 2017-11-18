document
  .querySelectorAll('link[as="style"]')
  .forEach(link => link.setAttribute("rel", "stylesheet"))

window.onLoadRecaptcha = () => {
  window.recaptchaLoaded = true
  if (window.shouldRenderCaptcha) {
    window.shouldRenderCaptcha()
  }
}
