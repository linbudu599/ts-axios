import { AxiosInstance } from './types';
import Axios from './core/Axios';
import { extend } from './helper/util';

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
