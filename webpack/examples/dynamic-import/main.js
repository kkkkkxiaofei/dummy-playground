import log from './util';

const run = () => {
  log('app is starting...');
  dynamicImport('./api').then(data => `response is ${data}`);
};

run();