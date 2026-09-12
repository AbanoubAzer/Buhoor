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
  const { projects, heroSlides, loadingProjects, fetchProjects, fetchHeroSlides } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  
  const loadData = async () => {
    fetchProjects();
    fetchHeroSlides();
  };

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
    if (heroSlides.length === 0) fetchHeroSlides();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loadingProjects) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const renderProject = ({ item: project }: { item: any }) => (
    <Link href={`/project/${project.id}`} asChild>
      <Pressable style={styles.card}>
        {project.coverImage ? (
          <Image source={{ uri: getDirectImageUrl(project.coverImage) }} contentFit="cover" style={styles.image} transition={200} />
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

  const renderHeroSlide = ({ item: slide }: { item: any }) => (
    <View style={styles.heroSlide}>
      <Image source={{ uri: getDirectImageUrl(slide.imageUrl) }} contentFit="cover" style={styles.heroImage} transition={200} />
      <View style={styles.heroOverlay}>
        <Text style={styles.heroTitle}>{slide.title}</Text>
        {slide.subtitle && <Text style={styles.heroSubtitle}>{slide.subtitle}</Text>}
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      {heroSlides.length > 0 && (
        <FlatList
          data={heroSlides}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderHeroSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.heroSliderContainer}
        />
      )}
      <Text style={styles.title}>المشاريع المميزة</Text>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(21, 45, 91, 0.4)', // Colors.primary with opacity
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
  }
});
