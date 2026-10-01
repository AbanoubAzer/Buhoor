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
  Linking
} from 'react-native';
import { Link } from 'expo-router';
import { 
  Sparkles, 
  X, 
  MapPin, 
  MessageCircle, 
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  DollarSign
} from 'lucide-react-native';
import axios from 'axios';
import Colors from '../constants/Colors';
import { useStore } from '../store/useStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://buhoor.vercel.app';
const { height } = Dimensions.get('window');

interface AiSearchModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AiSearchModal({ visible, onClose }: AiSearchModalProps) {
  const { language, t, getLocalized } = useStore();
  const isRtl = language === 'ar';

  // 1. User & Budget
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [budget, setBudget] = useState('');

  // 2. Query & Quick Options
  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  const [isSeaView, setIsSeaView] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const budgetOptions = ['3M', '5M', '8M', '12M', '20M+'];
  const locationOptions = isRtl 
    ? ['سهل حشيش', 'الجونة', 'الغردقة', 'الساحل الشمالي', 'التجمع', 'زايد']
    : ['Sahl Hasheesh', 'El Gouna', 'Hurghada', 'North Coast', 'New Cairo', 'Sheikh Zayed'];
  const typeOptions = isRtl
    ? ['شاليه', 'شقة', 'فيلا', 'دوبلكس']
    : ['Chalet', 'Apartment', 'Villa', 'Duplex'];
  const bedroomOptions = ['1', '2', '3', '4+'];

  const handleSearch = async () => {
    // Mandatory Validation
    if (!customerName.trim()) {
      setError(t('errNameReq'));
      return;
    }
    const cleanPhone = customerPhone.trim().replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setError(t('errPhoneReq'));
      return;
    }
    if (!budget.trim()) {
      setError(t('errBudgetReq'));
      return;
    }

    let combinedQuery = query.trim();
    const parts: string[] = [];

    if (selectedType) parts.push(selectedType);
    if (selectedBedrooms) parts.push(isRtl ? `${selectedBedrooms} غرف` : `${selectedBedrooms} beds`);
    if (selectedLocation) parts.push(isRtl ? `في ${selectedLocation}` : `in ${selectedLocation}`);
    if (isSeaView) parts.push(isRtl ? 'إطلالة بحرية مباشرة صف أول' : 'direct sea view frontline');
    parts.push(isRtl ? `ميزانية ${budget} ج.م` : `budget ${budget} EGP`);

