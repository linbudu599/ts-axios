import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosPromiseRes,
  Method,
  ResolvedFun,
  RejectedFun
} from '../types';
import dispatchRequest from './dispatchRequest';
import InterceptorManager from './interceptorManager';

// 定义请求&响应拦截器管理类实例
interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>;
  response: InterceptorManager<AxiosResponse>;
}

interface PromiseChain {
  resolved: ResolvedFun | ((config: AxiosRequestConfig) => AxiosPromiseRes);
  rejected?: RejectedFun;
}

export default class Axios {
  interceptors: Interceptors;

  constructor() {
    this.interceptors = {
      // 根据传入的泛型不同这个管理类的表现也不同
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    };
  }

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
    if (typeof url === 'string') {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }

    const chain: PromiseChain[] = [
      {
        //  dispatchRequest(config: AxiosRequestConfig): AxiosPromiseRes<any>
        // 还真就严丝合缝
        resolved: dispatchRequest,
        rejected: undefined
      }
    ];

    // 注意这里添加的顺序不同
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor);
    });

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor);
    });

    // 定义一个已经resolve的promise
    let promise = Promise.resolve(config);

    // 循环这条链，
    while (chain.length) {
      // shift()方法用于删除并返回数组中的第一个值
      // non-null assertions-->!，断言每一项都不会是null/undefined
      const { resolved, rejected } = chain.shift()!;
      // 把这些拦截器的resolved和rejected添加到promise.then中
      promise = promise.then(resolved, rejected);
    }

    return promise;
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
