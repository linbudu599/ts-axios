import cookie from '../../src/helper/cookie';

describe('helper: cookie', () => {
  test('cookie can be read', () => {
    document.cookie = 'key=value';
    expect(cookie.read('key')).toBe('value');
  });

  test('return null when cookie is undefined', () => {
    expect(cookie.read('none')).toBeNull();
  });
});
