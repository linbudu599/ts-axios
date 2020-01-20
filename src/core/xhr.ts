// 发送请求逻辑
import { AxiosRequestConfig, AxiosPromiseRes, AxiosResponse } from '../types';
import { parseHeaders } from '../helper/header';
import { createError } from '../helper/error';
import isURLSameOrigin from '../helper/isURLSameOrigin';
import cookies from '../helper/cookie';

const xhr = (config: AxiosRequestConfig): AxiosPromiseRes => {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName
    } = config;

    const request = new XMLHttpRequest();

    if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
      const xsrfValue = cookies.read(xsrfCookieName);
      if (xsrfValue) {
        headers[xsrfHeaderName!] = xsrfValue;
      }
    }

    if (withCredentials) {
      request.withCredentials = true;
    }

    // 设置请求头的中要求的响应类型
    if (responseType) {
      request.responseType = responseType;
    }

    request.open(method.toUpperCase(), url as string, true);

    // 网络异常
    request.onerror = () => {
      // reject(new Error('Network Error'));
      reject(createError('Network Error', config, null, request));
    };
    if (timeout) {
      request.timeout = timeout;
    }

    request.ontimeout = () => {
      // reject(new Error(`Timeout of ${timeout} ms exceeded`));
      reject(
        createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
      );
    };

    request.onreadystatechange = () => {
      // 0~4
      if (request.readyState !== 4) {
        return;
      }

      // 网络错误或超时时状态均为0
      if (request.status === 0) {
        return;
      }
      const handleResponse = (response: AxiosResponse) => {
        if (response.status >= 200 && response.status < 300) {
          resolve(response);
        } else {
          // reject(new Error(`Request failed with status code ${response.status}`));
          reject(
            createError(
              `Request failed with status code ${response.status}`,
              config,
              null,
              request,
              response
            )
          );
        }
      };
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

      // 拼装响应对象
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      handleResponse(response);
    };

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name];
      } else {
        request.setRequestHeader(name, headers[name]);
      }
    });

    request.send(data);

    // 首先判断用户是否配置的cancelToken，如果没有配置，表示没有取消请求这项需求；
    // 如果配置了cancelToken，并且当外部调用了请求取消触发函数，
    // 此时cancelToken.promise会变成resolved 状态，
    // 然后就会执行then函数，在then函数内部调用
    // XMLHttpRequest对象上的abort()方法取消请求。
    if (cancelToken) {
      // tslint:disable-next-line: no-floating-promises
      cancelToken.promise.then(reason => {
        request.abort();
        // reject：
        // 使用时，后续可以使用catch再次进行判断
        // .catch(function (e) {
        //   if (axios.isCancel(e)) {
        //     console.log('Request canceled', e.message);
        //   } else {
        //     // handle error
        //   }
        // }
        reject(reason);
      });
    }
  });
};

export default xhr;
