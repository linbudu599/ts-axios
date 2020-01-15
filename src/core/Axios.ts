import { AxiosRequestConfig, AxiosPromiseRes, Method } from '../types';
import dispatchRequest from './dispatchRequest';

export default class Axios {
  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    );
  }

  _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    );
  }

  request(url: any, config?: any): AxiosPromiseRes {
    // 如果url不是字符串类型，说明传入的是单参
    if (typeof url === 'string') {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }
    return dispatchRequest(config);
  }

  // 不携带数据的请求
  get(url: string, config?: AxiosRequestConfig): AxiosPromiseRes {
    return this._requestMethodWithoutData('get', url, config);
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromiseRes {
    return this._requestMethodWithoutData('delete', url, config);
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromiseRes {
    return this._requestMethodWithoutData('head', url, config);
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromiseRes {
    return this._requestMethodWithoutData('options', url, config);
  }

  // 携带数据的请求
  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromiseRes {
    return this._requestMethodWithData('post', url, data, config);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromiseRes {
    return this._requestMethodWithData('put', url, data, config);
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromiseRes {
    return this._requestMethodWithData('patch', url, data, config);
  }
}
