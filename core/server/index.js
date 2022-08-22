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

app.get("*", async (request, response) => {
  const text = "example";
  const result = await appRender.render(text);

  response.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Vexa</title>
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
