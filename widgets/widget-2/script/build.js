const path = require('path');
const { build } = require('@vexa/builder');
const { name, version } = require('../package.json');

const builder = build({
  widgetName: name,
  widgetVersion: version,
  context: process.cwd(),
  outputPath: path.resolve(process.cwd(), 'dist')
});
