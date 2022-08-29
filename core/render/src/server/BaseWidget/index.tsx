import * as path from "path";

import { isUrl } from "../utils/urlExtra";
import { clearRequireCache } from "../utils/requireCache";

import { parseWidgetName } from "./utils/nameResolve";
import { downloadWidget } from "./utils/downloadWidget";
import { loadComponent } from "./utils/loadComponent";
import { loadWidgetMeta } from "./utils/loadWidgetMeta";

class BaseWidget {
  private widgetRegestry = {};

  private widgetPath = (widgetName: string): string => {
    return path.resolve(process.cwd(), "node_modules", ".widget", widgetName);
  };

  public loadWidget = async ({
    widgetName,
    widgetHost,
  }: {
    widgetName: string;
    widgetHost: string;
  }) => {
    const widgetMeta = parseWidgetName(widgetName);
    const isRemoteWidget = isUrl(widgetHost);

    const modulePath = isRemoteWidget
      ? this.widgetPath(widgetName)
      : widgetHost;

    const isDev = widgetMeta.isDev || !isRemoteWidget;

    // clear if dev widget
    if (isDev) {
      delete this.widgetRegestry[widgetName];
      clearRequireCache(modulePath);
    }

    if (this.widgetRegestry[widgetName]) {
      return this.widgetRegestry[widgetName];
    }

    if (isRemoteWidget) {
      await downloadWidget(widgetHost, modulePath);
    }

    const assets = await loadWidgetMeta(modulePath);
    const element = await loadComponent(modulePath);

    this.widgetRegestry[widgetName] = {
      element,
      assets,
    };

    return this.widgetRegestry[widgetName];
  };
}

export const baseWidget = new BaseWidget();

export default baseWidget;
