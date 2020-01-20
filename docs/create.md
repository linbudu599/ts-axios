# 扩展axios.create()方法

## 前面存在的问题

各个地方使用的axios其实是同一个实例对象，这样就有一个问题，如果我修改了这个实例对象的默认配置，那么所有的axios实例都会受到影响，进而影响到所有的请求

## 实现

要使得每个不同的实例互不干扰
创建一个新的接口类型，用于定义 `create` 方法

```javascript
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance;
}
```

- 实现create接口
该接口支持接收一个 AxiosRequestConfig 类型的配置对象，把该配置对象和全局的默认配置对象进行合并，作为将来返回的新axios实例对象的默认配置，最后创建出一个新的实例对象返回即可

```typescript
function createInstance(config: AxiosRequestConfig):       AxiosStatic {
    const context = new Axios(config);
    // 创建instance 指向 Axios.prototype.request 方法，并绑定了上下文 context
    const instance = Axios.prototype.request.bind(context);
    // 把 context 中的原型方法和实例方法全部拷贝到 instance 上
    extend(instance, context);

    // instance本身是一个函数，又拥有了Axios类的所有原型和实例属性
    return instance as AxiosStatic;
  }
  // 直接axios({})相当于调用Axios原型上的request方法（绑定的是Axios类）
  // axios.get("",{})则相当于在调用Axios类实例上的对应方法
  // 在创建axios实例时传入默认配置
  const axios = createInstance(defaults);

  axios.create = function(config: AxiosRequestConfig) {
    return createInstance(mergeConfig(defaults, config));
  };
  axios.CancelToken = CancelToken;
  axios.Cancel = Cancel;
  axios.isCancel = isCancel;

  export default axios;
```

