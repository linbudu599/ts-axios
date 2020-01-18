import {
  AxiosRequestConfig,
  defaultConfigKey,
  onlyCustomConfigKey,
  deepMergeConfigKey
} from '../types';
import { isPlainObject, deepMerge } from '../helper/util';
export default function mergeConfig(
  defaultConfig: AxiosRequestConfig,
  userConfig?: AxiosRequestConfig
): AxiosRequestConfig {
  const config = Object.create(null);

  // 常规对象合并,用户配置了则使用用户地,否则使用默认值
  defaultConfigKey.forEach(key => {
    userConfig = userConfig || {};
    if (typeof userConfig[key] !== 'undefined') {
      config[key] = userConfig[key];
    } else if (typeof defaultConfig[key] !== 'undefined') {
      config[key] = defaultConfig[key];
    }
  });

  // 只接受用户配置
  onlyCustomConfigKey.forEach(key => {
    userConfig = userConfig || {};
    if (typeof userConfig[key] !== 'undefined') {
      config[key] = userConfig[key];
    }
  });

  // 深度合并配置
  // 以headers属性为例
  // 如果是headers属性值是对象-->调用deepMerge方法,合并二者配置对象中的headers属性
  // 不是对象且不为空-->直接作为config.headers值
  // 为空且defaultConfig.headers为对象-->将defaultConfig.headers深拷贝一份作为config.headers值
  // 为空且defaultConfig.headers不为对象而又不为空-->defaultConfig.headers直接作为config.headers值
  deepMergeConfigKey.forEach(key => {
    userConfig = userConfig || {};
    if (isPlainObject(userConfig[key])) {
      config[key] = deepMerge(defaultConfig[key], userConfig[key]);
    } else if (typeof userConfig[key] !== 'undefined') {
      config[key] = userConfig[key];
    } else if (isPlainObject(defaultConfig[key])) {
      config[key] = deepMerge(defaultConfig[key]);
    } else if (typeof defaultConfig[key] !== 'undefined') {
      config[key] = defaultConfig[key];
    }
  });
  return config;
}
