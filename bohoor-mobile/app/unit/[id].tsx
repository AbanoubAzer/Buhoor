import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList, Pressable, Linking, Dimensions, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { Image } from 'expo-image';
import axios from 'axios';
import { 
  PlayCircle, 
  MessageCircle, 
  Phone, 
  Heart, 
  MapPin, 
  Building, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  Layers,
  ChevronLeft
} from 'lucide-react-native';
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

  // Investment & ROI Breakdown Calculations (matching web engine)
  const isSea = Boolean(
    unit.isSeaView ||
    unit.location?.name?.includes('جونة') ||
    unit.location?.name?.includes('ساحل') ||
    unit.location?.name?.includes('بحر') ||
    unit.location?.name?.includes('غردقة') ||
    unit.title?.includes('بحر') ||
    unit.title?.includes('شاليه')
  );

  const rentalYield = Number(unit.expectedRentalRoi) > 0 
    ? Number(unit.expectedRentalRoi) 
    : (isSea ? 16.5 : 12.0);

  const annualRent = Math.round(totalPrice * (rentalYield / 100));
  const nightlyRate = Math.round(annualRent / 270);
  const appreciation = isSea ? 30 : 10;
  const annualAppreciationEgp = Math.round(totalPrice * (appreciation / 100));
  const totalRoi = Number((rentalYield + appreciation).toFixed(1));
  const totalAnnualEgp = annualRent + annualAppreciationEgp;
  const paybackYears = annualRent > 0 ? (totalPrice / annualRent).toFixed(1) : null;
  const totalPaybackYears = totalRoi > 0 ? (100 / totalRoi).toFixed(1) : null;

  // Compound appreciation
  const rate = appreciation / 100;
  const year1Value = Math.round(totalPrice * Math.pow(1 + rate, 1));
  const year3Value = Math.round(totalPrice * Math.pow(1 + rate, 3));
  const year5Value = Math.round(totalPrice * Math.pow(1 + rate, 5));
  const year1GainPercent = Math.round((Math.pow(1 + rate, 1) - 1) * 100);
  const year3GainPercent = Math.round((Math.pow(1 + rate, 3) - 1) * 100);
  const year5GainPercent = Math.round((Math.pow(1 + rate, 5) - 1) * 100);
  const year3TotalRent = annualRent * 3;
  const year5TotalRent = annualRent * 5;

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
            {isSea && <Text style={styles.seaBadge}>🌊 إطلالة بحرية</Text>}
            <Text style={unit.sellerType === 'DEVELOPER' ? styles.devBadge : styles.sellerBadge}>
              {unit.sellerType === 'DEVELOPER' ? '🏢 مطور مباشر (0% عمولة)' : '👤 بيع أفراد (إعادة بيع)'}
            </Text>
            {unit.deliveryStatus && (
              <Text style={styles.deliveryBadge}>
                {unit.deliveryStatus === 'READY' ? '✅ جاهز فوراً' : `🏗️ استلام ${unit.deliveryYear || ''}`}
              </Text>
            )}
          </View>

          {/* Buyer Commission Highlight Banner */}
          {unit.sellerType === 'DEVELOPER' ? (
            <View style={styles.commissionBannerGreen}>
              <ShieldCheck size={20} color="#065F46" />
              <View style={{ flex: 1 }}>
                <Text style={styles.commissionBannerTitleGreen}>🎉 بدون أي عمولة من المشتري (0%)</Text>
                <Text style={styles.commissionBannerSubGreen}>هذا العقار معروض مباشرة من شركة التطوير العقاري المعتمدة بدون رسوم إضافية.</Text>
              </View>
            </View>
          ) : (
            <View style={styles.commissionBannerBlue}>
              <ShieldCheck size={20} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.commissionBannerTitleBlue}>عمولة المنصة للمشتري: 1.25% فقط</Text>
                <Text style={styles.commissionBannerSubBlue}>عقار إعادة بيع من فرد. المالك البائع لا يدفع أي عمولة للمنصة.</Text>
              </View>
            </View>
          )}

          <Text style={styles.title}>{unit.title}</Text>
          
          {unit.location?.name && (
            <View style={styles.locRow}>
              <Text style={styles.locText}>
                {unit.location.governorate ? `${unit.location.governorate}، ${unit.location.name}` : unit.location.name}
              </Text>
              <MapPin size={16} color={Colors.darkGray} />
            </View>
          )}

          {/* Price Box */}
          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.priceLabel}>
                {unit.sellerType === 'DEVELOPER' && cashPaid > 0 ? 'المقدم المطلوب' : 'السعر الكلي'}
              </Text>
              <Text style={styles.price}>
                {(cashPaid > 0 && unit.sellerType === 'DEVELOPER' ? cashPaid : totalPrice).toLocaleString('ar-EG')} ج.م
              </Text>
            </View>
            {totalPrice > 0 && cashPaid > 0 && cashPaid !== totalPrice && (
              <View style={styles.totalPriceBadge}>
                <Text style={styles.totalPriceLabel}>إجمالي سعر العقار</Text>
                <Text style={styles.totalPriceVal}>{totalPrice.toLocaleString('ar-EG')} ج.م</Text>
              </View>
            )}
          </View>

          {/* Developer & Project Reference Card */}
          {(unit.developer || unit.project) && (
            <View style={styles.devCard}>
              <View style={{ flex: 1 }}>
                {unit.developer && (
                  <View style={styles.devCardItem}>
                    <Text style={styles.devCardLabel}>المطور العقاري:</Text>
                    <Text style={styles.devCardValue}>🏢 {unit.developer.name}</Text>
                  </View>
                )}
                {unit.project && (
                  <View style={styles.devCardItem}>
                    <Text style={styles.devCardLabel}>المشروع:</Text>
                    <Text style={styles.devCardValue}>📁 {unit.project.name}</Text>
                  </View>
                )}
              </View>
              {unit.project?.id && (
                <Link href={`/project/${unit.project.id}`} asChild>
                  <TouchableOpacity style={styles.devCardBtn}>
                    <Text style={styles.devCardBtnText}>تفاصيل المشروع</Text>
                    <ChevronLeft size={16} color={Colors.primary} />
                  </TouchableOpacity>
                </Link>
              )}
            </View>
          )}

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
          
          {/* Specifications Grid */}
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
            <View style={styles.featureBox}>
              <Text style={styles.featureLabel}>نوع الوحدة</Text>
              <Text style={styles.featureValue}>{unit.unitType?.name || '-'}</Text>
            </View>
          </View>

          {/* ================= ROI & INVESTMENT ENGINE ================= */}
          {totalPrice > 0 && (
            <View style={styles.roiContainer}>
              <View style={styles.roiHeader}>
                <View style={styles.roiHeaderRight}>
                  <View style={styles.roiIconBg}>
                    <TrendingUp size={22} color="#065F46" />
                  </View>
                  <View>
                    <Text style={styles.roiTitle}>الجدوى والعائد على الاستثمار (ROI)</Text>
                    <Text style={styles.roiSub}>تقدير الإيجار (270 ليلة - إشغال 75%) + نمو القيمة</Text>
                  </View>
                </View>
                <View style={[styles.roiTag, isSea ? styles.roiTagSea : styles.roiTagRes]}>
                  <Text style={[styles.roiTagText, isSea ? styles.roiTagTextSea : styles.roiTagTextRes]}>
                    {isSea ? '🌊 سياحي بحري (+30%)' : '🏢 سكني (+10%)'}
                  </Text>
                </View>
              </View>

              {/* 4 Key Stat Cards */}
              <View style={styles.roiGrid}>
                {/* 1. الإيجار السنوي */}
                <View style={styles.roiCard}>
                  <Text style={styles.roiCardLabel}>🏡 الإيجار السنوي المتوقع</Text>
                  <Text style={styles.roiCardValueGreen}>{annualRent.toLocaleString('ar-EG')} ج.م</Text>
                  <Text style={styles.roiCardSubGreen}>عائد {rentalYield}% (~{nightlyRate.toLocaleString('ar-EG')} ج/ليلة)</Text>
                </View>

                {/* 2. نمو ثمن العقار */}
                <View style={styles.roiCard}>
                  <Text style={styles.roiCardLabel}>📈 نمو قيمة العقار</Text>
                  <Text style={styles.roiCardValueBlue}>+{appreciation}% سنوياً</Text>
                  <Text style={styles.roiCardSubBlue}>+{annualAppreciationEgp.toLocaleString('ar-EG')} ج زيادة</Text>
                </View>

                {/* 3. إجمالي العائد */}
                <View style={styles.roiCardPrimary}>
                  <Text style={styles.roiCardLabelWhite}>🚀 إجمالي العائد (Total ROI)</Text>
                  <Text style={styles.roiCardValueWhite}>{totalRoi}%</Text>
                  <Text style={styles.roiCardSubWhite}>~{totalAnnualEgp.toLocaleString('ar-EG')} ج أرباح سنوية</Text>
                </View>

                {/* 4. استرداد القيمة */}
                <View style={styles.roiCard}>
                  <Text style={styles.roiCardLabel}>⏳ استرداد ثمن العقار</Text>
                  <Text style={styles.roiCardValueAmber}>{paybackYears ? `${paybackYears} سنوات` : '-'}</Text>
                  <Text style={styles.roiCardSubAmber}>من الإيجار الكاش الصافي</Text>
                </View>
              </View>

              {/* Compound Capital Growth (Year 1, 3, 5) */}
              <View style={styles.compoundSection}>
                <View style={styles.compoundHeader}>
                  <Sparkles size={16} color="#065F46" />
                  <Text style={styles.compoundTitle}>توقعات نمو القيمة الرأسمالية التراكمية (العائد المركّب)</Text>
                </View>

                <View style={styles.compoundGrid}>
                  <View style={styles.compoundCard}>
                    <View style={styles.compoundCardTop}>
                      <Text style={styles.compoundCardYear}>بعد سنة (Year 1)</Text>
                      <Text style={styles.compoundGainBadge}>+{year1GainPercent}%</Text>
                    </View>
                    <Text style={styles.compoundValue}>{year1Value.toLocaleString('ar-EG')} ج.م</Text>
                    <Text style={styles.compoundRentSub}>+ إيجار: {annualRent.toLocaleString('ar-EG')} ج</Text>
                  </View>

                  <View style={styles.compoundCard}>
                    <View style={styles.compoundCardTop}>
                      <Text style={styles.compoundCardYear}>بعد 3 سنوات (Year 3)</Text>
                      <Text style={styles.compoundGainBadge}>+{year3GainPercent}%</Text>
                    </View>
                    <Text style={styles.compoundValue}>{year3Value.toLocaleString('ar-EG')} ج.م</Text>
                    <Text style={styles.compoundRentSub}>+ إيجار تراكمي: {year3TotalRent.toLocaleString('ar-EG')} ج</Text>
                  </View>

                  <View style={[styles.compoundCard, styles.compoundCard5]}>
                    <View style={styles.compoundCardTop}>
                      <Text style={[styles.compoundCardYear, { color: '#fff' }]}>بعد 5 سنوات (Year 5)</Text>
                      <Text style={[styles.compoundGainBadge, { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }]}>
                        +{year5GainPercent}%
                      </Text>
                    </View>
                    <Text style={[styles.compoundValue, { color: '#fff' }]}>{year5Value.toLocaleString('ar-EG')} ج.م</Text>
                    <Text style={[styles.compoundRentSub, { color: '#D1FAE5' }]}>+ إيجار تراكمي: {year5TotalRent.toLocaleString('ar-EG')} ج</Text>
                  </View>
                </View>
              </View>

              {/* Payback Explanation */}
              {paybackYears && (
                <View style={styles.paybackBox}>
                  <Text style={styles.paybackTitle}>💡 رؤيتان ذكيتان لاسترداد رأس المال:</Text>
                  <Text style={styles.paybackText}>
                    1. <Text style={{ fontWeight: 'bold' }}>استرداد نقدي بحت:</Text> تسترد كامل ثمن الوحدة سيولة نقدية في جيبك خلال <Text style={{ fontWeight: 'bold', color: '#B45309' }}>{paybackYears} سنوات</Text> من أرباح الإيجار اليومي فقط، ويبقى أصل العقار ملكاً حراً لك مجاناً.
                  </Text>
                  <Text style={[styles.paybackText, { marginTop: 6 }]}>
                    2. <Text style={{ fontWeight: 'bold' }}>استرداد القيمة الشاملة:</Text> بدمج إيرادات الإيجار مع نمو قيمة العقار السنوي (+{appreciation}%)، يتجاوز إجمالي ما حققه استثمارك 100% من ثمن الشراء في غضون <Text style={{ fontWeight: 'bold', color: '#065F46' }}>{totalPaybackYears} سنة فقط</Text>!
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Payment & Installment Breakdown */}
          {remainingInstallments > 0 ? (
            <View style={styles.installmentContainer}>
              <Text style={styles.installmentTitle}>💳 تفاصيل نظام السداد والأقساط</Text>
              <View style={styles.installmentGrid}>
                <View style={styles.installmentBox}>
                  <Text style={styles.installmentLabel}>المقدم المطلوب</Text>
                  <Text style={styles.installmentValue}>{cashPaid.toLocaleString('ar-EG')} ج.م</Text>
                </View>
                <View style={styles.installmentBox}>
                  <Text style={styles.installmentLabel}>إجمالي الأقساط المتبقية</Text>
                  <Text style={styles.installmentValue}>{remainingInstallments.toLocaleString('ar-EG')} ج.م</Text>
                </View>
                <View style={styles.installmentBox}>
                  <Text style={styles.installmentLabel}>القسط الشهري المعادل</Text>
                  <Text style={styles.installmentValueOrange}>{monthlyInstallment.toLocaleString('ar-EG')} ج.م/شهر</Text>
                </View>
                {unit.installmentsCount && (
                  <View style={styles.installmentBox}>
                    <Text style={styles.installmentLabel}>عدد الأقساط</Text>
                    <Text style={styles.installmentValue}>{unit.installmentsCount} قسط</Text>
                  </View>
                )}
                {unit.installmentFrequency && (
                  <View style={styles.installmentBox}>
                    <Text style={styles.installmentLabel}>دورية السداد</Text>
                    <Text style={styles.installmentValue}>
                      {unit.installmentFrequency === 'MONTHLY' ? 'شهري' :
                       unit.installmentFrequency === 'QUARTERLY' ? 'ربع سنوي' :
                       unit.installmentFrequency === 'SEMI_ANNUAL' ? 'نصف سنوي' : 'سنوي'}
                    </Text>
                  </View>
                )}
                {unit.cashDiscountPercentage && Number(unit.cashDiscountPercentage) > 0 && (
                  <View style={styles.discountBox}>
                    <Text style={styles.discountLabel}>خصم الدفع الكاش</Text>
                    <Text style={styles.discountValue}>{unit.cashDiscountPercentage}% خصم</Text>
                  </View>
                )}
              </View>
            </View>
          ) : unit.isCashOnly ? (
            <View style={styles.cashOnlyContainer}>
              <Text style={styles.cashOnlyTitle}>💵 نظام الدفع: كاش فقط</Text>
              <Text style={styles.cashOnlySub}>هذا العقار معروض للبيع السريع نظام كاش بدون أقساط طويلة الأجل</Text>
              {unit.cashDiscountPercentage && Number(unit.cashDiscountPercentage) > 0 && (
                <Text style={styles.cashDiscountBadge}>خصم كاش مميز: {unit.cashDiscountPercentage}%</Text>
              )}
            </View>
          ) : null}

          {/* Photo Gallery */}
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

          {/* Videos */}
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
          
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الوصف والتفاصيل</Text>
            <Text style={styles.description}>
              {unit.description || (isSea
                ? 'استوديو فاخر ومميز بإطلالة ساحرة وموقع استراتيجي راقٍ بالقرب من الخدمات والمارينا. الوحدة مشطبة بأعلى المعايير وجاهزة تماماً للاستثمار العقاري والإيجار الفندقي عبر منصات Airbnb و Booking بعائد إيجاري مرتفع ومضمون طوال العام.'
                : 'وحدة مميزة بموقع استراتيجي متكامل الخدمات وتشطيب راقٍ، مناسبة جداً للسكن والاستثمار العقاري.')
              }
            </Text>
          </View>
          
          {/* Lead Booking Form */}
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
  content: { 
    padding: 20, 
    backgroundColor: Colors.background, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    marginTop: -24, 
    shadowColor: Colors.text, 
    shadowOffset: { width: 0, height: -2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 5 
  },
  badgeRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  verifiedBadge: { fontSize: 11, fontWeight: 'bold', color: '#B45309', backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  seaBadge: { fontSize: 11, fontWeight: 'bold', color: '#0369A1', backgroundColor: '#E0F2FE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  devBadge: { fontSize: 11, fontWeight: 'bold', color: '#065F46', backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  sellerBadge: { fontSize: 11, fontWeight: 'bold', color: Colors.primary, backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  deliveryBadge: { fontSize: 11, fontWeight: 'bold', color: '#92400E', backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },

  commissionBannerGreen: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    gap: 10,
    marginBottom: 14,
  },
  commissionBannerTitleGreen: { fontSize: 13, fontWeight: 'bold', color: '#065F46', textAlign: 'right' },
  commissionBannerSubGreen: { fontSize: 11, color: '#047857', textAlign: 'right', marginTop: 2, lineHeight: 16 },

  commissionBannerBlue: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    gap: 10,
    marginBottom: 14,
  },
  commissionBannerTitleBlue: { fontSize: 13, fontWeight: 'bold', color: Colors.primary, textAlign: 'right' },
  commissionBannerSubBlue: { fontSize: 11, color: Colors.darkGray, textAlign: 'right', marginTop: 2, lineHeight: 16 },

  title: { fontSize: 22, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 6 },
  locRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginBottom: 14 },
  locText: { fontSize: 14, color: Colors.darkGray },
  
  priceContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  priceLabel: { fontSize: 12, fontWeight: '600', color: Colors.darkGray, textAlign: 'right' },
  price: { fontSize: 24, fontWeight: 'bold', color: Colors.accent, textAlign: 'right' },
  totalPriceBadge: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1' },
  totalPriceLabel: { fontSize: 10, color: Colors.darkGray, textAlign: 'center' },
  totalPriceVal: { fontSize: 14, fontWeight: 'bold', color: Colors.primary, textAlign: 'center' },

  devCard: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginBottom: 16,
  },
  devCardItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, marginBottom: 2 },
  devCardLabel: { fontSize: 11, fontWeight: 'bold', color: '#6D28D9' },
  devCardValue: { fontSize: 13, fontWeight: 'bold', color: '#4C1D95' },
  devCardBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C4B5FD',
    gap: 4,
  },
  devCardBtnText: { fontSize: 11, fontWeight: 'bold', color: Colors.primary },

  actionsBar: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  waBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#25D366', paddingVertical: 12, borderRadius: 12, gap: 8 },
  waBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  callBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gray, borderWidth: 1, borderColor: '#D1D5DB', paddingVertical: 12, borderRadius: 12, gap: 8 },
  callBtnText: { color: Colors.primary, fontWeight: 'bold', fontSize: 14 },

  featuresRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 20 },
  featureBox: { flex: 1, backgroundColor: Colors.gray, borderRadius: 12, padding: 10, alignItems: 'center', marginHorizontal: 3 },
  featureLabel: { fontSize: 11, color: Colors.darkGray, marginBottom: 4 },
  featureValue: { fontSize: 13, fontWeight: 'bold', color: Colors.primary },

  // ROI Section Styles
  roiContainer: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  roiHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  roiHeaderRight: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  roiIconBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center' },
  roiTitle: { fontSize: 15, fontWeight: 'bold', color: '#064E3B', textAlign: 'right' },
  roiSub: { fontSize: 10, color: '#047857', textAlign: 'right' },
  roiTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  roiTagSea: { backgroundColor: '#E0F2FE', borderColor: '#BAE6FD', borderWidth: 1 },
  roiTagRes: { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0', borderWidth: 1 },
  roiTagText: { fontSize: 10, fontWeight: 'bold' },
  roiTagTextSea: { color: '#0369A1' },
  roiTagTextRes: { color: '#065F46' },

  roiGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  roiCard: {
    flexBasis: '48%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    alignItems: 'flex-end',
  },
  roiCardPrimary: {
    flexBasis: '48%',
    backgroundColor: '#047857',
    padding: 12,
    borderRadius: 14,
    alignItems: 'flex-end',
  },
  roiCardLabel: { fontSize: 10, fontWeight: 'bold', color: Colors.darkGray, marginBottom: 4, textAlign: 'right' },
  roiCardLabelWhite: { fontSize: 10, fontWeight: 'bold', color: '#D1FAE5', marginBottom: 4, textAlign: 'right' },
  roiCardValueGreen: { fontSize: 15, fontWeight: 'bold', color: '#065F46' },
  roiCardSubGreen: { fontSize: 9, fontWeight: '600', color: '#059669', marginTop: 2 },
  roiCardValueBlue: { fontSize: 15, fontWeight: 'bold', color: '#1E40AF' },
  roiCardSubBlue: { fontSize: 9, fontWeight: '600', color: '#2563EB', marginTop: 2 },
  roiCardValueWhite: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
  roiCardSubWhite: { fontSize: 9, fontWeight: '600', color: '#A7F3D0', marginTop: 2 },
  roiCardValueAmber: { fontSize: 15, fontWeight: 'bold', color: '#B45309' },
  roiCardSubAmber: { fontSize: 9, fontWeight: '600', color: '#D97706', marginTop: 2 },

  compoundSection: {
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
    paddingTop: 12,
    marginBottom: 12,
  },
  compoundHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, marginBottom: 10 },
  compoundTitle: { fontSize: 12, fontWeight: 'bold', color: '#064E3B', textAlign: 'right' },
  compoundGrid: { flexDirection: 'column', gap: 8 },
  compoundCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  compoundCard5: { backgroundColor: '#065F46', borderColor: '#047857' },
  compoundCardTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  compoundCardYear: { fontSize: 11, fontWeight: 'bold', color: Colors.primary },
  compoundGainBadge: { fontSize: 10, fontWeight: 'bold', color: '#065F46', backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  compoundValue: { fontSize: 14, fontWeight: 'bold', color: Colors.primary, textAlign: 'right' },
  compoundRentSub: { fontSize: 10, color: '#059669', textAlign: 'right', marginTop: 2 },

  paybackBox: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  paybackTitle: { fontSize: 12, fontWeight: 'bold', color: '#064E3B', textAlign: 'right', marginBottom: 6 },
  paybackText: { fontSize: 11, color: '#047857', textAlign: 'right', lineHeight: 18 },

  // Installment Styles
  installmentContainer: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  installmentTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 12 },
  installmentGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  installmentBox: {
    flexBasis: '48%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'flex-end',
  },
  installmentLabel: { fontSize: 10, color: Colors.darkGray, marginBottom: 2 },
  installmentValue: { fontSize: 13, fontWeight: 'bold', color: Colors.primary },
  installmentValueOrange: { fontSize: 13, fontWeight: 'bold', color: Colors.accent },
  discountBox: {
    flexBasis: '100%',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountLabel: { fontSize: 11, fontWeight: 'bold', color: '#065F46' },
  discountValue: { fontSize: 13, fontWeight: 'bold', color: '#047857' },

  cashOnlyContainer: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  cashOnlyTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  cashOnlySub: { fontSize: 11, color: Colors.darkGray, textAlign: 'right' },
  cashDiscountBadge: { fontSize: 12, fontWeight: 'bold', color: '#065F46', backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 8 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 12 },
  description: { fontSize: 14, color: Colors.text, textAlign: 'right', lineHeight: 22, backgroundColor: Colors.gray, padding: 14, borderRadius: 14 },
  galleryImage: { width: width * 0.45, height: 130, borderRadius: 12, backgroundColor: Colors.gray },
  videosContainer: { gap: 10, flexDirection: 'column' },
  videoButton: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.gray, padding: 12, borderRadius: 12, gap: 12 },
  videoText: { fontSize: 14, color: Colors.primary, fontWeight: 'bold' },
});
