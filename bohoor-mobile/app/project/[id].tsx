import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Linking, Pressable, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { Image } from 'expo-image';
import axios from 'axios';
import { PlayCircle, MapPin, Building, Key } from 'lucide-react-native';
import Colors from '../../constants/Colors';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://buhoor.vercel.app';

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

  const cover = project.coverImage || (project.images && project.images[0]);
  const projectUnits = project.units || [];

  return (
    <>
      <Stack.Screen options={{ title: project.name || 'تفاصيل المشروع', headerBackTitle: 'عودة' }} />
      <ScrollView style={styles.container} bounces={false}>
        {cover ? (
          <Image source={{ uri: getDirectImageUrl(cover) }} contentFit="cover" style={styles.coverImage} />
        ) : (
          <View style={[styles.coverImage, styles.placeholder]}>
            <Text style={styles.placeholderText}>لا توجد صورة غلاف</Text>
          </View>
        )}
        
        <View style={styles.content}>
          {project.developer?.name && (
            <View style={styles.devRow}>
              <Text style={styles.devName}>{project.developer.name}</Text>
              <Building size={14} color={Colors.darkGray} />
            </View>
          )}

          <Text style={styles.title}>{project.name}</Text>
          
          <View style={styles.locRow}>
            <Text style={styles.location}>{project.location}</Text>
            <MapPin size={16} color={Colors.darkGray} />
          </View>
          
          {project.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>نبذة عن المشروع</Text>
              <Text style={styles.description}>{project.description}</Text>
            </View>
          ) : null}

          {projectUnits.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>الوحدات المتاحة بالمشروع ({projectUnits.length})</Text>
              <View style={styles.unitsGrid}>
                {projectUnits.map((unit: any) => {
                  const unitCover = unit.coverImage || (unit.images && unit.images[0]);
                  const unitPrice = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);

                  return (
                    <Link href={`/unit/${unit.id}`} key={unit.id} asChild>
                      <Pressable style={styles.unitCard}>
                        {unitCover ? (
                          <Image source={{ uri: getDirectImageUrl(unitCover) }} contentFit="cover" style={styles.unitImg} />
                        ) : (
                          <View style={[styles.unitImg, styles.placeholder]}>
                            <Key size={20} color={Colors.darkGray} />
                          </View>
                        )}
                        <View style={styles.unitCardContent}>
                          <Text style={styles.unitTitle} numberOfLines={1}>{unit.title}</Text>
                          <Text style={styles.unitPrice}>{unitPrice.toLocaleString('ar-EG')} ج.م</Text>
                        </View>
                      </Pressable>
                    </Link>
                  );
                })}
              </View>
            </View>
          )}

          {project.videoUrl && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>فيديو توضيحي</Text>
              <Pressable style={styles.videoButton} onPress={() => Linking.openURL(project.videoUrl).catch(() => {})}>
                <PlayCircle color={Colors.accent} size={30} />
                <Text style={styles.videoText}>مشاهدة الفيديو التعريفي</Text>
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
  coverImage: { width: '100%', height: 280, backgroundColor: Colors.darkGray },
  placeholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5E7EB' },
  placeholderText: { color: Colors.darkGray, fontSize: 13 },
  content: { padding: 20, backgroundColor: Colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, shadowColor: Colors.text, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  devRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, marginBottom: 4 },
  devName: { fontSize: 13, color: Colors.darkGray, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 6 },
  locRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, marginBottom: 20 },
  location: { fontSize: 14, color: Colors.darkGray, textAlign: 'right' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 12 },
  description: { fontSize: 15, color: Colors.text, textAlign: 'right', lineHeight: 24 },
  unitsGrid: { gap: 12 },
  unitCard: { flexDirection: 'row-reverse', backgroundColor: Colors.gray, borderRadius: 12, overflow: 'hidden', padding: 10, alignItems: 'center', gap: 12 },
  unitImg: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#D1D5DB' },
  unitCardContent: { flex: 1 },
  unitTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 4 },
  unitPrice: { fontSize: 14, fontWeight: 'bold', color: Colors.accent, textAlign: 'right' },
  videoButton: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.gray, padding: 14, borderRadius: 12, gap: 12 },
  videoText: { fontSize: 16, color: Colors.primary, fontWeight: 'bold' },
});
