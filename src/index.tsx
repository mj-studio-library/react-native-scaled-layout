import { Dimensions, StyleSheet, Text } from 'react-native';
import React, { ReactElement } from 'react';

declare global {
  interface Math {
    clamp: (value: number, min: number, max: number) => number;
  }
}

Math.clamp = (value: number, min: number, max: number): number => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const window = Dimensions.get('window');
const minLength = Math.min(window.width, window.height);
const dimenRatio = minLength / 375; /* 375 is our design screen width */
// 0.5 ~ 1.5
const dimenScale = Math.clamp(dimenRatio, 0.5, 1.5);
// 0.75 ~ 1.3
const fontScale = dimenScale >= 1 ? Math.min(dimenScale, 1.3) : Math.max(dimenScale * dimenScale, 0.75);
export const _FONT_SCALE_ = fontScale;

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
const defaultFontSize = 12;

const _ScaledText = (props, ref): ReactElement => {
  const { style, children, allowFontScaling, customFontScale } = props;

  let fontSize: number;
  if (Array.isArray(style)) {
    fontSize = StyleSheet.flatten(style)?.fontSize ?? defaultFontSize;
  } else {
    fontSize = style?.fontSize ?? defaultFontSize;
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

export const ScaledText = React.forwardRef(_ScaledText);
