import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList, Pressable, Linking, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Image } from 'expo-image';
import axios from 'axios';
import { PlayCircle } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import UnitLeadForm from '../../components/UnitLeadForm';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333';
const { width } = Dimensions.get('window');

const getDirectImageUrl = (url: string) => {
  if (!url) return url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/file/d/')[1]?.split('/')[0];
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  return url;
};

export default function UnitDetails() {
  const { id } = useLocalSearchParams();
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnitDetails();
  }, [id]);

  const fetchUnitDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/units/${id}`);
      setUnit(response.data);
    } catch (error) {
      console.error('Error fetching unit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (!unit) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>الوحدة غير موجودة</Text>
      </View>
    );
  }

  const images = unit.images 
    ? unit.images.flatMap((img: string) => img.split(/[\s,]+/).map(s=>s.trim()).filter(Boolean)).map(getDirectImageUrl)
    : [];

  const coverImage = getDirectImageUrl(unit.coverImage) || images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';

  const videos = unit.videos
    ? unit.videos.flatMap((vid: string) => vid.split(/[\s,]+/).map(s=>s.trim()).filter(Boolean))
    : [];

  const openVideo = (vid: string) => {
    let url = vid;
    Linking.openURL(url).catch(() => console.error("Couldn't open URL:", url));
  };

  const totalPrice = Number(unit.totalPrice || unit.originalContractPrice || unit.cashPaidToSeller || 0);
  const cashPaid = Number(unit.cashPaidToSeller || 0);
  const remainingInstallments = Number(unit.remainingInstallments || 0);
  const monthlyInstallment = Number(unit.monthlyEquivalentInstallment || 0);

  return (
    <>
      <Stack.Screen options={{ title: unit.title, headerBackTitle: 'عودة' }} />
      <ScrollView style={styles.container} bounces={false}>
        <Image source={{ uri: coverImage }} contentFit="cover" style={styles.coverImage} />
        
        <View style={styles.content}>
          <Text style={styles.title}>{unit.title}</Text>
          <Text style={styles.price}>{totalPrice.toLocaleString('ar-EG')} ج.م</Text>
          
          <View style={styles.featuresRow}>
            <View style={styles.featureBox}>
              <Text style={styles.featureLabel}>المساحة</Text>
              <Text style={styles.featureValue}>{unit.area} م²</Text>
            </View>
            <View style={styles.featureBox}>
              <Text style={styles.featureLabel}>الغرف</Text>
              <Text style={styles.featureValue}>{unit.bedrooms || '-'}</Text>
            </View>
            <View style={styles.featureBox}>
              <Text style={styles.featureLabel}>الحمامات</Text>
              <Text style={styles.featureValue}>{unit.bathrooms || '-'}</Text>
            </View>
          </View>

          {images.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>باقي الصور</Text>
              <FlatList
                horizontal
                data={images}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} contentFit="cover" style={styles.galleryImage} />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, flexDirection: 'row-reverse' }}
              />
            </View>
          )}

          {videos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>الفيديوهات</Text>
              <View style={styles.videosContainer}>
                {videos.map((vid: string, index: number) => (
                  <Pressable key={index} style={styles.videoButton} onPress={() => openVideo(vid)}>
                    <PlayCircle color={Colors.accent} size={32} />
                    <Text style={styles.videoText}>مشاهدة الفيديو {index + 1}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الوصف</Text>
            <Text style={styles.description}>{unit.description || 'لا يوجد وصف متاح لهذه الوحدة.'}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>تفاصيل السعر</Text>
            <View style={styles.detailsBox}>
              <Text style={styles.description}>السعر الإجمالي: {totalPrice.toLocaleString('ar-EG')} ج.م</Text>
              {cashPaid > 0 && (
                <Text style={styles.description}>
                  {unit.sellerType === 'DEVELOPER' ? 'المقدم' : 'الكاش المطلوب الآن'}: {cashPaid.toLocaleString('ar-EG')} ج.م
                </Text>
              )}
            </View>
          </View>

          {remainingInstallments > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>تفاصيل الأقساط المتبقية</Text>
              <View style={styles.detailsRow}>
                <View style={styles.detailsBoxHalf}>
                  <Text style={styles.featureLabel}>المتبقي أقساط</Text>
                  <Text style={styles.featureValue}>{remainingInstallments.toLocaleString('ar-EG')} ج.م</Text>
                </View>
                <View style={styles.detailsBoxHalf}>
                  <Text style={styles.featureLabel}>القسط الشهري</Text>
                  <Text style={styles.featureValue}>{monthlyInstallment.toLocaleString('ar-EG')} ج.م</Text>
                </View>
              </View>
            </View>
          )}
          
          <UnitLeadForm unitId={unit.id} unitPrice={totalPrice} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorText: { color: Colors.primary, fontSize: 18, fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: Colors.gray },
  coverImage: { width: '100%', height: 300, backgroundColor: Colors.darkGray },
  content: { padding: 20, backgroundColor: Colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, shadowColor: Colors.text, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 4 },
  price: { fontSize: 22, fontWeight: 'bold', color: Colors.accent, textAlign: 'right', marginBottom: 20 },
  featuresRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 24 },
  featureBox: { flex: 1, backgroundColor: Colors.gray, borderRadius: 12, padding: 12, alignItems: 'center', marginHorizontal: 4 },
  featureLabel: { fontSize: 12, color: Colors.darkGray, marginBottom: 4 },
  featureValue: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 12 },
  description: { fontSize: 15, color: Colors.text, textAlign: 'right', lineHeight: 24 },
  galleryImage: { width: width * 0.4, height: 120, borderRadius: 12, backgroundColor: Colors.gray },
  videosContainer: { gap: 12, flexDirection: 'column' },
  videoButton: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.gray, padding: 12, borderRadius: 12, gap: 12 },
  videoText: { fontSize: 16, color: Colors.primary, fontWeight: 'bold' },
  detailsBox: { backgroundColor: Colors.gray, padding: 16, borderRadius: 12, gap: 8 },
  detailsRow: { flexDirection: 'row-reverse', gap: 12 },
  detailsBoxHalf: { flex: 1, backgroundColor: Colors.gray, padding: 16, borderRadius: 12, alignItems: 'center' },
});
