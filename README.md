# ts-axios

Achieve Own Axios By TypeScript. 🦄

> 未完成！进度约 15%

## 目录结构

```text
| - docs ----- 各模块讲解

| - examples ----- demo及测试
  | - base ----- 基本demo
  | - error ----- 错误demo
  | - extend ----- 扩展demo
  | - server.js ----- 使用 express + webpack 启动服务

| - src ----- 项目主文件

  | - helper ----- 工具函数
    | - data.ts ----- 处理请求/响应数据
    | - error.ts ----- 处理过程中的错误
    | - header.ts ----- 处理请求/响应头部
    | - url.ts ----- 处理/拼接URL
    | - util.ts ----- 公用函数

  | - core ----- 核心方法
    | - Axios.ts ----- 定义 Axios 基类
    | - dispatchRequest.ts ----- 处理请求/响应
    | - xhr.ts ----- 处理xhr对象

  | - types ----- 类型文件

  | - axios.ts ----- 创建axios实例
  | - index.ts ----- 入口

```

## 各模块处理

- [处理 URL](./docs/buildURL.md)
- [处理请求头部及数据](./docs/request.md)
- [处理响应](./docs/response.md)
- [处理异常及错误信息增强](./docs/error.md)
- [接口扩展](./docs/extend.md)
