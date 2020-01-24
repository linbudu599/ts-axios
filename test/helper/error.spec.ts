import { createError } from '../../src/helper/error';
import { AxiosRequestConfig, AxiosResponse } from '../../src/types';

describe('helper: error', () => {
  test('create error which includes msg,config,code,req,res,isAxiosError', () => {
    const request = new XMLHttpRequest();
    const config: AxiosRequestConfig = { method: 'post' };
    const response: AxiosResponse = {
      status: 200,
      statusText: 'OK',
      headers: null,
      request,
      config,
      data: { foo: 'bar' }
    };
    const error = createError('Boom!', config, 'SOMETHING', request, response);
    expect(error instanceof Error).toBeTruthy();
    expect(error.message).toBe('Boom!');
    expect(error.config).toBe(config);
    expect(error.code).toBe('SOMETHING');
    expect(error.request).toBe(request);
    expect(error.response).toBe(response);
    expect(error.isAxiosError).toBeTruthy();
  });
});
