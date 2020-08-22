const fs = require('fs');
const path = require('path');
const config = require('../config');
const pack = require('../src/index');

fs.writeFileSync(config.output, pack(config));
