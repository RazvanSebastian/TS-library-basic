// the following values are taken from the web-ui-styles project but using pixels instead of em
// @media only screen and (max-width: $md - $half-pixel-in-em)

export const XL_WIDTH = 1200;
export const LG_WIDTH = 980;
export const MD_WIDTH = 768;
export const SM_WIDTH = 600;
export const XS_WIDTH = 320;

export const HALF_PIXEL = 1 / 2;

export enum MediaMatcherBreakPoint {
  DOWN_XL = 'DOWN_XL',
  DOWN_LG = 'DOWN_LG',
  DOWN_MD = 'DOWN_MD',
  DOWN_SM = 'DOWN_SM',
  DOWN_XS = 'DOWN_XS',

  UP_XL = 'UP_XL',
  UP_LG = 'UP_LG',
  UP_MD = 'UP_MD',
  UP_SM = 'UP_SM',
  UP_XS = 'UP_XS',
}
