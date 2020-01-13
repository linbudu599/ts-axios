// 类型保护
export function isDate(val: any): val is Date {
  return Object.prototype.toString.call(val) === '[object Date]';
}

export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object';
}

// 仅为普通json对象满足
export function isPlainObject(val: any): val is Object {
  return Object.prototype.toString.call(val) === '[object Object]';
}
