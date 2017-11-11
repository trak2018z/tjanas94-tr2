window.onLoadRecaptcha = function () {
  window.recaptchaLoaded = true
  if (window.shouldRenderCaptcha) {
    window.shouldRenderCaptcha()
  }
}
