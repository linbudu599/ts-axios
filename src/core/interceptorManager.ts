import { ResolvedFun, RejectedFun } from '../types';

interface Interceptor<T> {
  resolved: ResolvedFun<T>;
  rejected?: RejectedFun;
}

export default class InterceptorManager<T> {
  // 存储拦截器
  private interceptors: Array<Interceptor<T> | null>;

  constructor() {
    this.interceptors = [];
  }

  public use(resolved: ResolvedFun<T>, rejected?: RejectedFun): number {
    this.interceptors.push({
      resolved,
      rejected
    });
    return this.interceptors.length - 1;
  }

  // 遍历拦截器，支持传入一个函数，遍历时会将每一个拦截器作为该函数参数传入
  public forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor);
      }
    });
  }

  public eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }
}
