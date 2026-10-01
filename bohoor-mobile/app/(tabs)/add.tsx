import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Switch, Image as RNImage } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { ChevronRight, ChevronLeft, Camera, Trash } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { useStore } from '../../store/useStore';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwm4j0_E7QODiADgwGLiUMPRWlBL7E6Z4fmk8ZVgzffWn5EiUZErnQ0YFJN4J-HYHVNLA/exec';

export default function AddPropertyTab() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { locations, unitTypes, fetchMetadata, language, t } = useStore();
  const isRtl = language === 'ar';

  useEffect(() => {
    if (locations.length === 0 || unitTypes.length === 0) {
      fetchMetadata();
    }
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    penaltyAgreed: false,
    projectLocation: '',
    unitType: '',
    area: '',
    paymentMethod: 'cash',
    cashRequired: '',
    installmentsCount: '',
    images: [] as { uri: string, base64: string }[]
  });

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.5,
      base64: true
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => ({
        uri: asset.uri,
        base64: asset.base64 || ''
      }));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const nextStep = () => {
    if (step === 1 && (!formData.clientName || !formData.phone || !formData.penaltyAgreed)) {
      Alert.alert(isRtl ? 'تنبيه' : 'Notice', isRtl ? 'يرجى إكمال البيانات والموافقة على الشرط الجزائي' : 'Please fill all fields and agree to the penalty clause');
      return;
    }
    if (step === 2 && (!formData.projectLocation || !formData.unitType || !formData.area)) {
      Alert.alert(isRtl ? 'تنبيه' : 'Notice', isRtl ? 'يرجى إكمال بيانات الوحدة الأساسية' : 'Please fill in basic unit info');
      return;
    }
    if (step === 3 && !formData.cashRequired) {
      Alert.alert(isRtl ? 'تنبيه' : 'Notice', isRtl ? 'يرجى تحديد المبلغ المطلوب' : 'Please specify required amount');
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const filesPayload = formData.images.map((img, index) => ({
        filename: `image_${index}.jpg`,
        mimeType: 'image/jpeg',
        base64: img.base64
      }));

      const payload = {
        clientName: formData.clientName,
        phone: formData.phone,
        location: formData.projectLocation,
        unitType: formData.unitType,
        area: Number(formData.area),
        paymentMethod: formData.paymentMethod,
        cashRequired: Number(formData.cashRequired),
        installmentsCount: Number(formData.installmentsCount) || 0,
        finishingStatus: 'N/A',
        files: filesPayload
      };

      await axios.post(GAS_URL, payload, {
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });

      Alert.alert(
        isRtl ? 'تم بنجاح!' : 'Success!',
        isRtl ? 'تم إرسال طلبك بنجاح وسيتواصل معك فريق المنصة لمراجعة العقار وتفعيله.' : 'Request sent successfully! Our team will contact you to review and publish the unit.'
      );
      setFormData({
        clientName: '',
        phone: '',
        penaltyAgreed: false,
        projectLocation: '',
        unitType: '',
        area: '',
        paymentMethod: 'cash',
        cashRequired: '',
        installmentsCount: '',
        images: []
      });
      setStep(1);
    } catch (error) {
      console.error(error);
      Alert.alert(isRtl ? 'خطأ' : 'Error', isRtl ? 'حدث خطأ أثناء رفع البيانات. حاول مرة أخرى.' : 'Error uploading data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
        {step > 1 && (
          <TouchableOpacity onPress={prevStep} style={styles.backBtn} accessibilityLabel={t('back')}>
            {isRtl ? (
              <ChevronRight color={Colors.primary} size={28} />
            ) : (
              <ChevronLeft color={Colors.primary} size={28} />
            )}
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{t('addProperty')} ({isRtl ? `الخطوة ${step}/4` : `Step ${step}/4`})</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Step 1: Contact Info */}
        {step === 1 && (
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isRtl ? 'البيانات الشخصية والاتفاقية' : 'Personal Info & Agreement'}
            </Text>
            
            <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{t('fullName')}</Text>
            <TextInput
              style={[styles.input, { textAlign: isRtl ? 'right' : 'left' }]}
              placeholder={isRtl ? 'اكتب اسمك' : 'Enter your name'}
              value={formData.clientName}
              onChangeText={val => updateForm('clientName', val)}
              placeholderTextColor={Colors.darkGray}
            />

            <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'رقم الواتساب' : 'WhatsApp Number'}</Text>
            <TextInput
              style={[styles.input, { textAlign: isRtl ? 'right' : 'left' }]}
              placeholder={isRtl ? 'مثال: +201012345678' : 'e.g. +201012345678'}
              value={formData.phone}
              onChangeText={val => updateForm('phone', val)}
              keyboardType="phone-pad"
              placeholderTextColor={Colors.darkGray}
            />

            <View style={styles.penaltyBox}>
              <Text style={[styles.penaltyText, { textAlign: isRtl ? 'right' : 'left' }]}>
                {isRtl
                  ? 'الشرط الجزائي: في حال أتمت المنصة بيع الوحدة وقررت أنت التراجع عن البيع، توافق على دفع شرط جزائي بقيمة 5000 جنيه مصري لإدارة المنصة تعويضاً عن وقت ومجهود الفريق.'
                  : 'Penalty Clause: If the platform successfully closes the deal and you withdraw, you agree to pay a 5,000 EGP penalty to platform management compensation.'}
              </Text>
              <View style={[styles.switchRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Text style={styles.switchLabel}>{isRtl ? 'أوافق على الشرط الجزائي' : 'I agree to the penalty clause'}</Text>
                <Switch 
                  value={formData.penaltyAgreed} 
                  onValueChange={v => updateForm('penaltyAgreed', v)} 
                  trackColor={{ false: Colors.gray, true: Colors.accent }}
                  thumbColor={Colors.background}
                />
              </View>
            </View>
          </View>
        )}

        {/* Step 2: Unit Details */}
        {step === 2 && (
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'تفاصيل الوحدة' : 'Unit Details'}</Text>
            
            <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'الموقع / اسم المنطقة' : 'Location / Area'}</Text>
            {locations.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chipsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                {locations.slice(0, 8).map((loc: any) => (
                  <TouchableOpacity 
                    key={loc.id} 
                    style={[styles.smallChip, formData.projectLocation === loc.name && styles.smallChipActive]}
                    onPress={() => updateForm('projectLocation', loc.name)}
                  >
                    <Text style={[styles.smallChipText, formData.projectLocation === loc.name && styles.smallChipTextActive]}>{loc.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <TextInput
              style={[styles.input, { textAlign: isRtl ? 'right' : 'left' }]}
              placeholder={isRtl ? 'مثال: مدينتي، التجمع الخامس، الساحل الشمالي' : 'e.g. Madinaty, 5th Settlement, North Coast'}
              value={formData.projectLocation}
              onChangeText={val => updateForm('projectLocation', val)}
              placeholderTextColor={Colors.darkGray}
            />

            <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'نوع الوحدة' : 'Unit Type'}</Text>
            {unitTypes.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chipsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                {unitTypes.map((tItem: any) => (
                  <TouchableOpacity 
                    key={tItem.id} 
                    style={[styles.smallChip, formData.unitType === tItem.name && styles.smallChipActive]}
                    onPress={() => updateForm('unitType', tItem.name)}
                  >
                    <Text style={[styles.smallChipText, formData.unitType === tItem.name && styles.smallChipTextActive]}>{tItem.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <TextInput
              style={[styles.input, { textAlign: isRtl ? 'right' : 'left' }]}
              placeholder={isRtl ? 'مثال: شقة، فيلا، شاليه، استوديو' : 'e.g. Apartment, Villa, Chalet, Studio'}
              value={formData.unitType}
              onChangeText={val => updateForm('unitType', val)}
              placeholderTextColor={Colors.darkGray}
            />

            <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{t('area')} ({t('sqm')})</Text>
            <TextInput
              style={[styles.input, { textAlign: isRtl ? 'right' : 'left' }]}
              placeholder={isRtl ? 'مثال: 120' : 'e.g. 120'}
              value={formData.area}
              onChangeText={val => updateForm('area', val)}
              keyboardType="numeric"
              placeholderTextColor={Colors.darkGray}
            />
          </View>
        )}

        {/* Step 3: Financials */}
        {step === 3 && (
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'التفاصيل المالية' : 'Financial Details'}</Text>
            
            <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'طريقة الدفع' : 'Payment Method'}</Text>
            <View style={[styles.row, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity style={[styles.choiceBtn, formData.paymentMethod === 'installment' && styles.choiceBtnActive]} onPress={() => updateForm('paymentMethod', 'installment')}>
                <Text style={[styles.choiceText, formData.paymentMethod === 'installment' && styles.choiceTextActive]}>{t('installments')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.choiceBtn, formData.paymentMethod === 'cash' && styles.choiceBtnActive]} onPress={() => updateForm('paymentMethod', 'cash')}>
                <Text style={[styles.choiceText, formData.paymentMethod === 'cash' && styles.choiceTextActive]}>{t('cashOnly')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>
              {formData.paymentMethod === 'cash' 
                ? (isRtl ? 'السعر المطلوب كاش' : 'Required Cash Price') 
                : (isRtl ? 'المقدم المطلوب منك كبائع (الأوفر + المدفوع)' : 'Required Down Payment (Over + Paid)')}
            </Text>
            <TextInput
              style={[styles.input, { textAlign: isRtl ? 'right' : 'left' }]}
              placeholder={isRtl ? 'المبلغ بالجنيه المصري' : 'Amount in EGP'}
              value={formData.cashRequired}
              onChangeText={val => updateForm('cashRequired', val)}
              keyboardType="numeric"
              placeholderTextColor={Colors.darkGray}
            />

            {formData.paymentMethod === 'installment' && (
              <>
                <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'عدد الأقساط المتبقية للمطور' : 'Remaining Installments to Developer'}</Text>
                <TextInput
                  style={[styles.input, { textAlign: isRtl ? 'right' : 'left' }]}
                  placeholder={isRtl ? 'مثال: 12' : 'e.g. 12'}
                  value={formData.installmentsCount}
                  onChangeText={val => updateForm('installmentsCount', val)}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.darkGray}
                />
              </>
            )}
          </View>
        )}

        {/* Step 4: Images */}
        {step === 4 && (
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'صور العقار' : 'Property Photos'}</Text>
            <Text style={[styles.subtitle, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isRtl ? 'الصور الجيدة تسرّع من عملية البيع بشكل كبير.' : 'High quality photos significantly accelerate the sale process.'}
            </Text>
            
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <Camera color={Colors.accent} size={32} style={{ marginBottom: 8 }} />
              <Text style={styles.uploadBtnText}>{isRtl ? 'اختر الصور من الهاتف' : 'Select Photos from Phone'}</Text>
            </TouchableOpacity>

            <View style={[styles.imagesGrid, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              {formData.images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <RNImage source={{ uri: img.uri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                    <Trash color="#FFF" size={16} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          {step < 4 ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={nextStep}>
              <Text style={styles.primaryBtnText}>{isRtl ? 'التالي' : 'Next'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.primaryBtn, loading && styles.disabledBtn]} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.primaryBtnText}>{loading ? (isRtl ? 'جاري الرفع...' : 'Uploading...') : (isRtl ? 'تأكيد وإرسال' : 'Confirm & Submit')}</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 20,
    paddingTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: { marginHorizontal: 8 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  content: { padding: 20, paddingBottom: 100 },
  formSection: {
    backgroundColor: Colors.cardBackground,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: Colors.primary, marginBottom: 18 },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    backgroundColor: Colors.surface,
    fontSize: 15,
    color: Colors.text,
  },
  chipsRow: { flexDirection: 'row-reverse', gap: 8, marginBottom: 12 },
  smallChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  smallChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  smallChipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  smallChipTextActive: { color: '#FFFFFF', fontWeight: '700' },
  penaltyBox: {
    backgroundColor: Colors.dangerLight,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.2)',
  },
  penaltyText: { color: Colors.danger, fontSize: 13, lineHeight: 22, textAlign: 'right', marginBottom: 12, fontWeight: '700' },
  switchRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel: { fontSize: 14, fontWeight: '800', color: Colors.danger },
  row: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 20 },
  choiceBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  choiceBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  choiceText: { fontSize: 15, color: Colors.text, fontWeight: '700' },
  choiceTextActive: { color: '#FFFFFF', fontWeight: '800' },
  uploadBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accent,
    borderStyle: 'dashed',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadBtnText: { color: Colors.accent, fontSize: 15, fontWeight: '800' },
  imagesGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap' },
  imageWrapper: { width: '30%', aspectRatio: 1, margin: '1.5%', position: 'relative' },
  previewImage: { width: '100%', height: '100%', borderRadius: 14 },
  removeImageBtn: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.65)', padding: 6, borderRadius: 12 },
  footer: { marginTop: 10 },
  primaryBtn: {
    backgroundColor: Colors.accent,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  disabledBtn: { opacity: 0.6 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
});
