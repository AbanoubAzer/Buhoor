import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  TextInput,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import { Search, MapPin, Building2, Layers, TrendingUp } from 'lucide-react-native';
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

// ─── Featured Horizontal Slider (top 4 projects) ─────────────────────────────
function FeaturedSlider({ projects, isRtl, t }: { projects: any[]; isRtl: boolean; t: any }) {
  if (projects.length === 0) return null;
  return (
    <View style={sliderStyles.container}>
      <View style={[sliderStyles.header, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
        <Text style={sliderStyles.headerTitle}>🌟 {t('featuredProjectsTitle')}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[sliderStyles.row, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
        {projects.slice(0, 6).map((proj: any) => {
          const cover = proj.coverImage || (proj.images && proj.images[0]);
          const unitsCount = proj._count?.units || 0;
          return (
            <Link href={`/project/${proj.id}`} key={proj.id} asChild>
              <Pressable style={sliderStyles.card}>
                {cover ? (
                  <Image source={{ uri: getDirectImageUrl(cover) }} contentFit="cover" style={sliderStyles.cardImage} transition={200} />
                ) : (
                  <View style={[sliderStyles.cardImage, { backgroundColor: Colors.primary }]} />
                )}
                <View style={sliderStyles.cardOverlay} />
                <View style={sliderStyles.cardBody}>
                  {proj.developer?.name && (
                    <Text style={[sliderStyles.devName, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={1}>🏢 {proj.developer.name}</Text>
                  )}
                  <Text style={[sliderStyles.projName, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={2}>{proj.name}</Text>
                  {proj.location && (
                    <View style={[sliderStyles.locRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                      <MapPin size={10} color="rgba(255,255,255,0.8)" />
                      <Text style={sliderStyles.locText} numberOfLines={1}>{proj.location}</Text>
                    </View>
                  )}
                </View>
                {unitsCount > 0 && (
                  <View style={sliderStyles.badge}>
                    <Text style={sliderStyles.badgeText}>{unitsCount} {isRtl ? 'وحدة' : 'units'}</Text>
                  </View>
                )}
              </Pressable>
            </Link>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── Project List Card ────────────────────────────────────────────────────────
function ProjectCard({ project, isRtl, t, getLocalized }: any) {
  const cover = project.coverImage || (project.images && project.images[0]);
  const unitsCount = project._count?.units || (project.units ? project.units.length : 0);
  const projectName = getLocalized(project, 'name');
  const projectLocation = getLocalized(project, 'location');
  const devName = project.developer ? getLocalized(project.developer, 'name') : '';

  return (
    <Link href={`/project/${project.id}`} asChild>
      <Pressable style={cardStyles.card}>
        <View style={cardStyles.imageWrap}>
          {cover ? (
            <Image source={{ uri: getDirectImageUrl(cover) }} contentFit="cover" style={cardStyles.image} transition={200} />
          ) : (
            <View style={[cardStyles.image, cardStyles.placeholder]}>
              <Building2 size={36} color={Colors.grayMid} />
            </View>
          )}
          {unitsCount > 0 && (
            <View style={cardStyles.countBadge}>
              <Layers size={11} color="#fff" />
              <Text style={cardStyles.countText}>{unitsCount} {isRtl ? 'وحدة' : 'units'}</Text>
            </View>
          )}
        </View>

        <View style={cardStyles.body}>
          {devName ? (
            <View style={[cardStyles.devRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <Building2 size={11} color={Colors.darkGray} />
              <Text style={cardStyles.devName}>{devName}</Text>
            </View>
          ) : null}

          <Text style={[cardStyles.projectName, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={1}>
            {projectName}
          </Text>

          {projectLocation ? (
            <View style={[cardStyles.locRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <MapPin size={12} color={Colors.darkGray} />
              <Text style={[cardStyles.locText, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={1}>
                {projectLocation}
              </Text>
            </View>
          ) : null}

          <View style={[cardStyles.footer, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <View style={cardStyles.roiTag}>
              <TrendingUp size={10} color={Colors.success} />
              <Text style={cardStyles.roiText}>{isRtl ? 'عائد مرتفع' : 'High ROI'}</Text>
            </View>
            <Text style={cardStyles.viewDetails}>{isRtl ? 'عرض المشروع ←' : 'View Project →'}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProjectsTab() {
  const { projects, loadingProjects, fetchProjects, language, t, getLocalized } = useStore();
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(p => {
      const name = getLocalized(p, 'name').toLowerCase();
      const loc = getLocalized(p, 'location').toLowerCase();
      const dev = p.developer ? getLocalized(p.developer, 'name').toLowerCase() : '';
      return name.includes(q) || loc.includes(q) || dev.includes(q);
    });
  }, [projects, searchQuery]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <View style={[styles.searchBar, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
          <Search color={Colors.darkGray} size={18} style={{ marginHorizontal: 4 }} />
          <TextInput
            style={[styles.searchInput, { textAlign: isRtl ? 'right' : 'left' }]}
            placeholder={isRtl ? 'ابحث عن مشروع، منطقة، مطور...' : 'Search project, area, developer...'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.darkGray}
          />
        </View>
        <Text style={[styles.resultsCount, { textAlign: isRtl ? 'right' : 'left' }]}>
          {filteredProjects.length} {isRtl ? 'مشروع' : 'projects'}
        </Text>
      </View>

      {loadingProjects && projects.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProjectCard
              project={item}
              isRtl={isRtl}
              t={t}
              getLocalized={getLocalized}
            />
          )}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          ListHeaderComponent={
            !searchQuery ? <FeaturedSlider projects={projects} isRtl={isRtl} t={t} /> : null
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Building2 size={48} color={Colors.grayMid} />
              <Text style={styles.emptyTitle}>{t('projectNotFound')}</Text>
              <Text style={styles.emptySub}>{isRtl ? 'جرب كلمة بحث مختلفة' : 'Try a different search keyword'}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const sliderStyles = StyleSheet.create({
  container: { marginBottom: 20 },
  header: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 10, paddingHorizontal: 16 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  row: { paddingHorizontal: 16, gap: 12 },
  card: {
    width: 230,
    height: 170,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: {
    position: 'absolute', inset: 0,
    backgroundColor: 'rgba(13,30,61,0.65)',
  },
  cardBody: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 12,
  },
  devName: { fontSize: 10, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  projName: { fontSize: 15, fontWeight: '800', color: '#fff', textAlign: 'right' },
  locRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 3, marginTop: 4 },
  locText: { fontSize: 10, color: 'rgba(255,255,255,0.8)', flex: 1 },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 200 },
  placeholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surface },
  countBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.primary,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  countText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  body: { padding: 16 },
  devRow: { alignItems: 'center', gap: 4, marginBottom: 6 },
  devName: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  projectName: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  locRow: { alignItems: 'center', gap: 5, marginBottom: 12 },
  locText: { fontSize: 12, color: Colors.textMuted, flex: 1 },
  footer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 12,
  },
  roiTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roiText: { fontSize: 11, fontWeight: '700', color: Colors.success },
  viewDetails: { fontSize: 13, fontWeight: '800', color: Colors.accent },
});

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  searchWrap: {
    padding: 14,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 8,
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text, paddingHorizontal: 8 },
  resultsCount: { fontSize: 12, color: Colors.textMuted, textAlign: 'right' },
  content: { padding: 16 },
  emptyWrap: { padding: 48, alignItems: 'center', gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  emptySub: { fontSize: 13, color: Colors.textMuted },
});
