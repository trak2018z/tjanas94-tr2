import * as webpack from "webpack"
import * as path from "path"
import getBaseConfiguration from "./webpack.config.base"
import config from "./config"

const CleanWebpackPlugin = require("clean-webpack-plugin")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const SriPlugin = require("webpack-subresource-integrity")

process.env.NODE_ENV = "production"
const baseConf = getBaseConfiguration(true)
const prodConf: webpack.Configuration = {
  ...baseConf,
  entry: {
    app: ["react-hot-loader/patch", "./src/index.tsx"],
    vendor: config.libraries,
  },
  output: {
    path: path.resolve(config.outputProd),
    filename: config.assets + "/[name].[chunkhash].js",
    crossOriginLoading: "anonymous",
  },
  devtool: config.sourceMapProd as any,
  plugins: [
    ...baseConf.plugins!,
    new CleanWebpackPlugin(
      [`${config.outputProd}/${config.assets}/{app,runtime,vendor,style}.*`],
      {
        root: path.resolve("."),
      }
    ),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ["vendor", "runtime"],
      minChunks: Infinity,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new UglifyJSPlugin({
      cache: true,
      sourceMap: true,
      parallel: true,
    }),
    new SriPlugin({
      hashFuncNames: ["sha256", "sha384"],
      enabled: true,
    }),
  ],
}

export default prodConf
