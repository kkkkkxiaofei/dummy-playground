#!/usr/bin/env node

const argv = require('yargs')
  .usage('Usage: pack [options]')
  .example('pack --configPath=path/pack-config.js', 'pack your project')
  .alias('h', 'help')
  .alias('v', 'version')
  .option('cp', { alias: 'configPath' })
  .argv;
const fs = require('fs');
const path = require('path');
const config = require(argv.configPath ? path.join(process.cwd(), argv.configPath) : `${process.cwd()}/pack-config.js`);
const pack = require('../src/index');

const absDist = `${process.cwd()}/dist`;

fs.promises.mkdir(absDist, { recursive: true })
  .then(() => 
    pack(config).forEach(({ prefix = '', content }) => {
      const path = `${absDist}/${prefix}${config.output.filename}`;
      fs.writeFileSync(path, content);
    })    
  );
