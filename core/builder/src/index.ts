import webpack from 'webpack';
import * as path from "path";

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const { ModuleFederationPlugin } = webpack.container;

interface Options {
  widgetName: string;
  widgetVersion: string;

  context: string; // widget source path
  outputPath: string;
  alias?: Record<string, string>;
}

export const build = (options: Options) => {
  const {
    widgetName,
    widgetVersion,
    context,
    outputPath,
    alias
  } = options;

  const moduleName = `${widgetName}~${widgetVersion}`;
  const entry = "./src/index.tsx"

  const client = webpack({
    entry: path.resolve(context, entry),
    target: "web",
    mode: "production",
    devtool: "hidden-source-map",
    context: context,
    output: {
      chunkLoadingGlobal: `webpack_chunks[${widgetName}]`, // todo name hash
      uniqueName: moduleName,
      publicPath: 'auto',
      path: path.resolve(outputPath, 'client'),
      filename: `${moduleName}.js`,
      chunkFilename: 'chunks/[name].[contenthash].js',
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".css"],
      alias: {
        "~": path.resolve("src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
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
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  // modules: true,
                  auto: true,
                  localIdentName: `${moduleName}-[contenthash]`,
                },
              } 
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new ModuleFederationPlugin({
        name: widgetName,
        library: {type: 'window', name: ['widget', widgetName,]},
        filename: 'widget.js',
        exposes: {
          'widget': entry,
        },
        shared: [
          {
            react: { singleton: true }, // to external
            'react-dom': { singleton: true }, // to external
            moment: { singleton: true },
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: `${widgetName}.[contenthash].css`, // css
      }),
    ],
  })

  client.run((err, stats) => {
    console.log('----');
    console.log('outputPath', path.resolve(outputPath, 'client'));
    console.log('err', err);
    console.log('stats', stats?.toString());
  });
}