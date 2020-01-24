import isURLSameOrigin, { resolveURL } from '../../src/helper/isURLSameOrigin';
import jest from 'jest';

describe('helper:isURLSameOrigin', () => {
  test('resolve URL to protocol and host', () => {
    expect(resolveURL('http://localhost:3000')).toStrictEqual({
      protocol: 'http:',
      host: 'localhost:3000'
    });
  });

  test.skip('check if url is same-origin', () => {
    // const fn = jest.fn();

    // const currentOrigin = 'http://localhost:3000';
    // const sameOriginURL = 'http://localhost:3000/demo';
    // const diffOriginURL = 'http://localhost:3333';

    // expect(isURLSameOrigin(sameOriginURL)).toBeTruthy();
    // function forEach(items, callback) {
    //   for (let index = 0; index < items.length; index++) {
    //     callback(items[index]);
    //   }
    // }
    // const mockCallback = jest.fn();
    // forEach([0, 1], mockCallback);
    // // 此模拟函数被调用了两次
    // expect(mockCallback.mock.calls.length).toBe(2);

    // // 第一次调用函数时的第一个参数是 0
    // expect(mockCallback.mock.calls[0][0]).toBe(0);

    // // 第二次调用函数时的第一个参数是 1
    // expect(mockCallback.mock.calls[1][0]).toBe(1);
  });
});
