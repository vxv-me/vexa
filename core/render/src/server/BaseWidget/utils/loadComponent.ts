import React from "react";
import * as path from "path";

export const loadComponent = async (
  moduleDist: string
): Promise<React.ReactElement> => {
  const containerPath = path.resolve(moduleDist, "./server/widget.js");
  // TODO requier client manifest:

  await __webpack_init_sharing__("default");
  const container = __non_webpack_require__(containerPath);
  const module = await container.get("widget");
  return module().default as React.ReactElement;
};
