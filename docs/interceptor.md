# 拦截器实现（重点）

## 使用方式

```JavaScript
// app.ts
// 添加一个请求拦截器
axios.interceptors.request.use((config)=>{
  // 在发送请求之前可以做一些事情
  return config;
}, (error)=>{
  // 处理请求错误
  return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use((response)=>{
  // 处理响应数据
  return response;
}, (error)=>{
  // 处理响应错误
  return Promise.reject(error);
});
```

即，请求拦截器需要支持传本次请求配置并处理请求错误，响应拦截器需要支持处理本次响应数据

## 实现

- 定义**拦截器管理类型**

  ```typescript
  // type/index.ts
  export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
  }

  export interface ResolvedFn<T=any> {
    // 可能处理同步或异步逻辑
    (val: T): T | Promise<T>
  }
  export interface RejectedFn {
    (error: any): any
  }
  ```

- 定义**拦截器管理基类**
  [具体实现](./../src/core/interceptorManager.ts)

  ```typescript
  import { ResolvedFun, RejectedFun } from '../types';
  
  // 每一个拦截器实际上都是一个拥有这两个属性的对象
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

    // 当调用use方法，会将拦截器push进存储数组
    public use(resolved: ResolvedFun<T>, rejected?: RejectedFun): number {}

    // 遍历拦截器，支持传入一个函数，遍历时会将每一个拦截器作为该函数参数传入
    public forEach(fn: (interceptor: Interceptor<T>) => void): void {}

    // 注销拦截器
    public eject(id: number): void {}
  }
  ```

- 定义链式调用
  [具体代码](../src/core/Axios.ts)

  ```typescript
  interface Interceptors {
  // 根据传入的泛型不同这个管理类的表现也不同
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
  }

  interface PromiseChain {
    resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn
  }

  export default class Axios {
    interceptors: Interceptors
    // 实例化Axios类时会初始化这个实例属性
    constructor() {
      this.interceptors = {
        request: new InterceptorManager<AxiosRequestConfig>(),
        response: new InterceptorManager<AxiosResponse>()
      }
    }
    // 为请求函数添加链式调用逻辑
    request(url: any, config?: any): AxiosPromise {

      const chain: PromiseChain[] = [{
        resolved: dispatchRequest,
        rejected: undefined
      }]

      // 发起请求时会将所有拦截器进行遍历并执行该方法
      // 注意两种拦截器顺序
      this.interceptors.request.forEach(interceptor => {
        chain.unshift(interceptor)
      })

      this.interceptors.response.forEach(interceptor => {
        chain.push(interceptor)
      })

      let promise = Promise.resolve(config)

      while (chain.length) {
        // 使用断言
        const { resolved, rejected } = chain.shift()!
        // 实现链式调用
        promise = promise.then(resolved, rejected)
      }

      return promise
    }
  }
  ```
