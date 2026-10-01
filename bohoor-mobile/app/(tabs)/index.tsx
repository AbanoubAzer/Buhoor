import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  Dimensions,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import {
  TrendingUp,
  Building2,
  Sparkles,
  MessageCircle,
  MapPin,
  Search,
  Heart,
  Maximize2,
  BedDouble,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { useStore } from '../../store/useStore';
import AiSearchModal from '../../components/AiSearchModal';

const { width } = Dimensions.get('window');

const getDirectImageUrl = (url: string) => {
  if (!url) return url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/file/d/')[1]?.split('/')[0];
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  return url;
};

// ─── Hero Slider Component ───────────────────────────────────────────────────
function HeroSlider({ slides }: { slides: any[] }) {
  const { language } = useStore();
  const isRtl = language === 'ar';
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % slides.length;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length > 1) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [slides.length, startTimer]);

  if (slides.length === 0) return null;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
    if (idx !== activeIndex && idx >= 0 && idx < slides.length) {
      setActiveIndex(idx);
    }
  };

  return (
    <View style={heroStyles.container}>
      <FlatList
        ref={flatRef}
        data={slides}
        keyExtractor={(item, index) => (item.id || index).toString()}
        renderItem={({ item }) => {
          const img = item.image || item.imageUrl;
          const slideTitle = isRtl ? (item.titleAr || item.title) : (item.titleEn || item.title);
          const slideSub = isRtl ? (item.subtitleAr || item.subtitle) : (item.subtitleEn || item.subtitle);

          return (
            <View style={heroStyles.slide}>
              {img ? (
                <Image
                  source={{ uri: getDirectImageUrl(img) }}
                  contentFit="cover"
                  style={heroStyles.image}
                  transition={300}
                />
              ) : (
                <View style={[heroStyles.image, { backgroundColor: Colors.primary }]} />
              )}
              {/* Gradient Overlay */}
              <View style={heroStyles.overlay} />

              <View style={[heroStyles.badgePill, isRtl ? { right: 14 } : { left: 14 }]}>
                <Sparkles size={11} color={Colors.accentLight} />
                <Text style={heroStyles.badgeText}>{isRtl ? 'فرصة مميزة' : 'Featured'}</Text>
              </View>

              <View style={[heroStyles.textBox, { alignItems: isRtl ? 'flex-start' : 'flex-end' }]}>
                {slideTitle && (
                  <Text style={[heroStyles.title, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={2}>{slideTitle}</Text>
                )}
                {slideSub && (
                  <Text style={[heroStyles.subtitle, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={2}>{slideSub}</Text>
                )}
              </View>
            </View>
          );
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        onScrollBeginDrag={() => { if (timerRef.current) clearInterval(timerRef.current); }}
        onScrollEndDrag={startTimer}
        getItemLayout={(_, idx) => ({ length: width - 32, offset: (width - 32) * idx, index: idx })}
      />

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <View style={heroStyles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                heroStyles.dot,
                i === activeIndex && heroStyles.dotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}



// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, href }: { title: string; subtitle?: string; href: string }) {
  const { language, t } = useStore();
  const isRtl = language === 'ar';

  return (
    <View style={[sectionStyles.row, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
      <View style={{ flex: 1 }}>
        <Text style={[sectionStyles.title, { textAlign: isRtl ? 'right' : 'left' }]}>{title}</Text>
        {subtitle ? <Text style={[sectionStyles.subtitle, { textAlign: isRtl ? 'right' : 'left' }]}>{subtitle}</Text> : null}
      </View>
      <Link href={href as any} asChild>
        <Pressable style={StyleSheet.flatten([sectionStyles.seeAll, { flexDirection: isRtl ? 'row-reverse' : 'row' }])}>
          <Text style={sectionStyles.seeAllText}>{t('seeAll')}</Text>
          {isRtl ? <ChevronLeft size={14} color={Colors.accent} /> : <ChevronRight size={14} color={Colors.accent} />}
        </Pressable>
      </Link>
    </View>
  );
}

// ─── Unit Card Component ─────────────────────────────────────────────────────
function UnitCard({ unit }: { unit: any }) {
  const { toggleFavorite, isFavorite, language, t, getLocalized } = useStore();
  const isRtl = language === 'ar';
  const favorite = isFavorite(unit.id);
  const cover = unit.coverImage || (unit.images && unit.images[0]);
  const price = Number(unit.cashPaidToSeller || unit.totalPrice || 0);
  const isSea = Boolean(unit.isSeaView);
  const roi = Number(unit.expectedRentalRoi) > 0 ? Number(unit.expectedRentalRoi) : (isSea ? 16.5 : 12);

  const title = getLocalized(unit, 'title') || unit.title;
  const locName = getLocalized(unit, 'location') || unit.location?.name || (isRtl ? 'موقع مميز' : 'Prime Location');

  return (
    <Link href={`/unit/${unit.id}`} asChild>
      <Pressable style={unitCardStyles.card}>
        <View style={unitCardStyles.imageWrap}>
          {cover ? (
            <Image source={{ uri: getDirectImageUrl(cover) }} contentFit="cover" style={unitCardStyles.image} transition={200} />
          ) : (
            <View style={[unitCardStyles.image, { backgroundColor: Colors.surface }]} />
          )}

          {/* ROI & Dev Badges */}
          <View style={[unitCardStyles.badges, isRtl ? { right: 8, flexDirection: 'row-reverse' } : { left: 8, flexDirection: 'row' }]}>
            <View style={[unitCardStyles.roiBadge, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <TrendingUp size={10} color={Colors.success} />
              <Text style={unitCardStyles.roiText}>{roi}% {t('roi')}</Text>
            </View>
            {unit.sellerType === 'DEVELOPER' && (
              <View style={unitCardStyles.devBadge}>
                <Text style={unitCardStyles.devText}>0% {isRtl ? 'عمولة' : 'Comm'}</Text>
              </View>
            )}
          </View>

          {/* Favorite Toggle Button */}
          <TouchableOpacity
            style={[unitCardStyles.favBtn, isRtl ? { left: 8 } : { right: 8 }]}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(unit.id);
            }}
            activeOpacity={0.8}
          >
            <Heart
              size={16}
              color={favorite ? Colors.danger : Colors.text}
              fill={favorite ? Colors.danger : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <View style={unitCardStyles.body}>
          <Text style={[unitCardStyles.name, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={1}>{title}</Text>
          
          <View style={[unitCardStyles.locRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <MapPin size={11} color={Colors.textMuted} />
            <Text style={[unitCardStyles.loc, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={1}>{locName}</Text>
          </View>

          {/* Specs row */}
          <View style={[unitCardStyles.specsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {unit.area ? (
              <View style={[unitCardStyles.specItem, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Maximize2 size={11} color={Colors.textMuted} />
                <Text style={unitCardStyles.specText}>{unit.area} {t('sqm')}</Text>
              </View>
            ) : null}
            {unit.bedrooms ? (
              <View style={[unitCardStyles.specItem, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <BedDouble size={11} color={Colors.textMuted} />
                <Text style={unitCardStyles.specText}>{unit.bedrooms} {isRtl ? 'غرف' : 'beds'}</Text>
              </View>
            ) : null}
          </View>

          <View style={[unitCardStyles.priceRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <Text style={unitCardStyles.priceLabel}>{t('downPayment') || (isRtl ? 'المطلوب' : 'Price')}</Text>
            <Text style={unitCardStyles.price}>{price ? price.toLocaleString(isRtl ? 'ar-EG' : 'en-US') : (isRtl ? 'تواصل معنا' : 'Contact Us')} <Text style={unitCardStyles.currency}>{t('currency')}</Text></Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

// ─── Project Card Component ──────────────────────────────────────────────────
function ProjectCard({ project }: { project: any }) {
  const { language, getLocalized } = useStore();
  const isRtl = language === 'ar';
  const cover = project.coverImage || (project.images && project.images[0]);
  const unitsCount = project._count?.units || 0;
  const name = getLocalized(project, 'name') || project.name;
  const location = getLocalized(project, 'location') || project.location;
  const devName = project.developer ? getLocalized(project.developer, 'name') : '';

  return (
    <Link href={`/project/${project.id}`} asChild>
      <Pressable style={projCardStyles.card}>
        {cover ? (
          <Image source={{ uri: getDirectImageUrl(cover) }} contentFit="cover" style={projCardStyles.image} transition={200} />
        ) : (
          <View style={[projCardStyles.image, { backgroundColor: Colors.primary }]} />
        )}
        <View style={projCardStyles.overlay} />
        
        <View style={projCardStyles.body}>
          {devName ? (
            <Text style={[projCardStyles.dev, { textAlign: isRtl ? 'right' : 'left' }]}>🏢 {devName}</Text>
          ) : null}
          <Text style={[projCardStyles.name, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={1}>{name}</Text>
          
          {location ? (
            <View style={[projCardStyles.locRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <MapPin size={11} color="rgba(255,255,255,0.85)" />
              <Text style={[projCardStyles.loc, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={1}>{location}</Text>
            </View>
          ) : null}

          {unitsCount > 0 && (
            <View style={[projCardStyles.badge, { alignSelf: isRtl ? 'flex-start' : 'flex-end' }]}>
              <Text style={projCardStyles.badgeText}>{unitsCount} {isRtl ? 'وحدة متاحة' : 'Units Available'}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Link>
  );
}

// ─── Developer Card Component ────────────────────────────────────────────────
function DevCard({ dev }: { dev: any }) {
  const { language, getLocalized, t } = useStore();
  const isRtl = language === 'ar';
  const count = dev._count?.units || dev.units?.length || 0;
  const name = getLocalized(dev, 'name') || dev.name;
  const logo = dev.logoUrl || dev.logo;

  return (
    <View style={devCardStyles.card}>
      <View style={devCardStyles.icon}>
        {logo ? (
          <Image
            source={{ uri: getDirectImageUrl(logo) }}
            style={{ width: 44, height: 44, borderRadius: 22 }}
            contentFit="contain"
          />
        ) : (
          <Building2 size={24} color={Colors.primary} />
        )}
      </View>
      <Text style={devCardStyles.name} numberOfLines={1}>{name}</Text>
      <Text style={devCardStyles.count}>{count > 0 ? `${count} ${isRtl ? 'وحدة' : 'units'}` : t('verifiedDeveloper')}</Text>
    </View>
  );
}

// ─── Main Home Screen Component ──────────────────────────────────────────────
export default function HomeTab() {
  const {
    projects,
    units,
    heroSlides,
    developers,
    loadingProjects,
    fetchProjects,
    fetchUnits,
    fetchHeroSlides,
    fetchMetadata,
    language,
    t,
  } = useStore();

  const isRtl = language === 'ar';
  const [refreshing, setRefreshing] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  const propertyTypesList = [
    { name: isRtl ? 'شاليهات' : 'Chalets', icon: '🌊', color: '#E0F2FE' },
    { name: isRtl ? 'شقق' : 'Apartments',    icon: '🏢', color: '#F3E8FF' },
    { name: isRtl ? 'فلل' : 'Villas',        icon: '🏡', color: '#D1FAE5' },
    { name: isRtl ? 'دوبلكس' : 'Duplexes',  icon: '✨', color: '#FEF3C7' },
    { name: isRtl ? 'تجاري' : 'Commercial',  icon: '💼', color: '#FCE7F3' },
  ];

  const loadData = async () => {
    await Promise.allSettled([fetchProjects(), fetchUnits(), fetchHeroSlides(), fetchMetadata()]);
  };

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
    if (units.length === 0) fetchUnits();
    if (heroSlides.length === 0) fetchHeroSlides();
    fetchMetadata();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleWhatsApp = () => {
    const text = isRtl ? 'مرحباً%20بُحور%20أبحث%20عن%20عقار' : 'Hello%20Buhoor%20looking%20for%20a%20property';
    Linking.openURL(`https://wa.me/201000000000?text=${text}`).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* ── AI Search Trigger Bar ─────────────────── */}
        <View style={styles.searchSection}>
          <TouchableOpacity
            style={[styles.aiSearchBar, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
            onPress={() => setAiModalVisible(true)}
            activeOpacity={0.85}
          >
            <View style={styles.aiIconBadge}>
              <Sparkles size={18} color="#fff" />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 8 }}>
              <Text style={[styles.aiSearchTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                {t('aiSearchTitleHome')}
              </Text>
              <Text style={[styles.aiSearchSub, { textAlign: isRtl ? 'right' : 'left' }]}>
                {t('aiSearchSubHome')}
              </Text>
            </View>
            <View style={styles.aiSearchBtn}>
              <Search size={16} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Hero Slider ───────────────────────────── */}
        {heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}

        {/* ── Property Type Shortcuts ───────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title={t('propertyCategories')}
            subtitle={t('exploreByCategory')}
            href="/units"
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.typeRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {propertyTypesList.map((pt, i) => (
              <Link href="/units" key={i} asChild>
                <TouchableOpacity style={StyleSheet.flatten([styles.typeCard, { backgroundColor: pt.color }])}>
                  <Text style={styles.typeIcon}>{pt.icon}</Text>
                  <Text style={styles.typeText}>{pt.name}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* ── Latest Units ──────────────────────────── */}
        {units.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title={t('latestDealsTitle')}
              subtitle={t('latestDealsSub')}
              href="/units"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.hRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              {units.slice(0, 8).map((unit: any) => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Featured Projects ─────────────────────── */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title={t('featuredProjectsTitle')}
              subtitle={t('featuredProjectsSub')}
              href="/projects"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.hRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              {projects.slice(0, 6).map((proj: any) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Developers ───────────────────────────── */}
        {developers.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title={t('topDevelopersTitle')}
              subtitle={t('topDevelopersSub')}
              href="/projects"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.hRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              {developers.slice(0, 8).map((dev: any) => (
                <DevCard key={dev.id} dev={dev} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={[styles.floatingBtns, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
        <TouchableOpacity style={[styles.aiFloatingBtn, { flexDirection: isRtl ? 'row-reverse' : 'row' }]} onPress={() => setAiModalVisible(true)} activeOpacity={0.85}>
          <Sparkles size={20} color="#fff" />
          <Text style={styles.aiFloatingBtnText}>{t('aiAssistant')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
          <MessageCircle size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* AI Search Modal */}
      <AiSearchModal visible={aiModalVisible} onClose={() => setAiModalVisible(false)} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const heroStyles = StyleSheet.create({
  container: { marginBottom: 20, paddingHorizontal: 16, position: 'relative' },
  slide: { width: width - 32, height: 230, borderRadius: 22, overflow: 'hidden', position: 'relative' },
  image: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 37, 71, 0.48)',
  },
  badgePill: {
    position: 'absolute',
    top: 14,
    backgroundColor: 'rgba(15, 37, 71, 0.82)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  textBox: {
    position: 'absolute',
    bottom: 22,
    left: 16,
    right: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.88)',
  },
  dots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    width: 22,
    backgroundColor: Colors.accent,
  },
});



const sectionStyles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 17, fontWeight: '800', color: Colors.primary },
  subtitle: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  seeAll: { alignItems: 'center', gap: 2 },
  seeAllText: { fontSize: 12, fontWeight: '700', color: Colors.accent },
});

const unitCardStyles = StyleSheet.create({
  card: {
    width: 210,
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 136 },
  badges: {
    position: 'absolute',
    top: 8,
    gap: 4,
  },
  roiBadge: {
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roiText: { fontSize: 10, fontWeight: '700', color: Colors.success },
  devBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  devText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  favBtn: {
    position: 'absolute',
    top: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: { padding: 12 },
  name: { fontSize: 13, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  locRow: { alignItems: 'center', gap: 4, marginBottom: 8 },
  loc: { fontSize: 11, color: Colors.textMuted, flex: 1 },
  specsRow: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  specItem: { alignItems: 'center', gap: 3 },
  specText: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },
  priceRow: { justifyContent: 'space-between', alignItems: 'baseline' },
  priceLabel: { fontSize: 10, color: Colors.textMuted },
  price: { fontSize: 14, fontWeight: '900', color: Colors.accent },
  currency: { fontSize: 10, fontWeight: '700', color: Colors.accent },
});

const projCardStyles = StyleSheet.create({
  card: {
    width: 250,
    height: 186,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  image: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
    backgroundColor: 'rgba(15, 37, 71, 0.76)',
  },
  body: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  dev: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginBottom: 3 },
  name: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  locRow: { alignItems: 'center', gap: 4, marginTop: 4 },
  loc: { fontSize: 11, color: 'rgba(255,255,255,0.85)', flex: 1 },
  badge: {
    marginTop: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
});

const devCardStyles = StyleSheet.create({
  card: {
    width: 115,
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  name: { fontSize: 12, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  count: { fontSize: 10, color: Colors.textMuted, marginTop: 3 },
});

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingTop: 12, paddingBottom: 32 },
  searchSection: { paddingHorizontal: 16, marginBottom: 16 },
  aiSearchBar: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  aiIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiSearchTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  aiSearchSub: { color: 'rgba(255,255,255,0.75)', fontSize: 10, marginTop: 1 },
  aiSearchBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  hRow: { gap: 14, paddingVertical: 4 },
  typeRow: { gap: 10, paddingVertical: 4 },
  typeCard: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 86,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  typeIcon: { fontSize: 22, marginBottom: 4 },
  typeText: { fontSize: 12, fontWeight: '800', color: Colors.primary },
  floatingBtns: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  aiFloatingBtn: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.ai,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    shadowColor: Colors.ai,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  aiFloatingBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  whatsappBtn: {
    backgroundColor: Colors.whatsapp,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.whatsapp,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});
