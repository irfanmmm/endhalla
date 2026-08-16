import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  TextStyle,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  View,
} from 'react-native';
import { px } from '../utils/responsive';
import { colors, fonts } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

export interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  disabledStyle?: StyleProp<ViewStyle>;
  disabledTextStyle?: StyleProp<TextStyle>;
}

export default function CustomButton({
  title,
  variant = 'primary',
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabledStyle,
  disabledTextStyle,
  disabled,
  ...props
}: CustomButtonProps) {
  const isDisabled = disabled || loading;

  const getVariantContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.lightGreen || '#EBF0EB',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
        };
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary,
        };
    }
  };

  const getVariantTextStyle = (): TextStyle => {
    switch (variant) {
      case 'secondary':
      case 'outline':
      case 'text':
        return {
          color: colors.primary,
        };
      case 'primary':
      default:
        return {
          color: colors.white,
        };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.button,
        getVariantContainerStyle(),
        style,
        isDisabled && [styles.disabledButton, disabledStyle],
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary}
          size="small"
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              getVariantTextStyle(),
              textStyle,
              isDisabled && [styles.disabledText, disabledTextStyle],
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: px(56),
    borderRadius: px(16),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: px(16),
  },
  disabledButton: {
    backgroundColor: '#D1D1D6',
    borderColor: '#D1D1D6',
    opacity: 0.8,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconContainer: {
    marginRight: px(8),
  },
  rightIconContainer: {
    marginLeft: px(8),
  },
  text: {
    fontFamily: fonts.sans.bold,
    fontSize: px(16),
  },
  disabledText: {
    color: '#FFFFFF',
  },
});
