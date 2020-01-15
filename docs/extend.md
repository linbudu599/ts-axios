# 接口扩展

> 使得既可以 axios({})也可 axios.get("",{})进行调用

- 定义 [dispatchRequest 方法](../src/core/dispatchRequest.ts)，在这里处理请求/响应并调用 xhr 方法进行发送
- 定义 Axios 类，在其中定义 get、post 等方法，
- 在[axios.ts]中，创建一个新的 Axios 类的实例 context，使用 `bind` 创建一个绑定到 context 的，Axios 类原型上的 request 函数。

```javascript
function createInstance(): AxiosInstance {
  const context = new Axios();
  // 创建instance 指向 Axios.prototype.request 方法，并绑定了上下文 context
  const instance = Axios.prototype.request.bind(context);
  // 把 context 中的原型方法和实例方法全部拷贝到 instance 上
  extend(instance, context);

  // instance本身是一个函数，又拥有了Axios类的所有原型和实例属性
  return instance as AxiosInstance;
}
// 直接axios({})相当于调用Axios原型上的request方法（绑定的是Axios类）
// axios.get("",{})则相当于在调用Axios类实例上的对应方法
const axios = createInstance();

export default axios;

```
