import app from './application.js';
import config from './config/index.js';

const { appName, version } = config;
app.start(appName, version);