import fs from 'fs-extra';
import * as webpack from 'webpack';

// const isJS = file => /\.js(\?[^.]+)?$/.test(file);
// const isCSS = file => /\.css(\?[^.]+)?$/.test(file);

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
    compiler.hooks.afterEmit.tapAsync('avito-anifest-plugin', (compilation, next) => {
      const stats = compilation.getStats().toJson(this.statsOptions);
      const output = this.output;

      // TODO MAKE MANIFEST
      const manifest = stats;
      fs.writeJson(output, manifest, err => {
        next();
        if (err) return console.error(err)
      });
    });
  }
};


