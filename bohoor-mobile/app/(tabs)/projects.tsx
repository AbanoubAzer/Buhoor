import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable, TextInput, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { Search, MapPin, Building } from 'lucide-react-native';
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

export default function ProjectsTab() {
  const { projects, loadingProjects, fetchProjects, language, t, getLocalized } = useStore();
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  const renderProject = ({ item: project }: { item: any }) => {
    const cover = project.coverImage || (project.images && project.images[0]);
    const unitsCount = project._count?.units || (project.units ? project.units.length : 0);
    const projectName = getLocalized(project, 'name');
    const projectLocation = getLocalized(project, 'location');
    const devName = project.developer ? getLocalized(project.developer, 'name') : '';

    return (
      <Link href={`/project/${project.id}`} asChild>
        <Pressable style={styles.card}>
          {cover ? (
            <Image source={{ uri: getDirectImageUrl(cover) }} contentFit="cover" style={styles.image} transition={200} />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.placeholderText}>{t('noCoverImage')}</Text>
            </View>
          )}

          {unitsCount > 0 && (
            <View style={[styles.unitBadge, isRtl ? { right: 12 } : { left: 12 }]}>
              <Text style={styles.unitBadgeText}>
                {unitsCount} {isRtl ? 'وحدات متاحة' : 'units available'}
              </Text>
            </View>
          )}

          <View style={styles.cardBody}>
            {devName ? (
              <View style={[styles.devRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Building size={12} color={Colors.darkGray} />
                <Text style={styles.devName}>{devName}</Text>
              </View>
            ) : null}
            <Text style={[styles.projectName, { textAlign: isRtl ? 'right' : 'left' }]}>{projectName}</Text>
            {projectLocation ? (
              <View style={[styles.locRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <MapPin size={14} color={Colors.darkGray} />
                <Text style={[styles.projectLocation, { textAlign: isRtl ? 'right' : 'left' }]}>{projectLocation}</Text>
              </View>
            ) : null}
          </View>
        </Pressable>
      </Link>
    );
  };

  const filteredProjects = projects.filter(project => {
    const name = getLocalized(project, 'name').toLowerCase();
    const loc = getLocalized(project, 'location').toLowerCase();
    const dev = (project.developer ? getLocalized(project.developer, 'name') : '').toLowerCase();
    const q = searchQuery.toLowerCase();

    return name.includes(q) || loc.includes(q) || dev.includes(q);
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
          <TextInput 
            style={[styles.searchInput, { textAlign: isRtl ? 'right' : 'left' }]}
            placeholder={isRtl ? 'ابحث عن مشروع أو منطقة أو مطور...' : 'Search by project, area, or developer...'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.darkGray}
          />
          <Search color={Colors.darkGray} size={20} style={{ marginHorizontal: 8 }} />
        </View>
      </View>

      {loadingProjects && projects.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProject}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>{t('projectNotFound')}</Text>
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
  searchBar: { alignItems: 'center', backgroundColor: Colors.gray, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  searchInput: { flex: 1, fontSize: 15, color: Colors.primary },
  content: { padding: 16 },
  card: { backgroundColor: Colors.background, borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 2, borderWidth: 1, borderColor: '#E5E7EB', position: 'relative' },
  image: { width: '100%', height: 200, backgroundColor: Colors.gray },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: Colors.darkGray },
  unitBadge: { position: 'absolute', top: 12, backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, zIndex: 10 },
  unitBadgeText: { color: Colors.background, fontSize: 11, fontWeight: 'bold' },
  cardBody: { padding: 16 },
  devRow: { alignItems: 'center', gap: 4, marginBottom: 4 },
  devName: { fontSize: 12, color: Colors.darkGray, fontWeight: '600' },
  projectName: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginBottom: 6 },
  locRow: { alignItems: 'center', gap: 4 },
  projectLocation: { fontSize: 13, color: Colors.darkGray },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
});
