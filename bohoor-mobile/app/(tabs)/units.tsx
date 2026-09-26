import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable, TouchableOpacity, TextInput, RefreshControl, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Heart, Search, MapPin, Maximize2, BedDouble } from 'lucide-react-native';
import { Image } from 'expo-image';
import Colors from '../../constants/Colors';
import { useStore } from '../../store/useStore';

const getDirectImageUrl = (url: string) => {
  if (!url) return url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/file/d/')[1]?.split('/')[0];
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  return url;
};

type FilterCategory = 'ALL' | 'CASH' | 'INSTALLMENT' | 'DEVELOPER' | 'INDIVIDUAL';

export default function UnitsTab() {
  const { units, loadingUnits, fetchUnits, toggleFavorite, isFavorite } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (units.length === 0) {
      fetchUnits();
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUnits();
    setRefreshing(false);
  };

  const renderUnit = ({ item: unit }: { item: any }) => {
    const isFav = isFavorite(unit.id);
    const cover = unit.coverImage || (unit.images && unit.images[0]);
    const price = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);
    const locName = unit.location?.name || unit.project?.location || '';

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
          >
            <Heart color={isFav ? Colors.accent : Colors.background} fill={isFav ? Colors.accent : 'rgba(0,0,0,0.5)'} size={22} />
          </TouchableOpacity>

          <View style={styles.cardBody}>
            <View style={styles.topMeta}>
              <Text style={styles.typeBadge}>{unit.sellerType === 'DEVELOPER' ? '🏢 مطور' : '👤 أفراد'}</Text>
              {unit.isSeaView && <Text style={styles.seaBadge}>🌊 إطلالة بحر</Text>}
            </View>

            <Text style={styles.unitName} numberOfLines={1}>{unit.title}</Text>
            
            {locName ? (
              <View style={styles.locRow}>
                <Text style={styles.locText} numberOfLines={1}>{locName}</Text>
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
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.price}>{price.toLocaleString('ar-EG')} ج.م</Text>
              <Text style={styles.priceLabel}>{unit.sellerType === 'DEVELOPER' ? 'السعر / المقدم:' : 'المطلوب كاش:'}</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };

  const filteredUnits = units.filter(unit => {
    const matchesSearch = 
      unit.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (unit.description && unit.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (unit.location?.name && unit.location.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'CASH') return unit.isCashOnly === true;
    if (activeFilter === 'INSTALLMENT') return unit.isCashOnly === false;
    if (activeFilter === 'DEVELOPER') return unit.sellerType === 'DEVELOPER';
    if (activeFilter === 'INDIVIDUAL') return unit.sellerType === 'INDIVIDUAL';
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput 
            style={styles.searchInput}
            placeholder="ابحث عن عقار، منطقة..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
            placeholderTextColor={Colors.darkGray}
          />
          <Search color={Colors.darkGray} size={20} style={{ marginLeft: 8 }} />
        </View>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsContainer}
        >
          <TouchableOpacity 
            style={[styles.chip, activeFilter === 'ALL' && styles.activeChip]}
            onPress={() => setActiveFilter('ALL')}
          >
            <Text style={[styles.chipText, activeFilter === 'ALL' && styles.activeChipText]}>الكل ({units.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, activeFilter === 'CASH' && styles.activeChip]}
            onPress={() => setActiveFilter('CASH')}
          >
            <Text style={[styles.chipText, activeFilter === 'CASH' && styles.activeChipText]}>💵 كاش فقط</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, activeFilter === 'INSTALLMENT' && styles.activeChip]}
            onPress={() => setActiveFilter('INSTALLMENT')}
          >
            <Text style={[styles.chipText, activeFilter === 'INSTALLMENT' && styles.activeChipText]}>📅 تقسيط</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, activeFilter === 'DEVELOPER' && styles.activeChip]}
            onPress={() => setActiveFilter('DEVELOPER')}
          >
            <Text style={[styles.chipText, activeFilter === 'DEVELOPER' && styles.activeChipText]}>🏢 مطورين</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, activeFilter === 'INDIVIDUAL' && styles.activeChip]}
            onPress={() => setActiveFilter('INDIVIDUAL')}
          >
            <Text style={[styles.chipText, activeFilter === 'INDIVIDUAL' && styles.activeChipText]}>👤 إعادة بيع</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>لم نجد وحدات مطابقة للبحث</Text>
              <Text style={styles.emptySub}>جرب اختيار تصنيف آخر أو مسح كلمة البحث</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.gray },
  searchContainer: { padding: 14, backgroundColor: Colors.background, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.primary },
  filterChipsContainer: { flexDirection: 'row-reverse', gap: 8, paddingVertical: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.gray, borderWidth: 1, borderColor: '#E5E7EB' },
  activeChip: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, fontWeight: 'bold', color: Colors.darkGray },
  activeChipText: { color: Colors.background },
  content: { padding: 16 },
  card: { backgroundColor: Colors.background, borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 2, borderWidth: 1, borderColor: '#E5E7EB', position: 'relative' },
  image: { width: '100%', height: 190, backgroundColor: Colors.gray },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: Colors.darkGray },
  favoriteBtn: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 8, zIndex: 10 },
  cardBody: { padding: 14 },
  topMeta: { flexDirection: 'row-reverse', gap: 8, marginBottom: 6 },
  typeBadge: { fontSize: 11, fontWeight: 'bold', color: Colors.primary, backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  seaBadge: { fontSize: 11, fontWeight: 'bold', color: '#0284C7', backgroundColor: '#E0F2FE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  unitName: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 6 },
  locRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginBottom: 8 },
  locText: { fontSize: 12, color: Colors.darkGray },
  specsRow: { flexDirection: 'row-reverse', gap: 12, marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  specItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  specVal: { fontSize: 12, color: Colors.darkGray, fontWeight: '600' },
  priceRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 12, color: Colors.darkGray },
  price: { fontSize: 16, fontWeight: 'bold', color: Colors.accent },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginBottom: 6 },
  emptySub: { fontSize: 13, color: Colors.darkGray },
});
