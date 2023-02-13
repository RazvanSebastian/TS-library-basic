import { LocalStorageUtil } from './local-storage.util';

describe('LocalStorageUtil', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('should set the item in the local storage', () => {
    // given
    const item = '111';
    const key = 'key1';

    // when
    LocalStorageUtil.setItem(key, item);

    // then
    expect(localStorage.getItem(key)).toBe(item);
  });

  it('should get the item from the local storage', () => {
    // given
    const item = '222';
    const key = 'key2';

    // when
    localStorage.setItem(key, item);

    // then
    expect(LocalStorageUtil.getItem(key)).toBe(item);
  });

  it('should remove the item from the local storage', () => {
    // given
    const item = '333';
    const key = 'key3';

    // when
    localStorage.setItem(key, item);
    LocalStorageUtil.removeItem(key);

    // then
    expect(localStorage.getItem(key)).toBe(null);
  });
});
