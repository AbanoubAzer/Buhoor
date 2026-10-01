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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
import { getGovernorateLabel } from '../../constants/translations';
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
    isFavorite,
    language,
    t,
    getLocalized
  } = useStore();
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'roi_desc' | 'installment_asc' | 'down_payment_asc';

  const [modalVisible, setModalVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  // Advanced Filter States
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedGov, setSelectedGov] = useState<string>('');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedUnitTypeId, setSelectedUnitTypeId] = useState<string>('');
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>('');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('');
  const [selectedBathrooms, setSelectedBathrooms] = useState<string>('');
  const [seaViewOnly, setSeaViewOnly] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minArea, setMinArea] = useState<string>('');
  const [maxArea, setMaxArea] = useState<string>('');
  const [minInstallment, setMinInstallment] = useState<string>('');
  const [maxInstallment, setMaxInstallment] = useState<string>('');

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
    if (selectedBathrooms) count++;
    if (seaViewOnly) count++;
    if (minPrice || maxPrice) count++;
    if (minArea || maxArea) count++;
    if (minInstallment || maxInstallment) count++;
    return count;
  }, [selectedGov, selectedLocationId, selectedUnitTypeId, selectedDeveloperId, selectedBedrooms, selectedBathrooms, seaViewOnly, minPrice, maxPrice, minArea, maxArea, minInstallment, maxInstallment]);

  const resetAdvancedFilters = () => {
    setSelectedGov('');
    setSelectedLocationId('');
    setSelectedUnitTypeId('');
    setSelectedDeveloperId('');
    setSelectedBedrooms('');
    setSelectedBathrooms('');
    setSeaViewOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
    setMinInstallment('');
    setMaxInstallment('');
    setSortBy('newest');
  };

  // Filter pipeline & sorting
  const filteredUnits = useMemo(() => {
    const list = units.filter((unit) => {
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

      // 9. Advanced: Bathrooms
      if (selectedBathrooms) {
        const targetBaths = parseInt(selectedBathrooms, 10);
        if (selectedBathrooms === '3+') {
          if ((unit.bathrooms || 0) < 3) return false;
        } else {
          if (unit.bathrooms !== targetBaths) return false;
        }
      }

      // 10. Area Range
      const effectiveArea = Number(unit.area || 0);
      if (minArea && effectiveArea < Number(minArea)) return false;
      if (maxArea && effectiveArea > Number(maxArea)) return false;

      // 11. Price Range
      const effectivePrice = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);
      if (minPrice && effectivePrice < Number(minPrice)) return false;
      if (maxPrice && effectivePrice > Number(maxPrice)) return false;

      // 12. Monthly Installment Range
      const effectiveInst = Number(unit.monthlyEquivalentInstallment || unit.monthlyInstallment || 0);
      if (minInstallment && effectiveInst < Number(minInstallment)) return false;
      if (maxInstallment && effectiveInst > Number(maxInstallment)) return false;

      return true;
    });

    // Sort
    return [...list].sort((a, b) => {
      const priceA = Number(a.totalPrice || a.originalContractPrice || a.cashPaidToSeller || 0);
      const priceB = Number(b.totalPrice || b.originalContractPrice || b.cashPaidToSeller || 0);
      const downA = Number(a.cashPaidToSeller || a.downPayment || 0);
      const downB = Number(b.cashPaidToSeller || b.downPayment || 0);
      const instA = Number(a.monthlyEquivalentInstallment || a.monthlyInstallment || 0);
      const instB = Number(b.monthlyEquivalentInstallment || b.monthlyInstallment || 0);
      const roiA = Number(a.expectedRentalRoi || 0);
      const roiB = Number(b.expectedRentalRoi || 0);

      switch (sortBy) {
        case 'price_asc': return priceA - priceB;
        case 'price_desc': return priceB - priceA;
        case 'roi_desc': return roiB - roiA;
        case 'installment_asc': return instA - instB;
        case 'down_payment_asc': return downA - downB;
        case 'newest':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
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
    selectedBathrooms,
    seaViewOnly, 
    minPrice, 
    maxPrice,
    minArea,
    maxArea,
    minInstallment,
    maxInstallment,
    sortBy
  ]);

  const renderUnit = ({ item: unit }: { item: any }) => {
    const isFav = isFavorite(unit.id);
    const cover = unit.coverImage || (unit.images && unit.images[0]);
    const price = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);
    const unitTitle = getLocalized(unit, 'title');
    const locName = getLocalized(unit, 'location') || getLocalized(unit.project, 'location') || '';
    const rawGov = unit.location?.governorate || '';
    const govName = getGovernorateLabel(rawGov, language as any);
    const fullLoc = govName && locName ? (isRtl ? `${govName}، ${locName}` : `${locName}, ${govName}`) : (govName || locName);
    const unitTypeName = getLocalized(unit.unitType, 'name');

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
              <Text style={styles.placeholderText}>{t('noCoverImage')}</Text>
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
            <View style={[styles.topMeta, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <Text style={unit.sellerType === 'DEVELOPER' ? styles.devBadge : styles.typeBadge}>
                {unit.sellerType === 'DEVELOPER' ? t('developerBadge') : t('resaleBadge')}
              </Text>
              {isSea && <Text style={styles.seaBadge}>🌊 {t('seaView')}</Text>}
              <View style={styles.roiBadge}>
                <TrendingUp size={11} color="#065F46" />
                <Text style={styles.roiBadgeText}>{t('roi')} {roi}%</Text>
              </View>
            </View>

            <Text style={[styles.unitName, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={1}>
              {unitTitle}
            </Text>
            
            {fullLoc ? (
              <View style={[styles.locRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <MapPin size={14} color={Colors.darkGray} />
                <Text style={[styles.locText, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={1}>
                  {fullLoc}
                </Text>
              </View>
            ) : null}

            <View style={[styles.specsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              {unit.area ? (
                <View style={[styles.specItem, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Maximize2 size={12} color={Colors.darkGray} />
                  <Text style={styles.specVal}>{unit.area} {t('sqm')}</Text>
                </View>
              ) : null}
              {unit.bedrooms ? (
                <View style={[styles.specItem, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <BedDouble size={12} color={Colors.darkGray} />
                  <Text style={styles.specVal}>{unit.bedrooms} {isRtl ? 'غرف' : 'beds'}</Text>
                </View>
              ) : null}
              {unitTypeName ? (
                <View style={[styles.specItem, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <Building2 size={12} color={Colors.darkGray} />
                  <Text style={styles.specVal}>{unitTypeName}</Text>
                </View>
              ) : null}
            </View>

            <View style={[styles.priceRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={{ alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                <Text style={styles.price}>{price.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}</Text>
                {unit.sellerType === 'DEVELOPER' && unit.cashPaidToSeller && unit.totalPrice && unit.cashPaidToSeller !== unit.totalPrice ? (
                  <Text style={styles.priceSub}>
                    {t('totalPrice')}: {Number(unit.totalPrice).toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.priceLabel}>
                {unit.sellerType === 'DEVELOPER' && unit.cashPaidToSeller ? `${t('downPayment')}:` : `${t('cash')}:`}
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
        <View style={[styles.searchRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
          <View style={[styles.searchBar, { flex: 1, flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <Search color={Colors.darkGray} size={20} style={{ marginHorizontal: 4 }} />
            <TextInput 
              style={[styles.searchInput, { textAlign: isRtl ? 'right' : 'left' }]}
              placeholder={isRtl ? 'ابحث عن عقار، منطقة، مطور...' : 'Search property, area, developer...'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.darkGray}
            />
          </View>

          <TouchableOpacity 
            style={[styles.filterIconBtn, activeFiltersCount > 0 && styles.filterIconBtnActive]}
            onPress={() => setModalVisible(true)}
            accessibilityLabel={t('advancedFilter')}
          >
            <SlidersHorizontal size={20} color={activeFiltersCount > 0 ? '#fff' : Colors.primary} />
            {activeFiltersCount > 0 && (
              <View style={styles.activeFilterBadge}>
                <Text style={styles.activeFilterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.aiSearchBtn}
            onPress={() => setAiModalVisible(true)}
            accessibilityLabel={isRtl ? 'البحث بالذكاء الاصطناعي' : 'AI Search'}
          >
            <Sparkles size={16} color="#fff" />
            <Text style={styles.aiSearchBtnText}>AI</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Filter Chips */}
        <KeyboardAwareScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.filterChipsContainer, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
        >
          <TouchableOpacity 
            style={[styles.chip, quickFilter === 'ALL' && styles.activeChip]}
            onPress={() => setQuickFilter('ALL')}
          >
            <Text style={[styles.chipText, quickFilter === 'ALL' && styles.activeChipText]}>
              {t('all')} ({units.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, quickFilter === 'CASH' && styles.activeChip]}
            onPress={() => setQuickFilter('CASH')}
          >
            <Text style={[styles.chipText, quickFilter === 'CASH' && styles.activeChipText]}>
              💵 {t('cashOnly')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, quickFilter === 'INSTALLMENT' && styles.activeChip]}
            onPress={() => setQuickFilter('INSTALLMENT')}
          >
            <Text style={[styles.chipText, quickFilter === 'INSTALLMENT' && styles.activeChipText]}>
              📅 {t('installments')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, quickFilter === 'DEVELOPER' && styles.activeChip]}
            onPress={() => setQuickFilter('DEVELOPER')}
          >
            <Text style={[styles.chipText, quickFilter === 'DEVELOPER' && styles.activeChipText]}>
              🏢 {isRtl ? 'مطورين (0% عمولة)' : 'Developers (0% Comm.)'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, quickFilter === 'INDIVIDUAL' && styles.activeChip]}
            onPress={() => setQuickFilter('INDIVIDUAL')}
          >
            <Text style={[styles.chipText, quickFilter === 'INDIVIDUAL' && styles.activeChipText]}>
              👤 {isRtl ? 'إعادة بيع' : 'Resale'}
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>

        {/* Sort Selector Bar */}
        <View style={{ paddingHorizontal: 16, marginTop: 8, marginBottom: 4 }}>
          <KeyboardAwareScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[{ gap: 6, alignItems: 'center' }, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.darkGray, marginEnd: 4 }}>
              {t('sortByLabel')}:
            </Text>
            {[
              { id: 'newest', label: t('sortNewest') },
              { id: 'price_asc', label: t('sortPriceAsc') },
              { id: 'price_desc', label: t('sortPriceDesc') },
              { id: 'roi_desc', label: t('sortRoiDesc') },
              { id: 'installment_asc', label: t('sortInstallmentAsc') },
              { id: 'down_payment_asc', label: t('sortDownPaymentAsc') },
            ].map((s) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => setSortBy(s.id as SortOption)}
                style={[
                  styles.sortChip,
                  sortBy === s.id && styles.sortChipActive,
                ]}
              >
                <Text style={[styles.sortChipText, sortBy === s.id && styles.sortChipTextActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </KeyboardAwareScrollView>
        </View>
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
                  <Text style={styles.clearFiltersText}>{t('resetFilters')}</Text>
                  <RotateCcw size={14} color="#EF4444" />
                </TouchableOpacity>
                <Text style={styles.activeFilterNoticeText}>
                  {t('filtersAndResults').replace('{filters}', String(activeFiltersCount)).replace('{results}', String(filteredUnits.length))}
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>{t('noMatchingUnits')}</Text>
              <Text style={styles.emptySub}>{t('tryAdjustFilters')}</Text>
              {activeFiltersCount > 0 && (
                <TouchableOpacity onPress={resetAdvancedFilters} style={styles.resetBtn}>
                  <Text style={styles.resetBtnText}>{t('clearAllFilters')}</Text>
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
              <Text style={styles.modalTitle}>{t('advancedFilter')}</Text>
              {activeFiltersCount > 0 ? (
                <TouchableOpacity onPress={resetAdvancedFilters} style={styles.resetHeaderBtn}>
                  <Text style={styles.resetHeaderText}>{t('clearAll')}</Text>
                </TouchableOpacity>
              ) : <View style={{ width: 40 }} />}
            </View>

            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              
              {/* Sea view toggle */}
              <TouchableOpacity 
                style={[styles.seaToggleCard, seaViewOnly && styles.seaToggleCardActive]}
                onPress={() => setSeaViewOnly(!seaViewOnly)}
              >
                <View style={styles.checkbox}>
                  {seaViewOnly && <Check size={16} color="#fff" />}
                </View>
                <View style={{ flex: 1, alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                  <Text style={[styles.seaToggleTitle, seaViewOnly && { color: '#0284C7' }]}>
                    {t('seaViewDirectOnly')}
                  </Text>
                  <Text style={styles.seaToggleSub}>{t('seaViewDirectSub')}</Text>
                </View>
              </TouchableOpacity>

              {/* Governorates */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{t('governorateFilter')}</Text>
                <KeyboardAwareScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chipsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <TouchableOpacity 
                    style={[styles.filterPill, !selectedGov && styles.filterPillActive]}
                    onPress={() => { setSelectedGov(''); setSelectedLocationId(''); }}
                  >
                    <Text style={[styles.filterPillText, !selectedGov && styles.filterPillTextActive]}>{t('allGovernorates')}</Text>
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
                      <Text style={[styles.filterPillText, selectedGov === gov && styles.filterPillTextActive]}>
                        {getGovernorateLabel(gov, language as any)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </KeyboardAwareScrollView>
              </View>

              {/* Specific Location */}
              {filteredLocations.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={[styles.filterSectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{t('locationFilter')}</Text>
                  <KeyboardAwareScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chipsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <TouchableOpacity 
                      style={[styles.filterPill, !selectedLocationId && styles.filterPillActive]}
                      onPress={() => setSelectedLocationId('')}
                    >
                      <Text style={[styles.filterPillText, !selectedLocationId && styles.filterPillTextActive]}>{t('allAreas')}</Text>
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
                  </KeyboardAwareScrollView>
                </View>
              )}

              {/* Unit Type */}
              {unitTypes.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={[styles.filterSectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{t('unitTypeFilter')}</Text>
                  <KeyboardAwareScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chipsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <TouchableOpacity 
                      style={[styles.filterPill, !selectedUnitTypeId && styles.filterPillActive]}
                      onPress={() => setSelectedUnitTypeId('')}
                    >
                      <Text style={[styles.filterPillText, !selectedUnitTypeId && styles.filterPillTextActive]}>{t('allTypes')}</Text>
                    </TouchableOpacity>
                    {unitTypes.map((uType: any) => (
                      <TouchableOpacity 
                        key={uType.id}
                        style={[styles.filterPill, selectedUnitTypeId === uType.id && styles.filterPillActive]}
                        onPress={() => setSelectedUnitTypeId(selectedUnitTypeId === uType.id ? '' : uType.id)}
                      >
                        <Text style={[styles.filterPillText, selectedUnitTypeId === uType.id && styles.filterPillTextActive]}>
                          {uType.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </KeyboardAwareScrollView>
                </View>
              )}

              {/* Bedrooms */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{t('bedroomsFilter')}</Text>
                <View style={[styles.bedroomsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  {['', '1', '2', '3', '4+'].map((beds) => (
                    <TouchableOpacity 
                      key={beds || 'all'}
                      style={[styles.bedroomBtn, selectedBedrooms === beds && styles.bedroomBtnActive]}
                      onPress={() => setSelectedBedrooms(beds)}
                    >
                      <Text style={[styles.bedroomBtnText, selectedBedrooms === beds && styles.bedroomBtnTextActive]}>
                        {beds ? `${beds} ${t('beds')}` : t('all')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Bathrooms */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{t('bathroomsFilter')}</Text>
                <View style={[styles.bedroomsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  {['', '1', '2', '3+'].map((baths) => (
                    <TouchableOpacity 
                      key={baths || 'all'}
                      style={[styles.bedroomBtn, selectedBathrooms === baths && styles.bedroomBtnActive]}
                      onPress={() => setSelectedBathrooms(baths)}
                    >
                      <Text style={[styles.bedroomBtnText, selectedBathrooms === baths && styles.bedroomBtnTextActive]}>
                        {baths ? baths : t('all')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Developer */}
              {developers.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={[styles.filterSectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{t('developerFilter')}</Text>
                  <KeyboardAwareScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chipsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <TouchableOpacity 
                      style={[styles.filterPill, !selectedDeveloperId && styles.filterPillActive]}
                      onPress={() => setSelectedDeveloperId('')}
                    >
                      <Text style={[styles.filterPillText, !selectedDeveloperId && styles.filterPillTextActive]}>{t('allDevelopers')}</Text>
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
                  </KeyboardAwareScrollView>
                </View>
              )}

              {/* Area Range */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{t('areaRange')}</Text>
                <View style={[styles.priceInputsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <TextInput 
                    style={styles.priceInput}
                    placeholder={t('maxAreaPlaceholder')}
                    placeholderTextColor={Colors.darkGray}
                    keyboardType="numeric"
                    value={maxArea}
                    onChangeText={setMaxArea}
                    textAlign="center"
                  />
                  <Text style={styles.priceInputDivider}>{t('to')}</Text>
                  <TextInput 
                    style={styles.priceInput}
                    placeholder={t('minAreaPlaceholder')}
                    placeholderTextColor={Colors.darkGray}
                    keyboardType="numeric"
                    value={minArea}
                    onChangeText={setMinArea}
                    textAlign="center"
                  />
                </View>
              </View>

              {/* Price / Down Payment Range */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{t('cashOrDownRange')}</Text>
                <View style={[styles.priceInputsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <TextInput 
                    style={styles.priceInput}
                    placeholder={t('rangeMax')}
                    placeholderTextColor={Colors.darkGray}
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    textAlign="center"
                  />
                  <Text style={styles.priceInputDivider}>{t('to')}</Text>
                  <TextInput 
                    style={styles.priceInput}
                    placeholder={t('rangeMin')}
                    placeholderTextColor={Colors.darkGray}
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    textAlign="center"
                  />
                </View>
              </View>

              {/* Monthly Installment Range */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{t('monthlyInstallmentRange')}</Text>
                <View style={[styles.priceInputsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  <TextInput 
                    style={styles.priceInput}
                    placeholder={t('rangeMax')}
                    placeholderTextColor={Colors.darkGray}
                    keyboardType="numeric"
                    value={maxInstallment}
                    onChangeText={setMaxInstallment}
                    textAlign="center"
                  />
                  <Text style={styles.priceInputDivider}>{t('to')}</Text>
                  <TextInput 
                    style={styles.priceInput}
                    placeholder={t('rangeMin')}
                    placeholderTextColor={Colors.darkGray}
                    keyboardType="numeric"
                    value={minInstallment}
                    onChangeText={setMinInstallment}
                    textAlign="center"
                  />
                </View>
              </View>

            </KeyboardAwareScrollView>

            {/* Modal Bottom Actions */}
            <View style={styles.modalBottomBar}>
              <TouchableOpacity 
                style={styles.applyBtn} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.applyBtnText}>
                  {t('applyWithCount').replace('{count}', String(filteredUnits.length))}
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
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortChipActive: {
    backgroundColor: '#0F294A',
    borderColor: '#0F294A',
  },
  sortChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  sortChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  
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
