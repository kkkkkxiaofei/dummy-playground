import request from './api.js';
import isEmpty from './util.js';

const googleSearchUrl = 'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg';

if (!isEmpty(window)) {
  console.log('start fetching image...');
  request.get(googleSearchUrl).then(res => console.log(`=======${res}========`));
} else {
  console.error('can not execute in node env..');
}
