import axios from '../../src/axios';

// const instance = axios.create({
//   xsrfCookieName: 'XSRF-TOKEN-D',
//   xsrfHeaderName: 'X-XSRF-TOKEN-D'
// });

// instance.get('/more/get').then(res => {
//   console.log(res);
// });

axios
  .get('/defendXSRF', {
    xsrfCookieName: 'XSRF-BUDU',
    xsrfHeaderName: 'X-XSRF-BUDU',
    withCredentials: true
  })
  .then(res => {
    console.log(res);
  });
