import request from './api.js';

const googleSearchUrl = 'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg';
request.get(googleSearchUrl).then(res => console.log(`=======${res}========`));

// import isEmpty from 'lodash/isEmpty';

// console.log(isEmpty([]));
