import React from "react";
import { hydrate } from "react-dom";
import { createRoot } from "react-dom/client";
import { App } from "../common/App";

(async () => {
  const text = window.__text__ || "";

  const container = document.getElementById("root");
  if (!container) {
    return "";
  }
  if (container.hasChildNodes()) {
    console.log("hydrate");
    hydrate(<App text={text} />, container);
  } else {
    console.log("render");
    const root = createRoot(container);
    root.render(<App text={text} />);
  }
})();
