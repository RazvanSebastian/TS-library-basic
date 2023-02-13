/**
 * Utility class for interacting safely (without exceptions) with the 'localStorage'.
 */
export class LocalStorageUtil {
  constructor() {
    throw new Error("Utility class can't be instantiated.");
  }

  public static setItem(key: string, value: string): void {
    LocalStorageUtil.executeCallbackSafe(() => localStorage.setItem(key, value));
  }

  public static getItem(key: string): string | null {
    return LocalStorageUtil.executeCallbackSafe(() => localStorage.getItem(key));
  }

  public static removeItem(key: string): void {
    LocalStorageUtil.executeCallbackSafe(() => localStorage.removeItem(key));
  }

  private static executeCallbackSafe(fn: Function): string | null {
    try {
      return fn();
    } catch (e) {
      console.warn('localStorage is not available', e);
    }
    return null;
  }
}
