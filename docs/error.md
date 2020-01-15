# 错误对象增强

> 使用 `reject(new Error("Oops! Some Error Occured!"))` 的方式来支持使用 `.catch()` 方法捕获错误

## 错误信息增强

> 对外提供的信息不仅仅包含错误文本信息，还包括了请求对象配置 config，错误代码 code，XMLHttpRequest 对象实例 request以及自定义响应对象 response

```typescript
//error.ts

// 这里继承了内置对象Error
export class AxiosError extends Error {
  isAxiosError: boolean;
  config: AxiosRequestConfig;
  code?: string | null;
  request?: any;
  response?: AxiosResponse;

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message);

    this.config = config;
    this.code = code;
    this.request = request;
    this.response = response;
    this.isAxiosError = true;

    // 解决继承内置对象时可能存在的问题
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    //  等于__proto__方法
    Object.setPrototypeOf(this, AxiosError.prototype);
  }
}

// 暴露一个工厂方法用于创建错误
export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
): AxiosError {
  const error = new AxiosError(message, config, code, request, response);

  return error;
}

```

在 `xhr.ts` 中使用该方法来生成错误并返回给客户端
