# react-native-scaled-layout
![npm](https://img.shields.io/npm/v/react-native-scaled-layout)

### Sorry to Api changes in 1.1.0 😢 

## [Detail Article's Link 🔗](https://medium.com/mj-studio/stop-hesitate-to-support-the-ipad-in-react-native-1040edc318cd)

### Flexible, Scalable layout dimensions, font sizes for React Native

<img src=https://github.com/mym0404/react-native-scaled-layout/blob/master/react-native-scaled-layout.jpg width=100%>

`react-native-scaled-layout` is using monkey-patch feature in javascript(typescript) and augmentation syntax in typescript.

## Install 💠 

```
npm i react-native-scaled-layout
```

## Usage 📌 

### 0. Configure your environment or wanted behavior(Optional)

_`index.js`_
```ts
import { initScaledSettings } from 'react-native-scaled-layout';
...
initScaledSettings(375, 875, { min: 0.5, max: 1.5 }, { min: 0.75, max: 1.35 }, 14);
```
| Params              |  Type   | Default | Required |
| ------------------- |---------|---------|----------|
| designSpecWidth     | number  | 375     | false    |
| designSpecHeight    | number  | 875     | false    |
| dimenScaleRange     | `{ min: number; max: number }` | [0.5, 1.5] | false |
| fontScaleRange      | `{ min: number; max: number }` | [0.75, 1.3] | false |
| defaultFontSize     | number | 14 | false |

### 1. Number type Augmentation(Extension)

```ts
// calculated with width, height of design spec
// using diagonal length(Pythagoras theorem)
// clamped with dimenScaleRange min, max value
(36).scaled() /* or */ (36).d() 

// calculated with width length of design spec
// clamped with dimenScaleRange min, max value
(36).widthScaled() /* or */ (36).w()

// calculated with height length of design spec
// clamped with dimenScaleRange min, max value
(36).heightScaled() /* or */ (36).h()

// calculated with width, height of design spec
// using diagonal length(Pythagoras theorem)
// clamped with fontScaleRange min, max value
(24).fontScaled() /* or */ (24).f()
```

Example in `ViewStyle`

```tsx
style={{
    height: (210).d() + safeAreaBottom,
    justifyContent: 'center',
    paddingHorizontal: theme.sidePadding,
    paddingBottom: safeAreaBottom + 24,
}}
```

### 2. ScaledText Component

```tsx
<ScaledText customFontScale={isTablet ? 2 : undefined}>My Text</ScaledText>
```

`react-native-scaled-layout` is also compatible with [Styled Component](https://styled-components.com/)

```tsx
export const BoldText = styled(ScaledText)`
  font-family: ${fonts.NotoSansKRBold};
`;
...
const TutorialText = styled(BoldText)`
  left: ${(20).d()}px;
  right: ${(20).d()}px;
  position: absolute;
  font-size: 24px; // automatically adjust font size with (24).fontScaled()
  color: ${({ theme }): string => theme.white};
`;
```

## Calculation 📐 

The following is the implementation of `initScaledSettings`

```ts
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
```

## Todo ✅ 

* Create `ScaledView`, `ScaledTextInput`, `ScaledTouchableXXX` like `ScaledText`

## Change Log 🔧  

* 1.1.0 (Sorry to API changes)
    - `dimenScaled()` is renamed to `scaled()`
    - New `number` type augmentation `dimenWidthScaled()`, `dimenHeightScaled()`
    - Add simple alias for functions `d()`, `f()`, `w()`, `h()`
* 1.0.6
    - Apply round for fixing showing weird line because of floating number dimension

### feel free your fork or any PR! Thanks
