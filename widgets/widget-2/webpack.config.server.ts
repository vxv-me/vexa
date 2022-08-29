import { Configuration } from "webpack";
import * as path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import webpack from "webpack";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const { ModuleFederationPlugin } = webpack.container;
import { isPackage } from "./webpack/package";
// webpack configs

import { name, version } from './package.json';
const packageName = name.replace('@vexa/','');
const widgetName = `${packageName}@${version}`;

export default (): Configuration => {
  const config: Configuration = {
    entry: {
      index: path.resolve(__dirname, "./src/index.ts"),
    },
    target: "node",
    mode: "production",
    devtool: "source-map",
    output: {
      chunkLoadingGlobal: "webpack_widget_chunks",
      uniqueName: widgetName,
      publicPath: "auto",
      library: "commonjs",
      path: path.resolve(__dirname, "dist/server"),
      filename: "[name].[contenthash].js",
      chunkFilename: "chunks/widget.js",
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".css"],
      alias: {
        "~": path.resolve("src"),
      },
    },
    optimization: {
      runtimeChunk: false,
      // concatenateModules: true,
      // moduleIds: 'named',
      // realContentHash: true,
      // splitChunks: false,
      splitChunks: {
        cacheGroups: {
          default: false
        },
      },
      // splitChunks: {
      //   chunks: "all",
      //   filename: 'chunk',
      //   name: 'chunk'
      // },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            exclude: /node_modules/,
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
        {
          test: /\.css$/i,
          use: [
            // MiniCssExtractPlugin.loader,
            // "css-loader/locals"
            {
              loader: 'css-loader',
              options: {
                modules: {
                  exportOnlyLocals: true,
                  auto: true,
                  localIdentName: `${packageName}_[contenthash]`,
                },
              } 
            },
          ],
        },
      ],
    },
    externals: [
      // hack for monorepo
      function ({ context, request }, callback) {
        // check if local file import
        if (request && context === process.cwd()) {
          const symbol = request[0];
          if (symbol === "/" || symbol === ".") {
            return callback();
          }
        }
        if (isPackage(request, process.cwd())) {
          return callback(undefined, "commonjs " + request);
        }
        return callback();
      },
    ],
    plugins: [
      new CleanWebpackPlugin(),
      // new MiniCssExtractPlugin({
      //   filename: 'main.css',
      //   chunkFilename: 'css/[name].[contenthash:8].css',
      // }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new ModuleFederationPlugin({
        name: widgetName,
        library: { type: "commonjs-module" },
        filename: "widget.js",
        exposes: { widget: "./src/Widget" },
        shared: [
          {
            react: { singleton: true },
            "react-dom": { singleton: true },
            moment: { singleton: true },
          },
        ],
      }),
    ],
  };

  return config;
};
