import { isPlainObject, deepMerge } from './util';
import { Method } from '../types';

// 规范化header字段名称
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return;
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      // headers['Content-Type'] = 请求中自定义的请求头
      headers[normalizedName] = headers[name];
      delete headers[name];
    }
  });
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type');

  // 如果数据为对象且没有附带请求头，则自动配置
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8';
    }
  }
  return headers;
}

// getAllResHeader()方法返回以下字符串，之间以回车符和换行符\r\n结尾
// 最终需要被解析为对象
// date: Fri, 05 Apr 2019 12:40:49 GMT
// etag: W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"
// connection: keep-alive
// x-powered-by: Express
// content-length: 13
// content-type: application/json; charset=utf-8

// 处理请求的响应头，即在响应发还给客户端时进行一次处理
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null);
  if (!headers) {
    return parsed;
  }

  // 处理为对象
  headers.split('\r\n').forEach(line => {
    let [key, ...vals] = line.split(':');
    key = key.trim().toLowerCase();
    if (!key) {
      return;
    }
    let val = vals.join(':').trim();
    parsed[key] = val;
  });

  return parsed;
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers;
  }
  // 将headers从多层级对象变为普通对象
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers);

  // headers: {
  //   common: {
  //     Accept: 'application/json, text/plain, */*'
  //   },
  //   post: {
  //     'Content-Type':'application/x-www-form-urlencoded'
  //   }
  // }
  // headers: {
  //   Accept: 'application/json, text/plain, */*',
  //  'Content-Type':'application/x-www-form-urlencoded'
  // }
  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];

  methodsToDelete.forEach(method => {
    // 删除多余的属性
    delete headers[method];
  });

  return headers;
}
