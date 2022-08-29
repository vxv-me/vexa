/* eslint-disable no-var */
export {};
declare global {
  interface Window {
    __text__: string;
  }
}

declare module "*.css" {
  const mapping: Record<string, string>;
  export default mapping;
}

declare global {
  interface Window {
    widget: Record<string, unknown>;
  }
}
