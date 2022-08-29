import * as path from "path";
import { isUrl } from "./urlExtra";

export const resolvePackage = (name: string): string => {
  const packagePath = __non_webpack_require__.resolve(`${name}/package.json`);
  return path.parse(packagePath).dir;
};

export const isAbsolutePath = (name: string): boolean => {
  if (isUrl(name)) {
    return false;
  }
  return path.isAbsolute(name);
};
