import * as path from "path"
import * as webpack from "webpack"
import getBaseConfiguration from "./webpack.config.base"
import config from "./config"

const CleanWebpackPlugin = require("clean-webpack-plugin")
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin")

process.env.NODE_ENV = "development"
const vendorManifest = require(path.resolve(
  `${config.outputDev}/${config.assets}/vendor-manifest.json`
))
const baseConf = getBaseConfiguration(false)
const devConf: webpack.Configuration = {
  ...baseConf,
  entry: {
    app: [
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
      "./src/index.tsx",
    ],
  },
  output: {
    path: path.resolve(config.outputDev),
    filename: config.assets + "/[name].[hash].js",
    hotUpdateChunkFilename: "hot/hot-update.js",
    hotUpdateMainFilename: "hot/hot-update.json",
  },
  devtool: config.sourceMapDev as any,
  plugins: [
    ...baseConf.plugins!,
    new CleanWebpackPlugin([`${config.outputDev}/${config.assets}/app.*`], {
      root: path.resolve("."),
    }),
    new webpack.WatchIgnorePlugin([path.resolve("dist")]),
    new AddAssetHtmlWebpackPlugin([
      {
        filepath: `${config.outputDev}/${config.assets}/vendor.*.js`,
        outputPath: config.assets,
        publicPath: config.assets,
      },
    ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      context: path.resolve("."),
      manifest: vendorManifest,
    }),
  ],
}

export default devConf
