import { isDate, isPlainObject } from './util';

function encode(val: string): string {
  // 保留特殊符号，从转义字符转回原先的特殊字符
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string) {
  if (!params) {
    return url;
  }

  const parts: string[] = [];

  Object.keys(params).forEach(key => {
    let val = params[key];
    // 处理null与undefined参数值
    if (val === null || typeof val === 'undefined') {
      return;
    }

    // 先将参数值全部处理到数组中
    let values: string[];
    if (Array.isArray(val)) {
      values = val;
      key += '[]';
    } else {
      values = [val];
    }

    // 再对数组中的每一项进行处理
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString();
        // 参数是对象的情况
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val);
      }
      parts.push(`${encode(key)}=${encode(val)}`);
    });
  });

  let serializedParams = parts.join('&');

  // 抹去“#”
  if (serializedParams) {
    const markIndex = url.indexOf('#');
    if (markIndex !== -1) {
      url = url.slice(0, markIndex);
    }

    // 如果url是第一次进行叠加，就加上?，多个参数用&进行连接
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}
