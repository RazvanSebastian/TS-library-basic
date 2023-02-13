import {
  HALF_PIXEL,
  LG_WIDTH,
  MD_WIDTH,
  MediaMatcherBreakPoint,
  SM_WIDTH,
  XL_WIDTH,
  XS_WIDTH,
} from 'models/media-matcher/model';

export class MediaMatcherUtil {
  public static readonly mediaMatcherCreatorMap = {
    [MediaMatcherBreakPoint.DOWN_XL]: MediaMatcherUtil.getDownXlMediaMatcher,
    [MediaMatcherBreakPoint.DOWN_LG]: MediaMatcherUtil.getDownLgMediaMatcher,
    [MediaMatcherBreakPoint.DOWN_MD]: MediaMatcherUtil.getDownMdMediaMatcher,
    [MediaMatcherBreakPoint.DOWN_SM]: MediaMatcherUtil.getDownSmMediaMatcher,
    [MediaMatcherBreakPoint.DOWN_XS]: MediaMatcherUtil.getDownXsMediaMatcher,

    [MediaMatcherBreakPoint.UP_XL]: MediaMatcherUtil.getUpXlMediaMatcher,
    [MediaMatcherBreakPoint.UP_LG]: MediaMatcherUtil.getUpLgMediaMatcher,
    [MediaMatcherBreakPoint.UP_MD]: MediaMatcherUtil.getUpMdMediaMatcher,
    [MediaMatcherBreakPoint.UP_SM]: MediaMatcherUtil.getUpSmMediaMatcher,
    [MediaMatcherBreakPoint.UP_XS]: MediaMatcherUtil.getUpXsMediaMatcher,
  };

  public static getDownXlMediaMatcher(): MediaQueryList | undefined {
    return MediaMatcherUtil.getMediaMatcher(`(max-width:${XL_WIDTH - HALF_PIXEL}px)`);
  }

  public static getDownLgMediaMatcher(): MediaQueryList | undefined {
    return MediaMatcherUtil.getMediaMatcher(`(max-width:${LG_WIDTH - HALF_PIXEL}px)`);
  }

  public static getDownMdMediaMatcher(): MediaQueryList | undefined {
    return MediaMatcherUtil.getMediaMatcher(`(max-width:${MD_WIDTH - HALF_PIXEL}px)`);
  }

  public static getDownSmMediaMatcher(): MediaQueryList | undefined {
    return MediaMatcherUtil.getMediaMatcher(`(max-width:${SM_WIDTH - HALF_PIXEL}px)`);
  }

  public static getDownXsMediaMatcher(): MediaQueryList | undefined {
    return MediaMatcherUtil.getMediaMatcher(`(max-width:${XS_WIDTH - HALF_PIXEL}px)`);
  }

  public static getUpXlMediaMatcher(): MediaQueryList | undefined {
    return MediaMatcherUtil.getMediaMatcher(`(min-width:${XL_WIDTH}px)`);
  }

  public static getUpLgMediaMatcher(): MediaQueryList | undefined {
    return MediaMatcherUtil.getMediaMatcher(`(min-width:${LG_WIDTH}px)`);
  }

  public static getUpMdMediaMatcher(): MediaQueryList | undefined {
    return MediaMatcherUtil.getMediaMatcher(`(min-width:${MD_WIDTH}px)`);
  }

  public static getUpSmMediaMatcher(): MediaQueryList | undefined {
    return MediaMatcherUtil.getMediaMatcher(`(min-width:${SM_WIDTH}px)`);
  }

  public static getUpXsMediaMatcher(): MediaQueryList | undefined {
    return MediaMatcherUtil.getMediaMatcher(`(min-width:${XS_WIDTH}px)`);
  }

  public static getMediaMatcher(mediaQuery: string): MediaQueryList | undefined {
    try {
      return window.matchMedia?.(mediaQuery);
    } catch (exp) {
      console.error(exp);
    }
  }

  public static addMediaQueryListener(
    mediaMatcher: MediaQueryList | undefined,
    mediaQueryHandler: (ev?: MediaQueryListEvent, mediaMatcher?: MediaQueryList) => void,
    applyHandlerImmediately = true
  ): void {
    if (mediaMatcher?.addEventListener && mediaMatcher?.removeEventListener) {
      mediaMatcher.removeEventListener('change', mediaQueryHandler);
      mediaMatcher.addEventListener('change', mediaQueryHandler);
    } else {
      // addListener is deprecated, but unfortunately there is a library in eurovision that overrides the matchMedia functionality
      // and only has this function available (check the savingsplan overview page)
      mediaMatcher?.addListener?.(mediaQueryHandler);
    }

    if (applyHandlerImmediately) {
      mediaQueryHandler(undefined, mediaMatcher);
    }
  }

  public static removeMediaQueryListener(
    mediaMatcher: MediaQueryList | undefined,
    mediaQueryHandler: (ev?: MediaQueryListEvent) => void
  ): void {
    if (mediaMatcher?.addEventListener && mediaMatcher?.removeEventListener) {
      mediaMatcher.removeEventListener('change', mediaQueryHandler);
    } else {
      // removeListener is deprecated, but unfortunately there is a library in eurovision that overrides the matchMedia functionality
      // and only has this function available (check the savingsplan overview page)
      mediaMatcher?.removeListener?.(mediaQueryHandler);
    }
  }

  public static getMediaMatcherCreator(mediaMatcherBreakPoint: MediaMatcherBreakPoint) {
    return MediaMatcherUtil.mediaMatcherCreatorMap[mediaMatcherBreakPoint];
  }
}
