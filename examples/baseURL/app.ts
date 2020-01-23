import axios from '../../src/axios';

const instance = axios.create({
  baseURL: 'http://localhost:8888'
});

instance.get('/api/baseURL');

instance.get('http://localhost:8888/api/baseURL');
