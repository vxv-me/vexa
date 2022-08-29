import React from "react";
import { loadScript } from "./loadAssets";

type Factory = () => Record<string, unknown>;

interface Container {
  init(shareScope: unknown): void;
  get(module: string): Factory;
}

export const loadModule = async (
  url: string,
  scope: string,
  module: string
): Promise<React.ElementType> => {
  try {
    await __webpack_init_sharing__("default");

    await loadScript(url);
    //
    console.log("window.widgets", scope, window.widget);
    const container = window.widget[scope] as Container;

    await container.init(__webpack_share_scopes__.default);

    console.log("container", container);
    const factory = await container.get(module);
    return factory().default as React.ElementType;
  } catch (error) {
    console.error("Error loading module:", error);
    throw error;
  }
};
