import logger from "js-logger"
import config from "config"

logger.useDefaults()
if (config.debug) {
  logger.setLevel(logger.DEBUG)
} else {
  logger.setLevel(logger.ERROR)
}

export default logger
