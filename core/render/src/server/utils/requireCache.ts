export const clearRequireCache = (modulePath: string): void => {
  const cached = Object.keys(__non_webpack_require__.cache);
  for (let i = 0; i < cached.length; i++) {
    const element = cached[i];
    if (element.startsWith(modulePath)) {
      delete __non_webpack_require__.cache[element];
    }
  }
};
