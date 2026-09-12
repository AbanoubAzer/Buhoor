import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Colors from '../constants/Colors';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwm4j0_E7QODiADgwGLiUMPRWlBL7E6Z4fmk8ZVgzffWn5EiUZErnQ0YFJN4J-HYHVNLA/exec';

interface Props {
  unitId: string;
  unitPrice: number;
}

export default function UnitLeadForm({ unitId, unitPrice }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [questions, setQuestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const commission = unitPrice ? (unitPrice * 0.0125).toLocaleString('ar-EG') : "0";

  const handleSubmit = async () => {
    if (!name || !phone) {
      Alert.alert('خطأ', 'الرجاء إدخال الاسم ورقم الواتساب');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        action: 'NEW_LEAD',
        unitId: `Mobile App - Unit ID: ${unitId}`,
        name,
        phone,
        readiness: 'Mobile User',
        questions,
        commission
      };

      await axios.post(GAS_URL, payload, {
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });

      setSuccess(true);
    } catch (error) {
      console.error(error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إرسال طلبك');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successTitle}>تم استلام طلبك بنجاح!</Text>
        <Text style={styles.successText}>سيقوم فريقنا بالتواصل معك في أقرب وقت.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>عايز تلحق تحجز الفرصة ديه؟</Text>
      <Text style={styles.subtitle}>
        سيب اسمك ورقم الواتساب، وفريقنا هيكلّمك يراجع معاك المطلوب كاش والأقساط اللي بعده.
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>الاسم *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="الاسم الكامل" 
          value={name} 
          onChangeText={setName} 
          textAlign="right"
          placeholderTextColor={Colors.darkGray}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>رقم الواتساب *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="مثال: +201012345678" 
          value={phone} 
          onChangeText={setPhone} 
          keyboardType="phone-pad" 
          textAlign="right"
          placeholderTextColor={Colors.darkGray}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>إيه الأسئلة أو الطلبات اللي عايز تسألها للبايع؟</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="مثلاً: الاستلام إمتا بالظبط؟" 
          value={questions} 
          onChangeText={setQuestions} 
          multiline 
          numberOfLines={3} 
          textAlign="right"
          placeholderTextColor={Colors.darkGray}
        />
      </View>

      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          عمولة المنصة: 1.25% ({commission} ج.م) تُدفع عند إتمام التنازل بنجاح.
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSubmit} 
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}</Text>
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
  subtitle: { fontSize: 14, color: Colors.darkGray, marginBottom: 20, textAlign: 'right', lineHeight: 22 },
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
  noticeBox: { backgroundColor: '#FEF3C7', padding: 12, borderRadius: 8, marginBottom: 20 },
  noticeText: { color: '#92400E', fontSize: 13, textAlign: 'center', fontWeight: 'bold' },
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
