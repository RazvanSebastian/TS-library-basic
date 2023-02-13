/**
 * Utility class for interacting safely (without exceptions) with the 'sessionStorage'.
 */
export class SessionStorageUtil {
  constructor() {
    throw new Error("Utility class can't be instantiated.");
  }

  public static setItem(key: string, value: string) {
    SessionStorageUtil.executeCallbackSafe(() => sessionStorage.setItem(key, value));
  }

  public static getItem(key: string): string | null {
    return SessionStorageUtil.executeCallbackSafe(() => sessionStorage.getItem(key));
  }

  public static removeItem(key: string) {
    SessionStorageUtil.executeCallbackSafe(() => sessionStorage.removeItem(key));
  }

  private static executeCallbackSafe(fn: Function): string | null {
    try {
      return fn();
    } catch (e) {
      console.warn('sessionStorage is not available', e);
    }
    return null;
  }
}
