// 公用类型定义文件
/**
 * @interface AxiosRequestConfig
 * @url: 请求地址
 * @method: HTTP方法
 * @data: POST/PATCH等请求类型数据，置于request.body中
 * @params: GET/HEAD等类型数据，拼接到 url query string中
 */
export interface AxiosRequestConfig {
  url?: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: any;
  // 在请求中可指定响应类型
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
  [propName: string]: any;
}

export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request: any;
}
// @types/node
export interface AxiosError extends Error {
  config: AxiosRequestConfig;
  code?: string;
  request?: any;
  response?: AxiosResponse;
  isAxiosError: boolean;
}

// resolve()的参数与axios的返回值类型一致
export interface AxiosPromiseRes<T = any> extends Promise<AxiosResponse<T>> {}

// AxiosPromise<T> 即 Promise<AxiosResponse<T>>

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'Delete'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH';

// 扩展Axios接口
export interface Axios {
  defaults: AxiosRequestConfig;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  request<T = any>(config: AxiosRequestConfig): AxiosPromiseRes<T>;

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromiseRes<T>;

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromiseRes<T>;

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromiseRes<T>;

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromiseRes<T>;

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromiseRes<T>;

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromiseRes<T>;

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromiseRes<T>;
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromiseRes<T>;

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromiseRes<T>;
}

export interface AxiosInterceptorManager<T> {
  // 返回拦截器id
  use(resolved: ResolvedFun<T>, rejected?: RejectedFun): number;

  // 根据id取消拦截器
  eject(id: number): void;
}
// 对于resolve函数的参数，请求拦截器为AxiosRequestConfig类型，响应拦截器为AxiosResponse类型
// 对于reject函数的参数则均为any类型
export interface ResolvedFun<T = any> {
  // 支持同步与异步逻辑
  (val: T): T | Promise<T>;
}

export interface RejectedFun {
  (error: any): any;
}

export const defaultConfigKey: string[] = [
  'baseURL',
  'transformRequest',
  'transformResponse',
  'paramsSerializer',
  'timeout',
  'withCredentials',
  'adapter',
  'responseType',
  'xsrfCookieName',
  'xsrfHeaderName',
  'onUploadProgress',
  'onDownloadProgress',
  'maxContentLength',
  'validateStatus',
  'maxRedirects',
  'httpAgent',
  'httpsAgent',
  'cancelToken',
  'socketPath'
];

export const onlyCustomConfigKey: string[] = ['url', 'method', 'params', 'data'];

export const deepMergeConfigKey: string[] = ['headers', 'auth', 'proxy'];

export interface AxiosTransformer {
  (data: any, headers?: any): any;
}
