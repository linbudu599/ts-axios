# 取消请求

## axios官方调用请求功能

### 使用 `CancelToken.source` 工厂创建取消令牌

```javascript
const CancelToken = axios.CancelToken;
// source方法是cancelToken的一个工厂方法
// CancelToken.source = function source() {
//   var cancel;
//   var token = new CancelToken(function executor(c) {
//     cancel = c;
//   });
//   return {
//     token: token,
//     cancel: cancel
//   };
// };
const source = CancelToken.source();

axios.get('/user/foo', {
  cancelToken: source.token
}).catch(function (e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled', e.message);
  } else {
    // handle error
  }
});

// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.');
```

### 将取消函数传递给 `CancelToken` 的构造函数来创建取消令牌

```javascript
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // 参数c是自带的取消请求参数，这里将cancel赋值为这个取消函数
    // An executor function receives a cancel function as a parameter
    cancel = c;
  })
});

// cancel the request
cancel();
```

这两种方法其实差不多

## 实现

在 cancelToken 中保存一个 pending 状态的 Promise 对象，然后当我们执行 cancel 方法的时候，能够访问到这个 Promise 对象，把它从 pending 状态变成 resolved 状态，这样我们就可以在 then 函数中去实现取消请求的逻辑

```javascript
if (cancelToken) {
  cancelToken.promise
    .then(reason => {
      request.abort()
      reject(reason)
    })
}
```

（详见各部分代码注释）

### 逻辑梳理

#### 将取消函数传递给 `CancelToken` 的构造函数来创建取消令牌的方式

- 用户配置了 `cancelToken` 属性，其值为 `CancelToken` 类的实例
- 实例化 `CancelToken` 类时，传入了 `executor` 函数，这个函数接受一个参数，并把参数赋给了变量cancel，后面要执行取消时只需 `cancel()` 即可
- 在 `CancelToken` 类的内部，构造函数首先实例化一个pending的Promise，并用一个变量指向它
- 执行传入的 `executor` 函数，同时为其传入了一个参数：

  ```javascript
  executor(message => {
      if (this.reason) {
        return;
      }
      this.reason = message;
      resolvePromise(this.reason);
    });
  // 即变量cancel为
  let cancel = message => {
    if (this.reason) {
        return;
    }
    this.reason = message;
    resolvePromise(this.reason);
  }
  ```

- 则变量cancel即为后续会被调用的取消函数，如`cancel()`。当被调用时，在其内部会调用 `resolvePromise` 函数将Promise变为resolved，即 `CancelToken` 类中的promise变为了resolved **（resolvePromise方法实际上就是另存一份的resolve）**
  
- 请求配置对象中的 `cancelToken` 属性即为 `CancelToken` 类实例，因此当 `promise` 属性变成 `resolved` 时，说明 `cancel` 函数被调用了，然后就会通过调用原生`abort()`方法取消请求

  ```javascript
  cancelToken.promise.then(reason => {
      request.abort();
      reject(reason)
  })
  ```

### 实现isCancel接口

该接口接收一个异常对象e作为参数，用来判断该异常是否是由取消请求导致的，如果是的话该异常对象就应该是请求取消的原因（`e.message`）；创建一个取消原因 `Cancel类`，把请求取消的原因作为该类的实例，在捕获异常的时候只需判断异常对象是不是 `Cancel类` 的实例，如果是的话，那么它就是请求取消原因，否则就是其他异常。
