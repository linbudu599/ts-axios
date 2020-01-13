import { AxiosRequestConfig } from '../types/index';
import { transformRequest } from '../helper/data';
import { buildURL } from '../helper/url';
import { processHeaders } from '../helper/header';
import xhr from './xhr';

const axios = (config: AxiosRequestConfig) => {
  processConfig(config);
  xhr(config);
};

const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformURL(config);
  config.headers = transformHeaders(config);
  config.data = transformRequestData(config);
};

const transformURL = (config: AxiosRequestConfig): string => {
  const { url, params } = config;
  return buildURL(url, params);
};

const transformRequestData = (config: AxiosRequestConfig): any => {
  return transformRequest(config.data);
};

function transformHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
}
export default axios;
