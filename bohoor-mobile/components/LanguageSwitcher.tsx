import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useStore } from '../store/useStore';
import Colors from '../constants/Colors';
import { Globe } from 'lucide-react-native';

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useStore();

  return (
    <TouchableOpacity 
      onPress={toggleLanguage} 
      style={styles.btn}
      accessibilityLabel="تغيير اللغة / Switch Language"
    >
      <Globe size={15} color={Colors.primary} />
      <Text style={styles.text}>
        {language === 'ar' ? '🇬🇧 EN' : '🇪🇬 عربي'}
      </Text>
    </TouchableOpacity>
  );
}

export default LanguageSwitcher;

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
