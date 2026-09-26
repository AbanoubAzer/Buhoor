import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Switch, Image as RNImage } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { ChevronRight, Camera, Trash } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { useStore } from '../../store/useStore';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwm4j0_E7QODiADgwGLiUMPRWlBL7E6Z4fmk8ZVgzffWn5EiUZErnQ0YFJN4J-HYHVNLA/exec';

export default function AddPropertyTab() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { locations, unitTypes, fetchMetadata } = useStore();

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
      Alert.alert('تنبيه', 'يرجى إكمال البيانات والموافقة على الشرط الجزائي');
      return;
    }
    if (step === 2 && (!formData.projectLocation || !formData.unitType || !formData.area)) {
      Alert.alert('تنبيه', 'يرجى إكمال بيانات الوحدة الأساسية');
      return;
    }
    if (step === 3 && !formData.cashRequired) {
      Alert.alert('تنبيه', 'يرجى تحديد المبلغ المطلوب');
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

      Alert.alert('تم بنجاح!', 'تم إرسال طلبك بنجاح وسيتواصل معك فريق المنصة لمراجعة العقار وتفعيله.');
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
      Alert.alert('خطأ', 'حدث خطأ أثناء رفع البيانات. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {step > 1 && (
          <TouchableOpacity onPress={prevStep} style={styles.backBtn}>
            <ChevronRight color={Colors.primary} size={28} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>أضف عقارك (الخطوة {step}/4)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Step 1: Contact Info */}
        {step === 1 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>البيانات الشخصية والاتفاقية</Text>
            
            <Text style={styles.label}>الاسم بالكامل</Text>
            <TextInput style={styles.input} placeholder="اكتب اسمك" value={formData.clientName} onChangeText={t => updateForm('clientName', t)} textAlign="right" />

            <Text style={styles.label}>رقم الواتساب</Text>
            <TextInput style={styles.input} placeholder="مثال: +201012345678" value={formData.phone} onChangeText={t => updateForm('phone', t)} keyboardType="phone-pad" textAlign="right" />

            <View style={styles.penaltyBox}>
              <Text style={styles.penaltyText}>
                الشرط الجزائي: في حال أتمت المنصة بيع الوحدة وقررت أنت التراجع عن البيع، توافق على دفع شرط جزائي بقيمة 5000 جنيه مصري لإدارة المنصة تعويضاً عن وقت ومجهود الفريق.
              </Text>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>أوافق على الشرط الجزائي</Text>
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
            <Text style={styles.sectionTitle}>تفاصيل الوحدة</Text>
            
            <Text style={styles.label}>الموقع / اسم المنطقة</Text>
            {locations.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
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
            <TextInput style={styles.input} placeholder="مثال: مدينتي، التجمع الخامس، الساحل الشمالي" value={formData.projectLocation} onChangeText={t => updateForm('projectLocation', t)} textAlign="right" />

            <Text style={styles.label}>نوع الوحدة</Text>
            {unitTypes.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                {unitTypes.map((t: any) => (
                  <TouchableOpacity 
                    key={t.id} 
                    style={[styles.smallChip, formData.unitType === t.name && styles.smallChipActive]}
                    onPress={() => updateForm('unitType', t.name)}
                  >
                    <Text style={[styles.smallChipText, formData.unitType === t.name && styles.smallChipTextActive]}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <TextInput style={styles.input} placeholder="مثال: شقة، فيلا، شاليه، استوديو" value={formData.unitType} onChangeText={t => updateForm('unitType', t)} textAlign="right" />

            <Text style={styles.label}>المساحة (م²)</Text>
            <TextInput style={styles.input} placeholder="مثال: 120" value={formData.area} onChangeText={t => updateForm('area', t)} keyboardType="numeric" textAlign="right" />
          </View>
        )}

        {/* Step 3: Financials */}
        {step === 3 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>التفاصيل المالية</Text>
            
            <Text style={styles.label}>طريقة الدفع</Text>
            <View style={styles.row}>
              <TouchableOpacity style={[styles.choiceBtn, formData.paymentMethod === 'installment' && styles.choiceBtnActive]} onPress={() => updateForm('paymentMethod', 'installment')}>
                <Text style={[styles.choiceText, formData.paymentMethod === 'installment' && styles.choiceTextActive]}>تقسيط</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.choiceBtn, formData.paymentMethod === 'cash' && styles.choiceBtnActive]} onPress={() => updateForm('paymentMethod', 'cash')}>
                <Text style={[styles.choiceText, formData.paymentMethod === 'cash' && styles.choiceTextActive]}>كاش</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>{formData.paymentMethod === 'cash' ? 'السعر المطلوب كاش' : 'المقدم المطلوب منك كبائع (الأوفر + المدفوع)'}</Text>
            <TextInput style={styles.input} placeholder="المبلغ بالجنيه المصري" value={formData.cashRequired} onChangeText={t => updateForm('cashRequired', t)} keyboardType="numeric" textAlign="right" />

            {formData.paymentMethod === 'installment' && (
              <>
                <Text style={styles.label}>عدد الأقساط المتبقية للمطور</Text>
                <TextInput style={styles.input} placeholder="مثال: 12" value={formData.installmentsCount} onChangeText={t => updateForm('installmentsCount', t)} keyboardType="numeric" textAlign="right" />
              </>
            )}
          </View>
        )}

        {/* Step 4: Images */}
        {step === 4 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>صور العقار</Text>
            <Text style={styles.subtitle}>الصور الجيدة تسرّع من عملية البيع بشكل كبير.</Text>
            
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <Camera color={Colors.accent} size={32} style={{ marginBottom: 8 }} />
              <Text style={styles.uploadBtnText}>اختر الصور من الهاتف</Text>
            </TouchableOpacity>

            <View style={styles.imagesGrid}>
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
              <Text style={styles.primaryBtnText}>التالي</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.primaryBtn, loading && styles.disabledBtn]} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.primaryBtnText}>{loading ? 'جاري الرفع...' : 'تأكيد وإرسال'}</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray },
  header: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.background, padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backBtn: { marginLeft: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  content: { padding: 20, paddingBottom: 100 },
  formSection: { backgroundColor: Colors.background, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.primary, marginBottom: 20, textAlign: 'right' },
  subtitle: { fontSize: 14, color: Colors.darkGray, marginBottom: 16, textAlign: 'right' },
  label: { fontSize: 14, fontWeight: 'bold', color: Colors.primary, marginBottom: 8, textAlign: 'right' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, marginBottom: 20, backgroundColor: Colors.gray, fontSize: 16, color: Colors.text },
  chipsRow: { flexDirection: 'row-reverse', gap: 6, marginBottom: 10 },
  smallChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: Colors.gray, borderWidth: 1, borderColor: '#E5E7EB' },
  smallChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  smallChipText: { fontSize: 12, color: Colors.darkGray, fontWeight: '600' },
  smallChipTextActive: { color: Colors.background },
  penaltyBox: { backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FCA5A5' },
  penaltyText: { color: '#991B1B', fontSize: 13, lineHeight: 22, textAlign: 'right', marginBottom: 12, fontWeight: 'bold' },
  switchRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel: { fontSize: 14, fontWeight: 'bold', color: '#991B1B' },
  row: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 20 },
  choiceBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginHorizontal: 4, alignItems: 'center' },
  choiceBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  choiceText: { fontSize: 16, color: Colors.text, fontWeight: 'bold' },
  choiceTextActive: { color: Colors.background },
  uploadBtn: { backgroundColor: Colors.gray, borderWidth: 2, borderColor: Colors.accent, borderStyle: 'dashed', borderRadius: 16, padding: 30, alignItems: 'center', marginBottom: 20 },
  uploadBtnText: { color: Colors.accent, fontSize: 16, fontWeight: 'bold' },
  imagesGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap' },
  imageWrapper: { width: '30%', aspectRatio: 1, margin: '1.5%', position: 'relative' },
  previewImage: { width: '100%', height: '100%', borderRadius: 12 },
  removeImageBtn: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', padding: 6, borderRadius: 12 },
  footer: { marginTop: 10 },
  primaryBtn: { backgroundColor: Colors.accent, padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: Colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  disabledBtn: { opacity: 0.7 },
  primaryBtnText: { color: Colors.background, fontSize: 18, fontWeight: 'bold' }
});
