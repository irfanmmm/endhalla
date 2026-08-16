import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts, borderRadius } from '../../theme';
import CustomInput from '../../../shared/components/CustomInput';
import Header from '../../../shared/components/Header';
import SearchIcon from '../../../shared/assets/icons/search.svg';
import FilterIcon from '../../../shared/assets/icons/filter.svg';
import WaveformSVG from '../../../shared/assets/icons/waveform.svg';
import ClockIcon from '../../../shared/assets/icons/clock.svg';
import PlayIcon from '../../../shared/assets/icons/play.svg';
import StarIcon from '../../../shared/assets/icons/star.svg';

export default function SearchScreen({ navigation }: any) {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Anxiety', 'Relationships', 'Family', 'Trauma'];

  const counsellors = [
    { name: 'Aisha', initial: 'A', verified: true, exp: '5 yrs experience', langs: 'Malayalam, English', price: '₹1,000', rating: '4.9 (120 reviews)', next: 'Available today', tags: ['Anxiety', 'Relationships', 'Trauma'] },
    { name: 'Rima', initial: 'R', verified: true, exp: '2 yrs experience', langs: 'Malayalam, English', price: '₹800', rating: '4.6 (87 reviews)', next: 'Available today', tags: ['Family', 'Anxiety', 'Self-Esteem'] },
    { name: 'Mariam', initial: 'M', verified: true, exp: '9 yrs experience', langs: 'Malayalam, English, Arabic', price: '₹1,500', rating: '5.0 (200 reviews)', next: 'Next: Tomorrow', tags: ['Personal Growth', 'Depression'] },
    { name: 'Fidha', initial: 'F', verified: true, exp: '1 yrs experience', langs: 'Malayalam, English, Hindi', price: '₹600', rating: '4.4 (54 reviews)', next: 'Available today', tags: ['Loneliness', 'Mindfulness', 'Stress'] },
    { name: 'Sanjay', initial: 'S', verified: true, exp: '4 yrs experience', langs: 'Malayalam, English', price: '₹1,200', rating: '4.8 (102 reviews)', next: 'Next: Tomorrow', tags: ['ADHD', 'Career', 'Stress'] },
    { name: 'Nora', initial: 'N', verified: true, exp: '3 yrs experience', langs: 'Malayalam, English, French', price: '₹900', rating: '4.7 (110 reviews)', next: 'Available today', tags: ['Trauma', 'Grief'] }
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header Section (Fixed at top) */}
        <View style={styles.header}>
          <Header
            title="Find a Counsellor"
            onBackPress={() => navigation.goBack()}
          />

          <View style={styles.searchRow}>
            <CustomInput
              containerStyle={{ flex: 1 }}
              inputContainerStyle={styles.searchInputContainer}
              inputStyle={styles.searchInput}
              placeholder="Search by expertise, name..."
              placeholderTextColor="#9D9D9D"
              leftElement={<SearchIcon width={px(20)} height={px(20)} stroke="#9D9D9D" />}
            />
            <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
              <FilterIcon width={px(18)} height={px(18)} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                activeOpacity={0.8}
                onPress={() => setSelectedFilter(filter)}
                style={[styles.filterPill, selectedFilter === filter ? styles.filterPillActive : null]}
              >
                <Text style={[styles.filterText, selectedFilter === filter ? styles.filterTextActive : null]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* List of Counsellors */}
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
          {counsellors.map((counsellor, idx) => (
            <View key={idx} style={styles.counsellorCard}>
              {/* Card Top */}
              <View style={styles.ccTop}>
                <View style={styles.ccAvatar}><Text style={styles.ccInitial}>{counsellor.initial}</Text></View>
                <View style={styles.ccInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.ccName}>{counsellor.name}</Text>
                    {counsellor.verified ? (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓ Verified</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.ccSubtext}>{`${counsellor.exp} • ${counsellor.langs}`}</Text>
                  <View style={styles.ratingRow}>
                    <StarIcon width={px(12)} height={px(12)} />
                    <Text style={styles.ratingText}>{counsellor.rating}</Text>
                  </View>
                </View>
                <View style={styles.ccRight}>
                  <Text style={styles.ccPrice}>{counsellor.price}</Text>
                  <Text style={styles.ccPriceSub}>per session</Text>
                </View>
              </View>

              {/* Audio Player */}
              <View style={styles.audioPlayer}>
                <TouchableOpacity style={styles.playBtn} activeOpacity={0.8}>
                  <PlayIcon width={px(12)} height={px(12)} fill="#FFFFFF" stroke="#FFFFFF" />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <WaveformSVG width={px(140)} height={px(16)} stroke={colors.primary} />
                </View>
                <Text style={styles.audioTime}>0:42</Text>
              </View>

              {/* Bottom Section (Tags + Next availability) */}
              <View style={styles.ccBottom}>
                <View style={styles.tagsRow}>
                  {counsellor.tags.map((t, i) => (
                    <View key={i} style={styles.tagPill}><Text style={styles.tagText}>{t}</Text></View>
                  ))}
                </View>
                <View style={styles.nextInfoRow}>
                  <View style={styles.nextInfo}>
                    <ClockIcon width={px(12)} height={px(12)} />
                    <Text style={[styles.nextText, counsellor.next.includes('today') ? { color: colors.primary } : null]}>
                      {counsellor.next.startsWith('Next:') ? counsellor.next : `Next: ${counsellor.next}`}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Button */}
              <TouchableOpacity style={styles.profileBtn} activeOpacity={0.8} onPress={() => navigation.navigate('BookSession', { counsellor })}>
                <Text style={styles.profileBtnText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={{ height: 24 }} />
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
  header: {
    paddingHorizontal: px(20),
    paddingTop: px(16),
    paddingBottom: px(8),
    backgroundColor: colors.background,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: px(16),
    gap: px(12),
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: px(16),
    paddingHorizontal: px(16),
    height: px(48),
  },
  searchInput: {
    flex: 1,
    marginLeft: px(8),
    fontSize: px(14),
    fontFamily: fonts.sans.regular,
    color: colors.black,
  },
  filterBtn: {
    width: px(48),
    height: px(48),
    borderRadius: px(16),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterScroll: {
    paddingBottom: px(8),
  },
  filterPill: {
    paddingHorizontal: px(16),
    paddingVertical: px(8),
    borderRadius: px(16),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: px(8),
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: px(12),
    fontFamily: fonts.sans.medium,
    color: colors.black,
  },
  filterTextActive: {
    color: colors.white,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: px(20),
    paddingTop: px(8),
  },
  counsellorCard: {
    backgroundColor: colors.white,
    borderRadius: px(20),
    padding: px(16),
    marginBottom: px(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  ccTop: {
    flexDirection: 'row',
    marginBottom: px(16),
  },
  ccAvatar: {
    width: px(48),
    height: px(48),
    borderRadius: px(16),
    backgroundColor: '#EEF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: px(12),
  },
  ccInitial: {
    fontSize: px(20),
    fontFamily: fonts.sans.medium,
    color: colors.primary,
  },
  ccInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  ccName: {
    fontSize: px(16),
    fontFamily: fonts.sans.medium,
    color: colors.black,
    marginRight: px(8),
  },
  verifiedBadge: {
    backgroundColor: '#EEF5F0',
    paddingHorizontal: px(6),
    paddingVertical: px(2),
    borderRadius: px(10),
  },
  verifiedText: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.primary,
  },
  ccSubtext: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
    marginTop: px(4),
  },
  ccRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  ccPrice: {
    fontSize: px(12),
    fontFamily: fonts.sans.medium,
    color: colors.black,
  },
  ccPriceSub: {
    fontSize: px(10),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
    marginTop: px(2),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(4),
    marginTop: px(4),
  },
  ratingText: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: px(16),
    padding: px(8),
    marginBottom: px(16),
  },
  playBtn: {
    width: px(32),
    height: px(32),
    borderRadius: px(16),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTime: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
    marginRight: px(8),
  },
  ccBottom: {
    flexDirection: 'column',
    gap: px(10),
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: px(8),
  },
  tagPill: {
    backgroundColor: '#F0EDE7',
    paddingHorizontal: px(12),
    paddingVertical: px(6),
    borderRadius: px(12),
  },
  tagText: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  nextInfoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  nextInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(4),
  },
  nextText: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  profileBtn: {
    backgroundColor: colors.primary,
    height: px(48),
    borderRadius: borderRadius.container,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: px(12),
  },
  profileBtnText: {
    color: colors.white,
    fontSize: px(14),
    fontFamily: fonts.sans.bold,
  },
});
