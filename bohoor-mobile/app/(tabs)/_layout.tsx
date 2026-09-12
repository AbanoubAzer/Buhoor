import { Tabs } from 'expo-router';
import { Home, Building2, Key, PlusCircle } from 'lucide-react-native';
import { Image, View } from 'react-native';
import Colors from '../../constants/Colors';

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
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleAlign: 'center',
        headerTitle: () => <LogoHeader />,
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
          title: 'الرئيسية',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'المشاريع',
          tabBarIcon: ({ color }) => <Building2 color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="units"
        options={{
          title: 'الوحدات',
          tabBarIcon: ({ color }) => <Key color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'أضف عقارك',
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
