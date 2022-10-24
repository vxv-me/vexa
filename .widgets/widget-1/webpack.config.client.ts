import { Configuration } from "webpack";
import * as path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import webpack from "webpack";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ManifestPlugin } from "./webpack/plugins/manifestPlugin";
const { ModuleFederationPlugin } = webpack.container;

import { name, version } from './package.json';
const packageName = name.replace('@vexa/','');
const widgetName = `${packageName}@${version}`;

export default (): Configuration => {
  const config: Configuration = {
    entry: './src/index',
    target: "web",
    mode: "production",
    devtool: "source-map",
    output: {
      chunkLoadingGlobal: `webpack_chunks_${widgetName}`, // todo name hash
      uniqueName: widgetName,
      publicPath: 'auto',
      path: path.resolve(__dirname, 'dist/client'),
      filename: `${widgetName}.js`,
      chunkFilename: 'chunks/[name].[contenthash].js',
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".css"],
      alias: {
        "~": path.resolve("src"),
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            // @ts-ignore
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              return `vendor/npm.${packageName.replace('@', '')}`
            },
          },
        },
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
                  auto: true,
                  localIdentName: `${packageName}_[contenthash]`,
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
          'widget': './src/Widget',
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
        filename: `${widgetName}.[contenthash].css`,
      }),
      new ManifestPlugin({
        statsOptions: {
          outputPath: false,
          cached: false,
          cachedAssets: false,
          chunks: true,
          chunkModules: false,
          chunkOrigins: false,
          modules: false,
          nestedModules: false,
          reasons: false,
          relatedAssets: false,
        },
        output: path.resolve("./dist/manifest.json"),
      }),
    ],
  };

  return config;
};
