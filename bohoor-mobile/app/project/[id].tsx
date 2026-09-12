import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Linking, Pressable } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Image } from 'expo-image';
import axios from 'axios';
import { PlayCircle } from 'lucide-react-native';
import Colors from '../../constants/Colors';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333';

const getDirectImageUrl = (url: string) => {
  if (!url) return url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/file/d/')[1]?.split('/')[0];
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  return url;
};

export default function ProjectDetails() {
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>المشروع غير موجود</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: project.name, headerBackTitle: 'عودة' }} />
      <ScrollView style={styles.container} bounces={false}>
        <Image source={{ uri: getDirectImageUrl(project.coverImage) }} contentFit="cover" style={styles.coverImage} />
        
        <View style={styles.content}>
          <Text style={styles.title}>{project.name}</Text>
          <Text style={styles.location}>{project.location}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الوصف</Text>
            <Text style={styles.description}>{project.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>حالة الاستلام</Text>
            <Text style={styles.value}>{project.deliveryStatus}</Text>
          </View>

          {project.videoUrl && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>فيديو توضيحي</Text>
              <Pressable style={styles.videoButton} onPress={() => Linking.openURL(project.videoUrl).catch(() => {})}>
                <PlayCircle color={Colors.accent} size={32} />
                <Text style={styles.videoText}>مشاهدة الفيديو</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorText: { color: Colors.primary, fontSize: 18, fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: Colors.gray },
  coverImage: { width: '100%', height: 300, backgroundColor: Colors.darkGray },
  content: { padding: 20, backgroundColor: Colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, shadowColor: Colors.text, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 26, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 8 },
  location: { fontSize: 16, color: Colors.darkGray, textAlign: 'right', marginBottom: 24 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 8 },
  description: { fontSize: 15, color: Colors.text, textAlign: 'right', lineHeight: 24 },
  value: { fontSize: 15, color: Colors.accent, textAlign: 'right', fontWeight: 'bold' },
  videoButton: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.gray, padding: 12, borderRadius: 12, gap: 12 },
  videoText: { fontSize: 16, color: Colors.primary, fontWeight: 'bold' },
});
