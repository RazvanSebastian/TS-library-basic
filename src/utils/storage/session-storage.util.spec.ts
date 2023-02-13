import { SessionStorageUtil } from './session-storage.util';

describe('SessionStorageUtil', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('should set the item in the session storage', () => {
    // given
    const item = '111';
    const key = 'key1';

    // when
    SessionStorageUtil.setItem(key, item);

    // then
    expect(sessionStorage.getItem(key)).toBe(item);
  });

  it('should get the item from the session storage', () => {
    // given
    const item = '222';
    const key = 'key2';

    // when
    sessionStorage.setItem(key, item);

    // then
    expect(SessionStorageUtil.getItem(key)).toBe(item);
  });

  it('should remove the item from the session storage', () => {
    // given
    const item = '333';
    const key = 'key3';

    // when
    sessionStorage.setItem(key, item);
    SessionStorageUtil.removeItem(key);

    // then
    expect(sessionStorage.getItem(key)).toBe(null);
  });
});
