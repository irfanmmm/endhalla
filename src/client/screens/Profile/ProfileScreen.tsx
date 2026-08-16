import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts, borderRadius } from '../../theme';
import Header from '../../../shared/components/Header';
import { useAppDispatch, useAppSelector } from '../../../shared/store';
import { logoutUser } from '../../../shared/store/authSlice';
import ProfileIcon from '../../../shared/assets/icons/profile.svg';

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const bookings = useAppSelector((state) => state.booking.confirmedBookings);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser());
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={styles.headerPadding}>
          <Header title="Profile" showBack={false} />
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
          {/* User Card */}
          <View style={styles.userCard}>
            <View style={styles.avatarCircle}>
              <ProfileIcon width={px(28)} height={px(28)} stroke={colors.primary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Aisha Khan'}</Text>
              <Text style={styles.userPhone}>{user?.phone || '+91 98765 43210'}</Text>
            </View>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>Client</Text>
            </View>
          </View>

          {/* Booked Sessions Summary */}
          {bookings.length > 0 ? (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionHeaderTitle}>Recent Bookings ({bookings.length})</Text>
              {bookings.slice(0, 3).map((item) => (
                <View key={item.id} style={styles.bookingItem}>
                  <View style={styles.bookingLeft}>
                    <Text style={styles.bookingTitle}>{item.sessionType} with {item.counsellorName}</Text>
                    <Text style={styles.bookingTime}>{item.dateText} · {item.timeText}</Text>
                  </View>
                  <Text style={styles.bookingPrice}>{item.price}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Settings Options */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeaderTitle}>Account Settings</Text>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Personal Information</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Privacy & Security</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Notification Preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Help & Support</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <View style={{ height: px(40) }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerPadding: {
    paddingHorizontal: px(20),
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: px(20),
    paddingTop: px(8),
  },
  userCard: {
    backgroundColor: colors.white,
    borderRadius: px(20),
    padding: px(16),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: px(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarCircle: {
    width: px(52),
    height: px(52),
    borderRadius: px(26),
    backgroundColor: '#EEF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: px(14),
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: px(16),
    fontFamily: fonts.sans.bold,
    color: colors.black,
    marginBottom: px(2),
  },
  userPhone: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  badgePill: {
    backgroundColor: '#EEF5F0',
    paddingHorizontal: px(10),
    paddingVertical: px(4),
    borderRadius: px(12),
  },
  badgeText: {
    fontSize: px(11),
    fontFamily: fonts.sans.medium,
    color: colors.primary,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: px(20),
    padding: px(16),
    marginBottom: px(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeaderTitle: {
    fontSize: px(14),
    fontFamily: fonts.sans.bold,
    color: colors.black,
    marginBottom: px(12),
  },
  bookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: px(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bookingLeft: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: px(13),
    fontFamily: fonts.sans.medium,
    color: colors.black,
  },
  bookingTime: {
    fontSize: px(11),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
    marginTop: px(2),
  },
  bookingPrice: {
    fontSize: px(13),
    fontFamily: fonts.sans.bold,
    color: colors.primary,
  },
  menuItem: {
    paddingVertical: px(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuText: {
    fontSize: px(13),
    fontFamily: fonts.sans.regular,
    color: colors.black,
  },
  logoutBtn: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFD6D6',
    borderRadius: borderRadius.container,
    height: px(48),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: px(8),
  },
  logoutText: {
    fontSize: px(14),
    fontFamily: fonts.sans.bold,
    color: '#D32F2F',
  },
});
