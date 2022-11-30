import React from "react";
import fs from "fs-extra";
import * as webpack from "webpack";

import * as path from "path";
import { resolvePackage } from "./utils/pathExtra";
import packageJson from "../../package.json";

import { renderComponentStream } from "./components/componentRender";
import { baseWidget } from "./BaseWidget";

export class AppRender {
  private manifest: unknown | null = null;
  private clinetAssetsPath = path.resolve(
    resolvePackage(packageJson.name),
    "./dist/client"
  );

  private clientManifest = async () => {
    const manifestPath = path.resolve(this.clinetAssetsPath, "./manifest.json");
    this.manifest = await fs.readJson(manifestPath);
  };

  private getAppAssets = async (): Promise<unknown> => {
    if (!this.manifest) {
      await this.clientManifest();
    }

    // add externals
    const manifest = this.manifest as webpack.StatsCompilation;
    const js = manifest.assets?.map((asset) => {
        return asset.name;
      }) || [];

    return {
      js,
      css: [],
    };
  };

  public getClinetAssetsPath = (): string => {
    return this.clinetAssetsPath;
  };

  public render = async (state: unknown) => {
    const appAssets = await this.getAppAssets();
    const widgets = await Promise.all([
      baseWidget.loadWidget({
        widgetName: "widget-1~1.0.0-dev",
        widgetHost: "http://127.0.0.1:8080/widget-1/dist.tgz",
      }),
    ]);

    const Element1 = widgets[0].element;

    let widgetsJS = [];
    let widgetsCSS = [];

    widgets.forEach((widget) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      widgetsJS = widgetsJS.concat(widget.assets.module);
      widgetsCSS = widgetsCSS.concat(widget.assets.css.allCss);
    });

    const responseStream = await renderComponentStream(
      <div>
        <Element1 data={state} />
      </div>
    );

    return {
      appAssets,
      widgetsAssets: {
        js: widgetsJS,
        css: widgetsCSS,
      },
      body: responseStream,
    };
  };
}
