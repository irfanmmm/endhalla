import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts } from '../../theme';
import WhiteArrowIcon from '../../../shared/assets/icons/whiteArrow.svg';
import BellIcon from '../../../shared/assets/icons/bell.svg';
import SearchIcon from '../../../shared/assets/icons/search.svg';
import BookIcon from '../../../shared/assets/icons/book.svg';
import WaveformSVG from '../../../shared/assets/icons/waveform.svg';
import ClockIcon from '../../../shared/assets/icons/clock.svg';
import HomeIcon from '../../../shared/assets/icons/home.svg';
import ChatIcon from '../../../shared/assets/icons/chat.svg';
import ProfileIcon from '../../../shared/assets/icons/profile.svg';
import PlayIcon from '../../../shared/assets/icons/play.svg';
import StarIcon from '../../../shared/assets/icons/star.svg';
import { useAppSelector } from '../../../shared/store';

export default function HomeScreen({ navigation }: any) {
  const user = useAppSelector((state) => state.auth.user);
  const userName = user?.name || 'Sara';

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greetingText}>Good evening</Text>
              <Text style={styles.nameText}>{userName} 👋</Text>
            </View>
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
              <BellIcon width={px(20)} height={px(20)} />
            </TouchableOpacity>
          </View>

          {/* Upcoming Session */}
          <View style={styles.upcomingCard}>
            <Text style={styles.upcomingLabel}>Upcoming session</Text>
            <Text style={styles.upcomingTitle}>Voice call with Aisha</Text>
            <Text style={styles.upcomingTime}>Tomorrow, 9:00 AM · 40 min</Text>
            <TouchableOpacity style={styles.viewDetailsContainer} activeOpacity={0.8}>
              <View style={styles.viewDetailsBtn}>
                <Text style={styles.viewDetailsText}>View Details</Text>
              </View>
              <WhiteArrowIcon width={px(7)} height={px(12)} />
            </TouchableOpacity>
          </View>

          {/* Daily Reflection */}
          <View style={styles.reflectionCard}>
            <Text style={styles.sectionSmallTitle}>Daily reflection</Text>
            <Text style={styles.reflectionQuestion}>How are you feeling today?</Text>
            <View style={styles.emojiRow}>
              {[
                { icon: '😔', label: 'Low' },
                { icon: '😐', label: 'Okay' },
                { icon: '🙂', label: 'Good' },
                { icon: '😊', label: 'Great' },
                { icon: '😌', label: 'Calm' },
              ].map((item, idx) => (
                <TouchableOpacity key={idx} style={styles.emojiPill} activeOpacity={0.7}>
                  <Text style={styles.emojiChar}>{item.icon}</Text>
                  <Text style={styles.emojiLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Support */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick support</Text>
          </View>
          <View style={styles.quickSupportRow}>
            <TouchableOpacity
              style={styles.qsCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Search')}
            >
              <SearchIcon width={px(24)} height={px(24)} stroke={colors.primary} />
              <View style={styles.qsTexts}>
                <Text style={styles.qsTitle}>Find a Counsellor</Text>
                <Text style={styles.qsSub}>Browse by expertise</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.qsCard} activeOpacity={0.8}>
              <BookIcon width={px(24)} height={px(24)} stroke={colors.primary} />
              <View style={styles.qsTexts}>
                <Text style={styles.qsTitle}>Mood Journal</Text>
                <Text style={styles.qsSub}>3 entries this week</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Suggested For You */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Suggested for you</Text>
            <TouchableOpacity activeOpacity={0.7}><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
          </View>

          {/* Render Counsellors */}
          {[
            { name: 'Mariam', initial: 'M', exp: '9 yrs · Malayalam', price: '₹1,000', rating: '4.9', tags: ['Anxiety', 'Personal Growth'], next: 'Tomorrow' },
            { name: 'Rima', initial: 'R', exp: '2 yrs · Malayalam', price: '₹800', rating: '4.6', tags: ['Anxiety', 'Self-esteem'], next: 'Available now', nextHighlight: true },
            { name: 'Fidha', initial: 'F', exp: '1 yrs · Malayalam', price: '₹600', rating: '4.4', tags: ['Loneliness', 'Mindfulness'], next: 'Available now', nextHighlight: true },
          ].map((counsellor, idx) => (
            <TouchableOpacity key={idx} style={styles.counsellorCard} activeOpacity={0.9} onPress={() => navigation.navigate('BookSession', { counsellor })}>
              <View style={styles.ccTop}>
                <View style={styles.ccAvatar}><Text style={styles.ccInitial}>{counsellor.initial}</Text></View>
                <View style={styles.ccInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.ccName}>{counsellor.name}</Text>
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓ Verified</Text>
                    </View>
                  </View>
                  <Text style={styles.ccExp}>{counsellor.exp}</Text>
                </View>
                <View style={styles.ccRight}>
                  <Text style={styles.ccPrice}>{counsellor.price}</Text>
                  <View style={styles.ratingRow}>
                    <StarIcon width={px(12)} height={px(12)} />
                    <Text style={styles.ccRating}>{counsellor.rating}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.audioPlayer}>
                <TouchableOpacity style={styles.playBtn} activeOpacity={0.8}>
                  <PlayIcon width={px(12)} height={px(12)} fill="#FFFFFF" stroke="#FFFFFF" />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <WaveformSVG width={px(140)} height={px(16)} stroke={colors.primary} />
                </View>
                <Text style={styles.audioTime}>0:42</Text>
              </View>

              <View style={styles.ccBottom}>
                <View style={styles.tagsRow}>
                  {counsellor.tags.map((t, i) => (
                    <View key={i} style={styles.tagPill}><Text style={styles.tagText}>{t}</Text></View>
                  ))}
                </View>
                <View style={styles.nextInfoRow}>
                  <View style={styles.nextInfo}>
                    <ClockIcon width={px(12)} height={px(12)} />
                    <Text style={[styles.nextText, counsellor.nextHighlight && { color: colors.primary }]}>
                      {counsellor.nextHighlight ? counsellor.next : `Next: ${counsellor.next}`}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Recent Conversations */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent conversations</Text>
            <TouchableOpacity activeOpacity={0.7}><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.chatCard} activeOpacity={0.8}>
            <View style={styles.chatAvatar}>
              <ChatIcon width={px(24)} height={px(24)} />
            </View>
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>Aisha</Text>
              <Text style={styles.chatMsg} numberOfLines={1}>That's completely valid — let's w...</Text>
            </View>
            <View style={styles.chatRight}>
              <Text style={styles.chatTime}>2h ago</Text>
              <View style={styles.unreadBadge}><Text style={styles.unreadText}>2</Text></View>
            </View>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
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
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: px(20),
    paddingTop: px(24),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(24),
  },
  greetingText: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
    marginBottom: px(4),
  },
  nameText: {
    fontSize: px(20),
    fontFamily: fonts.sans.medium,
    color: colors.black,
  },
  bellBtn: {
    width: px(40),
    height: px(40),
    borderRadius: px(16),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingCard: {
    backgroundColor: colors.primary, // Green for Client app
    borderRadius: px(20),
    padding: px(20),
    marginBottom: px(24),
  },
  upcomingLabel: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.white,
    marginBottom: px(8),
  },
  upcomingTitle: {
    fontSize: px(14),
    fontFamily: fonts.sans.medium,
    color: colors.white,
    marginBottom: px(4),
  },
  upcomingTime: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.white,
    marginBottom: px(20),
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: px(8),
  },
  viewDetailsBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: px(16),
    paddingVertical: px(8),
    borderRadius: px(20),
  },
  viewDetailsText: {
    fontSize: px(12),
    fontFamily: fonts.sans.medium,
    color: colors.white,
  },
  viewDetailsArrow: {
    fontSize: px(18),
    fontFamily: fonts.sans.medium,
    color: colors.white,
  },
  reflectionCard: {
    backgroundColor: colors.white,
    borderRadius: px(28),
    padding: px(16),
    marginBottom: px(24),
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionSmallTitle: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
    marginBottom: px(4),
  },
  reflectionQuestion: {
    fontSize: px(14),
    fontFamily: fonts.sans.medium,
    color: colors.black,
    marginBottom: px(18),
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: px(8),
  },
  emojiPill: {
    flex: 1,
    backgroundColor: '#F7F5F0',
    borderRadius: px(24),
    paddingVertical: px(16),
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(10),
  },
  emojiChar: {
    fontSize: px(18),
  },
  emojiLabel: {
    fontSize: px(10),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  sectionHeader: {
    marginBottom: px(16),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(16),
    marginTop: px(8),
  },
  sectionTitle: {
    fontSize: px(14),
    fontFamily: fonts.sans.medium,
    color: colors.black,
  },
  seeAllText: {
    fontSize: px(12),
    fontFamily: fonts.sans.medium,
    color: colors.primary,
  },
  quickSupportRow: {
    flexDirection: 'row',
    gap: px(16),
    marginBottom: px(24),
  },
  qsCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: px(24),
    padding: px(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  qsTexts: {
    marginTop: px(16),
  },
  qsTitle: {
    fontSize: px(14),
    fontFamily: fonts.sans.medium,
    color: colors.black,
    marginBottom: px(4),
  },
  qsSub: {
    fontSize: px(12),
    fontFamily: fonts.sans.medium,
    color: colors.textSecondary,
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
  ccExp: {
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(4),
    marginTop: px(4),
  },
  ccRating: {
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
  chatCard: {
    backgroundColor: colors.white,
    borderRadius: px(24),
    padding: px(16),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: px(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  chatAvatar: {
    width: px(48),
    height: px(48),
    borderRadius: px(24),
    backgroundColor: '#EEF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: px(12),
  },
  chatInitial: {
    fontSize: px(18),
    fontFamily: fonts.sans.bold,
    color: colors.primary,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: px(14),
    fontFamily: fonts.sans.medium,
    color: colors.black,
    marginBottom: px(4),
  },
  chatMsg: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.black,
  },
  chatRight: {
    alignItems: 'flex-end',
  },
  chatTime: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
    marginBottom: px(6),
  },
  unreadBadge: {
    width: px(20),
    height: px(20),
    borderRadius: px(10),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: px(10),
    fontFamily: fonts.sans.bold,
    color: colors.white,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: px(12),
    paddingHorizontal: px(20),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: Platform.OS === 'ios' ? px(24) : px(12),
  },
  tabItemActive: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: px(16),
    paddingVertical: px(10),
    borderRadius: px(24),
    alignItems: 'center',
    gap: px(8),
  },
  tabTextActive: {
    color: colors.white,
    fontFamily: fonts.sans.bold,
    fontSize: px(14),
  }
});
