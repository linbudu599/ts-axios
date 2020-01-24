import { isDate, isPlainObject, isFormData, extend, deepMerge } from '../../src/helper/util';

describe('hepler:util', () => {
  describe('isXX', () => {
    test('Validate Date', () => {
      expect(isDate(new Date())).toBeTruthy();
      expect(isDate(Date.now())).toBeFalsy();
    });

    test('Validate Plain Object', () => {
      expect(isPlainObject({})).toBeTruthy();
      expect(isPlainObject(new Date())).toBeFalsy();
    });

    test('Validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy();
      expect(isFormData({})).toBeFalsy();
    });
  });

  describe('extend', () => {
    test('Mutable', () => {
      const a = Object.create(null);
      const b = { foo: 123 };

      const c = extend(a, b);

      expect(c.foo).toBe(123);
    });

    test('Overwrite Properties', () => {
      const a = { foo: 123, bar: 456 };
      const b = { bar: 789 };
      const c = extend(a, b);

      expect(c.foo).toBe(123);
      expect(c.bar).toBe(789);
    });
  });

  describe('deepMerge', () => {
    test('Immutable', () => {
      const a = Object.create(null);
      const b: any = { foo: 123 };
      const c: any = { bar: 456 };

      deepMerge(a, b, c);

      expect(typeof a.foo).toBe('undefined');
      expect(typeof a.bar).toBe('undefined');
      expect(typeof b.foo).toBe('number');
      expect(typeof b.bar).toBe('undefined');
      expect(typeof c.foo).toBe('undefined');
      expect(typeof c.bar).toBe('number');
    });

    test('Deep Merge Properties', () => {
      const a = { foo: 123 };
      const b = { bar: 456 };
      const c = { foo: 789 };
      const d = deepMerge(a, b, c);

      expect(d.foo).toBe(789);
      expect(d.bar).toBe(456);
    });

    test('Deep Merge Recursively', () => {
      const a = { foo: { bar: 123 } };
      const b = { foo: { baz: 456 }, bar: { qux: 789 } };
      const c = deepMerge(a, b);

      expect(c).toEqual({
        foo: {
          bar: 123,
          baz: 456
        },
        bar: {
          qux: 789
        }
      });
    });

    test('Remove All References From Nested Objects', () => {
      const a = { foo: { bar: 123 } };
      const b = {};
      const c = deepMerge(a, b);

      expect(c).toEqual({
        foo: {
          bar: 123
        }
      });

      expect(c.foo).not.toBe(a.foo);
    });

    test('handle null and undefined arguments', () => {
      expect(deepMerge(undefined, undefined)).toEqual({});
      expect(deepMerge(undefined, { foo: 123 })).toEqual({ foo: 123 });
      expect(deepMerge({ foo: 123 }, undefined)).toEqual({ foo: 123 });

      expect(deepMerge(null, null)).toEqual({});
      expect(deepMerge(null, { foo: 123 })).toEqual({ foo: 123 });
      expect(deepMerge({ foo: 123 }, null)).toEqual({ foo: 123 });
    });
    
  });
});
