import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts } from '../../theme';
import ArrowLeftIcon from '../../../shared/assets/icons/back-icon.svg';
import ProgressBar from '../../../shared/components/ProgressBar';
import CustomButton from '../../../shared/components/CustomButton';
import Svg, { Path, Polyline, Line, Circle } from 'react-native-svg';

// Custom Icons
const ShieldBadgeIcon = () => (
  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></Path>
    </Svg>
  </View>
);

const CheckCircleIcon = () => (
  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></Path>
      <Polyline points="22 4 12 14.01 9 11.01"></Polyline>
    </Svg>
  </View>
);

const UploadCircleIcon = () => (
  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A7870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></Path>
      <Polyline points="17 8 12 3 7 8"></Polyline>
      <Line x1="12" y1="3" x2="12" y2="15"></Line>
    </Svg>
  </View>
);

export default function CertificatesScreen({ navigation }: any) {
  // Simulating uploaded files state
  const [uploaded, setUploaded] = useState<{ [key: string]: boolean }>({});

  const docs = [
    { id: 'degree', label: 'Counselling /\nPsychology Degree' },
    { id: 'training', label: 'Clinical Training\nCertificate' },
    { id: 'specialisation', label: 'Specialisation Certificate' },
    { id: 'membership', label: 'Membership / Registration' },
  ];

  const handleUpload = (id: string) => {
    // Simulate upload
    setUploaded({ ...uploaded, [id]: true });
  };

  const isAtLeastOneUploaded = Object.keys(uploaded).length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <ProgressBar progress={0.9} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeftIcon width={px(22)} height={px(22)} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.bannerContainer}>
            <ShieldBadgeIcon />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Get a Verified badge ✓</Text>
              <Text style={styles.bannerDesc}>Verified counsellors get 3× more client{'\n'}matches.</Text>
            </View>
          </View>

          <Text style={styles.title}>Upload certificates</Text>
          <Text style={styles.subtitle}>Upload at least one certificate. Our team reviews within 24–48 hrs.</Text>

          <View style={styles.docsContainer}>
            {docs.map((doc) => {
              const isDone = uploaded[doc.id];
              return (
                <TouchableOpacity
                  key={doc.id}
                  style={[styles.uploadBox, isDone && styles.uploadBoxDone]}
                  onPress={() => handleUpload(doc.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.docLeft}>
                    {isDone ? <CheckCircleIcon /> : <UploadCircleIcon />}
                    <Text style={[styles.docLabel, isDone && styles.docLabelDone]}>{doc.label}</Text>
                  </View>
                  {isDone && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.uploadedStatusText}>Uploaded</Text>
                      <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                        <Polyline points="20 6 9 17 4 12"></Polyline>
                      </Svg>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.formatsText}>Accepted formats: PDF, JPG, PNG · Max 5 MB per file</Text>
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton 
            title="Submit for verification" 
            onPress={() => navigation.navigate('Success')} 
            style={{ backgroundColor: isAtLeastOneUploaded ? colors.primary : '#D1D1D6' }}
            disabled={!isAtLeastOneUploaded}
          />
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Success')}>
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A7870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <Circle cx="12" cy="12" r="10"></Circle>
              <Polyline points="12 6 12 12 16 14"></Polyline>
            </Svg>
            <Text style={styles.secondaryButtonText}>Do this later from Profile</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: px(24),
    paddingTop: px(12),
  },
  backButton: {
    width: px(38),
    height: px(38),
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: px(16),
  },
  content: {
    flex: 1,
    paddingHorizontal: px(24),
  },
  title: {
    fontSize: px(24),
    fontFamily: fonts.sans.bold,
    color: '#1A1A1A',
    marginBottom: px(8),
  },
  subtitle: {
    fontSize: px(14),
    color: colors.textSecondary,
    marginBottom: px(32),
    fontFamily: fonts.sans.regular,
  },
  docsContainer: {
    gap: px(16),
  },
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    borderRadius: px(16),
    padding: px(16),
    minHeight: px(76),
  },
  uploadBoxDone: {
    borderColor: colors.primary,
    backgroundColor: '#EEF0FF',
  },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  docLabel: {
    fontSize: px(14),
    fontFamily: fonts.sans.medium,
    color: '#1A1A1A',
    marginLeft: px(16),
    flex: 1,
  },
  docLabelDone: {
    color: colors.primary,
  },
  uploadedStatusText: {
    fontSize: px(12),
    fontFamily: fonts.sans.medium,
    color: colors.primary,
  },
  formatsText: {
    marginTop: px(24),
    marginBottom: px(16),
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
    textAlign: 'left',
  },
  footer: {
    paddingHorizontal: px(24),
    paddingBottom: px(24),
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    height: px(56),
    borderRadius: px(16),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: px(16),
  },
  secondaryButtonText: {
    fontSize: px(16),
    fontFamily: fonts.sans.medium,
    color: colors.textSecondary,
  },
  bannerContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F5FF',
    borderRadius: px(16),
    padding: px(20),
    marginBottom: px(32),
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: px(16),
  },
  bannerTitle: {
    fontSize: px(16),
    fontFamily: fonts.sans.bold,
    color: colors.primary,
    marginBottom: px(6),
  },
  bannerDesc: {
    fontSize: px(14),
    fontFamily: fonts.sans.regular,
    color: '#7B84F6', // Perfect lighter primary match
    lineHeight: px(20),
  }
});
