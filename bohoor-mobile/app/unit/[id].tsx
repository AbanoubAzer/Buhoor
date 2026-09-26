import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList, Pressable, Linking, Dimensions, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Image } from 'expo-image';
import axios from 'axios';
import { PlayCircle, MessageCircle, Phone, Heart, MapPin, Building } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import UnitLeadForm from '../../components/UnitLeadForm';
import { useStore } from '../../store/useStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://buhoor.vercel.app';
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
  const { toggleFavorite, isFavorite } = useStore();

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

  const isFav = isFavorite(unit.id);

  const images = unit.images 
    ? unit.images.flatMap((img: string) => img.split(/[\s,]+/).map(s=>s.trim()).filter(Boolean)).map(getDirectImageUrl)
    : [];

  const coverImage = getDirectImageUrl(unit.coverImage) || images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';

  const videos = unit.videos
    ? unit.videos.flatMap((vid: string) => vid.split(/[\s,]+/).map(s=>s.trim()).filter(Boolean))
    : [];

  const openVideo = (vid: string) => {
    Linking.openURL(vid).catch(() => console.error("Couldn't open URL:", vid));
  };

  const totalPrice = Number(unit.totalPrice || unit.originalContractPrice || unit.cashPaidToSeller || 0);
  const cashPaid = Number(unit.cashPaidToSeller || 0);
  const remainingInstallments = Number(unit.remainingInstallments || 0);
  const monthlyInstallment = Number(unit.monthlyEquivalentInstallment || 0);

  const handleWhatsApp = () => {
    const text = encodeURI(`مرحباً بُحور، أستفسر بخصوص عقار: ${unit.title} (كود: ${unit.code || unit.id})`);
    Linking.openURL(`https://wa.me/201000000000?text=${text}`).catch(() => {});
  };

  const handleCall = () => {
    Linking.openURL('tel:+201000000000').catch(() => {});
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: unit.title || 'تفاصيل العقار', 
          headerBackTitle: 'عودة',
          headerRight: () => (
            <TouchableOpacity onPress={() => toggleFavorite(unit.id)} style={{ padding: 8 }}>
              <Heart 
                color={isFav ? Colors.accent : Colors.primary} 
                fill={isFav ? Colors.accent : 'transparent'} 
                size={24} 
              />
            </TouchableOpacity>
          )
        }} 
      />
      <ScrollView style={styles.container} bounces={false}>
        <Image source={{ uri: coverImage }} contentFit="cover" style={styles.coverImage} />
        
        <View style={styles.content}>
          
          {/* Top Badges */}
          <View style={styles.badgeRow}>
            {unit.isVerified && <Text style={styles.verifiedBadge}>⭐ موثق ومعتمد</Text>}
            {unit.isSeaView && <Text style={styles.seaBadge}>🌊 إطلالة بحرية</Text>}
            <Text style={unit.sellerType === 'DEVELOPER' ? styles.devBadge : styles.sellerBadge}>
              {unit.sellerType === 'DEVELOPER' ? '🏢 مطور (0% عمولة للمشتري)' : '👤 أفراد (إعادة بيع)'}
            </Text>
          </View>

          <Text style={styles.title}>{unit.title}</Text>
          
          {unit.location?.name && (
            <View style={styles.locRow}>
              <Text style={styles.locText}>{unit.location.name} {unit.location.governorate ? `(${unit.location.governorate})` : ''}</Text>
              <MapPin size={16} color={Colors.darkGray} />
            </View>
          )}

          <Text style={styles.price}>{totalPrice.toLocaleString('ar-EG')} ج.م</Text>

          {/* Quick Action Buttons (WhatsApp / Call) */}
          <View style={styles.actionsBar}>
            <TouchableOpacity style={styles.waBtn} onPress={handleWhatsApp}>
              <MessageCircle size={20} color="#fff" />
              <Text style={styles.waBtnText}>تواصل عبر واتساب</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
              <Phone size={20} color={Colors.primary} />
              <Text style={styles.callBtnText}>اتصال هاتفياً</Text>
            </TouchableOpacity>
          </View>
          
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
            {unit.finishingStatus && (
              <View style={styles.featureBox}>
                <Text style={styles.featureLabel}>التشطيب</Text>
                <Text style={styles.featureValue}>{unit.finishingStatus}</Text>
              </View>
            )}
          </View>

          {images.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>معرض الصور ({images.length})</Text>
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
                    <PlayCircle color={Colors.accent} size={30} />
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
            <Text style={styles.sectionTitle}>تفاصيل السعر والدفع</Text>
            <View style={styles.detailsBox}>
              <Text style={styles.detailsText}>السعر الإجمالي: {totalPrice.toLocaleString('ar-EG')} ج.م</Text>
              {cashPaid > 0 && (
                <Text style={styles.detailsText}>
                  {unit.sellerType === 'DEVELOPER' ? 'المقدم المطلوب' : 'المبلغ المدفوع للمالك كاش'}: {cashPaid.toLocaleString('ar-EG')} ج.م
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
                  <Text style={styles.featureLabel}>القسط الشهري المعادل</Text>
                  <Text style={styles.featureValue}>{monthlyInstallment.toLocaleString('ar-EG')} ج.م</Text>
                </View>
              </View>
            </View>
          )}
          
          <UnitLeadForm unitId={unit.id} unitPrice={totalPrice} sellerType={unit.sellerType} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorText: { color: Colors.primary, fontSize: 18, fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: Colors.gray },
  coverImage: { width: '100%', height: 280, backgroundColor: Colors.darkGray },
  content: { padding: 20, backgroundColor: Colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, shadowColor: Colors.text, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  badgeRow: { flexDirection: 'row-reverse', gap: 8, marginBottom: 10 },
  verifiedBadge: { fontSize: 12, fontWeight: 'bold', color: '#B45309', backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  seaBadge: { fontSize: 12, fontWeight: 'bold', color: '#0369A1', backgroundColor: '#E0F2FE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  devBadge: { fontSize: 12, fontWeight: 'bold', color: '#065F46', backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  sellerBadge: { fontSize: 12, fontWeight: 'bold', color: Colors.primary, backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 6 },
  locRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginBottom: 12 },
  locText: { fontSize: 14, color: Colors.darkGray },
  price: { fontSize: 24, fontWeight: 'bold', color: Colors.accent, textAlign: 'right', marginBottom: 16 },
  actionsBar: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  waBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#25D366', paddingVertical: 12, borderRadius: 12, gap: 8 },
  waBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  callBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gray, borderWidth: 1, borderColor: '#D1D5DB', paddingVertical: 12, borderRadius: 12, gap: 8 },
  callBtnText: { color: Colors.primary, fontWeight: 'bold', fontSize: 14 },
  featuresRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 24 },
  featureBox: { flex: 1, backgroundColor: Colors.gray, borderRadius: 12, padding: 10, alignItems: 'center', marginHorizontal: 3 },
  featureLabel: { fontSize: 11, color: Colors.darkGray, marginBottom: 4 },
  featureValue: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 12 },
  description: { fontSize: 15, color: Colors.text, textAlign: 'right', lineHeight: 24 },
  galleryImage: { width: width * 0.45, height: 130, borderRadius: 12, backgroundColor: Colors.gray },
  videosContainer: { gap: 10, flexDirection: 'column' },
  videoButton: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.gray, padding: 12, borderRadius: 12, gap: 12 },
  videoText: { fontSize: 15, color: Colors.primary, fontWeight: 'bold' },
  detailsBox: { backgroundColor: Colors.gray, padding: 16, borderRadius: 12, gap: 8 },
  detailsText: { fontSize: 15, color: Colors.text, textAlign: 'right', fontWeight: '600' },
  detailsRow: { flexDirection: 'row-reverse', gap: 12 },
  detailsBoxHalf: { flex: 1, backgroundColor: Colors.gray, padding: 14, borderRadius: 12, alignItems: 'center' },
});
