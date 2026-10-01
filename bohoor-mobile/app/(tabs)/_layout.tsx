import { Tabs } from 'expo-router';
import { Home, Building2, Key, Heart, PlusCircle } from 'lucide-react-native';
import { Image, View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useStore } from '../../store/useStore';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import React, { useRef, useEffect } from 'react';

function LogoHeader() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../../assets/logo.jpg')}
        style={{ width: 110, height: 38, resizeMode: 'contain' }}
      />
    </View>
  );
}

type TabIconProps = {
  icon: React.ReactNode;
  label: string;
  focused: boolean;
  badge?: number;
};

function TabIcon({ icon, label, focused, badge }: TabIconProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.15 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 12,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={tabStyles.iconWrapper}>
      {/* Active pill indicator background */}
      <Animated.View
        style={[
          tabStyles.activePill,
          {
            opacity: opacityAnim,
            transform: [
              {
                scale: opacityAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {icon}
      </Animated.View>
      <Text
        style={[tabStyles.tabLabel, focused && tabStyles.tabLabelActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {badge && badge > 0 ? (
        <View style={tabStyles.badge}>
          <Text style={tabStyles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function TabLayout() {
  const { language, t, favorites } = useStore();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.cardBackground,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.borderLight,
        },
        headerTitleAlign: 'center',
        headerTitle: () => <LogoHeader />,
        headerRight: () => (
          <View style={{ paddingHorizontal: 16 }}>
            <LanguageSwitcher />
          </View>
        ),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.cardBackground,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 16,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Home color={focused ? Colors.primary : Colors.textMuted} size={22} strokeWidth={focused ? 2.5 : 2} />}
              label={t('home')}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Building2 color={focused ? Colors.primary : Colors.textMuted} size={22} strokeWidth={focused ? 2.5 : 2} />}
              label={t('projects')}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="units"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Key color={focused ? Colors.primary : Colors.textMuted} size={22} strokeWidth={focused ? 2.5 : 2} />}
              label={t('units')}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Heart color={focused ? Colors.danger : Colors.textMuted} size={22} fill={focused ? Colors.danger : 'transparent'} strokeWidth={focused ? 2.5 : 2} />}
              label={t('favorites')}
              focused={focused}
              badge={favorites?.length}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<PlusCircle color={focused ? Colors.accent : Colors.textMuted} size={22} strokeWidth={focused ? 2.5 : 2} />}
              label={t('addProperty')}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: -4,
    width: 48,
    height: 34,
    backgroundColor: Colors.primary + '12',
    borderRadius: 14,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 3,
    letterSpacing: -0.1,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: 2,
    backgroundColor: Colors.accent,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.cardBackground,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
