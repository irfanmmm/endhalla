import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { px } from '../utils/responsive';
import { colors, fonts } from '../theme';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
}

export default function OTPInput({ length = 6, value, onChange, hasError = false }: OTPInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const codeArray = Array.from({ length }, (_, i) => value[i] || '');

  const handleChangeText = (text: string, index: number) => {
    const newCodeArray = [...codeArray];
    newCodeArray[index] = text;
    onChange(newCodeArray.join(''));

    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !codeArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();

      const newCodeArray = [...codeArray];
      newCodeArray[index - 1] = '';
      onChange(newCodeArray.join(''));
    }
  };

  return (
    <View style={styles.otpContainer}>
      {codeArray.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => { inputRefs.current[index] = ref; }}
          style={[
            styles.otpInput,
            (digit || focusedIndex === index) ? styles.otpInputFilled : null,
            hasError ? styles.otpInputError : null,
          ]}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: px(20),
  },
  otpInput: {
    width: px(46),
    height: px(56),
    backgroundColor: colors.inputLight,
    borderRadius: px(16),
    textAlign: 'center',
    fontSize: px(20),
    fontFamily: fonts.sans.bold,
    color: colors.text,
    borderWidth: px(2),
    borderColor: 'transparent',
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.lightGreen,
  },
  otpInputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
});
