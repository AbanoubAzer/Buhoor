import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable, TouchableOpacity, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { Heart, Search } from 'lucide-react-native';
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

export default function UnitsTab() {
  const { units, loadingUnits, fetchUnits, toggleFavorite, isFavorite } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (units.length === 0) {
      fetchUnits();
    }
  }, []);

  if (loadingUnits) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const renderUnit = ({ item: unit }: { item: any }) => {
    const isFav = isFavorite(unit.id);
    return (
      <Link href={`/unit/${unit.id}`} asChild>
        <Pressable style={styles.card}>
          {unit.coverImage ? (
            <Image source={{ uri: getDirectImageUrl(unit.coverImage) }} contentFit="cover" style={styles.image} transition={200} />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.placeholderText}>لا توجد صورة</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.favoriteBtn} 
            onPress={() => toggleFavorite(unit.id)}
          >
            <Heart color={isFav ? Colors.accent : Colors.background} fill={isFav ? Colors.accent : 'rgba(0,0,0,0.5)'} size={24} />
          </TouchableOpacity>

          <View style={styles.cardBody}>
            <Text style={styles.unitName} numberOfLines={1}>{unit.title}</Text>
            <View style={styles.row}>
              <Text style={styles.price}>{Number(unit.cashPaidToSeller).toLocaleString('ar-EG')} ج.م</Text>
              <Text style={styles.type}>{unit.sellerType === 'DEVELOPER' ? 'مطور' : 'فرد'}</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };

  const filteredUnits = units.filter(unit => 
    unit.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (unit.description && unit.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput 
            style={styles.searchInput}
            placeholder="ابحث عن وحدة..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
            placeholderTextColor={Colors.darkGray}
          />
          <Search color={Colors.darkGray} size={20} style={{ marginLeft: 8 }} />
        </View>
      </View>

      <FlatList
        data={filteredUnits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUnit}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<Text style={styles.title}>الوحدات المتاحة</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.gray },
  searchContainer: { padding: 16, backgroundColor: Colors.background, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  searchInput: { flex: 1, fontSize: 16, color: Colors.primary },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.primary, marginBottom: 16, textAlign: 'right' },
  card: { backgroundColor: Colors.background, borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 2, borderWidth: 1, borderColor: '#E5E7EB', position: 'relative' },
  image: { width: '100%', height: 200, backgroundColor: Colors.gray },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: Colors.darkGray },
  favoriteBtn: { position: 'absolute', top: 12, left: 12, zIndex: 10, padding: 4, borderRadius: 20 },
  cardBody: { padding: 16 },
  unitName: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 8 },
  row: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: 'bold', color: Colors.accent },
  type: { fontSize: 12, color: Colors.background, backgroundColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' }
});
