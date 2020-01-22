// 发送请求逻辑
import { AxiosRequestConfig, AxiosPromiseRes, AxiosResponse } from '../types';
import { parseHeaders } from '../helper/header';
import { createError } from '../helper/error';
import isURLSameOrigin from '../helper/isURLSameOrigin';
import { isFormData } from '../helper/util';
import cookies from '../helper/cookie';

export default function xhr(config: AxiosRequestConfig): AxiosPromiseRes {
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
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config;

    const request = new XMLHttpRequest();

    request.open(method.toUpperCase(), url!, true);

    configureRequest();

    addEvents();

    processHeaders();

    processCancel();

    request.send(data);

    // 配置request对象
    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType;
      }

      if (timeout) {
        request.timeout = timeout;
      }

      if (withCredentials) {
        request.withCredentials = withCredentials;
      }

      if (auth) {
        const username = auth.username || '';
        const password = auth.password || '';
        headers['Authorization'] = 'Basic ' + btoa(username + ':' + password);
      }
    }

    // 添加事件处理函数，响应也在这里处理
    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 0) {
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
        const responseData =
          responseType && responseType !== 'text' ? request.response : request.responseText;
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

      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request));
      };

      request.ontimeout = function handleTimeout() {
        reject(
          createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
        );
      };

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress;
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress;
      }
    }

    // 处理请求头
    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type'];
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookies.read(xsrfCookieName);
        if (xsrfValue) {
          headers[xsrfHeaderName!] = xsrfValue;
        }
      }

      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name];
        } else {
          request.setRequestHeader(name, headers[name]);
        }
      });
    }

    // 处理请求取消逻辑
    function processCancel(): void {
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
    }

    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request.status,
            response
          )
        );
      }
    }
  });
}
