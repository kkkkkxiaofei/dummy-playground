import log from './util';

log('app is starting...');

const btn = document.querySelector('#btn');

window.addEventListener('load', () => {
  btn.addEventListener('click', () => {
    dynamicImport('./api').then(res => console.log(`dynamic module response: ${JSON.stringify(res.default())}`));
  });  
});
