import React from "react";
import { renderToString } from "react-dom/server";
import fs from "fs-extra";
import * as webpack from "webpack";

import * as path from "path";
import { resolvePackage } from "./utils/path-extra";
import packageJson from "../../package.json";

import { App } from "../common/App";

export class AppRender {
  private manifest: unknown | null = null;
  private clinetAssetsPath = path.resolve(
    resolvePackage(packageJson.name),
    "./dist/client"
  );

  // constructor() {}

  private clientManifest = async () => {
    const manifestPath = path.resolve(this.clinetAssetsPath, "./manifest.json");
    this.manifest = await fs.readJson(manifestPath);
  };

  private getAppAssets = async (): Promise<Array<string>> => {
    if (!this.manifest) {
      await this.clientManifest();
    }

    // add externals

    const manifest = this.manifest as webpack.StatsCompilation;
    return (
      manifest.assets?.map((asset) => {
        return asset.name;
      }) || []
    );
  };

  public getClinetAssetsPath = (): string => {
    return this.clinetAssetsPath;
  };

  public render = async (text = "") => {
    const appAssets = await this.getAppAssets();

    return {
      appAssets,
      body: renderToString(<App text={text} />),
    };
  };
}
