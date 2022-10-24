import * as path from "path";

export const common = {
  extensions: [".js", ".ts", ".tsx", ".css"],
  alias: {
    "~": path.resolve("src"),
  },
};
