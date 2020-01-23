import axios from '../../src/axios';

const instance = axios.create({
  baseURL: 'http://localhost:8888'
});

instance.get('/more/baseURL');

instance.get('http://localhost:8888/more/baseURL');
