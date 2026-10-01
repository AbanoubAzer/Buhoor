import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable, Linking, Dimensions, TouchableOpacity, Share, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLocalSearchParams, Stack, Link, useRouter } from 'expo-router';
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
  ChevronLeft,
  ChevronRight,
  Share2
} from 'lucide-react-native';
import Colors from '../../constants/Colors';
import UnitLeadForm from '../../components/UnitLeadForm';
import LanguageSwitcher from '../../components/LanguageSwitcher';
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
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite, language, t, getLocalized } = useStore();
  const isRtl = language === 'ar';

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
        <Text style={styles.errorText}>{isRtl ? 'الوحدة غير موجودة' : 'Unit not found'}</Text>
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

  
  const title = getLocalized(unit, 'title') || unit.title;
  const description = getLocalized(unit, 'description') || unit.description;
  const locName = getLocalized(unit, 'location') || unit.location?.name;

  const handleShare = async () => {
    if (!unit) return;
    const webUrl = `https://buhoor-web.vercel.app/units/${unit.id}`;
    const priceText = totalPrice > 0 ? `${totalPrice.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${t('currency')}` : '';
    const locText = locName ? `\n📍 ${locName}` : '';
    const shareMessage = `🏡 ${title}${priceText ? `\n💰 ${priceText}` : ''}${locText}\n\n🔗 ${webUrl}`;

    try {
      await Share.share({
        message: shareMessage,
        url: webUrl,
        title: title,
      });
    } catch (error) {
      console.error('Error sharing unit:', error);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: '',
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={{ paddingHorizontal: 6, paddingVertical: 4 }}
              accessibilityLabel={t('back')}
            >
              {isRtl ? (
                <ChevronRight size={26} color={Colors.primary} />
              ) : (
                <ChevronLeft size={26} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
              <LanguageSwitcher />
              <TouchableOpacity onPress={handleShare} style={{ padding: 6 }} accessibilityLabel={t('share')}>
                <Share2 color={Colors.primary} size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleFavorite(unit.id)} style={{ padding: 6 }} accessibilityLabel="Favorites">
                <Heart 
                  color={isFav ? Colors.accent : Colors.primary} 
                  fill={isFav ? Colors.accent : 'transparent'} 
                  size={22} 
                />
              </TouchableOpacity>
            </View>
          )
        }} 
      />
      <KeyboardAwareScrollView
        style={styles.container}
        bounces={false}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={150}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={{ uri: coverImage }} contentFit="cover" style={styles.coverImage} />
        
        <View style={styles.content}>
          
          {/* Top Badges */}
          <View style={[styles.badgeRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {unit.isVerified && <Text style={styles.verifiedBadge}>{isRtl ? '⭐ موثق ومعتمد' : '⭐ Verified & Certified'}</Text>}
            {isSea && <Text style={styles.seaBadge}>{isRtl ? '🌊 إطلالة بحرية' : '🌊 Sea View'}</Text>}
            <Text style={unit.sellerType === 'DEVELOPER' ? styles.devBadge : styles.sellerBadge}>
              {unit.sellerType === 'DEVELOPER' ? isRtl ? '🏢 مطور مباشر (0% عمولة)' : '🏢 Direct Developer (0% Commission)' : isRtl ? '👤 بيع أفراد (إعادة بيع)' : '👤 Individual Sale (Resale)'}
            </Text>
            {unit.deliveryStatus && (
              <Text style={styles.deliveryBadge}>
                {unit.deliveryStatus === 'READY' ? isRtl ? '✅ جاهز فوراً' : '✅ Ready Now' : `🏗️ استلام ${unit.deliveryYear || ''}`}
              </Text>
            )}
          </View>

          {/* Buyer Commission Highlight Banner */}
          {unit.sellerType === 'DEVELOPER' ? (
            <View style={[styles.commissionBannerGreen, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <ShieldCheck size={20} color="#065F46" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.commissionBannerTitleGreen, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isRtl ? '🎉 بدون أي عمولة من المشتري (0%)' : '🎉 0% Buyer Commission'}
                </Text>
                <Text style={[styles.commissionBannerSubGreen, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isRtl ? 'هذا العقار معروض مباشرة من شركة التطوير العقاري المعتمدة بدون رسوم إضافية.' : 'This property is offered directly by the certified developer without extra fees.'}
                </Text>
              </View>
            </View>
          ) : (
            <View style={[styles.commissionBannerBlue, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <ShieldCheck size={20} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.commissionBannerTitleBlue, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isRtl ? 'عمولة المنصة للمشتري: 1.25% فقط' : 'Platform Commission for Buyer: Only 1.25%'}
                </Text>
                <Text style={[styles.commissionBannerSubBlue, { textAlign: isRtl ? 'right' : 'left' }]}>
                  {isRtl ? 'عقار إعادة بيع من فرد. المالك البائع لا يدفع أي عمولة للمنصة.' : 'Resale property from an individual. The selling owner pays no commission to the platform.'}
                </Text>
              </View>
            </View>
          )}

          <Text style={[styles.title, { textAlign: isRtl ? 'right' : 'left' }]}>{title}</Text>
          
          {locName ? (
            <View style={[styles.locRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <MapPin size={16} color={Colors.darkGray} />
              <Text style={[styles.locText, { textAlign: isRtl ? 'right' : 'left' }]}>
                {unit.location?.governorate ? (isRtl ? `${unit.location.governorate}، ${locName}` : `${locName}, ${unit.location.governorate}`) : locName}
              </Text>
            </View>
          ) : null}

          {/* Price Box */}
          <View style={[styles.priceContainer, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <View>
              <Text style={[styles.priceLabel, { textAlign: isRtl ? 'right' : 'left' }]}>
                {unit.sellerType === 'DEVELOPER' && cashPaid > 0 ? (isRtl ? 'المقدم المطلوب' : 'Required Down Payment') : (isRtl ? 'السعر الكلي' : 'Total Price')}
              </Text>
              <Text style={[styles.price, { textAlign: isRtl ? 'right' : 'left' }]}>
                {(cashPaid > 0 && unit.sellerType === 'DEVELOPER' ? cashPaid : totalPrice).toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}
              </Text>
            </View>
            {totalPrice > 0 && cashPaid > 0 && cashPaid !== totalPrice && (
              <View style={styles.totalPriceBadge}>
                <Text style={styles.totalPriceLabel}>{isRtl ? 'إجمالي سعر العقار' : 'Total Property Price'}</Text>
                <Text style={styles.totalPriceVal}>{totalPrice.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}</Text>
              </View>
            )}
          </View>

          {/* Developer & Project Reference Card */}
          {(unit.developer || unit.project) && (
            <View style={[styles.devCard, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              {Boolean(unit.developer?.logoUrl || unit.developer?.logo) && (
                <Image
                  source={{ uri: unit.developer.logoUrl || unit.developer.logo }}
                  style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', marginEnd: 10 }}
                  contentFit="contain"
                />
              )}
              <View style={{ flex: 1 }}>
                {unit.developer && (
                  <View style={[styles.devCardItem, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <Text style={styles.devCardLabel}>{isRtl ? 'المطور العقاري:' : 'Developer:'}</Text>
                    <Text style={styles.devCardValue}>🏢 {unit.developer.name}</Text>
                  </View>
                )}
                {unit.project && (
                  <View style={[styles.devCardItem, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <Text style={styles.devCardLabel}>{isRtl ? 'المشروع:' : 'Project:'}</Text>
                    <Text style={styles.devCardValue}>📁 {unit.project.name}</Text>
                  </View>
                )}
              </View>
              {unit.project?.id && (
                <Link href={`/project/${unit.project.id}`} asChild>
                  <TouchableOpacity style={styles.devCardBtn}>
                    <Text style={styles.devCardBtnText}>{isRtl ? 'تفاصيل المشروع' : 'Project Details'}</Text>
                    <ChevronLeft size={16} color={Colors.primary} style={{ transform: [{ rotate: isRtl ? '0deg' : '180deg' }] }} />
                  </TouchableOpacity>
                </Link>
              )}
            </View>
          )}

          {/* Quick Action Buttons (WhatsApp / Call / Share) */}
          <View style={styles.actionsBar}>
            <TouchableOpacity style={styles.waBtn} onPress={handleWhatsApp}>
              <MessageCircle size={18} color="#fff" />
              <Text style={styles.waBtnText}>{t('contactWhatsApp')}</Text>
            </TouchableOpacity>

            

            <TouchableOpacity style={styles.shareActionBtn} onPress={handleShare}>
              <Share2 size={18} color={Colors.primary} />
              <Text style={styles.shareActionBtnText}>{t('shareProperty')}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Specifications Grid */}
          <View style={[styles.featuresRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <View style={styles.featureBox}>
              <Text style={styles.featureLabel}>{t('area')}</Text>
              <Text style={styles.featureValue}>{unit.area} {t('sqm')}</Text>
            </View>
            <View style={styles.featureBox}>
              <Text style={styles.featureLabel}>{t('bedrooms')}</Text>
              <Text style={styles.featureValue}>{unit.bedrooms || '-'}</Text>
            </View>
            <View style={styles.featureBox}>
              <Text style={styles.featureLabel}>{t('bathrooms')}</Text>
              <Text style={styles.featureValue}>{unit.bathrooms || '-'}</Text>
            </View>
            <View style={styles.featureBox}>
              <Text style={styles.featureLabel}>{t('unitType') || (language === 'ar' ? 'نوع الوحدة' : 'Type')}</Text>
              <Text style={styles.featureValue}>{getLocalized(unit, 'unitType') || unit.unitType?.name || '-'}</Text>
            </View>
          </View>

          {/* ================= ROI & INVESTMENT ENGINE ================= */}
          {totalPrice > 0 && (
            <View style={styles.roiContainer}>
              <View style={[styles.roiHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={[styles.roiHeaderRight, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <View style={styles.roiIconBg}>
                    <TrendingUp size={22} color="#065F46" />
                  </View>
                  <View>
                    <Text style={[styles.roiTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'الجدوى والعائد على الاستثمار (ROI)' : 'Feasibility & Return on Investment (ROI)'}</Text>
                    <Text style={[styles.roiSub, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'تقدير الإيجار (270 ليلة - إشغال 75%) + نمو القيمة' : 'Rent Estimate (270 nights - 75% occupancy) + Capital Growth'}</Text>
                  </View>
                </View>
                <View style={[styles.roiTag, isSea ? styles.roiTagSea : styles.roiTagRes]}>
                  <Text style={[styles.roiTagText, isSea ? styles.roiTagTextSea : styles.roiTagTextRes]}>
                    {isSea ? (isRtl ? '🌊 سياحي بحري (+30%)' : '🌊 Tourist Coastal (+30%)') : (isRtl ? '🏢 سكني (+10%)' : '🏢 Residential (+10%)')}
                  </Text>
                </View>
              </View>

              {/* 4 Key Stat Cards */}
              <View style={[styles.roiGrid, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                {/* 1. الإيجار السنوي */}
                <View style={[styles.roiCard, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.roiCardLabel, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? '🏡 الإيجار السنوي المتوقع' : '🏡 Expected Annual Rent'}</Text>
                  <Text style={styles.roiCardValueGreen}>{annualRent.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}</Text>
                  <Text style={[styles.roiCardSubGreen, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {isRtl ? `عائد ${rentalYield}% (~${nightlyRate.toLocaleString('ar-EG')} ج/ليلة)` : `${rentalYield}% yield (~${nightlyRate.toLocaleString('en-US')} ${t('currency')}/night)`}
                  </Text>
                </View>

                {/* 2. نمو ثمن العقار */}
                <View style={[styles.roiCard, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.roiCardLabel, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? '📈 نمو قيمة العقار' : '📈 Property Value Growth'}</Text>
                  <Text style={styles.roiCardValueBlue}>+{appreciation}% {isRtl ? 'سنوياً' : '/yr'}</Text>
                  <Text style={[styles.roiCardSubBlue, { textAlign: isRtl ? 'right' : 'left' }]}>
                    +{annualAppreciationEgp.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {isRtl ? 'ج زيادة' : `${t('currency')} gain`}
                  </Text>
                </View>

                {/* 3. إجمالي العائد */}
                <View style={[styles.roiCardPrimary, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.roiCardLabelWhite, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? '🚀 إجمالي العائد (Total ROI)' : '🚀 Total Return (Total ROI)'}</Text>
                  <Text style={styles.roiCardValueWhite}>{totalRoi}%</Text>
                  <Text style={[styles.roiCardSubWhite, { textAlign: isRtl ? 'right' : 'left' }]}>
                    ~{totalAnnualEgp.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {isRtl ? 'ج أرباح سنوية' : `${t('currency')} annual gain`}
                  </Text>
                </View>

                {/* 4. استرداد القيمة */}
                <View style={[styles.roiCard, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.roiCardLabel, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? '⏳ استرداد ثمن العقار' : '⏳ Property Payback Period'}</Text>
                  <Text style={styles.roiCardValueAmber}>{paybackYears ? `${paybackYears} ${isRtl ? 'سنوات' : 'years'}` : '-'}</Text>
                  <Text style={[styles.roiCardSubAmber, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'من الإيجار الكاش الصافي' : 'From Pure Cash Rent'}</Text>
                </View>
              </View>

              {/* Compound Capital Growth (Year 1, 3, 5) */}
              <View style={styles.compoundSection}>
                <View style={[styles.compoundHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Sparkles size={16} color="#065F46" />
                  <Text style={[styles.compoundTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'توقعات نمو القيمة الرأسمالية التراكمية (العائد المركّب)' : 'Cumulative Capital Growth Expectations (Compound Return)'}</Text>
                </View>

                <View style={styles.compoundGrid}>
                  <View style={styles.compoundCard}>
                    <View style={[styles.compoundCardTop, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                      <Text style={styles.compoundCardYear}>{isRtl ? 'بعد سنة (Year 1)' : 'After 1 Year (Year 1)'}</Text>
                      <Text style={styles.compoundGainBadge}>+{year1GainPercent}%</Text>
                    </View>
                    <Text style={[styles.compoundValue, { textAlign: isRtl ? 'right' : 'left' }]}>{year1Value.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}</Text>
                    <Text style={[styles.compoundRentSub, { textAlign: isRtl ? 'right' : 'left' }]}>
                      {isRtl ? `+ إيجار: ${annualRent.toLocaleString('ar-EG')} ج` : `+ Rent: ${annualRent.toLocaleString('en-US')} ${t('currency')}`}
                    </Text>
                  </View>

                  <View style={styles.compoundCard}>
                    <View style={[styles.compoundCardTop, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                      <Text style={styles.compoundCardYear}>{isRtl ? 'بعد 3 سنوات (Year 3)' : 'After 3 Years (Year 3)'}</Text>
                      <Text style={styles.compoundGainBadge}>+{year3GainPercent}%</Text>
                    </View>
                    <Text style={[styles.compoundValue, { textAlign: isRtl ? 'right' : 'left' }]}>{year3Value.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}</Text>
                    <Text style={[styles.compoundRentSub, { textAlign: isRtl ? 'right' : 'left' }]}>
                      {isRtl ? `+ إيجار تراكمي: ${year3TotalRent.toLocaleString('ar-EG')} ج` : `+ Cum. Rent: ${year3TotalRent.toLocaleString('en-US')} ${t('currency')}`}
                    </Text>
                  </View>

                  <View style={[styles.compoundCard, styles.compoundCard5]}>
                    <View style={[styles.compoundCardTop, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                      <Text style={[styles.compoundCardYear, { color: '#fff' }]}>{isRtl ? 'بعد 5 سنوات (Year 5)' : 'After 5 Years (Year 5)'}</Text>
                      <Text style={[styles.compoundGainBadge, { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }]}>
                        +{year5GainPercent}%
                      </Text>
                    </View>
                    <Text style={[styles.compoundValue, { color: '#fff', textAlign: isRtl ? 'right' : 'left' }]}>{year5Value.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}</Text>
                    <Text style={[styles.compoundRentSub, { color: '#D1FAE5', textAlign: isRtl ? 'right' : 'left' }]}>
                      {isRtl ? `+ إيجار تراكمي: ${year5TotalRent.toLocaleString('ar-EG')} ج` : `+ Cum. Rent: ${year5TotalRent.toLocaleString('en-US')} ${t('currency')}`}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Payback Explanation */}
              {paybackYears && (
                <View style={[styles.paybackBox, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.paybackTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? '💡 رؤيتان ذكيتان لاسترداد رأس المال:' : '💡 Two Smart Capital Recovery Visions:'}</Text>
                  <Text style={[styles.paybackText, { textAlign: isRtl ? 'right' : 'left' }]}>
                    1. <Text style={{ fontWeight: 'bold' }}>{isRtl ? 'استرداد نقدي بحت:' : 'Pure Cash Recovery:'}</Text> {isRtl ? 'تسترد كامل ثمن الوحدة سيولة نقدية في جيبك خلال ' : 'You recover the full unit price in cash in your pocket within '}<Text style={{ fontWeight: 'bold', color: '#B45309' }}>{paybackYears} {isRtl ? 'سنوات' : 'years'}</Text> {isRtl ? 'من أرباح الإيجار اليومي فقط، ويبقى أصل العقار ملكاً حراً لك مجاناً.' : 'from daily rental yield only, leaving the unit as a completely free asset.'}
                  </Text>
                  <Text style={[styles.paybackText, { marginTop: 6, textAlign: isRtl ? 'right' : 'left' }]}>
                    2. <Text style={{ fontWeight: 'bold' }}>{isRtl ? 'استرداد القيمة الشاملة:' : 'Comprehensive Value Recovery:'}</Text> {isRtl ? `بدمج إيرادات الإيجار مع نمو قيمة العقار السنوي (+${appreciation}%)، يتجاوز إجمالي ما حققه استثمارك 100% من ثمن الشراء في غضون ` : `By combining rental revenues with annual capital appreciation (+${appreciation}%), total returns exceed 100% of purchase price within `}<Text style={{ fontWeight: 'bold', color: '#065F46' }}>{totalPaybackYears} {isRtl ? 'سنة فقط' : 'years only'}</Text>!
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Payment & Installment Breakdown */}
          {remainingInstallments > 0 ? (
            <View style={styles.installmentContainer}>
              <Text style={[styles.installmentTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? '💳 تفاصيل نظام السداد والأقساط' : '💳 Payment Plan & Installments Details'}</Text>
              <View style={[styles.installmentGrid, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={[styles.installmentBox, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.installmentLabel, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'المقدم المطلوب' : 'Required Down Payment'}</Text>
                  <Text style={[styles.installmentValue, { textAlign: isRtl ? 'right' : 'left' }]}>{cashPaid.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}</Text>
                </View>
                <View style={[styles.installmentBox, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.installmentLabel, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'إجمالي الأقساط المتبقية' : 'Total Remaining Installments'}</Text>
                  <Text style={[styles.installmentValue, { textAlign: isRtl ? 'right' : 'left' }]}>{remainingInstallments.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}</Text>
                </View>
                <View style={[styles.installmentBox, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.installmentLabel, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'القسط الشهري المعادل' : 'Equivalent Monthly Installment'}</Text>
                  <Text style={[styles.installmentValueOrange, { textAlign: isRtl ? 'right' : 'left' }]}>{monthlyInstallment.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {isRtl ? 'ج.م/شهر' : `${t('currency')}/mo`}</Text>
                </View>
                {unit.installmentsCount && (
                  <View style={[styles.installmentBox, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                    <Text style={[styles.installmentLabel, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'عدد الأقساط' : 'Number of Installments'}</Text>
                    <Text style={[styles.installmentValue, { textAlign: isRtl ? 'right' : 'left' }]}>{unit.installmentsCount} {isRtl ? 'قسط' : 'installments'}</Text>
                  </View>
                )}
                {unit.installmentFrequency && (
                  <View style={[styles.installmentBox, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                    <Text style={[styles.installmentLabel, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'دورية السداد' : 'Payment Frequency'}</Text>
                    <Text style={[styles.installmentValue, { textAlign: isRtl ? 'right' : 'left' }]}>
                      {unit.installmentFrequency === 'MONTHLY' ? (isRtl ? 'شهري' : 'Monthly') :
                       unit.installmentFrequency === 'QUARTERLY' ? (isRtl ? 'ربع سنوي' : 'Quarterly') :
                       unit.installmentFrequency === 'SEMI_ANNUAL' ? (isRtl ? 'نصف سنوي' : 'Semi-Annual') : (isRtl ? 'سنوي' : 'Annual')}
                    </Text>
                  </View>
                )}
                {unit.cashDiscountPercentage && Number(unit.cashDiscountPercentage) > 0 && (
                  <View style={[styles.discountBox, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                    <Text style={[styles.discountLabel, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'خصم الدفع الكاش' : 'Cash Payment Discount'}</Text>
                    <Text style={[styles.discountValue, { textAlign: isRtl ? 'right' : 'left' }]}>{unit.cashDiscountPercentage}% {isRtl ? 'خصم' : 'Discount'}</Text>
                  </View>
                )}
              </View>
            </View>
          ) : unit.isCashOnly ? (
            <View style={[styles.cashOnlyContainer, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.cashOnlyTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? '💵 نظام الدفع: كاش فقط' : '💵 Payment Plan: Cash Only'}</Text>
              <Text style={[styles.cashOnlySub, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'هذا العقار معروض للبيع السريع نظام كاش بدون أقساط طويلة الأجل' : 'This property is offered for quick sale on a cash basis without long-term installments.'}</Text>
              {unit.cashDiscountPercentage && Number(unit.cashDiscountPercentage) > 0 && (
                <Text style={styles.cashDiscountBadge}>{isRtl ? `خصم كاش مميز: ${unit.cashDiscountPercentage}%` : `Special Cash Discount: ${unit.cashDiscountPercentage}%`}</Text>
              )}
            </View>
          ) : null}

          {/* Photo Gallery */}
          {images.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                {isRtl ? 'معرض الصور' : 'Photo Gallery'} ({images.length})
              </Text>
              <FlatList
                horizontal
                data={images}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} contentFit="cover" style={styles.galleryImage} />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, flexDirection: isRtl ? 'row-reverse' : 'row' }}
              />
            </View>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'الفيديوهات' : 'Videos'}</Text>
              <View style={[styles.videosContainer, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                {videos.map((vid: string, index: number) => (
                  <Pressable key={index} style={[styles.videoButton, { flexDirection: isRtl ? 'row-reverse' : 'row' }]} onPress={() => openVideo(vid)}>
                    <PlayCircle color={Colors.accent} size={30} />
                    <Text style={styles.videoText}>{isRtl ? `مشاهدة الفيديو ${index + 1}` : `Watch Video ${index + 1}`}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          
          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'الوصف والتفاصيل' : 'Description & Details'}</Text>
            <Text style={[styles.description, { textAlign: isRtl ? 'right' : 'left' }]}>
              {unit.description || (isSea
                ? (isRtl ? 'استوديو فاخر ومميز بإطلالة ساحرة وموقع استراتيجي راقٍ بالقرب من الخدمات والمارينا. الوحدة مشطبة بأعلى المعايير وجاهزة تماماً للاستثمار العقاري والإيجار الفندقي عبر منصات Airbnb و Booking بعائد إيجاري مرتفع ومضمون طوال العام.' : 'Luxurious and distinguished studio with a charming view and a sophisticated strategic location near services and the marina. The unit is finished to the highest standards and is fully ready for real estate investment and hotel rental via Airbnb and Booking platforms with a high and guaranteed rental yield throughout the year.')
                : (isRtl ? 'وحدة مميزة بموقع استراتيجي متكامل الخدمات وتشطيب راقٍ، مناسبة جداً للسكن والاستثمار العقاري.' : 'A distinguished unit in a strategic location with integrated services and sophisticated finishing, highly suitable for living and real estate investment.'))
              }
            </Text>
          </View>
          
          {/* Lead Booking Form */}
          <UnitLeadForm unitId={unit.id} unitPrice={totalPrice} sellerType={unit.sellerType} />
        </View>
      </KeyboardAwareScrollView>
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
  waBtn: { flex: 1.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#25D366', paddingVertical: 12, borderRadius: 12, gap: 6 },
  waBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  callBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gray, borderWidth: 1, borderColor: '#D1D5DB', paddingVertical: 12, borderRadius: 12, gap: 6 },
  callBtnText: { color: Colors.primary, fontWeight: 'bold', fontSize: 13 },
  shareActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB', paddingVertical: 12, borderRadius: 12, gap: 6 },
  shareActionBtnText: { color: Colors.primary, fontWeight: 'bold', fontSize: 13 },

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
