import { AxiosPromiseRes, AxiosRequestConfig, AxiosResponse } from '../types';
import xhr from './xhr';
import { buildURL, isAbsoluteURL, combineURL } from '../helper/url';
import transform from './transform';
import { flattenHeaders } from '../helper/header';

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromiseRes {
  throwIfCancellationRequested(config);
  processConfig(config);
  return xhr(config).then((res: any) => {
    return transformResponseData(res);
  });
}

function processConfig(config: AxiosRequestConfig): void {
  // 之前对请求数据和响应数据的处理逻辑，放到了默认配置中，也就是默认处理逻辑
  config.url = transformURL(config);
  config.data = transform(config.data, config.headers, config.transformRequest);
  config.headers = flattenHeaders(config.headers, config.method!);
}

function transformURL(config: AxiosRequestConfig): string {
  // const { url, params } = config;
  // return buildURL(url as string, params);
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  // res.data = transformResponse(res.data);
  res.data = transform(res.data, res.headers, res.config.transformResponse);
  return res;
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}
