import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { useAppSelector } from '../../shared/store';
import {
  useGetDashboardOverviewQuery,
  useLazyGetCounsellorCallTokenQuery,
  useEndCounsellorCallMutation,
  useLazyGetCounsellorChatChannelQuery,
  useLazyGetCounsellorChatTokenQuery,
} from '../../shared/store/api/counsellorApi';
import JoinCallButton from '../../shared/videoCall/JoinCallButton';

export default function DashboardScreen({ navigation }: any) {
  const phone = useAppSelector((state) => state.auth.user?.phone) || '';
  const { data: dashboardData, isLoading } = useGetDashboardOverviewQuery(phone, { skip: !phone });
  const [fetchCallToken] = useLazyGetCounsellorCallTokenQuery();
  const [endCall] = useEndCounsellorCallMutation();
  const [fetchChatChannel] = useLazyGetCounsellorChatChannelQuery();
  const [fetchChatToken] = useLazyGetCounsellorChatTokenQuery();
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [messagingId, setMessagingId] = useState<string | null>(null);

  const stats = dashboardData?.stats || {
    totalSessions: 12,
    completedSessions: 8,
    upcomingSessions: 4,
    totalEarnings: '₹8,400',
    rating: 4.9,
    reviewCount: 38,
  };

  const upcomingBookings = dashboardData?.upcomingBookings || [];

  const handleJoinCall = async (bookingId: string) => {
    setJoiningId(bookingId);
    try {
      const result = await fetchCallToken(bookingId).unwrap();
      navigation.navigate('VideoCall', {
        bookingId,
        callToken: result,
        onCallEnd: () => endCall(bookingId),
      });
    } catch (err: any) {
      const reason = err?.data?.reason;
      const message =
        reason === 'expired'
          ? 'This call has already ended.'
          : err?.data?.message || 'Could not join the call. Please try again.';
      Alert.alert('Unable to join call', message);
    } finally {
      setJoiningId(null);
    }
  };

  const handleMessage = async (booking: any) => {
    setMessagingId(booking._id);
    try {
      const [channelResult, tokenResult] = await Promise.all([
        fetchChatChannel(booking._id).unwrap(),
        fetchChatToken().unwrap(),
      ]);
      navigation.navigate('ChatScreen', {
        channelId: channelResult.channelId,
        chatToken: tokenResult,
        otherUserName: booking.clientName,
      });
    } catch (err: any) {
      Alert.alert('Unable to open chat', err?.data?.message || 'Please try again.');
    } finally {
      setMessagingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Counsellor Dashboard</Text>
            <Text style={styles.subtitle}>Overview of your sessions & earnings</Text>
          </View>
          <TouchableOpacity style={styles.messagesButton} onPress={() => navigation.navigate('Messages')}>
            <Text style={styles.messagesButtonText}>Messages</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{stats.totalEarnings}</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statVal}>{stats.upcomingSessions}</Text>
            <Text style={styles.statLabel}>Upcoming Sessions</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statVal}>{stats.completedSessions}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statVal}>⭐ {stats.rating}</Text>
            <Text style={styles.statLabel}>{stats.reviewCount} Reviews</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 12 }} />
        ) : upcomingBookings.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming sessions.</Text>
        ) : (
          upcomingBookings.map((booking: any) => (
            <View key={booking._id} style={styles.bookingCard}>
              <View style={styles.bookingCardRow}>
                <Text style={styles.bookingClientName}>{booking.clientName}</Text>
                <View style={[styles.badge, booking.sessionType === 'Video' && styles.badgeVideo]}>
                  <Text style={styles.badgeText}>{booking.sessionType}</Text>
                </View>
              </View>
              <Text style={styles.bookingDateText}>
                {booking.dateText} · {booking.timeText}
              </Text>
              {booking.sessionType === 'Video' && booking.status === 'confirmed' && (
                <View style={{ marginTop: 10 }}>
                  <JoinCallButton
                    sessionType={booking.sessionType}
                    status={booking.status}
                    callStatus={booking.callStatus}
                    role="counsellor"
                    loading={joiningId === booking._id}
                    onPress={() => handleJoinCall(booking._id)}
                  />
                </View>
              )}
              {booking.status === 'confirmed' && (
                <TouchableOpacity
                  style={styles.messageBookingButton}
                  onPress={() => handleMessage(booking)}
                  disabled={messagingId === booking._id}
                >
                  <Text style={styles.messageBookingButtonText}>
                    {messagingId === booking._id ? 'Opening...' : 'Message'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
  },
  title: {
    color: colors.primary,
    fontFamily: fonts.serif.regular,
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E6DF',
  },
  statVal: {
    fontSize: 20,
    fontFamily: fonts.sans.bold,
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.sans.bold,
    color: colors.text,
    marginTop: 28,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E6DF',
    marginBottom: 12,
  },
  bookingCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bookingClientName: {
    fontSize: 15,
    fontFamily: fonts.sans.bold,
    color: colors.text,
  },
  bookingDateText: {
    fontSize: 13,
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#EEF0E8',
  },
  badgeVideo: {
    backgroundColor: '#DCEFEC',
  },
  badgeText: {
    fontFamily: fonts.sans.medium,
    fontSize: 11,
    color: colors.primary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  messagesButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E8E6DF',
  },
  messagesButtonText: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    color: colors.primary,
  },
  messageBookingButton: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  messageBookingButtonText: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    color: colors.primary,
  },
});
