import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Colors from '../constants/Colors';
import { useStore } from '../store/useStore';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwm4j0_E7QODiADgwGLiUMPRWlBL7E6Z4fmk8ZVgzffWn5EiUZErnQ0YFJN4J-HYHVNLA/exec';

interface Props {
  unitId: string;
  unitPrice: number;
  sellerType?: string;
}

export default function UnitLeadForm({ unitId, unitPrice, sellerType = 'DEVELOPER' }: Props) {
  const { language, t } = useStore();
  const isRtl = language === 'ar';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [questions, setQuestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isDeveloper = sellerType === 'DEVELOPER';
  const commission = isDeveloper ? "0" : (unitPrice ? (unitPrice * 0.0125).toLocaleString(isRtl ? 'ar-EG' : 'en-US') : "0");

  const handleSubmit = async () => {
    if (!name || !phone) {
      Alert.alert(isRtl ? 'خطأ' : 'Error', t('errNameReq'));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        action: 'NEW_LEAD',
        unitId: `Mobile App - Unit ID: ${unitId}`,
        sellerType: isDeveloper ? 'DEVELOPER' : 'INDIVIDUAL',
        name,
        phone,
        readiness: 'Mobile User',
        questions,
        commission: isDeveloper 
          ? (isRtl ? "0 (مطور - بدون عمولة للمشتري)" : "0 (Developer - No Buyer Commission)")
          : `${commission} ${t('currency')} (1.25% ${isRtl ? 'إعادة بيع' : 'Resale'})`
      };

      await axios.post(GAS_URL, payload, {
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });

      setSuccess(true);
    } catch (error) {
      console.error(error);
      Alert.alert(isRtl ? 'خطأ' : 'Error', t('errSearchFail'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successTitle}>{t('leadSubmittedSuccess')}</Text>
        <Text style={styles.successText}>{t('leadSubmittedSub')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { textAlign: isRtl ? 'right' : 'left' }]}>{t('sendLeadTitle')}</Text>
      <Text style={[styles.subtitle, { textAlign: isRtl ? 'right' : 'left' }]}>
        {t('sendLeadSub')}
      </Text>

      {/* Commission Notice */}
      {isDeveloper ? (
        <View style={styles.developerNoticeBox}>
          <Text style={[styles.developerNoticeTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
            {t('noBuyerCommission')}
          </Text>
          <Text style={[styles.developerNoticeSub, { textAlign: isRtl ? 'right' : 'left' }]}>
            {t('developerDirectDesc')}
          </Text>
        </View>
      ) : (
        <View style={styles.noticeBox}>
          <Text style={[styles.noticeText, { textAlign: isRtl ? 'right' : 'left' }]}>
            {t('resaleCommissionNotice').replace('{commission}', commission)}
          </Text>
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{t('fullName')} *</Text>
        <TextInput 
          style={[styles.input, { textAlign: isRtl ? 'right' : 'left' }]} 
          placeholder={t('namePlaceholder')} 
          value={name} 
          onChangeText={setName} 
          placeholderTextColor={Colors.darkGray}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{t('phoneNumber')} *</Text>
        <TextInput 
          style={[styles.input, { textAlign: isRtl ? 'right' : 'left' }]} 
          placeholder={t('phonePlaceholder')} 
          value={phone} 
          onChangeText={setPhone} 
          keyboardType="phone-pad" 
          placeholderTextColor={Colors.darkGray}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{t('questionsLabel')}</Text>
        <TextInput 
          style={[styles.input, styles.textArea, { textAlign: isRtl ? 'right' : 'left' }]} 
          placeholder={isDeveloper ? (isRtl ? "مثلاً: مواعيد التسليم، أنظمة السداد، موعد المعاينة..." : "e.g. Delivery dates, payment plans...") : (isRtl ? "مثلاً: الاستلام إمتا بالظبط؟" : "e.g. When is exact delivery?")} 
          value={questions} 
          onChangeText={setQuestions} 
          multiline 
          numberOfLines={3} 
          placeholderTextColor={Colors.darkGray}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSubmit} 
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? t('submitting') : t('confirmRequest')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  successContainer: {
    backgroundColor: '#ECFDF5',
    padding: 24,
    borderRadius: 16,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: '#059669', marginBottom: 8 },
  successText: { fontSize: 16, color: '#047857', textAlign: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, marginBottom: 8, textAlign: 'right' },
  subtitle: { fontSize: 14, color: Colors.darkGray, marginBottom: 16, textAlign: 'right', lineHeight: 22 },
  developerNoticeBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  developerNoticeTitle: {
    color: '#065F46',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 2,
  },
  developerNoticeSub: {
    color: '#047857',
    fontSize: 11,
    textAlign: 'right',
    lineHeight: 18,
  },
  noticeBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  noticeText: {
    color: '#92400E',
    fontSize: 12,
    textAlign: 'right',
    fontWeight: '600',
    lineHeight: 18,
  },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: Colors.text, marginBottom: 8, textAlign: 'right' },
  input: {
    backgroundColor: Colors.gray,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: {
    backgroundColor: Colors.accent,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: Colors.background, fontSize: 18, fontWeight: 'bold' }
});
