const { AppRender } = require("@vexa/core-render");
const appRender = new AppRender();

(async () => {
  const result = await appRender.render('test');
  console.log(result);
})();
