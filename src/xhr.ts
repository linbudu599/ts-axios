// 发送请求逻辑
import { AxiosRequestConfig } from '../types';

const xhr = (config: AxiosRequestConfig): void => {
  const { url, method = 'GET', data = null, headers } = config;
  // 对xhr对象进行封装
  const request = new XMLHttpRequest();

  request.open(method.toUpperCase(), url, true);

  Object.keys(headers).forEach(name => {
    // 如果没有携带数据，则删去请求头属性，减小体积
    if (data === null && name.toLowerCase() === 'content-type') {
      delete headers[name];
    } else {
      request.setRequestHeader(name, headers[name]);
    }
  });

  request.send(data);
};

export default xhr;
