import { Tabs } from 'expo-router';
import { Home, Building2, Key, Heart, PlusCircle } from 'lucide-react-native';
import { Image, View } from 'react-native';
import Colors from '../../constants/Colors';
import { useStore } from '../../store/useStore';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

function LogoHeader() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image 
        source={require('../../assets/logo.jpg')} 
        style={{ width: 100, height: 40, resizeMode: 'contain' }} 
      />
    </View>
  );
}

export default function TabLayout() {
  const { t } = useStore();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleAlign: 'center',
        headerTitle: () => <LogoHeader />,
        headerRight: () => (
          <View style={{ paddingHorizontal: 12 }}>
            <LanguageSwitcher />
          </View>
        ),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.darkGray,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.gray,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: t('projects'),
          tabBarIcon: ({ color }) => <Building2 color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="units"
        options={{
          title: t('units'),
          tabBarIcon: ({ color }) => <Key color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('favorites'),
          tabBarIcon: ({ color }) => <Heart color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: t('addProperty'),
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}

