# 默认配置及合并配置

## 使用

```javascript
axios.defaults.headers.common['budu'] = 'common budu';
axios.defaults.headers.post['budu'] = 'post property';
axios.defaults.headers.get['budu'] = 'get property';
```

可以把相同的配置字段写入 `axios.defaults` ，并在没有提供时使用默认配置，其中 `common` 表示为所有请求的 `headers` 添加这一字段。

## 默认实现

- 新增[defaults.ts](../src/defaults.ts)，在其中实现符合 `AxiosRequestConfig` 接口的 `defaults` 对象，并为附带数据的请求类型添加默认的请求头 `'Content-Type': 'application/x-www-form-urlencoded'`。

- 在使用时，我们可以通过 `axios.defaults` 的方式来使用，因此需要在[Axios.ts](../src/core/Axios.ts)中为 `Axios` 类添加这个属性，并添加到构造函数中，使用构造函数的唯一参数进行初始化默认配置

- 在[axios.ts](../src/axios.ts)中实例化axios时，传入配置对象即可。

## 合并用户配置

- 对于不同属性，需要执行不同的合并方法，如 timeout、responseType 属性，用户配置了则使用用户的，否则就上默认配置。对于 url、method、params、data属性，不管默认配置而只采用用户默认配置。对于 header、auth 属性，需要将用户配置和默认配置做深度合并，如在headers中，字段不相同的要拷贝合并在一起，字段相同的，内容不同也要拷贝合并在一起

- 在 [mergeConfig.ts](../src/core/mergeConfig.ts)中，进行各配置项的合并，在[util.ts](../src/helper/util.ts)中实现了 `deepMerge` 方法

- 注意，在[Axios.ts](../src/core/Axios.ts)中发送请求前就要做一次合并

- 扁平化headers

仍然通过 deepMerge 方法

```javascript
headers: {
  common: {
    Accept: 'application/json, text/plain, */*'
  },
  post: {
    'Content-Type':'application/x-www-form-urlencoded'
  }
}
// 真正附带的
headers: {
  Accept: 'application/json, text/plain, */*',
 'Content-Type':'application/x-www-form-urlencoded'
}
```

- 在发送请求前进行处理

```javascript
// dispatchRequest.ts
  config.headers = flattenHeaders(config.headers, config.method!);

```
