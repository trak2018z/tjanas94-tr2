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
    app: "./src/index.tsx",
  },
  output: {
    path: path.resolve(config.outputDev),
    filename: config.assets + "/[name].[hash].js",
  },
  devtool: config.sourceMapDev as any,
  devServer: {
    contentBase: path.resolve(config.outputDev),
    compress: true,
    host: "0.0.0.0",
    port: 9000,
    historyApiFallback: true,
    hot: true,
    disableHostCheck: true,
    stats: {
      assets: false,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      version: false,
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    proxy: {
      "/api": "http://backend:8000",
      "/admin": "http://backend:8000",
      "/static": "http://backend:8000",
    },
  },
  plugins: [
    ...baseConf.plugins!,
    new CleanWebpackPlugin([`${config.outputDev}/${config.assets}/app.*`], {
      root: path.resolve("."),
    }),
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
