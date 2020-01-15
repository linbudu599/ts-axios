# ts-axios

Achieve Own Axios By TypeScript. 🦄

> 未完成！进度约10%

## 目录结构

```text
| - docs ----- 各模块讲解
| - examples ----- demo及测试
  | - base ----- 基本demo
  | - error ----- 错误demo
  | - server.js ----- 使用 express + webpack 启动服务
| - helper ----- 工具函数
  | - data.ts ----- 处理请求/响应数据
  | - error.ts ----- 处理过程中的错误
  | - header.ts ----- 处理请求/响应头部
  | - url.ts ----- 处理/拼接URL
  | - util.ts ----- 公用函数
| - src ----- 项目主文件
  | - axios.ts ----- 调用处理方法来发送请求&处理响应
  | - index.ts ----- 入口
  | - xhr.ts ----- 封装原生XHR对象，处理请求与响应
| - types ----- 类型文件
```

## 各模块处理

- [处理URL](./docs/buildURL.md)
- [处理请求头部及数据](./docs/request.md)
- [处理响应](./docs/response.md)
- [处理异常及错误信息增强](./docs/error.md)
