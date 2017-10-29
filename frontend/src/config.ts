export default {
  apiUrl: "/api/",
  debug: process.env.NODE_ENV !== "production",
  adminEmail: process.env.ADMIN_EMAIL!,
  recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY!,
}
