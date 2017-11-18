import logger from "utils/logger"
import stores from "stores/index"

export default class ErrorHandler {
  public static formError(err: any, allowOffline = false) {
    this.handleError(err, allowOffline, (message: string) => {
      throw new Error(message)
    })
  }

  public static globalError(err: any, allowOffline = false) {
    this.handleError(err, allowOffline, stores.messageStore.showMessage)
  }

  private static handleError(
    err: any,
    allowOffline: boolean,
    handler: (message: string) => void
  ) {
    if (err.response && err.response.data.detail && err.response.status < 500) {
      return handler(err.response.data.detail)
    } else {
      logger.error(err)
      if (err.request && !err.response && !err.message.includes("timeout")) {
        if (allowOffline) {
          return
        }
        return handler("Akcja wymaga połączenia z internetem.")
      }
      return handler("Napotkano błąd. Spróbuj ponownie.")
    }
  }
}
