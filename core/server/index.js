const express = require("express");
const { AppRender } = require("@vexa/core-render");
const appRender = new AppRender();

const PORT = 3000;
const app = express();

app.use(express.static(appRender.getClinetAssetsPath()));

app.get("*", async (request, response) => {
  const text = "example";
  const result = await appRender.render(text);

  response.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>UI Kit Curious Byte</title>
    ${result.appAssets
      .map((asset) => {
        return `<script defer type="text/javascript" src="${asset}"></script>`;
      })
      .join("")}
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
