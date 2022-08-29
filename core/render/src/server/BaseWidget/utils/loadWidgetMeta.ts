import * as path from "path";
import fs from "fs-extra";

export const loadWidgetMeta = (moduleDist: string) => {
  const containerPath = path.resolve(moduleDist, "./client/manifest.json");
  const manifest = fs.readJson(containerPath);
  return manifest;
};
