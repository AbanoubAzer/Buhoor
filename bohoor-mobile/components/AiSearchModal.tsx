import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Dimensions,
  Linking,
  Pressable
} from 'react-native';
import { Link } from 'expo-router';
import { 
  Sparkles, 
  X, 
  MapPin, 
  MessageCircle, 
  ChevronLeft, 
  ArrowRight,
  TrendingUp,
  Building
} from 'lucide-react-native';
import axios from 'axios';
import Colors from '../constants/Colors';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://buhoor.vercel.app';
const { height } = Dimensions.get('window');

interface AiSearchModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AiSearchModal({ visible, onClose }: AiSearchModalProps) {
  const [query, setQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const exampleQueries = [
    '2 bedroom apartment in Sahl Hasheesh, max 5M, sea view',
    'شاليه غرفتين في الجونة على البحر أقل من 6 مليون',
    'شقة 3 غرف في التجمع الخامس تقسيط ميزانية 4 مليون',
  ];

  const handleSearch = async (textToSearch?: string) => {
    const q = textToSearch || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/ai-search`, {
        query: q,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
      });
      setResult(response.data);
    } catch (err: any) {
      console.error('Mobile AI Search Error:', err);
      setError('تعذر استخراج التطابقات، يرجى التأكد من اتصال الإنترنت والمحاولة ثانية.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (unit: any) => {
    const text = encodeURI(`أستفسر عن العقار المتطابق عبر البحث الذكي: ${unit.title} (كود: ${unit.code || unit.id})`);
    Linking.openURL(`https://wa.me/201000000000?text=${text}`).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={22} color={Colors.primary} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <View style={styles.headerPill}>
                <Sparkles size={14} color="#D97706" />
                <Text style={styles.headerPillText}>AI Search & Matching</Text>
              </View>
              <Text style={styles.title}>البحث الذكي ومطابقة العقارات</Text>
            </View>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Query Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>اكتب طلبك بلغتك الطبيعية (عربي أو إنجليزي):</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={3}
                placeholder="مثال: I need a 2 bedroom apartment in Sahl Hasheesh, max 5M, sea view..."
                placeholderTextColor={Colors.darkGray}
                value={query}
                onChangeText={setQuery}
                textAlign="right"
              />

              {/* Example Chips */}
              <View style={styles.examplesRow}>
                {exampleQueries.map((ex, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={styles.exampleChip}
                    onPress={() => {
                      setQuery(ex);
                      handleSearch(ex);
                    }}
                  >
                    <Text style={styles.exampleText} numberOfLines={1}>{ex}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Optional Contact Inputs */}
              <View style={styles.contactInputs}>
                <TextInput
                  style={styles.singleInput}
                  placeholder="رقم الهاتف (اختياري لاستلام العروض)"
                  placeholderTextColor={Colors.darkGray}
                  keyboardType="phone-pad"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  textAlign="right"
                />
                <TextInput
                  style={styles.singleInput}
                  placeholder="الاسم الكريم (اختياري)"
                  placeholderTextColor={Colors.darkGray}
                  value={customerName}
                  onChangeText={setCustomerName}
                  textAlign="right"
                />
              </View>

              {/* Search Button */}
              <TouchableOpacity
                style={[styles.searchBtn, (!query.trim() || loading) && styles.searchBtnDisabled]}
                onPress={() => handleSearch()}
                disabled={!query.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.searchBtnText}>تحليل ومطابقة العقارات بالـ AI</Text>
                    <Sparkles size={18} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Results Section */}
            {result && (
              <View style={styles.resultsContainer}>
                
                {/* Extracted Filters Card */}
                {result.extractedFilters && (
                  <View style={styles.extractedCard}>
                    <Text style={styles.extractedTitle}>💡 تم استخراج الفلاتر كالتالي:</Text>
                    <View style={styles.filtersPillsRow}>
                      {result.extractedFilters.location && (
                        <View style={styles.extractedPill}>
                          <Text style={styles.extractedPillText}>📍 {result.extractedFilters.location}</Text>
                        </View>
                      )}
                      {result.extractedFilters.maxPrice && (
                        <View style={styles.extractedPill}>
                          <Text style={styles.extractedPillText}>
                            💰 ميزانية: {Number(result.extractedFilters.maxPrice).toLocaleString('ar-EG')} ج
                          </Text>
                        </View>
                      )}
                      {result.extractedFilters.bedrooms && (
                        <View style={styles.extractedPill}>
                          <Text style={styles.extractedPillText}>🛏️ {result.extractedFilters.bedrooms} غرف</Text>
                        </View>
                      )}
                      {result.extractedFilters.propertyType && (
                        <View style={styles.extractedPill}>
                          <Text style={styles.extractedPillText}>🏢 {result.extractedFilters.propertyType}</Text>
                        </View>
                      )}
                      {result.extractedFilters.seaView && (
                        <View style={styles.extractedPill}>
                          <Text style={styles.extractedPillText}>🌊 إطلالة بحرية</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Matches List */}
                <View style={styles.matchesList}>
                  <Text style={styles.matchesTitle}>
                    العقارات المتطابقة ({result.matches?.length || 0})
                  </Text>

                  {result.matches?.length === 0 ? (
                    <Text style={styles.emptyText}>لم نجد عقارات مطابقة بدقة، جرب توسيع معايير البحث.</Text>
                  ) : (
                    result.matches.map((item: any, idx: number) => {
                      const unit = item.unit;
                      const score = item.matchScore;
                      const price = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);

                      let scoreColor = '#065F46';
                      let scoreBg = '#DCFCE7';
                      if (score < 80) {
                        scoreColor = '#1E40AF';
                        scoreBg = '#DBEAFE';
                      }

                      return (
                        <View key={unit.id || idx} style={styles.matchCard}>
                          <View style={styles.matchCardTop}>
                            <View style={[styles.scoreBadge, { backgroundColor: scoreBg }]}>
                              <Text style={[styles.scoreBadgeText, { color: scoreColor }]}>
                                {score}% تطابق
                              </Text>
                            </View>
                            <Text style={styles.matchUnitTitle} numberOfLines={1}>
                              {unit.title}
                            </Text>
                          </View>

                          <View style={styles.matchLocRow}>
                            <Text style={styles.matchLocText}>
                              {unit.location?.name || unit.location?.governorate || '-'}
                            </Text>
                            <MapPin size={13} color={Colors.darkGray} />
                          </View>

                          <View style={styles.matchBottomRow}>
                            <View style={styles.matchActions}>
                              <TouchableOpacity 
                                style={styles.waMiniBtn}
                                onPress={() => handleWhatsApp(unit)}
                              >
                                <MessageCircle size={16} color="#fff" />
                                <Text style={styles.waMiniBtnText}>واتساب</Text>
                              </TouchableOpacity>

                              <Link 
                                href={`/unit/${unit.id}`}
                                asChild
                                onPress={onClose}
                              >
                                <TouchableOpacity style={styles.viewMiniBtn}>
                                  <Text style={styles.viewMiniBtnText}>عرض</Text>
                                  <ChevronLeft size={16} color={Colors.primary} />
                                </TouchableOpacity>
                              </Link>
                            </View>

                            <Text style={styles.matchPrice}>
                              {price.toLocaleString('ar-EG')} ج.م
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>

              </View>
            )}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.88,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitleContainer: { alignItems: 'flex-end' },
  headerPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
    marginBottom: 4,
  },
  headerPillText: { fontSize: 10, fontWeight: 'bold', color: '#B45309' },
  title: { fontSize: 17, fontWeight: 'bold', color: Colors.primary },
  closeBtn: { padding: 6 },
  scroll: { paddingHorizontal: 20, paddingVertical: 14 },

  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 6 },
  textInput: {
    backgroundColor: Colors.gray,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 13,
    color: Colors.primary,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  examplesRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  exampleChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxWidth: '100%',
  },
  exampleText: { fontSize: 10, color: Colors.darkGray },
  contactInputs: { flexDirection: 'row-reverse', gap: 8, marginTop: 10 },
  singleInput: {
    flex: 1,
    backgroundColor: Colors.gray,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.primary,
  },
  searchBtn: {
    flexDirection: 'row-reverse',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBtnDisabled: { opacity: 0.5 },
  searchBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  errorBox: { backgroundColor: '#FEE2E2', padding: 10, borderRadius: 10, marginBottom: 12 },
  errorText: { color: '#DC2626', fontSize: 12, textAlign: 'right' },

  resultsContainer: { marginTop: 10, paddingBottom: 20 },
  extractedCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 16,
  },
  extractedTitle: { fontSize: 12, fontWeight: 'bold', color: '#3730A3', textAlign: 'right', marginBottom: 8 },
  filtersPillsRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6 },
  extractedPill: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  extractedPillText: { fontSize: 11, fontWeight: 'bold', color: '#4338CA' },

  matchesList: { gap: 10 },
  matchesTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 4 },
  emptyText: { textAlign: 'center', color: Colors.darkGray, fontSize: 13, marginVertical: 16 },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  matchCardTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  matchUnitTitle: { fontSize: 13, fontWeight: 'bold', color: Colors.primary, flex: 1, textAlign: 'right', marginLeft: 8 },
  scoreBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  scoreBadgeText: { fontSize: 11, fontWeight: 'bold' },
  matchLocRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginBottom: 8 },
  matchLocText: { fontSize: 11, color: Colors.darkGray },
  matchBottomRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  matchPrice: { fontSize: 14, fontWeight: 'bold', color: Colors.accent },
  matchActions: { flexDirection: 'row-reverse', gap: 6 },
  waMiniBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  waMiniBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  viewMiniBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.gray,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  viewMiniBtnText: { color: Colors.primary, fontSize: 11, fontWeight: 'bold' },
});
