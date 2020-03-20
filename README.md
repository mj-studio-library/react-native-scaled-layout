# react-native-scaled-layout

### Flexible, Scalable layout dimensions, font sizes for React Native

<img src=https://github.com/mym0404/react-native-scaled-layout/blob/master/react-native-scaled-layout.jpg width=100%>

## Install

```
npm i react-native-scaled-layout
```

## Usage

### 1. Number type Augmentation(Extension)

```ts
(36).dimenScaled()
(24).fontScaled()
```

### 2. ScaledText Component

```tsx
<ScaledText customFontScale={isTablet ? 2 : undefined}>My Text</ScaledText>
```
