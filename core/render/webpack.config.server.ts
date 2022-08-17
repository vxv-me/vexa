import { Configuration } from "webpack";
import * as path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { isPackage } from "./webpack/package";

// // webpack configs
// import * as WebpackRules from "./webpack/rules";
// import * as WebpackResolves from "./webpack/resolves";
// import * as WebpackModuleFederation from "./webpack/moduleFederation";

import webpack from "webpack";
const { ModuleFederationPlugin } = webpack.container;

export default (): Configuration => {
  const config: Configuration = {
    entry: {
      index: path.resolve("./src/server/index.tsx"),
    },
    devtool: "source-map",
    target: "node",
    output: {
      uniqueName: "host", // in package
      libraryTarget: "umd",
      path: path.resolve("./dist/server"),
      filename: "index.js",
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
      }
    ],
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".css"],
      alias: {
        "~": path.resolve("src"),
      },
    },
    optimization: {
      minimize: false,
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
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new ModuleFederationPlugin({
        name: "host",
        library: { type: "commonjs-module" },
        shared: {
          react: { singleton: true, requiredVersion: "18.2.0" }, // to external
          "react-dom": { singleton: true, requiredVersion: "18.2.0" }, // to external
          moment: { singleton: true },
        },
      }),
      // new ForkTsCheckerWebpackPlugin({
      //   async: true,
      // }),
    ],
  };

  return config;
};
