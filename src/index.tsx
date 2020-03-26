import { Dimensions, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import React, { ReactElement, ReactNode } from 'react';

const window = Dimensions.get('window');
const minLength = Math.min(window.width, window.height);
const maxLength = Math.max(window.width, window.height);
let dimenRatio: number;
let dimenWidthRatio: number;
let dimenHeightRatio: number;
let dimenScale: number;
let dimenWidthScale: number;
let dimenHeightScale: number;
let fontScale: number;
export let _FONT_SCALE_: number;
let _defaultFontSize: number;

declare global {
  interface Number {
    scaled: () => number;
    widthScaled: () => number;
    heightScaled: () => number;
    fontScaled: () => number;
    d: () => number;
    w: () => number;
    h: () => number;
    f: () => number;
  }
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Set initial configuration for scaled layout behavior. If your height of design guideline spec is less than width, invert 1st, 2nd params.
 * @param designSpecWidth your design width viewport width(zeplin, pigma etc...). If your design viewport is 375 x 1000 then 375 is a right value.
 * @param designSpecHeight your design width viewport height(zeplin, pigma etc...). If your design viewport is 375 x 1000 then 1000 is a right value.
 * @param dimenScaleRange dimension scale factor minimum & maximum range. default is [0.5, 1.5]..
 * @param fontScaleRange font scale factor minimum & maximum range. default is [0.75, 1.3].
 * @param defaultFontsize default `<Text>` fontSize. default is 12.
 *
 * @example
 * ```ts
 * initScaledSettings(375, 812, {min: 0.5, max: 1.5}, {min: 0.75, max: 1.3}, 12);
 * ```
 */
export function initScaledSettings(
  designSpecWidth = 375,
  designSpecHeight = 812,
  dimenScaleRange: { min: number; max: number } = { min: 0.5, max: 1.5 },
  fontScaleRange: { min: number; max: number } = { min: 0.75, max: 1.3 },
  defaultFontsize = 12,
): void {
  dimenRatio =
    Math.sqrt(minLength * minLength + maxLength * maxLength) /
    Math.sqrt(designSpecWidth * designSpecWidth + designSpecHeight * designSpecHeight);
  dimenWidthRatio = minLength / designSpecWidth;
  dimenHeightRatio = maxLength / designSpecHeight;

  dimenScale = clamp(dimenRatio, dimenScaleRange.min, dimenScaleRange.max);
  dimenWidthScale = clamp(dimenWidthRatio, dimenScaleRange.min, dimenScaleRange.max);
  dimenHeightScale = clamp(dimenHeightRatio, dimenScaleRange.min, dimenScaleRange.max);

  fontScale =
    dimenScale >= 1 ? Math.min(dimenScale, fontScaleRange.max) : Math.max(dimenScale * dimenScale, fontScaleRange.min);
  _FONT_SCALE_ = fontScale;
  _defaultFontSize = defaultFontsize;

  /* eslint-disable no-extend-native */
  Number.prototype.scaled = function scaled(): number {
    return Math.round((this as number) * dimenScale);
  };
  Number.prototype.widthScaled = function widthScaled(): number {
    return Math.round((this as number) * dimenWidthScale);
  };
  Number.prototype.heightScaled = function heightScaled(): number {
    return Math.round((this as number) * dimenHeightScale);
  };
  Number.prototype.fontScaled = function fontScaled(): number {
    return Math.round((this as number) * fontScale);
  };
  Number.prototype.d = function d(): number {
    return (this as number).scaled();
  };
  Number.prototype.w = function w(): number {
    return (this as number).widthScaled();
  };
  Number.prototype.h = function h(): number {
    return (this as number).heightScaled();
  };
  Number.prototype.f = function f(): number {
    return (this as number).fontScaled();
  };
  /* eslint-enable no-extend-native */
}
initScaledSettings();

type ScaledTextProps = {
  style?: TextStyle;
  children?: ReactNode;
  allowFontScaling?: boolean;
  customFontScale?: number;
  ref?: React.Ref<Text>;
} & TextProps;
const _ScaledText = (props: ScaledTextProps, ref: React.Ref<Text>): ReactElement => {
  const { style, children, allowFontScaling, customFontScale } = props;

  let fontSize: number;
  if (Array.isArray(style)) {
    fontSize = StyleSheet.flatten(style)?.fontSize ?? _defaultFontSize;
  } else {
    fontSize = style?.fontSize ?? _defaultFontSize;
  }

  if (allowFontScaling !== false) {
    if (
      typeof customFontScale === 'number' &&
      ((customFontScale > 1 && _FONT_SCALE_ > 1) || (customFontScale < 1 && _FONT_SCALE_ < 1))
    ) {
      fontSize *= customFontScale;
    } else {
      fontSize *= _FONT_SCALE_;
    }
  }
  return (
    <Text ref={ref} allowFontScaling={false} {...props} style={[style, { fontSize }]}>
      {children}
    </Text>
  );
};

export const ScaledText = React.forwardRef<Text, ScaledTextProps>(_ScaledText);
