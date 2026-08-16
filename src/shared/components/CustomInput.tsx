import React, { forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors, fonts } from '../theme';
import { px, verticalScale } from '../utils/responsive';
import { sanitizePhone, sanitizeName } from '../utils/validation';

export type InputType = 'phone' | 'name' | 'number' | 'text';

export interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  inputType?: InputType;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  helperStyle?: StyleProp<TextStyle>;
}

const CustomInput = forwardRef<TextInput, CustomInputProps>(
  (
    {
      label,
      error,
      helperText,
      inputType = 'text',
      leftElement,
      rightElement,
      containerStyle,
      inputContainerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      helperStyle,
      style,
      placeholderTextColor = '#9D9D9D',
      onChangeText,
      maxLength,
      keyboardType,
      autoCapitalize,
      ...props
    },
    ref
  ) => {
    const handleChangeText = (text: string) => {
      if (!onChangeText) return;

      let sanitizedText = text;
      if (inputType === 'phone') {
        sanitizedText = sanitizePhone(text, maxLength || 10);
      } else if (inputType === 'name') {
        sanitizedText = sanitizeName(text, maxLength || 50);
      } else if (inputType === 'number') {
        sanitizedText = text.replace(/\D/g, '');
        if (maxLength) sanitizedText = sanitizedText.slice(0, maxLength);
      }

      onChangeText(sanitizedText);
    };

    const resolvedKeyboardType =
      keyboardType ||
      (inputType === 'phone' || inputType === 'number'
        ? 'phone-pad'
        : 'default');

    const resolvedAutoCapitalize =
      autoCapitalize || (inputType === 'name' ? 'words' : 'none');

    const resolvedMaxLength =
      maxLength || (inputType === 'phone' ? 10 : inputType === 'name' ? 30 : undefined);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

        <View
          style={[
            styles.inputContainer,
            error ? styles.inputError : null,
            inputContainerStyle,
          ]}
        >
          {leftElement}
          <TextInput
            ref={ref}
            style={[styles.input, inputStyle, style]}
            placeholderTextColor={placeholderTextColor}
            onChangeText={handleChangeText}
            keyboardType={resolvedKeyboardType}
            autoCapitalize={resolvedAutoCapitalize}
            maxLength={resolvedMaxLength}
            {...props}
          />
          {rightElement}
        </View>

        {error ? (
          <Text style={[styles.errorText, errorStyle]}>{error}</Text>
        ) : helperText ? (
          <Text style={[styles.helperText, helperStyle]}>{helperText}</Text>
        ) : null}
      </View>
    );
  }
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontFamily: fonts.sans.medium,
    fontSize: px(14),
    color: colors.text,
    marginBottom: verticalScale(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputLight,
    height: px(56),
    borderRadius: px(16),
    paddingHorizontal: px(16),
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.sans.regular,
    fontSize: px(16),
    color: '#1A1A1A',
    paddingVertical: 0,
  },
  helperText: {
    fontSize: px(13),
    color: colors.textSecondary,
    fontFamily: fonts.sans.regular,
    marginTop: verticalScale(8),
  },
  errorText: {
    fontSize: px(13),
    color: '#FF3B30',
    fontFamily: fonts.sans.regular,
    marginTop: verticalScale(8),
  },
});
