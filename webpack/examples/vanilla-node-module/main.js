import request from './api.js';
import isEmpty from './util.js';

const googleSearchUrl = 'https://www.google.com/search?q=axios&oq=axios&aqs=chrome..69i57j0l7.1560j0j9&sourceid=chrome&ie=UTF-8';

request(
  isEmpty(window) ? process.env.URL : googleSearchUrl
).then(res => console.log(`=======${res}========`));