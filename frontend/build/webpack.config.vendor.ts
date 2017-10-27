import * as path from "path"
import * as webpack from "webpack"
const CleanWebpackPlugin = require("clean-webpack-plugin")

const config: webpack.Configuration = {
  devtool: "cheap-module-source-map",
  entry: [
    "react",
    "react-dom",
    "react-router",
    "redbox-react",
    "mobx",
    "mobx-react",
    "mobx-react-devtools",
    "classnames",
    "axios",
    "js-logger",
  ],
  output: {
    path: path.resolve("dist"),
    filename: "assets/vendor.[hash].js",
    library: "vendor_lib",
  },
  plugins: [
    new CleanWebpackPlugin(["dist/assets/vendor.*"], {
      root: path.resolve("."),
    }),
    new webpack.DllPlugin({
      context: path.resolve("."),
      path: "dist/assets/vendor-manifest.json",
      name: "vendor_lib",
    }),
  ],
}

export default config
