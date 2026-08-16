import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on a standard ~5" screen mobile device (e.g., iPhone 11/X)
// You can adjust these base dimensions according to the design file you are using.
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Use horizontalScale for width, paddingHorizontal, marginHorizontal, etc.
export const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;

// Use verticalScale for height, paddingVertical, marginVertical, etc.
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

// Use moderateScale for fonts or elements you don't want to scale as dramatically
export const moderateScale = (size: number, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

/**
 * Shorthand for horizontalScale. Good for general width, padding, margins, etc.
 */
export const px = (size: number) => horizontalScale(size);
