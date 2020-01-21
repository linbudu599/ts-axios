// 类型保护
export function isDate(val: any): val is Date {
  return Object.prototype.toString.call(val) === '[object Date]';
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

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null);

  for (let i = 0; i < objs.length; i++) {
    const obj = objs[i];
    for (let key in obj) {
      assignValue(obj[key], key);
    }
  }

  // 将每个对象的每个属性都拷贝到result上
  function assignValue(val: any, key: string) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = deepMerge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

export function isFormData(val: any): boolean {
  return typeof val !== 'undefined' && val instanceof FormData;
}
