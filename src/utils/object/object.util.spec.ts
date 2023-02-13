import {
  deepClone,
  deepEqual,
  getNumberWithoutRounding,
  splitStringIntoArray,
  stringDoesntHaveText,
  stringHasText,
  stringsAreEqual,
  xor,
} from './object.util';

describe('object methods', () => {
  it('should correctly compare primitives', () => {
    expect(deepEqual(4, 5)).toBeFalse();
    expect(deepEqual(4, 4)).toBeTrue();
    expect(deepEqual('a', 'b')).toBeFalse();
    expect(deepEqual('a', 'a')).toBeTrue();
    expect(deepEqual('true', true)).toBeFalse();
    expect(deepEqual(true, 1)).toBeFalse();
    expect(deepEqual(false, null)).toBeFalse();
    expect(deepEqual(false, false)).toBeTrue();
  });

  it('should correctly compare nested objects', () => {
    const obj1 = {
      key1: 3,
      key2: 'string',
      key3: [4, '45', { key4: [5, '6', false, null, { v: 1 }] }],
    };

    const obj2 = {
      key1: 3,
      key2: 'string',
      key3: [4, '45', { key4: [5, '6', false, null, { v: 1 }] }],
    };

    expect(deepEqual(obj1, obj2)).toBeTrue();

    const obj3 = {
      key1: 3,
      key2: 'string',
      key3: [4, '45', { key4: [5, '6', false, null, { v: 1 }] }],
    };

    const obj4 = {
      key1: 3,
      key2: 'string',
      key3: [4, '45', { key4: [5, '6', undefined, null, { v: 1 }] }],
    };

    expect(deepEqual(obj3, obj4)).toBeFalse();
  });

  it('should correctly compare objects with functions', () => {
    const customFunc = (x: number) => {
      return x * 2;
    };
    const obj = { key1: { key1a: 'value', key1b: '3' }, key2: 2, myFunc: customFunc };

    expect(deepEqual(obj, { key1: { key1a: 'value', key1b: '3' }, key2: 2, myFunc: customFunc })).toBeTrue();
    // Functions must be strictly equal
    expect(
      deepEqual(obj, {
        key1: { key1a: 'value', key1b: '3' },
        key2: 2,
        myFunc: (x: number) => {
          return x * 2;
        },
      })
    ).toBeFalse();

    expect(
      deepEqual(obj, {
        key1: { key1a: 'value', key1b: '3' },
        key2: 2,
        myFunc: (x: number) => {
          return x * 999;
        },
      })
    ).toBeFalse();
  });

  it('should correctly compare objects based on excluded attributes', () => {
    const obj1 = {
      key1: 3,
      key2: 'string1',
      key3: [4, '45', { key4: [5, '6', false, null, { v: 1 }] }],
    };

    const obj2 = {
      key1: 3,
      key2: 'string2',
      key3: [4, '45', { key4: [5, '6', false, null, { v: 2 }] }],
    };

    expect(deepEqual(obj1, obj2)).toBeFalse();
    expect(deepEqual(obj1, obj2, ['key2'])).toBeFalse();
    expect(deepEqual(obj1, obj2, ['key2', 'v'])).toBeTrue();
  });

  describe('splitStringIntoArray', () => {
    [
      {
        value: '1 2    3 4,5',
        result: ['1', '2', '3', '4,5'],
        // default for trim is true and for splitString is " "
      },
      {
        value: '1 2    3 4,5',
        trim: true,
        splitString: ' ',
        result: ['1', '2', '3', '4,5'],
      },
      {
        result: [],
      },
      {
        value: '   1 2    3 4,5',
        trim: false,
        splitString: ',',
        result: ['   1 2    3 4', '5'],
      },
    ].forEach((testInput) => {
      it(`should split the value '${testInput.value}' using trim '${testInput.trim}' and splitString '${testInput.splitString}' and get the result '[${testInput.result}]'`, () => {
        expect(splitStringIntoArray(testInput.value, testInput.splitString, testInput.trim)).toEqual(testInput.result);
      });
    });
  });

  describe('strings are equal', () => {
    it("should return 'true' when both strings have the same value", () => {
      expect(stringsAreEqual('test', 'test')).toBeTrue();
    });

    it("should return 'true' when both strings have the same lowercase value", () => {
      expect(stringsAreEqual('teSt', 'tEsT', true)).toBeTrue();
    });

    it("should return 'false' when the strings are different", () => {
      expect(stringsAreEqual('test', undefined)).toBeFalse();
    });
  });

  describe('strings has text', () => {
    [null, undefined, '', '  ', '  \n\t'].forEach((value) => {
      it(`should return 'false' if the string is '${value}'`, () => {
        expect(stringHasText(value)).toBeFalse();
      });
    });

    [' 1 ', 'test'].forEach((value) => {
      it(`should return 'true' if the string is '${value}'`, () => {
        expect(stringHasText(value)).toBeTrue();
      });
    });
  });

  describe("strings doesn't have text", () => {
    [null, undefined, '', '  ', '  \n\t'].forEach((value) => {
      it(`should return 'true' if the string is '${value}'`, () => {
        expect(stringDoesntHaveText(value)).toBeTrue();
      });
    });

    [' 1 ', 'test'].forEach((value) => {
      it(`should return 'false' if the string is '${value}'`, () => {
        expect(stringDoesntHaveText(value)).toBeFalse();
      });
    });
  });

  describe('xor', () => {
    [
      {
        a: true,
        b: true,
        res: false,
      },
      {
        a: true,
        b: false,
        res: true,
      },
      {
        a: false,
        b: true,
        res: true,
      },
      {
        a: false,
        b: false,
        res: false,
      },
    ].forEach((xorInput) => {
      it(`should return '${xorInput.res}' if '${xorInput.a}' && '${xorInput.b}'`, () => {
        expect(xor(xorInput.a, xorInput.b)).toBe(xorInput.res);
      });
    });
  });

  describe('number without rounding', () => {
    const specialCases = [null, undefined];
    const numbers = [2, 9.95, 9.9499, 0.356, 1.09, 1.001, 209.3501];
    const precision0Results = [2, 9, 9, 0, 1, 1, 209];
    const precision1Results = [2, 9.9, 9.9, 0.3, 1.0, 1.0, 209.3];
    const precision2Results = [2, 9.95, 9.94, 0.35, 1.09, 1.0, 209.35];
    const precision3Results = [2, 9.95, 9.949, 0.356, 1.09, 1.001, 209.35];
    const precision4Results = [2, 9.95, 9.9499, 0.356, 1.09, 1.001, 209.3501];

    specialCases.forEach((testInput) => {
      it(`should return NaN for '${testInput}'`, () => {
        expect(getNumberWithoutRounding(testInput, 0)).toBeNaN();
      });
    });

    numbers.forEach((testInput, i) => {
      it(`should return the number without rounding for '${testInput}' with precision 0`, () => {
        expect(getNumberWithoutRounding(testInput, 0)).toBe(precision0Results[i]);
      });

      it(`should return the number without rounding for '${testInput}' with precision 1`, () => {
        expect(getNumberWithoutRounding(testInput, 1)).toBe(precision1Results[i]);
      });

      it(`should return the number without rounding for '${testInput}' with precision 2`, () => {
        expect(getNumberWithoutRounding(testInput, 2)).toBe(precision2Results[i]);
      });

      it(`should return the number without rounding for '${testInput}' with precision 3`, () => {
        expect(getNumberWithoutRounding(testInput, 3)).toBe(precision3Results[i]);
      });

      it(`should return the number without rounding for '${testInput}' with precision 4`, () => {
        expect(getNumberWithoutRounding(testInput, 4)).toBe(precision4Results[i]);
      });
    });
  });

  describe('deep clone', () => {
    it('should return a deep copy for the given object', () => {
      // given
      const obj = {
        level1: {
          level2: {
            value: 'test',
          },
        },
      };

      // when
      const deepCloneObj = deepClone(obj);

      // then
      expect(deepCloneObj).toBeTruthy();
      expect(deepCloneObj).not.toBe(obj);
      expect(deepCloneObj.level1).not.toBe(obj.level1);
      expect(deepCloneObj.level1.level2).not.toBe(obj.level1.level2);
      expect(deepCloneObj).toEqual(obj);
    });

    it('should return a deep copy and keep the object Date type', () => {
      // given
      const date = new Date();

      // when
      const deepCloneDate = deepClone(date);

      // then
      expect(deepCloneDate).toBeTruthy();
      expect(deepCloneDate).not.toBe(date);
      expect(deepCloneDate).toBeInstanceOf(Date);
      expect(deepCloneDate.getTime()).toBe(date.getTime());
    });

    it('should return a deep copy and keep the object Map type', () => {
      // given
      const map = new Map();
      map.set(1, '11');
      map.set(2, '22');

      // when
      const deepCloneMap = deepClone(map);

      // then
      expect(deepCloneMap).toBeTruthy();
      expect(deepCloneMap).not.toBe(map);
      expect(deepCloneMap).toBeInstanceOf(Map);
      expect(deepCloneMap).toEqual(map);
    });

    [1, 'test', null, undefined, true].forEach((testInput) => {
      it(`should return the same value for primitive '${testInput}'`, () => {
        expect(deepClone(testInput)).toBe(testInput);
      });
    });
  });
});
