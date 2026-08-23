import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  Animated,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path, Polyline, Circle, Line } from 'react-native-svg';

import HomeScreen from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { px } from '../../shared/utils/responsive';
import { colors, fonts } from '../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Tab = createBottomTabNavigator();

// SVGs
const HomeIcon = ({ color = '#9D9D9D' }: { color?: string }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></Path>
    <Polyline points="9 22 9 12 15 12 15 22"></Polyline>
  </Svg>
);

const SearchIcon = ({ color = '#9D9D9D' }: { color?: string }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8"></Circle>
    <Line x1="21" y1="21" x2="16.65" y2="16.65"></Line>
  </Svg>
);

const MessageIcon = ({ color = '#9D9D9D' }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></Path>
  </Svg>
);

const ProfileIcon = ({ color = '#9D9D9D' }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></Path>
    <Circle cx="12" cy="7" r="4"></Circle>
  </Svg>
);

// Placeholder screen for unused tabs
const PlaceholderScreen = () => <View style={{ flex: 1, backgroundColor: colors.background }} />;

interface AnimatedTabItemProps {
  label: string;
  isFocused: boolean;
  onPress: () => void;
}

function AnimatedTabItem({ label, isFocused, onPress }: AnimatedTabItemProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const focusAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 16,
      bounciness: 8,
    }).start();
  };

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPress();
  };

  const renderIcon = (color: string) => {
    if (label === 'Home') return <HomeIcon color={color} />;
    if (label === 'Search') return <SearchIcon color={color} />;
    if (label === 'Messages') return <MessageIcon color={color} />;
    if (label === 'Profile') return <ProfileIcon color={color} />;
    return null;
  };

  const iconScale = focusAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.15, 1.1],
  });

  const labelOpacity = focusAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  const labelTranslateX = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 0],
  });

  const inactiveIconOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const activeIconOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View
        style={[
          styles.tabItemBase,
          isFocused ? styles.tabItemActive : styles.tabItemInactive,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: iconScale }], position: 'relative' }}>
          {/* Inactive Icon Layer */}
          <Animated.View style={{ opacity: inactiveIconOpacity }}>
            {renderIcon('#8E8E93')}
          </Animated.View>
          {/* Active Icon Layer */}
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: activeIconOpacity }]}>
            {renderIcon('#FFFFFF')}
          </Animated.View>
        </Animated.View>

        {isFocused && (
          <Animated.Text
            style={[
              styles.tabTextActive,
              {
                opacity: labelOpacity,
                transform: [{ translateX: labelTranslateX }],
              },
            ]}
          >
            {label}
          </Animated.Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.bottomBar}>
      {state.routes.map((route: any, index: number) => {
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

        return (
          <AnimatedTabItem
            key={route.key}
            label={label}
            isFocused={isFocused}
            onPress={onPress}
          />
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
    paddingVertical: px(10),
    paddingHorizontal: px(16),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: Platform.OS === 'ios' ? px(24) : px(10),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItemBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(24),
  },
  tabItemActive: {
    backgroundColor: colors.primary,
    paddingHorizontal: px(16),
    paddingVertical: px(10),
    gap: px(8),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  tabItemInactive: {
    backgroundColor: 'transparent',
    paddingHorizontal: px(12),
    paddingVertical: px(10),
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: fonts.sans.bold,
    fontSize: px(14),
    letterSpacing: 0.2,
  },
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

