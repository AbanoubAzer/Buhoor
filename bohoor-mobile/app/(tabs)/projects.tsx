import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { Search } from 'lucide-react-native';
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
  const { projects, loadingProjects, fetchProjects } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, []);

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
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.projectLocation}>{project.location}</Text>
        </View>
      </Pressable>
    </Link>
  );

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput 
            style={styles.searchInput}
            placeholder="ابحث عن مشروع أو منطقة..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
            placeholderTextColor={Colors.darkGray}
          />
          <Search color={Colors.darkGray} size={20} style={{ marginLeft: 8 }} />
        </View>
      </View>

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProject}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<Text style={styles.title}>كل المشاريع العقارية</Text>}
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
  card: { backgroundColor: Colors.background, borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 2, borderWidth: 1, borderColor: '#E5E7EB' },
  image: { width: '100%', height: 200, backgroundColor: Colors.gray },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: Colors.darkGray },
  cardBody: { padding: 16 },
  projectName: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 4 },
  projectLocation: { fontSize: 14, color: Colors.darkGray, textAlign: 'right' }
});
