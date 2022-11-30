import React from "react";

import { createRoot, hydrateRoot } from "react-dom/client";
import { loadModule } from "./utils/loadModule";

(async () => {
  const state = window.__text__ || "";

  const Element1 = await loadModule(
    "http://127.0.0.1:8080/widget-1/dist/client/widget.js",
    "widgte-1~1.0.0-dev",
    "widget"
  );

  const container = document.getElementById("root");
  if (!container) {
    return "";
  }

  if (container.hasChildNodes()) {
    console.log("hydrate");
    hydrateRoot(
      container,
      <div>
        <Element1 data={state} />
      </div>
    );
  } else {
    console.log("render");
    const root = createRoot(container);
    root.render(
      <div>
        <Element1 data={state} />
      </div>
    );
  }
})();
