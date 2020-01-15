# 处理请求

## 处理header

> 1. 需要支持在发送请求时配置header
> 2. 在没有配置header的情况下使用默认配置

在[header.ts](./../src/helper/header.ts)中通过 `normalizeHeaderName`以及 `processHeaders` 方法，对发起的请求进行请求头处理，通过 `parseHeaders` 方法，在请求发还给客户端时处理响应头部，从字符串处理为对象。

## 处理数据

- 在 [data.ts](./../src/helper/data.ts) 中，将请求中的对象类型数据转化为json，响应中的json字符串数据转化为对象
