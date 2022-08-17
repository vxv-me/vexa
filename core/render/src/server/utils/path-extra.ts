import * as path from "path";

export const resolvePackage = (name: string): string => {
  const packagePath = __non_webpack_require__.resolve(`${name}/package.json`);
  return path.parse(packagePath).dir;
}