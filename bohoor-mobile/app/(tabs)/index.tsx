import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable, Dimensions, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
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

export default function Home() {
  const { projects, units, heroSlides, loadingProjects, fetchProjects, fetchUnits, fetchHeroSlides, fetchMetadata } = useStore();
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
            <Text style={styles.projectName} numberOfLines={1}>{project.name}</Text>
            <Text style={styles.projectLocation} numberOfLines={1}>{project.location}</Text>
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
          <View style={styles.unitCardBody}>
            <Text style={styles.unitCardTitle} numberOfLines={1}>{unit.title}</Text>
            <Text style={styles.unitCardPrice}>{price.toLocaleString('ar-EG')} ج.م</Text>
          </View>
        </Pressable>
      </Link>
    );
  };

  const renderHeader = () => (
    <View>
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

      {units.length > 0 && (
        <View style={styles.sectionHeader}>
          <View style={styles.rowBetween}>
            <Link href="/units" asChild>
              <Pressable>
                <Text style={styles.seeAllText}>عرض الكل &larr;</Text>
              </Pressable>
            </Link>
            <Text style={styles.title}>أحدث الفرص المتاحة</Text>
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

      <Text style={[styles.title, { marginTop: 12 }]}>المشاريع المميزة</Text>
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
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'right',
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    padding: 16,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'right',
    marginBottom: 4,
  },
  projectLocation: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: 'right',
  },
  heroSliderContainer: {
    marginBottom: 20,
    marginTop: 0,
    height: 250,
  },
  heroSlide: {
    width: width,
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(21, 45, 91, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.background,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.background,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: 'bold',
  },
  unitCard: {
    width: 200,
    backgroundColor: Colors.background,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  unitImage: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.gray,
  },
  unitCardBody: {
    padding: 10,
  },
  unitCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'right',
    marginBottom: 4,
  },
  unitCardPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.accent,
    textAlign: 'right',
  },
});
