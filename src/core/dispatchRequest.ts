import { AxiosPromiseRes, AxiosRequestConfig, AxiosResponse } from '../types';
import xhr from './xhr';
import { buildURL } from '../helper/url';
import { transformRequest, transformResponse } from '../helper/data';
import { processHeaders, flattenHeaders } from '../helper/header';

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromiseRes {
  processConfig(config);
  return xhr(config).then((res: any) => {
    return transformResponseData(res);
  });
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);
  config.headers = transformHeaders(config);
  config.data = transformRequestData(config);
  // 注意断言符
  config.headers = flattenHeaders(config.headers, config.method!);
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config;
  return buildURL(url as string, params);
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data);
}

function transformHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data);
  return res;
}
