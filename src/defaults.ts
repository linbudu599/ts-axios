import { AxiosRequestConfig } from './types';
import { processHeaders } from './helper/header';
import { transformRequest, transformResponse } from './helper/data';

const defaults: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,

  headers: {
    // common字段：在所有请求发送时都会添加的属性
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data);
      return transformRequest(data);
    }
  ],

  transformResponse: [
    function(data: any): any {
      return transformResponse(data);
    }
  ]
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
