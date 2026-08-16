import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts, borderRadius } from '../../theme';
import Header from '../../../shared/components/Header';
import { useAppDispatch, useAppSelector } from '../../../shared/store';
import { setSessionType as setReduxSessionType, confirmBooking } from '../../../shared/store/bookingSlice';

import ChatIcon from '../../../shared/assets/icons/chat.svg';
import PhoneIcon from '../../../shared/assets/icons/phone.svg';
import VideoIcon from '../../../shared/assets/icons/video.svg';
import ShieldIcon from '../../../shared/assets/icons/sheeld-icon.svg';

export default function BookSessionScreen({ route, navigation }: any) {
  const dispatch = useAppDispatch();
  const counsellor = route?.params?.counsellor || {
    name: 'Aisha',
    price: '₹1,000',
  };

  const [sessionType, setSessionTypeState] = useState<'Chat' | 'Voice' | 'Video'>('Chat');
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [baseDate, setBaseDate] = useState<Date>(new Date());

  // Dynamically compute all days in the month for baseDate (28, 29, 30, or 31 days)
  const monthDays = useMemo(() => {
    const start = startOfMonth(baseDate);
    const end = endOfMonth(baseDate);
    const daysInMonth = eachDayOfInterval({ start, end });

    return daysInMonth.map((d) => ({
      dateObj: d,
      day: format(d, 'EEE'), // "Mon", "Tue"
      dateNum: format(d, 'd'), // "1", "2", ... "30", "31"
      fullDateText: format(d, 'EEE, d MMM'), // "Tue, 10 Jun"
      monthYearHeader: format(d, 'MMMM yyyy').toUpperCase(), // "JUNE 2026"
      id: format(d, 'yyyy-MM-dd'),
    }));
  }, [baseDate]);

  const [selectedDateItem, setSelectedDateItem] = useState(monthDays[0]);

  const timeSlots = ['9:00 AM', '10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'];
  const [selectedTime, setSelectedTime] = useState(timeSlots[1]);

  const sessionTypes = [
    { id: 'Chat' as const, label: 'Chat', icon: ChatIcon },
    { id: 'Voice' as const, label: 'Voice', icon: PhoneIcon },
    { id: 'Video' as const, label: 'Video', icon: VideoIcon },
  ];

  const handleSelectSessionType = (type: 'Chat' | 'Voice' | 'Video') => {
    setSessionTypeState(type);
    dispatch(setReduxSessionType(type));
  };

  const handleConfirm = () => {
    dispatch(
      confirmBooking({
        counsellorName: counsellor.name,
        sessionType,
        dateText: selectedDateItem.fullDateText,
        timeText: selectedTime,
        price: counsellor.price,
      })
    );
    navigation.navigate('BookingConfirmed', {
      counsellorName: counsellor.name,
      sessionType,
      dateText: selectedDateItem.fullDateText,
      timeText: selectedTime,
    });
  };

  const handleCalendarDaySelect = (day: any) => {
    const selected = parseISO(day.dateString);
    setBaseDate(selected);
    const monthYear = format(selected, 'MMMM yyyy').toUpperCase();
    const fullText = format(selected, 'EEE, d MMM');
    const newSelected = {
      dateObj: selected,
      day: format(selected, 'EEE'),
      dateNum: format(selected, 'd'),
      fullDateText: fullText,
      monthYearHeader: monthYear,
      id: day.dateString,
    };
    setSelectedDateItem(newSelected);
    setShowFullCalendar(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={styles.headerPadding}>
          <Header
            subtitle="Book a session"
            title={`with ${counsellor.name}`}
            onBackPress={() => navigation.goBack()}
          />
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
          {/* Section 1: SESSION TYPE */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              SESSION TYPE <Text style={styles.sectionSubtitle}>· same price, switch anytime</Text>
            </Text>
          </View>

          <View style={styles.typesRow}>
            {sessionTypes.map((item) => {
              const IconComp = item.icon;
              const isActive = sessionType === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => handleSelectSessionType(item.id)}
                  style={[styles.typeCard, isActive ? styles.typeCardActive : null]}
                >
                  <IconComp
                    width={px(22)}
                    height={px(22)}
                    stroke={isActive ? colors.primary : colors.textSecondary}
                    color={isActive ? colors.primary : colors.textSecondary}
                  />
                  <Text style={[styles.typeText, isActive ? styles.typeTextActive : null]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Section 2: DATE (Click DATE header to open calendar modal) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowFullCalendar(true)}
            style={styles.sectionHeaderClickable}
          >
            <Text style={styles.sectionTitle}>
              DATE <Text style={styles.sectionSubtitle}>· {selectedDateItem.monthYearHeader}</Text>
            </Text>
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
            {monthDays.map((item) => {
              const isActive = isSameDay(selectedDateItem.dateObj, item.dateObj);
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDateItem(item)}
                  style={[styles.datePill, isActive ? styles.datePillActive : null]}
                >
                  <Text style={[styles.dayText, isActive ? styles.dayTextActive : null]}>{item.day}</Text>
                  <Text style={[styles.dateNumText, isActive ? styles.dateNumActive : null]}>{item.dateNum}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Section 3: TIME */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TIME</Text>
          </View>

          <View style={styles.timeGrid}>
            {timeSlots.map((t) => {
              const isActive = selectedTime === t;
              return (
                <TouchableOpacity
                  key={t}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTime(t)}
                  style={[styles.timeSlot, isActive ? styles.timeSlotActive : null]}
                >
                  <Text style={[styles.timeSlotText, isActive ? styles.timeSlotTextActive : null]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Session</Text>
              <Text style={styles.summaryVal}>{sessionType} · 40 min</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>When</Text>
              <Text style={styles.summaryVal}>{selectedDateItem.fullDateText} · {selectedTime}</Text>
            </View>
            <View style={[styles.summaryRow, { marginBottom: 0 }]}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryPrice}>{counsellor.price}</Text>
            </View>
          </View>

          {/* Security Note */}
          <View style={styles.securityRow}>
            <ShieldIcon width={px(14)} height={px(14)} stroke={colors.textSecondary} />
            <Text style={styles.securityText}>End-to-end encrypted · Secure payment</Text>
          </View>

          <View style={{ height: px(80) }} />
        </ScrollView>

        {/* Bottom Sticky CTA */}
        <View style={styles.bottomCtaContainer}>
          <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.8} onPress={handleConfirm}>
            <Text style={styles.confirmBtnText}>Confirm & Pay {counsellor.price}</Text>
          </TouchableOpacity>
        </View>

        {/* Full Month Calendar Modal (react-native-calendars) */}
        <Modal
          visible={showFullCalendar}
          animationType="slide"
          transparent
          onRequestClose={() => setShowFullCalendar(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowFullCalendar(false)}>
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
              <Calendar
                current={selectedDateItem.id}
                minDate={format(new Date(), 'yyyy-MM-dd')}
                onDayPress={handleCalendarDaySelect}
                markedDates={{
                  [selectedDateItem.id]: { selected: true, selectedColor: colors.primary },
                }}
                theme={{
                  backgroundColor: colors.white,
                  calendarBackground: colors.white,
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: colors.white,
                  todayTextColor: colors.primary,
                  dayTextColor: colors.black,
                  textDisabledColor: colors.textSecondary,
                  monthTextColor: colors.black,
                  textDayFontFamily: fonts.sans.regular,
                  textMonthFontFamily: fonts.sans.medium,
                  textDayHeaderFontFamily: fonts.sans.medium,
                  arrowColor: colors.primary,
                }}
              />
            </View>
          </View>
        </Modal>
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
    paddingTop: px(12),
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: px(20),
  },
  sectionHeader: {
    marginTop: px(12),
    marginBottom: px(12),
  },
  sectionHeaderClickable: {
    marginTop: px(12),
    marginBottom: px(12),
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: px(12),
    fontFamily: fonts.sans.medium,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  typesRow: {
    flexDirection: 'row',
    gap: px(12),
    marginBottom: px(8),
  },
  typeCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: px(16),
    paddingVertical: px(16),
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(8),
  },
  typeCardActive: {
    backgroundColor: '#EEF5F0',
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  typeText: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  typeTextActive: {
    fontFamily: fonts.sans.medium,
    color: colors.black,
  },
  dateScroll: {
    paddingBottom: px(8),
    gap: px(10),
  },
  datePill: {
    width: px(60),
    height: px(70),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: px(16),
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(4),
  },
  datePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  dayTextActive: {
    color: colors.white,
  },
  dateNumText: {
    fontSize: px(16),
    fontFamily: fonts.sans.bold,
    color: colors.black,
  },
  dateNumActive: {
    color: colors.white,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: px(10),
    marginBottom: px(16),
  },
  timeSlot: {
    width: '31%',
    height: px(46),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: px(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.black,
  },
  timeSlotTextActive: {
    color: colors.white,
    fontFamily: fonts.sans.medium,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: px(16),
    padding: px(16),
    marginTop: px(8),
    marginBottom: px(16),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(12),
  },
  summaryLabel: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: px(12),
    fontFamily: fonts.sans.medium,
    color: colors.black,
  },
  summaryPrice: {
    fontSize: px(14),
    fontFamily: fonts.sans.bold,
    color: colors.primary,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(6),
    marginBottom: px(16),
  },
  securityText: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
  },
  bottomCtaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: px(20),
    paddingTop: px(12),
    paddingBottom: Platform.OS === 'ios' ? px(28) : px(16),
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    height: px(48),
    borderRadius: borderRadius.container,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: colors.white,
    fontSize: px(14),
    fontFamily: fonts.sans.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: px(24),
    borderTopRightRadius: px(24),
    padding: px(20),
    paddingBottom: Platform.OS === 'ios' ? px(40) : px(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(16),
  },
  modalTitle: {
    fontSize: px(16),
    fontFamily: fonts.sans.medium,
    color: colors.black,
  },
  modalCloseText: {
    fontSize: px(14),
    fontFamily: fonts.sans.medium,
    color: colors.primary,
  },
});
