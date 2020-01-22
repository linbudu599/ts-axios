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

  validateStatus(status: number): boolean {
    return status >= 200 && status < 300;
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
  ],
  // 与axios官方保持一致
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN'
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
