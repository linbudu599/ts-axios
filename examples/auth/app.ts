import axios from '../../src/axios';

axios
  .get('/auth', {
    auth: {
      username: 'Yee',
      password: '123456'
    }
  })
  .then(res => {
    console.log(res);
  });
