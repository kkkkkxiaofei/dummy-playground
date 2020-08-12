const run = () => {
  console.log('app is starting...');
  dynamicImport('./api').then(data => `response is ${data}`);
};

run();