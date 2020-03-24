# react-native-scaled-layout
![npm](https://img.shields.io/npm/v/react-native-scaled-layout)

## [Detail Article's Link 🔗](https://medium.com/mj-studio/stop-hesitate-to-support-the-ipad-in-react-native-1040edc318cd)

### Flexible, Scalable layout dimensions, font sizes for React Native

<img src=https://github.com/mym0404/react-native-scaled-layout/blob/master/react-native-scaled-layout.jpg width=100%>

`react-native-scaled-layout` is using monkey-patch feature in javascript(typescript) and augmentation syntax in typescript.

## Install

```
npm i react-native-scaled-layout
```

## Usage

### 0. Configure your environment or wanted behavior(Optional)

_`index.js`_
```ts
import { initScaledSettings } from 'react-native-scaled-layout';
...
initScaledSettings(375, { min: 0.5, max: 1.5 }, { min: 0.75, max: 1.35 }, 14);
```
| Params              |  Type   | Default | Required |
| ------------------- |---------|---------|----------|
| designSpecWidth     | number  | 375     | false    |
| dimenScaleRange     | `{ min: number; max: number }` | [0.5, 1.5] | false |
| fontScaleRange      | `{ min: number; max: number }` | [0.75, 1.3] | false |
| defaultFontSize     | number | 14 | false |

### 1. Number type Augmentation(Extension)

```ts
(36).dimenScaled()
(24).fontScaled()
```

Example in `ViewStyle`

```tsx
style={{
    height: (210).dimenScaled() + safeAreaBottom,
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
  include-font-padding: false;
  font-family: ${fonts.NotoSansKRBold};
  color: ${({ theme }): string => theme.text};
`;
...
const TutorialText = styled(BoldText)`
  left: ${(20).dimenScaled()}px;
  right: ${(20).dimenScaled()}px;
  position: absolute;
  font-size: 24px;
  color: ${({ theme }): string => theme.white};
`;
```

## Calculation

The following is the implementation of `initScaledSettings`

```ts
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
    return (this as number) * dimenScale;
  };
  // eslint-disable-next-line no-extend-native
  Number.prototype.fontScaled = function fontScaled(): number {
    return (this as number) * fontScale;
  };
}
```

### feel free your fork or any PR! Thanks
