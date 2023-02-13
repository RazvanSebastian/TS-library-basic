import cloneDeep from 'lodash.clonedeep';

export const isString = (val: any): boolean => {
  return Object.prototype.toString.call(val) === '[object String]';
};

export const isObject = (val: any): boolean => {
  return valueNotNullOrUndefined(val) && typeof val === 'object';
};

export const valueIsValidNumber = (numValue?: number): boolean => {
  return numValue !== null && numValue !== undefined && !isNaN(numValue);
};

export const stringValueIsValidNumber = (stringValue?: string | null): boolean => {
  return !!stringValue && valueIsValidNumber(+stringValue);
};

export const valueNotNullOrUndefined = (value: any): boolean => {
  return value !== null && value !== undefined;
};

export const capitalizeFirstLetter = (str: string) => {
  return str ? `${str.charAt(0).toUpperCase()}${str.slice(1)}` : '';
};

export const getStringArrayWithoutDuplicates = (arr: string[]) => {
  return arr.filter((value, index) => duplicateFilter(value, index, arr));
};

export const duplicateFilter = (value: string | number, index: number, self: (string | number)[]) => {
  return self.indexOf(value) === index;
};

export const minusBetweenStringArrays = (arr1: string[], arr2: string[]) => {
  return arr1.filter((prop) => !arr2.some((propLoaded) => propLoaded === prop));
};

/**
 * Split the given `value` into an array of strings using the given `splitString`.
 *
 * @param value value to split
 * @param splitString string used to split
 * @param trim indicates if the values from the resulted array should be trimmed
 * @returns and array of strings
 */
export const splitStringIntoArray = (value?: string, splitString = ' ', trim = true): string[] => {
  return (
    value
      ?.split(splitString)
      .map((item) => (trim ? item.trim() : item))
      .filter((item) => item) || []
  );
};

/**
 * Split an array of string objects into an array of groups (array of arrays).
 * Each group is an array of string objects representing a slice of the original array.
 *
 * @param arr array of string objects
 * @param size size of each group
 * @returns an array of groups (each group containing a slice of the original array)
 */
export const splitStringArrayInGroups = (arr: string[] | undefined, size: number): string[][] => {
  const splitArray: string[][] = [];
  if (arr?.length) {
    for (let i = 0; i < arr.length; i += size) {
      splitArray.push(arr.slice(i, i + size));
    }
  }
  return splitArray;
};

export const validProp = (prop: any, defaultValue = '-') => {
  return prop !== null && prop !== undefined ? prop : defaultValue;
};

/**
 * Return an accesor that can be used to retrieve a nested prop from an object.
 */
export const getNestedProp = (data: any, selectorArray: string[], defaultValue?: any) => {
  const value = selectorArray?.length
    ? selectorArray.reduce(
        (dataChild: any, selectorItem: string) =>
          valueNotNullOrUndefined(dataChild?.[selectorItem]) ? dataChild[selectorItem] : null,
        data
      )
    : defaultValue;
  return valueNotNullOrUndefined(value) ? value : defaultValue;
};

export const stringsAreEqual = (val1?: string | null, val2?: string | null, ignoreCase = false): boolean => {
  return ignoreCase ? val1?.toLowerCase() === val2?.toLowerCase() : val1 === val2;
};

export const stringHasText = (val?: string | null): boolean => {
  return !!val?.trim();
};

export const stringDoesntHaveText = (val?: string | null): boolean => {
  return !stringHasText(val);
};

export const xor = (a?: boolean, b?: boolean): boolean => {
  return !!((a && !b) || (!a && b));
};

/**
 * Asserts the deep equality between two objects
 * @param object1 the first object to be compared
 * @param object2 the second object to be compared
 * @param exceptAttributes attributes which should not be verified
 */
export const deepEqual = (object1: any, object2: any, exceptAttributes: string[] = []) => {
  if (object1 === object2) {
    return true; // same object
  }

  if (!isObject(object1) || !isObject(object2)) {
    return false;
  }

  if (object1?.constructor !== object2?.constructor) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (Object.keys(object1).length !== Object.keys(object2).length) {
    return false;
  }

  for (const p in object1) {
    if (!object1.hasOwnProperty(p)) {
      continue;
    }

    if (!object2.hasOwnProperty(p)) {
      return false;
    }

    if (object1[p] === object2[p] || exceptAttributes.indexOf(p) >= 0) {
      continue;
    }

    if (!isObject(object1[p])) {
      return false;
    }

    if (!deepEqual(object1[p], object2[p], exceptAttributes)) {
      return false;
    }
  }

  for (const p in object2) {
    if (object2.hasOwnProperty(p) && !object1.hasOwnProperty(p)) {
      return false;
    }
  }

  return true;
};

export const getNumberWithoutRounding = (num: number | null | undefined, maxFractionDigits: number) => {
  if (num === null || num === undefined) {
    return Number.NaN;
  }

  let numStr = num.toString();
  if (numStr?.indexOf('.') !== -1) {
    numStr = numStr?.slice(0, numStr.indexOf('.') + maxFractionDigits + 1);
  }

  return Number(numStr);
};

export const shallowClone = <T>(object: T): T => {
  return valueNotNullOrUndefined(object) && typeof object === 'object' ? { ...object } : object;
};

export const deepClone = <T>(object: T): T => {
  return cloneDeep(object);
};
