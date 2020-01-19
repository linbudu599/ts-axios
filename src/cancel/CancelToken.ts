import { Canceler, CancelExecutor, CancelTokenSource } from '../types';
import Cancel from './Cancel';

// 当cancelToken为true时执行的then方法的参数的接口
interface ResolvePromise {
  (reason?: Cancel): void;
}

export default class CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise;

    // 实例化一个pending的Promise，并用一个变量指向它
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve;
    });

    // 实例化这个类还会调用executor函数，它接收一个cancel函数作为参数
    // （如果外部调用了cancel函数）在cancel函数内部调用resolvePromise将这个Promise对象变为resolved
    executor(message => {
      if (this.reason) {
        return;
      }
      this.reason = new Cancel(message!);
      resolvePromise(this.reason);
    });
  }

  // 显式实例化
  static source(): CancelTokenSource {
    let cancel!: Canceler;
    let token = new CancelToken(c => {
      cancel = c;
    });
    return {
      cancel,
      token
    };
  }

  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason;
    }
  }
}
