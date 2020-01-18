import axios from '../../src/axios';
import qs from 'qs';

axios.defaults.headers.common['budu'] = 'common budu';
axios.defaults.headers.post['budu'] = 'post property';
axios.defaults.headers.get['budu'] = 'get property';

axios({
  url: '/api/mergeConfig',
  method: 'post',
  data: qs.stringify({
    a: 1
  }),
  headers: {
    test: '321'
  }
})
  .then(res => {
    console.log(res.data);
  })
  .catch(err => console.log(err));
