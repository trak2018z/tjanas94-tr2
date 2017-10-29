import * as os from "os"
import * as path from "path"
import * as webpack from "webpack"
import * as HtmlWebpackPlugin from "html-webpack-plugin"
import * as CopyWebpackPlugin from "copy-webpack-plugin"

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const threadLoader = require("thread-loader")
const autoprefixer = require("autoprefixer")()
const vendorManifest: string = require("../dist/assets/vendor-manifest.json")

threadLoader.warmup(
  {
    workers: os.cpus().length - 1,
  },
  ["babel-loader", "babel-preset-env", "babel-preset-stage-2", "ts-loader"]
)

const config: webpack.Configuration = {
  entry: ["react-hot-loader/patch", "./src/index.tsx"],
  output: {
    path: path.resolve("dist"),
    filename: "assets/app.[hash].js",
  },
  resolve: {
    modules: [path.resolve("src"), path.resolve("node_modules")],
    extensions: [".tsx", ".ts", ".jsx", ".js", ".scss"],
  },
  devtool: "cheap-module-source-map",
  devServer: {
    contentBase: path.resolve("dist"),
    compress: true,
    host: "0.0.0.0",
    port: 9000,
    historyApiFallback: true,
    hot: true,
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
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: "cache-loader" },
          {
            loader: "thread-loader",
            options: {
              workers: os.cpus().length - 1,
            },
          },
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "resolve-url-loader",
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              plugins: [autoprefixer],
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
        include: [
          path.resolve("src/styles"),
          path.resolve("node_modules/bulma"),
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: "[path][name]__[local]--[hash:base64:5]",
            },
          },
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              plugins: [autoprefixer],
            },
          },
        ],
        exclude: [
          path.resolve("src/styles"),
          path.resolve("node_modules/bulma"),
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "assets/[hash].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      inject: "body",
    }),
    new AddAssetHtmlWebpackPlugin([
      {
        filepath: "dist/assets/vendor.*.js",
        outputPath: "assets",
        publicPath: "assets",
      },
    ]),
    new CopyWebpackPlugin([{ from: "src/public" }]),
    new CleanWebpackPlugin(["dist/assets/app.*"], {
      root: path.resolve("."),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      context: path.resolve("."),
      manifest: vendorManifest,
    }),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"development"',
        ADMIN_EMAIL: JSON.stringify(process.env.FRONTEND_ADMIN_EMAIL),
        RECAPTCHA_SITE_KEY: JSON.stringify(process.env.RECAPTCHA_SITE_KEY),
      },
    }),
  ],
}

export default config
