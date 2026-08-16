import { px } from '../shared/utils/responsive';

export const fonts = {
  sans: {
    regular: 'DMSans-Regular',
    medium: 'DMSans-Medium',
    semiBold: 'DMSans-SemiBold',
    bold: 'DMSans-Bold',
    italic: 'DMSans-Italic',
    boldItalic: 'DMSans-BoldItalic',
  },
  serif: {
    regular: 'DMSerifDisplay-Regular',
    italic: 'DMSerifDisplay-Italic',
  },
};

export const colors = {
  background: '#F9F8F5',
  primary: '#5865F2', // Blue theme for counsellor
  text: '#1C1C1E',
  black: '#1A1A1A',
  pureBlack: '#000000',
  textSecondary: '#7A7870',
  muted: '#7A7870',
  white: '#FFFFFF',
  inputBg: '#F4F4F4',
  inputLight: '#F0EDE7',
  lightGreen: '#EBF2FA',
  border: '#E5E2DB',
  borderColor: '#E5E2DB',
};

export const borderRadius = {
  sm: px(8),
  md: px(12),
  card: px(16),
  container: px(16),
  lg: px(16),
  xl: px(20),
  full: 9999,
};

export const radii = borderRadius;
