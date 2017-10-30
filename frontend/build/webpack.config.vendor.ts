import * as path from "path"
import * as webpack from "webpack"
import config from "./config"

const CleanWebpackPlugin = require("clean-webpack-plugin")

const vendorConf: webpack.Configuration = {
  devtool: config.sourceMapDev as any,
  entry: config.libraries,
  output: {
    path: path.resolve(config.outputDev),
    filename: config.assets + "/vendor.[chunkhash].js",
    library: "vendor_lib",
  },
  plugins: [
    new CleanWebpackPlugin([`${config.outputDev}/${config.assets}/vendor[.-]*`], {
      root: path.resolve("."),
    }),
    new webpack.DllPlugin({
      context: path.resolve("."),
      path: `${config.outputDev}/${config.assets}/vendor-manifest.json`,
      name: "vendor_lib",
    }),
  ],
}

export default vendorConf
