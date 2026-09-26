import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  FlatList, 
  Pressable, 
  TouchableOpacity, 
  TextInput, 
  RefreshControl, 
  ScrollView,
  Modal,
  Dimensions
} from 'react-native';
import { Link } from 'expo-router';
import { 
  Heart, 
  Search, 
  MapPin, 
  Maximize2, 
  BedDouble, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Check, 
  Building2,
  TrendingUp,
  Sparkles
} from 'lucide-react-native';
import { Image } from 'expo-image';
import Colors from '../../constants/Colors';
import { useStore } from '../../store/useStore';
import AiSearchModal from '../../components/AiSearchModal';

const { height } = Dimensions.get('window');

const getDirectImageUrl = (url: string) => {
  if (!url) return url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/file/d/')[1]?.split('/')[0];
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  return url;
};

const DEFAULT_GOVERNORATES = [
  'البحر الأحمر',
  'القاهرة',
  'الجيزة',
  'مطروح',
  'الإسكندرية',
  'السويس',
  'جنوب سيناء',
];

type QuickFilter = 'ALL' | 'CASH' | 'INSTALLMENT' | 'DEVELOPER' | 'INDIVIDUAL';

export default function UnitsTab() {
  const { 
    units, 
    loadingUnits, 
    fetchUnits, 
    locations, 
    unitTypes, 
    developers, 
    fetchMetadata,
    toggleFavorite, 
    isFavorite 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  // Advanced Filter States
  const [selectedGov, setSelectedGov] = useState<string>('');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedUnitTypeId, setSelectedUnitTypeId] = useState<string>('');
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>('');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('');
  const [seaViewOnly, setSeaViewOnly] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    if (units.length === 0) fetchUnits();
    if (locations.length === 0) fetchMetadata();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.allSettled([fetchUnits(), fetchMetadata()]);
    setRefreshing(false);
  };

  // Distinct governorates
  const allGovernorates = useMemo(() => {
    const fromLocs = locations.map((l: any) => l.governorate).filter(Boolean);
    return Array.from(new Set([...DEFAULT_GOVERNORATES, ...fromLocs]));
  }, [locations]);

  // Filter locations by selected governorate
  const filteredLocations = useMemo(() => {
    if (!selectedGov) return locations;
    return locations.filter((loc: any) => 
      loc.governorate && loc.governorate.trim().toLowerCase() === selectedGov.trim().toLowerCase()
    );
  }, [locations, selectedGov]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedGov) count++;
    if (selectedLocationId) count++;
    if (selectedUnitTypeId) count++;
    if (selectedDeveloperId) count++;
    if (selectedBedrooms) count++;
    if (seaViewOnly) count++;
    if (minPrice || maxPrice) count++;
    return count;
  }, [selectedGov, selectedLocationId, selectedUnitTypeId, selectedDeveloperId, selectedBedrooms, seaViewOnly, minPrice, maxPrice]);

  const resetAdvancedFilters = () => {
    setSelectedGov('');
    setSelectedLocationId('');
    setSelectedUnitTypeId('');
    setSelectedDeveloperId('');
    setSelectedBedrooms('');
    setSeaViewOnly(false);
    setMinPrice('');
    setMaxPrice('');
  };

  // Filter pipeline
  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = 
          unit.title?.toLowerCase().includes(q) ||
          unit.description?.toLowerCase().includes(q) ||
          unit.location?.name?.toLowerCase().includes(q) ||
          unit.project?.name?.toLowerCase().includes(q) ||
          unit.developer?.name?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Quick Pills
      if (quickFilter === 'CASH' && !unit.isCashOnly) return false;
      if (quickFilter === 'INSTALLMENT' && unit.isCashOnly) return false;
      if (quickFilter === 'DEVELOPER' && unit.sellerType !== 'DEVELOPER') return false;
      if (quickFilter === 'INDIVIDUAL' && unit.sellerType !== 'INDIVIDUAL') return false;

      // 3. Advanced: Governorate
      if (selectedGov) {
        const uGov = unit.location?.governorate || '';
        if (uGov.trim().toLowerCase() !== selectedGov.trim().toLowerCase()) return false;
      }

      // 4. Advanced: Location ID
      if (selectedLocationId && unit.locationId !== selectedLocationId && unit.location?.id !== selectedLocationId) {
        return false;
      }

      // 5. Advanced: Unit Type ID
      if (selectedUnitTypeId && unit.unitTypeId !== selectedUnitTypeId && unit.unitType?.id !== selectedUnitTypeId) {
        return false;
      }

      // 6. Advanced: Developer ID
      if (selectedDeveloperId && unit.developerId !== selectedDeveloperId && unit.developer?.id !== selectedDeveloperId) {
        return false;
      }

      // 7. Advanced: Sea View
      if (seaViewOnly && !unit.isSeaView) return false;

      // 8. Advanced: Bedrooms
      if (selectedBedrooms) {
        const target = parseInt(selectedBedrooms, 10);
        if (selectedBedrooms === '4+') {
          if ((unit.bedrooms || 0) < 4) return false;
        } else {
          if (unit.bedrooms !== target) return false;
        }
      }

      // 9. Price Range
      const effectivePrice = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);
      if (minPrice && effectivePrice < Number(minPrice)) return false;
      if (maxPrice && effectivePrice > Number(maxPrice)) return false;

      return true;
    });
  }, [
    units, 
    searchQuery, 
    quickFilter, 
    selectedGov, 
    selectedLocationId, 
    selectedUnitTypeId, 
    selectedDeveloperId, 
    selectedBedrooms, 
    seaViewOnly, 
    minPrice, 
    maxPrice
  ]);

  const renderUnit = ({ item: unit }: { item: any }) => {
    const isFav = isFavorite(unit.id);
    const cover = unit.coverImage || (unit.images && unit.images[0]);
    const price = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);
    const locName = unit.location?.name || unit.project?.location || '';
    const isSea = Boolean(
      unit.isSeaView ||
      unit.location?.name?.includes('جونة') ||
      unit.location?.name?.includes('ساحل') ||
      unit.location?.name?.includes('بحر')
    );
    const roi = Number(unit.expectedRentalRoi) > 0 ? Number(unit.expectedRentalRoi) : (isSea ? 16.5 : 12);

    return (
      <Link href={`/unit/${unit.id}`} asChild>
        <Pressable style={styles.card}>
          {cover ? (
            <Image source={{ uri: getDirectImageUrl(cover) }} contentFit="cover" style={styles.image} transition={200} />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.placeholderText}>لا توجد صورة</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.favoriteBtn} 
            onPress={() => toggleFavorite(unit.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart color={isFav ? Colors.accent : '#fff'} fill={isFav ? Colors.accent : 'rgba(0,0,0,0.5)'} size={22} />
          </TouchableOpacity>

          <View style={styles.cardBody}>
            {/* Top Badges */}
            <View style={styles.topMeta}>
              <Text style={unit.sellerType === 'DEVELOPER' ? styles.devBadge : styles.typeBadge}>
                {unit.sellerType === 'DEVELOPER' ? '🏢 مطور مباشر (0% عمولة)' : '👤 أفراد'}
              </Text>
              {isSea && <Text style={styles.seaBadge}>🌊 إطلالة بحر</Text>}
              <View style={styles.roiBadge}>
                <TrendingUp size={11} color="#065F46" />
                <Text style={styles.roiBadgeText}>عائد {roi}%</Text>
              </View>
            </View>

            <Text style={styles.unitName} numberOfLines={1}>{unit.title}</Text>
            
            {locName ? (
              <View style={styles.locRow}>
                <Text style={styles.locText} numberOfLines={1}>
                  {unit.location?.governorate ? `${unit.location.governorate}، ${locName}` : locName}
                </Text>
                <MapPin size={14} color={Colors.darkGray} />
              </View>
            ) : null}

            <View style={styles.specsRow}>
              {unit.area ? (
                <View style={styles.specItem}>
                  <Text style={styles.specVal}>{unit.area} م²</Text>
                  <Maximize2 size={12} color={Colors.darkGray} />
                </View>
              ) : null}
              {unit.bedrooms ? (
                <View style={styles.specItem}>
                  <Text style={styles.specVal}>{unit.bedrooms} غرف</Text>
                  <BedDouble size={12} color={Colors.darkGray} />
                </View>
              ) : null}
              {unit.unitType?.name ? (
                <View style={styles.specItem}>
                  <Text style={styles.specVal}>{unit.unitType.name}</Text>
                  <Building2 size={12} color={Colors.darkGray} />
                </View>
              ) : null}
            </View>

            <View style={styles.priceRow}>
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={styles.price}>{price.toLocaleString('ar-EG')} ج.م</Text>
                {unit.sellerType === 'DEVELOPER' && unit.cashPaidToSeller && unit.totalPrice && unit.cashPaidToSeller !== unit.totalPrice ? (
                  <Text style={styles.priceSub}>إجمالي: {Number(unit.totalPrice).toLocaleString('ar-EG')} ج</Text>
                ) : null}
              </View>
              <Text style={styles.priceLabel}>
                {unit.sellerType === 'DEVELOPER' && unit.cashPaidToSeller ? 'المقدم المطلوب:' : 'المطلوب كاش:'}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar & Advanced Filter Button */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <TouchableOpacity 
            style={styles.aiSearchBtn}
            onPress={() => setAiModalVisible(true)}
          >
            <Sparkles size={16} color="#fff" />
            <Text style={styles.aiSearchBtnText}>AI</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterIconBtn, activeFiltersCount > 0 && styles.filterIconBtnActive]}
            onPress={() => setModalVisible(true)}
          >
            <SlidersHorizontal size={20} color={activeFiltersCount > 0 ? '#fff' : Colors.primary} />
            {activeFiltersCount > 0 && (
              <View style={styles.activeFilterBadge}>
                <Text style={styles.activeFilterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.searchBar}>
            <TextInput 
              style={styles.searchInput}
              placeholder="ابحث عن عقار، منطقة، مطور..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlign="right"
              placeholderTextColor={Colors.darkGray}
            />
            <Search color={Colors.darkGray} size={20} style={{ marginLeft: 8 }} />
          </View>
        </View>

        {/* Quick Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsContainer}
        >
          <TouchableOpacity 
            style={[styles.chip, quickFilter === 'ALL' && styles.activeChip]}
            onPress={() => setQuickFilter('ALL')}
          >
            <Text style={[styles.chipText, quickFilter === 'ALL' && styles.activeChipText]}>الكل ({units.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, quickFilter === 'CASH' && styles.activeChip]}
            onPress={() => setQuickFilter('CASH')}
          >
            <Text style={[styles.chipText, quickFilter === 'CASH' && styles.activeChipText]}>💵 كاش فقط</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, quickFilter === 'INSTALLMENT' && styles.activeChip]}
            onPress={() => setQuickFilter('INSTALLMENT')}
          >
            <Text style={[styles.chipText, quickFilter === 'INSTALLMENT' && styles.activeChipText]}>📅 تقسيط</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, quickFilter === 'DEVELOPER' && styles.activeChip]}
            onPress={() => setQuickFilter('DEVELOPER')}
          >
            <Text style={[styles.chipText, quickFilter === 'DEVELOPER' && styles.activeChipText]}>🏢 مطورين (0% عمولة)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, quickFilter === 'INDIVIDUAL' && styles.activeChip]}
            onPress={() => setQuickFilter('INDIVIDUAL')}
          >
            <Text style={[styles.chipText, quickFilter === 'INDIVIDUAL' && styles.activeChipText]}>👤 إعادة بيع</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Results List */}
      {loadingUnits && units.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredUnits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUnit}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListHeaderComponent={
            activeFiltersCount > 0 ? (
              <View style={styles.activeFilterNotice}>
                <TouchableOpacity onPress={resetAdvancedFilters} style={styles.clearFiltersBtn}>
                  <Text style={styles.clearFiltersText}>إعادة ضبط</Text>
                  <RotateCcw size={14} color="#EF4444" />
                </TouchableOpacity>
                <Text style={styles.activeFilterNoticeText}>
                  تطبيق {activeFiltersCount} فلاتر مخصصة ({filteredUnits.length} نتيجة)
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>لم نجد وحدات مطابقة للبحث</Text>
              <Text style={styles.emptySub}>جرب اختيار فلاتر أخرى أو مسح كلمات البحث لتوسيع النتائج</Text>
              {activeFiltersCount > 0 && (
                <TouchableOpacity onPress={resetAdvancedFilters} style={styles.resetBtn}>
                  <Text style={styles.resetBtnText}>إلغاء جميع الفلاتر</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}

      {/* ================= ADVANCED FILTER MODAL ================= */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={22} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>تصفية متقدمة للعقارات 🎯</Text>
              {activeFiltersCount > 0 ? (
                <TouchableOpacity onPress={resetAdvancedFilters} style={styles.resetHeaderBtn}>
                  <Text style={styles.resetHeaderText}>تفريغ</Text>
                </TouchableOpacity>
              ) : <View style={{ width: 40 }} />}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              
              {/* Sea view toggle */}
              <TouchableOpacity 
                style={[styles.seaToggleCard, seaViewOnly && styles.seaToggleCardActive]}
                onPress={() => setSeaViewOnly(!seaViewOnly)}
              >
                <View style={styles.checkbox}>
                  {seaViewOnly && <Check size={16} color="#fff" />}
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={[styles.seaToggleTitle, seaViewOnly && { color: '#0284C7' }]}>
                    🌊 إطلالة بحرية مباشرة فقط
                  </Text>
                  <Text style={styles.seaToggleSub}>عرض الشاليهات والوحدات ذات الإطلالة الساحلية</Text>
                </View>
              </TouchableOpacity>

              {/* Governorates */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>المحافظة</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                  <TouchableOpacity 
                    style={[styles.filterPill, !selectedGov && styles.filterPillActive]}
                    onPress={() => { setSelectedGov(''); setSelectedLocationId(''); }}
                  >
                    <Text style={[styles.filterPillText, !selectedGov && styles.filterPillTextActive]}>الكل</Text>
                  </TouchableOpacity>
                  {allGovernorates.map((gov) => (
                    <TouchableOpacity 
                      key={gov}
                      style={[styles.filterPill, selectedGov === gov && styles.filterPillActive]}
                      onPress={() => {
                        setSelectedGov(selectedGov === gov ? '' : gov);
                        setSelectedLocationId('');
                      }}
                    >
                      <Text style={[styles.filterPillText, selectedGov === gov && styles.filterPillTextActive]}>{gov}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Specific Location */}
              {filteredLocations.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>المنطقة / المدينة</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                    <TouchableOpacity 
                      style={[styles.filterPill, !selectedLocationId && styles.filterPillActive]}
                      onPress={() => setSelectedLocationId('')}
                    >
                      <Text style={[styles.filterPillText, !selectedLocationId && styles.filterPillTextActive]}>الكل</Text>
                    </TouchableOpacity>
                    {filteredLocations.map((loc: any) => (
                      <TouchableOpacity 
                        key={loc.id}
                        style={[styles.filterPill, selectedLocationId === loc.id && styles.filterPillActive]}
                        onPress={() => setSelectedLocationId(selectedLocationId === loc.id ? '' : loc.id)}
                      >
                        <Text style={[styles.filterPillText, selectedLocationId === loc.id && styles.filterPillTextActive]}>
                          {loc.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Unit Type */}
              {unitTypes.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>نوع الوحدة</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                    <TouchableOpacity 
                      style={[styles.filterPill, !selectedUnitTypeId && styles.filterPillActive]}
                      onPress={() => setSelectedUnitTypeId('')}
                    >
                      <Text style={[styles.filterPillText, !selectedUnitTypeId && styles.filterPillTextActive]}>الكل</Text>
                    </TouchableOpacity>
                    {unitTypes.map((t: any) => (
                      <TouchableOpacity 
                        key={t.id}
                        style={[styles.filterPill, selectedUnitTypeId === t.id && styles.filterPillActive]}
                        onPress={() => setSelectedUnitTypeId(selectedUnitTypeId === t.id ? '' : t.id)}
                      >
                        <Text style={[styles.filterPillText, selectedUnitTypeId === t.id && styles.filterPillTextActive]}>
                          {t.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Bedrooms */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>عدد غرف النوم</Text>
                <View style={styles.bedroomsRow}>
                  {['', '1', '2', '3', '4+'].map((beds) => (
                    <TouchableOpacity 
                      key={beds || 'all'}
                      style={[styles.bedroomBtn, selectedBedrooms === beds && styles.bedroomBtnActive]}
                      onPress={() => setSelectedBedrooms(beds)}
                    >
                      <Text style={[styles.bedroomBtnText, selectedBedrooms === beds && styles.bedroomBtnTextActive]}>
                        {beds ? `${beds} غرف` : 'الكل'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Developer */}
              {developers.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>المطور العقاري</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                    <TouchableOpacity 
                      style={[styles.filterPill, !selectedDeveloperId && styles.filterPillActive]}
                      onPress={() => setSelectedDeveloperId('')}
                    >
                      <Text style={[styles.filterPillText, !selectedDeveloperId && styles.filterPillTextActive]}>الكل</Text>
                    </TouchableOpacity>
                    {developers.map((dev: any) => (
                      <TouchableOpacity 
                        key={dev.id}
                        style={[styles.filterPill, selectedDeveloperId === dev.id && styles.filterPillActive]}
                        onPress={() => setSelectedDeveloperId(selectedDeveloperId === dev.id ? '' : dev.id)}
                      >
                        <Text style={[styles.filterPillText, selectedDeveloperId === dev.id && styles.filterPillTextActive]}>
                          {dev.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>نطاق السعر / المقدم (ج.م)</Text>
                <View style={styles.priceInputsRow}>
                  <TextInput 
                    style={styles.priceInput}
                    placeholder="الحد الأقصى"
                    placeholderTextColor={Colors.darkGray}
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    textAlign="center"
                  />
                  <Text style={styles.priceInputDivider}>إلى</Text>
                  <TextInput 
                    style={styles.priceInput}
                    placeholder="الحد الأدنى"
                    placeholderTextColor={Colors.darkGray}
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    textAlign="center"
                  />
                </View>
              </View>

            </ScrollView>

            {/* Modal Bottom Actions */}
            <View style={styles.modalBottomBar}>
              <TouchableOpacity 
                style={styles.applyBtn} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.applyBtnText}>
                  تطبيق ({filteredUnits.length} وحدة مطابقة)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* AI Natural Language Search Modal */}
      <AiSearchModal 
        visible={aiModalVisible} 
        onClose={() => setAiModalVisible(false)} 
      />

    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.gray },
  searchContainer: { 
    padding: 14, 
    backgroundColor: Colors.background, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB' 
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  aiSearchBtn: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  aiSearchBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  filterIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterIconBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  activeFilterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  searchBar: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.gray, 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    height: 44, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.primary },
  filterChipsContainer: { flexDirection: 'row-reverse', gap: 8, paddingVertical: 4 },
  chip: { 
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    borderRadius: 20, 
    backgroundColor: Colors.gray, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  activeChip: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, fontWeight: 'bold', color: Colors.darkGray },
  activeChipText: { color: Colors.background },
  
  activeFilterNotice: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 12,
  },
  activeFilterNoticeText: { fontSize: 12, fontWeight: 'bold', color: Colors.primary },
  clearFiltersBtn: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  clearFiltersText: { fontSize: 11, fontWeight: 'bold', color: '#EF4444' },

  content: { padding: 16 },
  card: { 
    backgroundColor: Colors.background, 
    borderRadius: 16, 
    marginBottom: 16, 
    overflow: 'hidden', 
    elevation: 2, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    position: 'relative' 
  },
  image: { width: '100%', height: 190, backgroundColor: Colors.gray },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: Colors.darkGray },
  favoriteBtn: { 
    position: 'absolute', 
    top: 12, 
    left: 12, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    borderRadius: 20, 
    padding: 8, 
    zIndex: 10 
  },
  cardBody: { padding: 14 },
  topMeta: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  typeBadge: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: Colors.primary, 
    backgroundColor: '#EFF6FF', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 8 
  },
  devBadge: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#065F46', 
    backgroundColor: '#ECFDF5', 
    borderColor: '#A7F3D0', 
    borderWidth: 1, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 8 
  },
  seaBadge: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#0284C7', 
    backgroundColor: '#E0F2FE', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 8 
  },
  roiBadge: { 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    gap: 2, 
    backgroundColor: '#DCFCE7', 
    borderColor: '#BBF7D0', 
    borderWidth: 1, 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 8 
  },
  roiBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#065F46' },

  unitName: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 6 },
  locRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginBottom: 8 },
  locText: { fontSize: 12, color: Colors.darkGray },
  specsRow: { 
    flexDirection: 'row-reverse', 
    gap: 12, 
    marginBottom: 10, 
    paddingBottom: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  specItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  specVal: { fontSize: 12, color: Colors.darkGray, fontWeight: '600' },
  priceRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 12, color: Colors.darkGray },
  price: { fontSize: 17, fontWeight: 'bold', color: Colors.accent },
  priceSub: { fontSize: 10, color: Colors.darkGray, marginTop: 1 },

  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginBottom: 6 },
  emptySub: { fontSize: 13, color: Colors.darkGray, textAlign: 'center', lineHeight: 20 },
  resetBtn: { marginTop: 16, backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  resetBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: { fontSize: 17, fontWeight: 'bold', color: Colors.primary },
  modalCloseBtn: { padding: 4 },
  resetHeaderBtn: { padding: 4 },
  resetHeaderText: { fontSize: 13, fontWeight: 'bold', color: '#EF4444' },
  modalScroll: { paddingHorizontal: 20, paddingVertical: 14 },
  
  seaToggleCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    gap: 12,
  },
  seaToggleCardActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#38BDF8',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seaToggleTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  seaToggleSub: { fontSize: 11, color: Colors.darkGray, marginTop: 2 },

  filterSection: { marginBottom: 18 },
  filterSectionTitle: { fontSize: 13, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 8 },
  chipsRow: { flexDirection: 'row-reverse', gap: 8 },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: { fontSize: 12, color: Colors.text, fontWeight: '600' },
  filterPillTextActive: { color: '#fff', fontWeight: 'bold' },

  bedroomsRow: { flexDirection: 'row-reverse', gap: 8 },
  bedroomBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.gray,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  bedroomBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bedroomBtnText: { fontSize: 12, fontWeight: 'bold', color: Colors.text },
  bedroomBtnTextActive: { color: '#fff' },

  priceInputsRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  priceInput: {
    flex: 1,
    backgroundColor: Colors.gray,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: Colors.primary,
  },
  priceInputDivider: { fontSize: 13, color: Colors.darkGray, fontWeight: 'bold' },

  modalBottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: Colors.background,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  applyBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
