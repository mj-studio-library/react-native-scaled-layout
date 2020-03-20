import { Dimensions, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import React, { ReactElement, ReactNode } from 'react';

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

const window = Dimensions.get('window');
const minLength = Math.min(window.width, window.height);
let dimenRatio: number; /* 375 is our design screen width */
let dimenScale: number;
let fontScale: number;
export let _FONT_SCALE_: number;
let _defaultFontSize: number;

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
}
initScaledSettings();

declare global {
  interface Number {
    dimenScaled: () => number;
    fontScaled: () => number;
  }
}
// eslint-disable-next-line no-extend-native
Number.prototype.dimenScaled = function dimenScaled(): number {
  return (this as number) * dimenScale;
};
// eslint-disable-next-line no-extend-native
Number.prototype.fontScaled = function fontScaled(): number {
  return (this as number) * fontScale;
};

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
