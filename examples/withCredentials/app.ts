import axios from '../../src/axios';

// 开启了该选项后才能携带cookie并接收到服务端返回的cookie
axios.post('http://192.168.1.2:3000/withCredentials', {}).then(res => {
  console.log(res);
});

axios
  .post(
    'http://192.168.1.2:3000/withCredentials',
    {},
    {
      withCredentials: true
    }
  )
  .then(res => {
    console.log(res);
  });
