import { transformRequest, transformResponse } from '../../src/helper/data';
import { isPlainObject } from '../../src/helper/util';

describe('helper: data', () => {
  test('only transform obj-type data to json-str', () => {
    const a = { a: 1 };
    expect(transformRequest(a)).toBe('{"a":1}');
    expect(transformRequest('foo=123')).toBe('foo=123');
  });

  test('only transform json-str data to Object', () => {
    const a = '{"a": 2}';
    expect(transformResponse(a)).toEqual({ a: 2 });
    expect(transformResponse({ a: 2 })).toEqual({ a: 2 });
  });
});
