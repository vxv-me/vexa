// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppRender } = require("./dist/server");

(async () => {
  const appRender = new AppRender();
  // const result = render();
  const result = await appRender.render();
  console.log({ result });
})();
