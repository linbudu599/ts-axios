import { isDate, isObject, isPlainObject } from './util';

function encode(val: string): string {
  // 保留特殊符号，从转义字符转回原先
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

export function buildURL(url: string, params?: any) {
  if (!params) {
    return url;
  }

  const parts: string[] = [];

  Object.keys(params).forEach(key => {
    let val = params[key];
    // 处理为空的参数值
    if (val === null || typeof val === 'undefined') {
      return;
    }

    // 将参数值全部处理到数组中
    let values: string[];
    if (Array.isArray(val)) {
      values = val;
      key += '[]';
    } else {
      values = [val];
    }

    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString();
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

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}
