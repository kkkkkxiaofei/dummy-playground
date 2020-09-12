import log from './util';

log('app is starting...');

const btn = document.querySelector('#btn');
const result = document.querySelector('#result');

window.addEventListener('load', () => {
  btn.addEventListener('click', () => {
    dynamicImport('./api').then(res => {
      const resStr = JSON.stringify(res.default());
      console.log(`dynamic module response: ${resStr}`);
      result.innerText = resStr;
    });
  });  
});
