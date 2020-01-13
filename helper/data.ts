import { isPlainObject } from './util';

// 当请求中的数据为对象，将其转换为json
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}
// 将字符串数据转为对象类型
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (err) {
      throw new Error(err);
    }
  }
  return data;
}
