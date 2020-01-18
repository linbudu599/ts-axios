import { AxiosTransformer } from '../types';

// 接收三个参数，待转换的数据data、待转换的headers以及所有的转换函数
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
) {
  if (!fns) {
    return data;
  }
  if (!Array.isArray(fns)) {
    fns = [fns];
  }
  // 前一个输出会作为后一个输入
  fns.forEach(fn => {
    data = fn(data, headers);
  });
  return data;
}
