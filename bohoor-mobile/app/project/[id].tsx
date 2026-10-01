import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Linking, Pressable, Share, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import axios from 'axios';
import { PlayCircle, MapPin, Building, Key, Share2, ChevronRight, ChevronLeft } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { useStore } from '../../store/useStore';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

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
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { language, t, getLocalized } = useStore();
  const isRtl = language === 'ar';

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

  const projectName = project ? getLocalized(project, 'name') : '';
  const projectLocation = project ? getLocalized(project, 'location') : '';
  const projectDescription = project ? getLocalized(project, 'description') : '';
  const developerName = project?.developer ? getLocalized(project.developer, 'name') : '';

  const handleShare = async () => {
    if (!project) return;
    const webUrl = `https://buhoor-web.vercel.app/projects/${project.id}`;
    const devText = developerName 
      ? `\n🏢 ${isRtl ? 'المطور' : 'Developer'}: ${developerName}` 
      : '';
    const locText = projectLocation 
      ? `\n📍 ${isRtl ? 'الموقع' : 'Location'}: ${projectLocation}` 
      : '';
    const shareMessage = isRtl
      ? `🏢 مشروع: ${projectName}${devText}${locText}\n\n🔗 شاهد تفاصيل المشروع والوحدات المتاحة:\n${webUrl}`
      : `🏢 Project: ${projectName}${devText}${locText}\n\n🔗 Explore project details & available units:\n${webUrl}`;

    try {
      await Share.share({
        message: shareMessage,
        url: webUrl,
        title: projectName,
      });
    } catch (error) {
      console.error('Error sharing project:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={{ marginTop: 12, color: Colors.darkGray }}>{t('loading')}</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{t('projectNotFound')}</Text>
      </View>
    );
  }

  const cover = project.coverImage || (project.images && project.images[0]);
  const projectUnits = project.units || [];

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: '',
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={{ paddingHorizontal: 8, paddingVertical: 4 }}
              accessibilityLabel={t('back')}
            >
              {isRtl ? (
                <ChevronRight size={26} color={Colors.primary} />
              ) : (
                <ChevronLeft size={26} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
              <LanguageSwitcher />
              <TouchableOpacity onPress={handleShare} style={{ padding: 6 }} accessibilityLabel={t('share')}>
                <Share2 color={Colors.primary} size={22} />
              </TouchableOpacity>
            </View>
          )
        }} 
      />
      <ScrollView style={styles.container} bounces={false}>
        {cover ? (
          <Image source={{ uri: getDirectImageUrl(cover) }} contentFit="cover" style={styles.coverImage} />
        ) : (
          <View style={[styles.coverImage, styles.placeholder]}>
            <Text style={styles.placeholderText}>{t('noCoverImage')}</Text>
          </View>
        )}
        
        <View style={styles.content}>
          {developerName ? (
            <View style={[styles.devRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <Building size={14} color={Colors.darkGray} />
              <Text style={styles.devName}>{developerName}</Text>
            </View>
          ) : null}

          <Text style={[styles.title, { textAlign: isRtl ? 'right' : 'left' }]}>{projectName}</Text>
          
          {projectLocation ? (
            <View style={[styles.locRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <MapPin size={16} color={Colors.darkGray} />
              <Text style={[styles.location, { textAlign: isRtl ? 'right' : 'left' }]}>{projectLocation}</Text>
            </View>
          ) : null}
          
          {projectDescription ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{t('projectOverview')}</Text>
              <Text style={[styles.description, { textAlign: isRtl ? 'right' : 'left' }]}>{projectDescription}</Text>
            </View>
          ) : null}

          {projectUnits.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                {t('availableUnits')} ({projectUnits.length})
              </Text>
              <View style={styles.unitsGrid}>
                {projectUnits.map((unit: any) => {
                  const unitCover = unit.coverImage || (unit.images && unit.images[0]);
                  const unitPrice = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);
                  const unitTitle = getLocalized(unit, 'title');

                  return (
                    <Link href={`/unit/${unit.id}`} key={unit.id} asChild>
                      <Pressable style={StyleSheet.flatten([styles.unitCard, { flexDirection: isRtl ? 'row-reverse' : 'row' }])}>
                        {unitCover ? (
                          <Image source={{ uri: getDirectImageUrl(unitCover) }} contentFit="cover" style={styles.unitImg} />
                        ) : (
                          <View style={[styles.unitImg, styles.placeholder]}>
                            <Key size={20} color={Colors.darkGray} />
                          </View>
                        )}
                        <View style={styles.unitCardContent}>
                          <Text style={[styles.unitTitle, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={1}>{unitTitle}</Text>
                          <Text style={[styles.unitPrice, { textAlign: isRtl ? 'right' : 'left' }]}>
                            {unitPrice.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}
                          </Text>
                        </View>
                      </Pressable>
                    </Link>
                  );
                })}
              </View>
            </View>
          )}

          {project.images && project.images.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{isRtl ? 'صور المشروع' : 'Project Gallery'}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {project.images.map((img: string, index: number) => (
                  <Image key={index} source={{ uri: getDirectImageUrl(img) }} style={styles.galleryImage} contentFit="cover" />
                ))}
              </ScrollView>
            </View>
          )}

          {project.videoLink && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{t('videos')}</Text>
              <Pressable 
                style={[styles.videoButton, { flexDirection: isRtl ? 'row-reverse' : 'row' }]} 
                onPress={() => Linking.openURL(project.videoLink).catch(() => {})}
              >
                <PlayCircle color={Colors.accent} size={28} />
                <Text style={styles.videoText}>{t('watchVideo')}</Text>
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
  devRow: { alignItems: 'center', gap: 6, marginBottom: 6 },
  devName: { fontSize: 13, color: Colors.darkGray, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, marginBottom: 6 },
  locRow: { alignItems: 'center', gap: 6, marginBottom: 20 },
  location: { fontSize: 14, color: Colors.darkGray },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginBottom: 12 },
  description: { fontSize: 15, color: Colors.text, lineHeight: 24 },
  unitsGrid: { gap: 12 },
  unitCard: { backgroundColor: Colors.gray, borderRadius: 12, overflow: 'hidden', padding: 10, alignItems: 'center', gap: 12 },
  unitImg: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#D1D5DB' },
  unitCardContent: { flex: 1 },
  unitTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  unitPrice: { fontSize: 14, fontWeight: 'bold', color: Colors.accent },
  videoButton: { alignItems: 'center', backgroundColor: Colors.gray, padding: 14, borderRadius: 12, gap: 12 },
  videoText: { fontSize: 15, color: Colors.primary, fontWeight: 'bold' },
  galleryImage: { width: 140, height: 100, borderRadius: 12, backgroundColor: '#D1D5DB' },
});
