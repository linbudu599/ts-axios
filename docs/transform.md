# 请求/响应数据配置化

在官方的axios中，默认配置对象里面还提供了transformRequest 和 transformResponse 这两个属性，它们的值可以是一个函数或者是一个由多个函数组成的数组。官方对这个属性介绍如下：

transformRequest:允许你在将请求数据发送到服务器之前对其进行修改，这只适用于请求方法 put、post 和 patch，如果值是数组，则数组中的最后一个函数必须返回一个字符串或 FormData、URLSearchParams、Blob 等类型作为 xhr.send 方法的参数，而且在 transform 过程中可以修改 headers 对象。

```javascript
// `transformRequest` allows changes to the request data before it is sent to the server
// This is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE'
// The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
// FormData or Stream
// You may modify the headers object.
transformRequest: [function (data, headers) {
    // Do whatever you want to transform the data

    return data;
}]
transformResponse:允许你在把响应数据传递给 then 或者 catch 之前对它们进行修改。

// `transformResponse` allows changes to the response data to be made before
// it is passed to then/catch
transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
}]
```

当值为数组的时候，数组的每一个函数都是一个转换函数，数组中的函数就像管道一样依次执行，前者的输出作为后者的输入。

## 实现

- 在 [defaults.ts](../src/defaults.ts)中，添加属性`transformRequest` 和 `transformResponse`，并且之前我们是在`dispatchRequest` 方法中处理请求头部&数据以及响应数据，
  
```javascript
  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data);
      return transformRequest(data);
    }
  ],

  transformResponse: [
    function(data: any): any {
      return transformResponse(data);
    }
  ]
```

- 这两个转换方法有一个共同点，即要么是转换函数，要么是一个转换函数组成的数组，因此为其顶底单独的接口类型

```javascript
export interface AxiosTransformer {
  (data: any, headers?: any): any;
}
```

- 在 [transform](../src/core/transform.ts)中实现转换函数

在该函数内部遍历执行所有的转换函数，并且把前一个转换函数的返回值作为参数传给后一个转换函数。在外层我们只需调用transform函数即可

```javascript
import { AxiosTransformer } from '../types';

// 接收三个参数，待转换的数据data、待转换的headers以及所有的转换函数
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
) {
  if (!fns) {
    return data;
  }
  if (!Array.isArray(fns)) {
    fns = [fns];
  }
  // 前一个输出会作为后一个输入
  fns.forEach(fn => {
    data = fn(data, headers);
  });
  return data;
}

```

- 在 `dispatchRequest` 函数和 `processConfig` 函数内调用默认配置里的 `transformRequest` 和 `transformResponse`：
  
```javascript
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config);
  config.data = transform(config.data, config.headers, config.transformRequest);
  config.headers = flattenHeaders(config.headers, config.method!);
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse);
  return res;
}
```
