/* tslint:disable:no-console */
import * as express from "express"
import * as morgan from "morgan"
import * as httpProxy from "http-proxy"
import * as path from "path"
import * as webpack from "webpack"
import * as webpackHotMiddleware from "webpack-hot-middleware"
import webpackConfig from "./webpack.config.dev"
import config from "./config"

const compiler = webpack(webpackConfig)
const root = path.resolve(config.outputDev)
const apiProxy = httpProxy.createProxyServer()
const app = express()

app.use(morgan("dev"))

Object.entries(config.proxy).forEach(([url, target]) => {
  app.all(url + "*", (req, res) => apiProxy.web(req, res, { target }))
})

app.use(
  webpackHotMiddleware(compiler, {
    log: console.log,
    path: "/__webpack_hmr",
    heartbeat: 10 * 1000,
  })
)

app.use(express.static(root))

app.get("*", (_: express.Request, res: express.Response) =>
  res.sendfile(path.resolve("dist/dev/index.html"))
)

app.listen(config.serverPort, () => {
  console.log("Server started on port:", config.serverPort)
  console.log("Root directory", root)
  console.log("Press Ctrl+C to exit...\n")
})

compiler.watch(webpackConfig.watchOptions!, (_: any, stats: any) => {
  console.log(stats.toString(config.webpackStats))
})
