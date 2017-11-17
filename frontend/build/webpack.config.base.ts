import * as os from "os"
import * as path from "path"
import * as webpack from "webpack"
import * as HtmlWebpackPlugin from "html-webpack-plugin"
import * as CopyWebpackPlugin from "copy-webpack-plugin"
import * as ExtractTextPlugin from "extract-text-webpack-plugin"
import config from "./config"

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const threadLoader = require("thread-loader")
const autoprefixer = require("autoprefixer")()

const ENV = process.env.npm_lifecycle_event!
const isWatch = ENV.includes(":watch")

const threadOptions: any = {
  workers: os.cpus().length - 1,
}
if (isWatch) {
  threadOptions.poolTimeout = Infinity
  threadLoader.warmup([
    "babel-loader",
    "babel-preset-env",
    "babel-preset-stage-2",
    "ts-loader",
  ])
}

export function getCssLoader(modules: boolean, prod: boolean) {
  const globalPaths = [
    path.resolve("src/styles"),
    path.resolve("node_modules/bulma"),
  ]

  let loader: webpack.Loader[] = [
    {
      loader: "css-loader",
      options: {
        sourceMap: true,
        minimize: prod,
        importLoaders: 1,
        modules,
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
  ]

  if (prod) {
    loader = ExtractTextPlugin.extract({
      fallback: "style-loader",
      use: loader,
    })
  } else {
    loader.unshift("style-loader")
  }

  const conf: webpack.Rule = {
    test: /\.scss$/,
    use: loader,
  }

  if (modules) {
    conf.exclude = globalPaths
  } else {
    conf.include = globalPaths
  }

  return conf
}

export default function getBaseConfiguration(prod: boolean) {
  const conf: webpack.Configuration = {
    resolve: {
      modules: [path.resolve("src"), path.resolve("node_modules")],
      extensions: [".tsx", ".ts", ".jsx", ".js", ".scss"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            { loader: "cache-loader" },
            {
              loader: "thread-loader",
              options: threadOptions,
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
        getCssLoader(false, prod),
        getCssLoader(true, prod),
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8192,
                name: config.assets + "/[chunkhash].[ext]",
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
      new CopyWebpackPlugin([{ from: "src/public" }]),
      new webpack.NoEmitOnErrorsPlugin(),
      new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
          ADMIN_EMAIL: JSON.stringify(process.env.FRONTEND_ADMIN_EMAIL),
          RECAPTCHA_SITE_KEY: JSON.stringify(process.env.RECAPTCHA_SITE_KEY),
        },
      }),
    ],
  }

  if (prod) {
    conf.plugins!.push(
      new ExtractTextPlugin({
        filename: config.assets + "/style.[chunkhash].css",
        allChunks: true,
      })
    )
  }

  return conf
}
