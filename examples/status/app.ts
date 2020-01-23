import axios, { AxiosError } from '../../src';

// 默认304不正常
axios
  .get('/more/status')
  .then(res => {
    console.log(res);
  })
  .catch((e: AxiosError) => {
    console.log(e.message);
  });

axios
  .get('/more/status', {
    validateStatus(status) {
      return status >= 200 && status < 400;
    }
  })
  .then(res => {
    console.log(res);
  })
  .catch((e: AxiosError) => {
    console.log(e.message);
  });
