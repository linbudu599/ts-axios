import { AxiosRequestConfig } from './types';

const defaults: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,

  headers: {
    // common字段：在所有请求发送时都会添加的属性
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
};

const methodsWithoutData = ['delete', 'get', 'head', 'options'];

methodsWithoutData.forEach(method => {
  defaults.headers[method] = {};
});

const methodsWithData = ['post', 'put', 'patch'];

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
});

export default defaults;