    const separator = isRtl ? '، ' : ', ';
    if (combinedQuery) {
      combinedQuery = `${combinedQuery} (${parts.join(separator)})`;
    } else {
      combinedQuery = parts.join(separator);
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/ai-search`, {
        query: combinedQuery,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
      });
      setResult(response.data);
    } catch (err: any) {
      console.error('Mobile AI Search Error:', err);
      setError(t('errSearchFail'));
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (unit: any) => {
    const title = getLocalized(unit, 'title');
    const text = isRtl
      ? encodeURI(`مرحباً بُحور، أستفسر عن العقار المتطابق: ${title} (كود: ${unit.code || unit.id})`)
      : encodeURI(`Hello Buhoor, inquiring about matching property: ${title} (Code: ${unit.code || unit.id})`);
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
          <View style={[styles.header, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={22} color={Colors.primary} />
            </TouchableOpacity>
            <View style={[styles.headerTitleContainer, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
              <View style={[styles.headerPill, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Sparkles size={14} color="#D97706" />
                <Text style={styles.headerPillText}>{t('aiSearchSubtitle')}</Text>
              </View>
              <Text style={styles.title}>{t('aiSearchTitle')}</Text>
            </View>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            
            {/* STEP 1: Name, Phone & Budget */}
            <View style={styles.stepBox}>
              <View style={[styles.stepHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Text style={styles.stepPill}>{t('aiStep')} 1</Text>
                <Text style={styles.stepTitle}>{t('aiStep1Title')}</Text>
              </View>

              <View style={[styles.inputsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={styles.inputWrapper}>
                  <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{t('phoneNumber')}</Text>
                  <TextInput
                    style={[styles.input, { textAlign: isRtl ? 'right' : 'left' }]}
                    placeholder={t('phonePlaceholder')}
                    placeholderTextColor={Colors.darkGray}
                    keyboardType="phone-pad"
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{t('fullName')}</Text>
                  <TextInput
                    style={[styles.input, { textAlign: isRtl ? 'right' : 'left' }]}
                    placeholder={t('namePlaceholder')}
                    placeholderTextColor={Colors.darkGray}
                    value={customerName}
                    onChangeText={setCustomerName}
                  />
                </View>
              </View>

              <View style={{ marginTop: 8 }}>
                <Text style={[styles.label, { textAlign: isRtl ? 'right' : 'left' }]}>{t('budgetLabel')}</Text>
                <TextInput
                  style={[styles.input, { fontWeight: 'bold', textAlign: isRtl ? 'right' : 'left' }]}
                  placeholder={t('budgetPlaceholder')}
                  placeholderTextColor={Colors.darkGray}
                  keyboardType="numeric"
                  value={budget}
                  onChangeText={setBudget}
                />
                
                {/* Budget quick chips */}
                <View style={[styles.budgetChipsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  {budgetOptions.map((b) => (
                    <TouchableOpacity
                      key={b}
                      onPress={() => setBudget(b.replace('M', '000000'))}
                      style={[
                        styles.chip,
                        budget === b.replace('M', '000000') && styles.chipActive
                      ]}
                    >
                      <Text style={[styles.chipText, budget === b.replace('M', '000000') && styles.chipTextActive]}>
                        {b}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* STEP 2: Quick Search or Pick Options */}
            <View style={styles.stepBox}>
              <View style={[styles.stepHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.stepPill, { backgroundColor: '#059669' }]}>{t('aiStep')} 2</Text>
                <Text style={styles.stepTitle}>{t('aiStep2Title')}</Text>
              </View>

              {/* Free text prompt */}
              <TextInput
                style={[styles.promptInput, { textAlign: isRtl ? 'right' : 'left' }]}
                multiline
                numberOfLines={2}
                placeholder={t('aiPromptPlaceholder')}
                placeholderTextColor={Colors.darkGray}
                value={query}
                onChangeText={setQuery}
              />

              {/* Pick Location */}
              <View style={styles.optionsSection}>
                <Text style={[styles.optionsLabel, { textAlign: isRtl ? 'right' : 'left' }]}>{t('aiLocationLabel')}</Text>
                <View style={[styles.optionsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  {locationOptions.map((loc) => (
                    <TouchableOpacity
                      key={loc}
                      onPress={() => setSelectedLocation(selectedLocation === loc ? '' : loc)}
                      style={[styles.optionPill, selectedLocation === loc && styles.optionPillActive]}
                    >
                      <Text style={[styles.optionPillText, selectedLocation === loc && styles.optionPillTextActive]}>
                        {loc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Pick Type & Bedrooms */}
              <View style={styles.optionsSection}>
                <Text style={[styles.optionsLabel, { textAlign: isRtl ? 'right' : 'left' }]}>{t('aiTypeAndBedsLabel')}</Text>
                <View style={[styles.optionsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                  {typeOptions.map((tp) => (
                    <TouchableOpacity
                      key={tp}
                      onPress={() => setSelectedType(selectedType === tp ? '' : tp)}
                      style={[styles.optionPill, selectedType === tp && styles.optionPillActive]}
                    >
                      <Text style={[styles.optionPillText, selectedType === tp && styles.optionPillTextActive]}>
                        {tp}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {bedroomOptions.map((b) => (
                    <TouchableOpacity
                      key={b}
                      onPress={() => setSelectedBedrooms(selectedBedrooms === b ? '' : b)}
                      style={[styles.optionPill, selectedBedrooms === b && styles.optionPillActive]}
                    >
                      <Text style={[styles.optionPillText, selectedBedrooms === b && styles.optionPillTextActive]}>
                        {b} {isRtl ? 'غرف' : 'beds'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Sea View Toggle */}
              <TouchableOpacity
                onPress={() => setIsSeaView(!isSeaView)}
                style={[styles.seaBtn, isSeaView && styles.seaBtnActive, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
              >
                <Text style={[styles.seaBtnText, isSeaView && styles.seaBtnTextActive]}>
                  {t('aiSeaViewDirect')}
                </Text>
                <View style={[styles.seaCheckbox, isSeaView && styles.seaCheckboxActive]}>
                  {isSeaView && <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>✓</Text>}
                </View>
              </TouchableOpacity>

              {/* Submit Search */}
              <TouchableOpacity
                style={[styles.searchBtn, loading && styles.searchBtnDisabled, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
                onPress={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.searchBtnText}>{t('aiStartMatching')}</Text>
                    <Sparkles size={18} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={[styles.errorText, { textAlign: isRtl ? 'right' : 'left' }]}>{error}</Text>
              </View>
            )}

            {/* Results Section */}
            {result && (
              <View style={styles.resultsContainer}>
                
                {/* Extracted Filters Card */}
                {result.extractedFilters && (
                  <View style={styles.extractedCard}>
                    <Text style={[styles.extractedTitle, { textAlign: isRtl ? 'right' : 'left' }]}>{t('aiExtractedFilters')}</Text>
                    <View style={[styles.filtersPillsRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                      {result.extractedFilters.location && (
                        <View style={styles.extractedPill}>
                          <Text style={styles.extractedPillText}>📍 {result.extractedFilters.location}</Text>
                        </View>
                      )}
                      {result.extractedFilters.maxPrice && (
                        <View style={styles.extractedPill}>
                          <Text style={styles.extractedPillText}>
                            💰 {Number(result.extractedFilters.maxPrice).toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}
                          </Text>
                        </View>
                      )}
                      {result.extractedFilters.bedrooms && (
                        <View style={styles.extractedPill}>
                          <Text style={styles.extractedPillText}>
                            🛏️ {result.extractedFilters.bedrooms} {isRtl ? 'غرف' : 'beds'}
                          </Text>
                        </View>
                      )}
                      {result.extractedFilters.propertyType && (
                        <View style={styles.extractedPill}>
                          <Text style={styles.extractedPillText}>🏢 {result.extractedFilters.propertyType}</Text>
                        </View>
                      )}
                      {result.extractedFilters.seaView && (
                        <View style={styles.extractedPill}>
                          <Text style={styles.extractedPillText}>🌊 {t('seaView')}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Matches List */}
                <View style={styles.matchesList}>
                  <Text style={[styles.matchesTitle, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {t('aiMatchingUnits')} ({result.matches?.length || 0})
                  </Text>

                  {result.matches?.length === 0 ? (
                    <Text style={[styles.emptyText, { textAlign: isRtl ? 'right' : 'left' }]}>{t('aiNoMatches')}</Text>
                  ) : (
                    result.matches.map((item: any, idx: number) => {
                      const unit = item.unit;
                      const score = item.matchScore;
                      const price = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);
                      const unitTitle = getLocalized(unit, 'title');
                      const unitLocation = getLocalized(unit, 'location');

                      let scoreColor = '#065F46';
                      let scoreBg = '#DCFCE7';
                      if (score < 80) {
                        scoreColor = '#1E40AF';
                        scoreBg = '#DBEAFE';
                      }

                      return (
                        <View key={unit.id || idx} style={styles.matchCard}>
                          <View style={[styles.matchCardTop, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                            <View style={[styles.scoreBadge, { backgroundColor: scoreBg }]}>
                              <Text style={[styles.scoreBadgeText, { color: scoreColor }]}>
                                {score}% {t('aiMatchScore')}
                              </Text>
                            </View>
                            <Text style={[styles.matchUnitTitle, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={1}>
                              {unitTitle}
                            </Text>
                          </View>

                          <View style={[styles.matchLocRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                            <MapPin size={13} color={Colors.darkGray} />
                            <Text style={styles.matchLocText}>
                              {unitLocation || '-'}
                            </Text>
                          </View>

                          <View style={[styles.matchBottomRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                            <View style={[styles.matchActions, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                              <TouchableOpacity 
                                style={[styles.waMiniBtn, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
                                onPress={() => handleWhatsApp(unit)}
                              >
                                <MessageCircle size={16} color="#fff" />
                                <Text style={styles.waMiniBtnText}>{t('contactWhatsApp')}</Text>
                              </TouchableOpacity>

                              <Link 
                                href={`/unit/${unit.id}`}
                                asChild
                                onPress={onClose}
                              >
                                <TouchableOpacity style={StyleSheet.flatten([styles.viewMiniBtn, { flexDirection: isRtl ? 'row-reverse' : 'row' }])}>
                                  <Text style={styles.viewMiniBtnText}>{t('view')}</Text>
                                  {isRtl ? (
                                    <ChevronLeft size={16} color={Colors.primary} />
                                  ) : (
                                    <ChevronRight size={16} color={Colors.primary} />
                                  )}
                                </TouchableOpacity>
                              </Link>
                            </View>

                            <Text style={styles.matchPrice}>
                              {price.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} {t('currency')}
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
    maxHeight: height * 0.90,
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
  title: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  closeBtn: { padding: 6 },
  scroll: { paddingHorizontal: 20, paddingVertical: 14 },

  stepBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  stepHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  stepPill: {
    backgroundColor: '#4F46E5',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stepTitle: { fontSize: 13, fontWeight: 'bold', color: Colors.primary },
  inputsRow: { flexDirection: 'row-reverse', gap: 8 },
  inputWrapper: { flex: 1 },
  label: { fontSize: 11, fontWeight: 'bold', color: Colors.darkGray, textAlign: 'right', marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.primary,
  },
  budgetChipsRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  chipText: { fontSize: 11, color: Colors.text, fontWeight: 'bold' },
  chipTextActive: { color: '#fff' },

  promptInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    fontSize: 12,
    color: Colors.primary,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  optionsSection: { marginBottom: 10 },
  optionsLabel: { fontSize: 11, fontWeight: 'bold', color: Colors.darkGray, textAlign: 'right', marginBottom: 4 },
  optionsRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6 },
  optionPill: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionPillText: { fontSize: 11, color: Colors.text },
  optionPillTextActive: { color: '#fff', fontWeight: 'bold' },

  seaBtn: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  seaBtnActive: { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' },
  seaBtnText: { fontSize: 12, color: Colors.text, fontWeight: 'bold' },
  seaBtnTextActive: { color: '#0369A1' },
  seaCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  seaCheckboxActive: { backgroundColor: '#0284C7', borderColor: '#0284C7' },

  searchBtn: {
    flexDirection: 'row-reverse',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  searchBtnDisabled: { opacity: 0.5 },
  searchBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  errorBox: { backgroundColor: '#FEE2E2', padding: 10, borderRadius: 10, marginBottom: 12 },
  errorText: { color: '#DC2626', fontSize: 12, textAlign: 'right' },

  resultsContainer: { marginTop: 6, paddingBottom: 24 },
  extractedCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 14,
  },
  extractedTitle: { fontSize: 12, fontWeight: 'bold', color: '#3730A3', textAlign: 'right', marginBottom: 6 },
  filtersPillsRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6 },
  extractedPill: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  extractedPillText: { fontSize: 11, fontWeight: 'bold', color: '#4338CA' },

  matchesList: { gap: 10 },
  matchesTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.primary, textAlign: 'right', marginBottom: 4 },
  emptyText: { textAlign: 'center', color: Colors.darkGray, fontSize: 12, marginVertical: 14 },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  matchCardTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  matchUnitTitle: { fontSize: 13, fontWeight: 'bold', color: Colors.primary, flex: 1, textAlign: 'right', marginLeft: 8 },
  scoreBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
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
