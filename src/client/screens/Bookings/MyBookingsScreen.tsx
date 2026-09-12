import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts } from '../../theme';
import { useAppSelector } from '../../../shared/store';
import { useGetClientBookingsQuery } from '../../../shared/store/api/clientApi';

export default function MyBookingsScreen({ navigation }: any) {
  const phone = useAppSelector((state) => state.auth.user?.phone);
  const { data, isLoading, refetch, isFetching } = useGetClientBookingsQuery(phone || '', {
    skip: !phone,
  });

  const bookings = data?.data || [];

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Text style={styles.title}>My Bookings</Text>

        {isLoading ? (
          <ActivityIndicator style={{ marginTop: px(40) }} color={colors.primary} />
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            refreshing={isFetching}
            onRefresh={refetch}
            ListEmptyComponent={
              <Text style={styles.emptyText}>You don't have any bookings yet.</Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('BookingDetail', { bookingId: item._id })}
              >
                <View style={styles.cardRow}>
                  <Text style={styles.counsellorName}>{item.counsellorName}</Text>
                  <View style={[styles.badge, item.sessionType === 'Video' && styles.badgeVideo]}>
                    <Text style={styles.badgeText}>{item.sessionType}</Text>
                  </View>
                </View>
                <Text style={styles.dateText}>{item.dateText} · {item.timeText}</Text>
                <Text style={styles.statusText}>{item.status}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: px(24),
    fontFamily: fonts.sans.bold,
    color: colors.black,
    paddingHorizontal: px(20),
    marginTop: px(8),
    marginBottom: px(12),
  },
  list: {
    paddingHorizontal: px(20),
    paddingBottom: px(30),
  },
  emptyText: {
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: px(40),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: px(16),
    borderWidth: 1,
    borderColor: colors.border,
    padding: px(16),
    marginBottom: px(12),
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(6),
  },
  counsellorName: {
    fontFamily: fonts.sans.bold,
    fontSize: px(16),
    color: colors.black,
  },
  badge: {
    paddingHorizontal: px(10),
    paddingVertical: px(4),
    borderRadius: px(20),
    backgroundColor: colors.lightGreen,
  },
  badgeVideo: {
    backgroundColor: '#DCEFEC',
  },
  badgeText: {
    fontFamily: fonts.sans.medium,
    fontSize: px(11),
    color: colors.primary,
  },
  dateText: {
    fontFamily: fonts.sans.regular,
    fontSize: px(13),
    color: colors.textSecondary,
    marginBottom: px(4),
  },
  statusText: {
    fontFamily: fonts.sans.medium,
    fontSize: px(12),
    color: colors.muted,
    textTransform: 'capitalize',
  },
});
