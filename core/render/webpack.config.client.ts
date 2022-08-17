import { Configuration } from "webpack";
import * as path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import webpack from "webpack";
const { ModuleFederationPlugin } = webpack.container;
import { ManifestPlugin } from './webpack/plugins/manifest-plugin';
// webpack configs
import * as WebpackRules from "./webpack/rules";
import * as WebpackResolves from "./webpack/resolves";

export default (): Configuration => {
  const config: Configuration = {
    target: "web",
    devtool: "source-map",
    mode: "production",
    entry: {
      index: path.resolve("./src/client/index.ts"),
      // shared modules?
    },
    output: {
      uniqueName: "host", // in package
      publicPath: "auto",
      chunkFilename: () => {
        // console.log(name);
        return "[name].[contenthash].js";
      },
      path: path.resolve("./dist/client"),
    },
    plugins: [
      new CleanWebpackPlugin(),
      new ManifestPlugin({
        statsOptions: {
          outputPath: false,
          cached: false,
          cachedAssets: false,
          chunks: false,
          chunkModules: false,
          chunkOrigins: false,
          modules: false,
          nestedModules: false,
          reasons: false,
          relatedAssets: false,
        },
        output: path.resolve("./dist/client/manifest.json"),
      }),
      new ModuleFederationPlugin({
        name: "host", // build name by package.json
        shared: {
          react: { singleton: true, requiredVersion: "18.2.0" }, // to external
          "react-dom": { singleton: true, requiredVersion: "18.2.0" }, // to external
          moment: { singleton: true },
        },
      }),
    ],
    resolve: WebpackResolves.common,
    module: {
      rules: [...WebpackRules.common],
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        name: "vendor",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              // console.log("packageName", module.context);
              return `/vendor/${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },
  };

  return config;
};
