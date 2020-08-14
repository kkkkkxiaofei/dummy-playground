import log from './util';

const run = () => {
  log('app is starting...');
  dynamicImport('./api').then(res => console.log(`dynamic module response: ${res.default()}`));
};

run();