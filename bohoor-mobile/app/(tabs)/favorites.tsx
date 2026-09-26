import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { Heart, MapPin, Maximize2, BedDouble, Trash2, ArrowRight } from 'lucide-react-native';
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

export default function FavoritesTab() {
  const { units, favorites, toggleFavorite, isFavorite } = useStore();

  const favoriteUnits = units.filter((unit) => isFavorite(unit.id));

  const renderUnit = ({ item: unit }: { item: any }) => {
    const cover = unit.coverImage || (unit.images && unit.images[0]);
    const price = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);
    const locName = unit.location?.name || unit.project?.location || '';

    return (
      <Link href={`/unit/${unit.id}`} asChild>
        <Pressable style={styles.card}>
          {cover ? (
            <Image 
              source={{ uri: getDirectImageUrl(cover) }} 
              contentFit="cover" 
              style={styles.image} 
              transition={200} 
            />
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
            <Heart color={Colors.accent} fill={Colors.accent} size={22} />
          </TouchableOpacity>

          <View style={styles.cardBody}>
            <View style={styles.topMeta}>
              <Text style={unit.sellerType === 'DEVELOPER' ? styles.devBadge : styles.typeBadge}>
                {unit.sellerType === 'DEVELOPER' ? '🏢 مطور مباشر' : '👤 أفراد'}
              </Text>
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
              <Text style={styles.priceLabel}>
                {unit.sellerType === 'DEVELOPER' ? 'السعر / المقدم:' : 'المطلوب كاش:'}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>
          {favoriteUnits.length > 0
            ? `لديك ${favoriteUnits.length} عقار محفوظ في قائمتك المفضلة`
            : 'احفظ العقارات التي تعجبك بالضغط على أيقونة القلب لتصل إليها لاحقاً'}
        </Text>
        <Text style={styles.headerTitle}>العقارات المفضلة ❤️</Text>
      </View>

      {favoriteUnits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Heart size={48} color={Colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>لا توجد عقارات في المفضلة</Text>
          <Text style={styles.emptySub}>
            تصفح قائمة العقارات والمشاريع وقم بالضغط على رمز القلب لحفظ العقارات التي تهتم بها.
          </Text>
          <Link href="/units" asChild>
            <TouchableOpacity style={styles.browseBtn}>
              <Text style={styles.browseBtnText}>استكشف العقارات الآن</Text>
              <ArrowRight size={18} color="#fff" />
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        <FlatList
          data={favoriteUnits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUnit}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'flex-end',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  headerSubtitle: { fontSize: 13, color: Colors.darkGray, marginTop: 4, textAlign: 'right' },
  content: { padding: 16 },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  image: { width: '100%', height: 190, backgroundColor: Colors.gray },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: Colors.darkGray },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBody: { padding: 14 },
  topMeta: { flexDirection: 'row-reverse', gap: 8, marginBottom: 6 },
  typeBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primary,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
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
    borderRadius: 8,
  },
  seaBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  unitName: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 6 },
  locRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginBottom: 8 },
  locText: { fontSize: 12, color: Colors.darkGray },
  specsRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  specItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  specVal: { fontSize: 12, color: Colors.darkGray, fontWeight: '600' },
  priceRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 12, color: Colors.darkGray },
  price: { fontSize: 16, fontWeight: 'bold', color: Colors.accent },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  browseBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  browseBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
