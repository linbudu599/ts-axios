// 发送请求逻辑
import { AxiosRequestConfig, AxiosPromiseRes, AxiosResponse } from '../types';
import { parseHeaders } from '../helper/header';
const xhr = (config: AxiosRequestConfig): AxiosPromiseRes => {
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config;

    const request = new XMLHttpRequest();

    // 设置请求头的中要求的响应类型
    if (responseType) {
      request.responseType = responseType;
    }

    request.open(method.toUpperCase(), url, true);

    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return;
      }

      // 获取原始响应头，如
      // date: Fri, 05 Apr 2019 12:40:49 GMT
      // etag: W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"
      // connection: keep-alive
      // x-powered-by: Express
      // content-length: 13
      // content-type: application/json; charset=utf-8
      const responseHeaders = parseHeaders(request.getAllResponseHeaders());
      // 获取响应数据
      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText;

      // 提取响应对象
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      resolve(response);
    };

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name];
      } else {
        request.setRequestHeader(name, headers[name]);
      }
    });

    request.send(data);
  });
};

export default xhr;
