import axios from '../../src';

interface ResponseData<T = any> {
  code: number;
  result: T;
  message: string;
}

interface User {
  name: string;
  age: number;
}

function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(err => console.error(err));
}

async function test() {
  const user = await getUser<User>();
  if (user) {
    console.log(user.result.name);
  }
}

// 调用 getUser<User>相当于调用axios<ResponseData<User>>，即传入axios函数的类型为ResponseData<User>
// 返回值 AxiosPromiseRes<T> 的 T，实际上也是 Promise<AxiosResponse<T>> 中的 T 的类型是 ResponseData<User>，
// 所以响应数据中的 data 类型就是 ResponseData<User>
test();
