import { Dimensions, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import React, { ReactElement, ReactNode } from 'react';

const window = Dimensions.get('window');
const minLength = Math.min(window.width, window.height);
let dimenRatio: number; /* 375 is our design screen width */
let dimenScale: number;
let fontScale: number;
export let _FONT_SCALE_: number;
let _defaultFontSize: number;

declare global {
  interface Number {
    dimenScaled: () => number;
    fontScaled: () => number;
  }
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Set initial configuration for scaled layout behavior
 * @param designSpecWidth your design width viewport width(zeplin, pigma etc...). If your design viewport is 375 x 1000 then 375 is a right value.
 * @param dimenScaleRange dimension scale factor minimum & maximum range. default is [0.5, 1.5]..
 * @param fontScaleRange font scale factor minimum & maximum range. default is [0.75, 1.3].
 * @param defaultFontsize default <Text> fontSize. default is 12.
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

  // eslint-disable-next-line no-extend-native
  Number.prototype.dimenScaled = function dimenScaled(): number {
    return Math.round((this as number) * dimenScale);
  };
  // eslint-disable-next-line no-extend-native
  Number.prototype.fontScaled = function fontScaled(): number {
    return Math.round((this as number) * fontScale);
  };
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
