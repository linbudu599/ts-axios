// 公用类型定义文件
/**
 * @interface AxiosRequestConfig
 * @url: 请求地址
 * @method: HTTP方法
 * @data: POST/PATCH等请求类型数据，置于request.body中
 * @params: GET/HEAD等类型数据，拼接到 url query string中
 */
export interface AxiosRequestConfig {
  url: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: any;
  // 在请求中可指定响应类型
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
}

export interface AxiosResponse {
  data: any;
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
export interface AxiosPromiseRes extends Promise<AxiosResponse> {}

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
