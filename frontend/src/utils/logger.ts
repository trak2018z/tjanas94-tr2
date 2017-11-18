import logger from "js-logger"

logger.useDefaults()
if (process.env.DEBUG) {
  logger.setLevel(logger.DEBUG)
} else {
  logger.setLevel(logger.ERROR)
}

export default logger
