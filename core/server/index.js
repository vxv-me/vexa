const express = require("express");
const { AppRender, async } = require("@vexa/core-render");
const appRender = new AppRender();

// (async () => {
//   const result = await appRender.render();
//   console.log(result);
// })();

const PORT = 3000;
const app = express();

app.use(express.static(appRender.getClinetAssetsPath()));

// todo create inline css
const renderCss = (css, host = "") => {
  const links = [];
  css.forEach((file) => {
    links.push(`<link rel="stylesheet" href="${host + file}" />`);
  });

  return links.join("");
};

const renderJs = (js, host = "") => {
  const scripts = [];
  js.forEach((file) => {
    scripts.push(
      `<script defer="defer" type="application/javascript" src="${
        host + file
      }"></script>`
    );
  });

  return scripts.join("");
};

app.get("*", async (request, response) => {
  const text = "example";
  const result = await appRender.render(text);

  const { appAssets, widgetsAssets } = result;

  response.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Vexa</title>

    ${renderJs(appAssets.js)}

    <!-- -->

    ${renderCss(appAssets.css)}
  </head>
  <script>
    window.__text__ = "${text}";
  </script>
  <body>
    <div id="root">${result.body}</div>
  </body>
  </html>`);
});

app.listen(PORT, () => {
  console.log(`Server running in http://127.0.0.1:${PORT}`);
});
