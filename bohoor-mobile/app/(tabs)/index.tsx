import React, { useEffect, useState } from 'react';
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
  Linking
} from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  Home, 
  Compass, 
  Key, 
  MapPin, 
  Sparkles, 
  MessageCircle,
  ChevronLeft
} from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

const getDirectImageUrl = (url: string) => {
  if (!url) return url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/file/d/')[1]?.split('/')[0];
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  return url;
};

const PROPERTY_TYPES = [
  { name: 'شاليهات', icon: '🌊', query: 'شاليه' },
  { name: 'شقق', icon: '🏢', query: 'شقة' },
  { name: 'فلل', icon: '🏡', query: 'فيلا' },
  { name: 'دوبلكس', icon: '✨', query: 'دوبلكس' },
  { name: 'تجاري', icon: '💼', query: 'تجاري' },
];

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
    fetchMetadata 
  } = useStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  const loadData = async () => {
    await Promise.allSettled([
      fetchProjects(),
      fetchUnits(),
      fetchHeroSlides(),
      fetchMetadata(),
    ]);
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
    Linking.openURL('https://wa.me/201000000000?text=مرحباً%20بُحور،%20أرغب%20في%20استشارة%20عقارية%20بخصوص%20الفرص%20المتاحة').catch(() => {});
  };

  if (loadingProjects && projects.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const renderProject = ({ item: project }: { item: any }) => {
    const cover = project.coverImage || (project.images && project.images[0]);
    return (
      <Link href={`/project/${project.id}`} asChild>
        <Pressable style={styles.card}>
          {cover ? (
            <Image source={{ uri: getDirectImageUrl(cover) }} contentFit="cover" style={styles.image} transition={200} />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.placeholderText}>لا توجد صورة</Text>
            </View>
          )}
          <View style={styles.cardBody}>
            {project.developer?.name && (
              <Text style={styles.devTag}>🏢 {project.developer.name}</Text>
            )}
            <Text style={styles.projectName} numberOfLines={1}>{project.name}</Text>
            <View style={styles.locRow}>
              <Text style={styles.projectLocation} numberOfLines={1}>{project.location}</Text>
              <MapPin size={13} color={Colors.darkGray} />
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };

  const renderHeroSlide = ({ item: slide }: { item: any }) => {
    const slideImg = slide.image || slide.imageUrl;
    return (
      <View style={styles.heroSlide}>
        {slideImg ? (
          <Image source={{ uri: getDirectImageUrl(slideImg) }} contentFit="cover" style={styles.heroImage} transition={200} />
        ) : (
          <View style={[styles.heroImage, styles.placeholder]} />
        )}
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>{slide.title}</Text>
          {slide.subtitle && <Text style={styles.heroSubtitle}>{slide.subtitle}</Text>}
        </View>
      </View>
    );
  };

  const renderUnitCard = ({ item: unit }: { item: any }) => {
    const cover = unit.coverImage || (unit.images && unit.images[0]);
    const price = Number(unit.cashPaidToSeller || unit.totalPrice || 0);
    const isSea = Boolean(
      unit.isSeaView || 
      unit.location?.name?.includes('جونة') || 
      unit.location?.name?.includes('ساحل') || 
      unit.location?.name?.includes('بحر')
    );
    const roi = Number(unit.expectedRentalRoi) > 0 ? Number(unit.expectedRentalRoi) : (isSea ? 16.5 : 12);

    return (
      <Link href={`/unit/${unit.id}`} asChild>
        <Pressable style={styles.unitCard}>
          {cover ? (
            <Image source={{ uri: getDirectImageUrl(cover) }} contentFit="cover" style={styles.unitImage} transition={200} />
          ) : (
            <View style={[styles.unitImage, styles.placeholder]}>
              <Text style={styles.placeholderText}>لا توجد صورة</Text>
            </View>
          )}

          {/* Floating Badges */}
          <View style={styles.unitFloatingBadges}>
            <View style={styles.unitRoiBadge}>
              <Text style={styles.unitRoiText}>عائد {roi}%</Text>
            </View>
            {unit.sellerType === 'DEVELOPER' && (
              <View style={styles.unitDevBadge}>
                <Text style={styles.unitDevText}>0% عمولة</Text>
              </View>
            )}
          </View>

          <View style={styles.unitCardBody}>
            <Text style={styles.unitCardTitle} numberOfLines={1}>{unit.title}</Text>
            <Text style={styles.unitCardLoc} numberOfLines={1}>
              {unit.location?.name || unit.location?.governorate || 'موقع مميز'}
            </Text>
            <View style={styles.unitCardPriceRow}>
              <Text style={styles.unitCardPrice}>{price.toLocaleString('ar-EG')} ج.م</Text>
              <Text style={styles.unitCardPriceLabel}>
                {unit.sellerType === 'DEVELOPER' && unit.cashPaidToSeller ? 'المقدم' : 'السعر'}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Hero Carousel */}
      {heroSlides.length > 0 && (
        <FlatList
          data={heroSlides}
          keyExtractor={(item) => (item.id || item.title).toString()}
          renderItem={renderHeroSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.heroSliderContainer}
        />
      )}

      {/* Trust & Guarantee Highlights (Mirroring Web) */}
      <View style={styles.trustBanner}>
        <View style={styles.trustItem}>
          <ShieldCheck size={20} color="#065F46" />
          <Text style={styles.trustTitle}>موثق 100%</Text>
          <Text style={styles.trustSub}>عقود معتمدة</Text>
        </View>
        <View style={styles.trustDivider} />
        <View style={styles.trustItem}>
          <Sparkles size={20} color={Colors.accent} />
          <Text style={styles.trustTitle}>0% عمولة</Text>
          <Text style={styles.trustSub}>شراء من المطور</Text>
        </View>
        <View style={styles.trustDivider} />
        <View style={styles.trustItem}>
          <TrendingUp size={20} color="#0284C7" />
          <Text style={styles.trustTitle}>عائد حتى 16.5%</Text>
          <Text style={styles.trustSub}>إيجار يومي Airbnb</Text>
        </View>
      </View>

      {/* Property Type Quick Shortcuts */}
      <View style={styles.typeSection}>
        <View style={styles.rowBetween}>
          <Link href="/units" asChild>
            <Pressable>
              <Text style={styles.seeAllText}>عرض العقارات &larr;</Text>
            </Pressable>
          </Link>
          <Text style={styles.sectionHeaderTitle}>تصفح حسب نوع العقار</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
          {PROPERTY_TYPES.map((pt, i) => (
            <Link href="/units" key={i} asChild>
              <TouchableOpacity style={styles.typeCard}>
                <Text style={styles.typeIcon}>{pt.icon}</Text>
                <Text style={styles.typeCardText}>{pt.name}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>

      {/* Latest Featured Units */}
      {units.length > 0 && (
        <View style={styles.sectionHeader}>
          <View style={styles.rowBetween}>
            <Link href="/units" asChild>
              <Pressable>
                <Text style={styles.seeAllText}>عرض الكل &larr;</Text>
              </Pressable>
            </Link>
            <Text style={styles.sectionHeaderTitle}>أحدث الفرص الاستثمارية 📈</Text>
          </View>
          <FlatList
            data={units.slice(0, 6)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUnitCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row-reverse', gap: 12, paddingVertical: 8 }}
          />
        </View>
      )}

      {/* Developers Spotlight */}
      {developers.length > 0 && (
        <View style={styles.sectionHeader}>
          <View style={styles.rowBetween}>
            <Link href="/projects" asChild>
              <Pressable>
                <Text style={styles.seeAllText}>المشاريع &larr;</Text>
              </Pressable>
            </Link>
            <Text style={styles.sectionHeaderTitle}>كبار المطورين العقاريين 🏢</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.devsRow}>
            {developers.slice(0, 8).map((dev: any) => (
              <View key={dev.id} style={styles.devCard}>
                <Building2 size={24} color={Colors.primary} />
                <Text style={styles.devCardName} numberOfLines={1}>{dev.name}</Text>
                <Text style={styles.devCardCount}>مطور معتمد</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <Text style={[styles.sectionHeaderTitle, { marginTop: 16, marginBottom: 12 }]}>
        أحدث المشاريع السكنية والسياحية
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProject}
        contentContainerStyle={styles.content}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      />

      {/* Floating WhatsApp Action Button */}
      <TouchableOpacity style={styles.floatingWaBtn} onPress={handleWhatsApp}>
        <MessageCircle size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.gray,
    position: 'relative',
  },
  content: {
    padding: 16,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'right',
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.gray,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.darkGray,
  },
  cardBody: {
    padding: 14,
  },
  devTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
    textAlign: 'right',
  },
  projectName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'right',
    marginBottom: 4,
  },
  locRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  projectLocation: {
    fontSize: 13,
    color: Colors.darkGray,
  },
  heroSliderContainer: {
    marginBottom: 16,
    marginHorizontal: -16,
    height: 230,
  },
  heroSlide: {
    width: width,
    height: 230,
    paddingHorizontal: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    bottom: 0,
    backgroundColor: 'rgba(21, 45, 91, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#F3F4F6',
    textAlign: 'center',
  },
  
  // Trust banner
  trustBanner: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 1,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  trustTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 4,
  },
  trustSub: {
    fontSize: 10,
    color: Colors.darkGray,
    marginTop: 1,
  },

  // Type section
  typeSection: {
    marginBottom: 20,
  },
  typeRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingVertical: 8,
  },
  typeCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 80,
  },
  typeIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  typeCardText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },

  sectionHeader: {
    marginBottom: 20,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: 'bold',
  },
  unitCard: {
    width: 220,
    backgroundColor: Colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
    elevation: 2,
  },
  unitImage: {
    width: '100%',
    height: 130,
    backgroundColor: Colors.gray,
  },
  unitFloatingBadges: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row-reverse',
    gap: 4,
  },
  unitRoiBadge: {
    backgroundColor: '#065F46',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unitRoiText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  unitDevBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unitDevText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  unitCardBody: {
    padding: 12,
  },
  unitCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'right',
    marginBottom: 4,
  },
  unitCardLoc: {
    fontSize: 11,
    color: Colors.darkGray,
    textAlign: 'right',
    marginBottom: 8,
  },
  unitCardPriceRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 6,
  },
  unitCardPriceLabel: {
    fontSize: 11,
    color: Colors.darkGray,
  },
  unitCardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.accent,
  },

  // Developers section
  devsRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingVertical: 6,
  },
  devCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    width: 110,
  },
  devCardName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 6,
    textAlign: 'center',
  },
  devCardCount: {
    fontSize: 10,
    color: Colors.darkGray,
    marginTop: 2,
  },

  // WhatsApp Floating Button
  floatingWaBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#25D366',
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 100,
  },
});
