import axios from '../../src/axios';
import { Canceler } from '../../src/types';

const CancelToken = axios.CancelToken;
let cancel: Canceler;

// 服务端在接收到请求3秒后才会响应
axios
  .get('/cancel', {
    cancelToken: new CancelToken(c => {
      cancel = c;
    })
  })
  .catch(function(e) {
    console.log(e);
  });

setTimeout(() => {
  cancel('Operation canceled by the user');
}, 1000);

const source = CancelToken.source();

axios
  .get('/api/cancel', {
    cancelToken: source.token
  })
  .catch(function(e) {
    console.log(e);
  });

setTimeout(() => {
  source.cancel('Operation canceled by the user');
}, 1000);
