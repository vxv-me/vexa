import { Writable } from "stream";
import React from "react";
import { renderToString } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";

class HtmlWritable extends Writable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private chunks: Array<any> = [];
  private html = "";
  getHtml() {
    return this.html;
  }
  _write(chunk, encoding, next) {
    this.chunks.push(chunk);
    next();
  }
  _final(callback) {
    this.html = Buffer.concat(this.chunks).toString();
    callback();
  }
}

export const renderComponentStream = (
  Component: React.ReactElement
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const htmlWritable = new HtmlWritable();
    const { pipe } = renderToPipeableStream(Component, {
      onAllReady() {
        pipe(htmlWritable);
      },
      onError(error) {
        reject(error);
      },
    });
    htmlWritable.on("finish", () => {
      resolve(htmlWritable.getHtml());
    });
  });
};

export const renderComponent = (Component: React.ReactElement): string => {
  return renderToString(Component);
};
