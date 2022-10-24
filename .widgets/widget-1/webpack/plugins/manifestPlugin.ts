import fs from 'fs-extra';
import * as webpack from 'webpack';

// const isJS = file => /\.js(\?[^.]+)?$/.test(file);
const isCSS = (file:string): boolean => /\.css(\?[^.]+)?$/.test(file);

const getAssetsCss = (assets: Array<webpack.Asset>): Array<string> => {
  const result: Array<string> = [];
  assets.forEach((asset: webpack.Asset) => {
    if (isCSS(asset.name)) {
      result.push(asset.name);
    }
  });

  return result;
}

const getCssChunks = (stats: Record<string, webpack.StatsChunkGroup>): {
  initialCss: Array<string>;
  allCss: Array<string>;
} => {
  // const entrypoints = Object.keys(stats);

  const allCss: Array<string> = getAssetsCss(stats.assets as Array<webpack.Asset>);

  let initialCss: Array<string> = [];
  const entrypoints = Object.keys(stats.entrypoints);
  for (let i = 0; i < entrypoints.length; i++) {
    const entrypoint = stats.entrypoints[entrypoints[i]];
    const css = getAssetsCss(entrypoint.assets as Array<webpack.Asset>);
    initialCss = initialCss.concat(css)
  }

  return {
    initialCss: [...new Set(initialCss)],
    allCss: [...new Set(allCss)],
  }
}

export class ManifestPlugin {
  private statsOptions: webpack.StatsOptions;
  private output: string;

  constructor(opts: {
    statsOptions: webpack.StatsOptions,
    output: string
  }) {
    this.statsOptions = opts.statsOptions || {};
    this.output = opts.output;
  }

  // https://webpack.js.org/contribute/writing-a-plugin/#creating-a-plugin
  apply(compiler: webpack.Compiler) {
    compiler.hooks.afterEmit.tapAsync('manifest-plugin', (compilation, next) => {
      const stats = compilation.getStats().toJson(this.statsOptions);

      // Build simple manifest
      const manifest = {
        module: 'widget.js',
        css: getCssChunks(stats),
      }
      const output = this.output;
      fs.writeJson(output, manifest, err => {
        next();
        if (err) return console.error(err)
      });
    });
  }
};


