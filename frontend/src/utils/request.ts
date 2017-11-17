import axios from "axios"
import config from "config"

const request = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFtoken",
})

export default request
