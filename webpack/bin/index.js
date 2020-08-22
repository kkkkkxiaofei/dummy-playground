const fs = require('fs');
const config = require(`${process.cwd()}/config`);
const pack = require('../src/index');

const absDist = `${process.cwd()}/dist`;

fs.promises.mkdir(absDist, { recursive: true })
  .then(() => fs.writeFileSync(`${absDist}/${config.output}`, pack(config)));
