import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { useGetDashboardOverviewQuery } from '../../shared/store/api/counsellorApi';

export default function DashboardScreen() {
  // Uses RTK Query to fetch counsellor dashboard analytics
  const phone = '+919876543210'; // Default counsellor test phone
  const { data: dashboardData, isLoading } = useGetDashboardOverviewQuery(phone);

  const stats = dashboardData?.stats || {
    totalSessions: 12,
    completedSessions: 8,
    upcomingSessions: 4,
    totalEarnings: '₹8,400',
    rating: 4.9,
    reviewCount: 38,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Counsellor Dashboard</Text>
        <Text style={styles.subtitle}>Overview of your sessions & earnings</Text>

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
});
