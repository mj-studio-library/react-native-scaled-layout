import { Dimensions, StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import React, { ReactElement, ReactNode } from 'react';

const window = Dimensions.get('window');
const minLength = Math.min(window.width, window.height);
let dimenRatio: number;
let dimenScale: number;
let fontScale: number;
export let _FONT_SCALE_: number;
let _defaultFontSize: number;

declare global {
  interface Number {
    scaled: () => number;
    fontScaled: () => number;
    d: () => number;
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
  dimenScaleRange: { min: number; max: number } = { min: 0.5, max: 1.5 },
  fontScaleRange: { min: number; max: number } = { min: 0.75, max: 1.3 },
  defaultFontsize = 12,
): void {
  dimenRatio = minLength / designSpecWidth;

  dimenScale = clamp(dimenRatio, dimenScaleRange.min, dimenScaleRange.max);

  fontScale =
    dimenScale >= 1 ? Math.min(dimenScale, fontScaleRange.max) : Math.max(dimenScale * dimenScale, fontScaleRange.min);
  _FONT_SCALE_ = fontScale;
  _defaultFontSize = defaultFontsize;

  /* eslint-disable no-extend-native */
  Number.prototype.scaled = function scaled(): number {
    return Math.ceil((this as number) * dimenScale);
  };
  Number.prototype.fontScaled = function fontScaled(): number {
    return Math.ceil((this as number) * fontScale);
  };
  Number.prototype.d = function d(): number {
    return (this as number).scaled();
  };
  Number.prototype.f = function f(): number {
    return (this as number).fontScaled();
  };
  /* eslint-enable no-extend-native */
}
initScaledSettings();

type ScaledTextProps = {
  style?: StyleProp<TextStyle>;
  children?: ReactNode;
  allowFontScaling?: boolean;
  customFontScale?: number;
  minimumFontSize?: number;
} & TextProps;
export const ScaledText = React.forwardRef(
  (props: ScaledTextProps, ref: React.Ref<Text>): ReactElement => {
    const { style, children, allowFontScaling, customFontScale, minimumFontSize, ...rest } = props;

    let fontSize = StyleSheet.flatten(style)?.fontSize ?? _defaultFontSize;

    if (allowFontScaling !== false) {
      if (typeof customFontScale === 'number' && customFontScale > 0) {
        fontSize = Math.ceil(fontSize * customFontScale);
      }
      fontSize = Math.ceil(fontSize * _FONT_SCALE_);
    }

    if (minimumFontSize) {
      fontSize = Math.ceil(Math.max(minimumFontSize, fontSize));
    }

    return (
      <Text ref={ref} allowFontScaling={false} style={StyleSheet.flatten([style, { fontSize }])} {...rest}>
        {children}
      </Text>
    );
  },
);

ScaledText.displayName = 'ScaledText';
