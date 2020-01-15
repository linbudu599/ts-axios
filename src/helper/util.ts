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

// 作用：把from的属性都扩展到to中，包括原型上的属性
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any;
  }
  return to as T & U;
}
