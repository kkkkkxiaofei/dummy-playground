import request from './api.js';
import isEmpty from './util.js';

const imageUrl = 'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg';

if (!isEmpty(window)) {
  console.log('start fetching image...');
  request.get(imageUrl)
    .then(res => console.log('%c ', `font-size:600px;background:url(${imageUrl}) no-repeat;`))
    .finally(() => console.log('fetching end.'))
} else {
  console.error('can not execute in node env..');
}