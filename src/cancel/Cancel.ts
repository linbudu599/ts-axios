// 实例化一个取消请求原因对象
export default class Cancel {
  message?: string;
  constructor(message?: string) {
    this.message = message;
  }
}
export function isCancel(value: any): boolean {
  return value instanceof Cancel;
}
