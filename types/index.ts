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
}
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
