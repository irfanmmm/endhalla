import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path, Polyline, Circle, Line } from 'react-native-svg';
// import { px } from '../../../shared/utils/responsive';
// import { colors, fonts } from '../../theme';

import HomeScreen from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { px } from '../../shared/utils/responsive';
import { colors, fonts } from '../theme';

const Tab = createBottomTabNavigator();

// SVGs
const HomeIcon = ({ color = '#9D9D9D' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></Path>
    <Polyline points="9 22 9 12 15 12 15 22"></Polyline>
  </Svg>
);

const SearchIcon = ({ color = '#9D9D9D' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8"></Circle>
    <Line x1="21" y1="21" x2="16.65" y2="16.65"></Line>
  </Svg>
);

const MessageIcon = ({ color = '#9D9D9D' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></Path>
  </Svg>
);

const ProfileIcon = ({ color = '#9D9D9D' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></Path>
    <Circle cx="12" cy="7" r="4"></Circle>
  </Svg>
);

// Placeholder screen for unused tabs
const PlaceholderScreen = () => <View style={{ flex: 1, backgroundColor: colors.background }} />;

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.bottomBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const renderIcon = (color: string) => {
          if (label === 'Home') return <HomeIcon color={color} />;
          if (label === 'Search') return <SearchIcon color={color} />;
          if (label === 'Messages') return <MessageIcon color={color} />;
          if (label === 'Profile') return <ProfileIcon color={color} />;
        };

        return (
          <TouchableOpacity
            key={label}
            activeOpacity={0.8}
            onPress={onPress}
            style={isFocused ? styles.tabItemActive : {}}
          >
            {renderIcon(isFocused ? '#FFFFFF' : '#9D9D9D')}
            {isFocused && <Text style={styles.tabTextActive}>{label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    color: '#FFFFFF',
    fontFamily: fonts.sans.bold,
    fontSize: px(14),
  }
});

export default function MainTabNavigator() {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Messages" component={PlaceholderScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
