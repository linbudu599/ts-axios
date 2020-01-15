# 处理url

> 统一处理各种不同情况/方法的请求参数

```JavaScript
// /base/get?foo[]=bar&foo[]=baz'
params: {
    foo: ['bar', 'baz']
  }

// /base/get?foo=%7B%22bar%22:%22baz%22%7D，对{"bar":"baz"} encode
params: {
    foo: {
      bar: 'baz'
    }
  }

// /base/get?date=2019-04-01T05:55:39.030Z
const date = new Date()；
params: {
    date
  }

// 保留特殊字符
// /base/get?foo=@:$+，空格会被转为+
params: {
    foo: '@:$, '
  }

// 忽略null与undefined

// 丢弃hash标志
// /base/get?foo=bar
url: '/base/get#hash',
  params: {
    foo: 'bar'
  }

// 保留已经存在的
```

见[buildURL注释](../helper/url.ts)
