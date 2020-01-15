# 处理响应

> 处理服务端响应并使其支持 Promise 链式调用
> 为 res 对象添加响应数据 data、http 状态码 status、状态消息 statusText，响应头 headers、请求配置对象 config 以及请求的 XMLHttpRequest 对象实例 request
> 在 [xhr.ts](../src/core/xhr.ts)中经过一系列处理后拼装为

```JavaScript
const response: AxiosResponse = {
  data: responseData,
  status: request.status,
  statusText: request.statusText,
  headers: responseHeaders,
  config,
  request
      };
```

整体 `xhr` 函数返回一个 Promise 对象，使用 `resolve` 的方式返回成功数据
