import { isPlainObject } from './util';

// 当请求中的数据为对象，将其转换为json
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}
