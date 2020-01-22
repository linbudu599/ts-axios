import axios from '../../src/axios';

axios
  .get('/auth', {
    auth: {
      username: 'USER',
      password: 'PWD'
    }
  })
  .then(res => {
    console.log(res);
  });
