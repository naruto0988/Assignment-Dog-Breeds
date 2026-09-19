import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  Dimensions 
} from 'react-native';
import { BreedDetailsScreenProps } from '../types/navigation';
import TraitBar from '../components/TraitBar';
import { useTheme } from '../theme/ThemeContext';
import CachedImage from '../components/CachedImage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TabType = 'Overview' | 'Traits' | 'Gallery';

const BreedDetailsScreen: React.FC<BreedDetailsScreenProps> = ({ route }) => {
  const { colors } = useTheme();
  const { breed } = route.params;
  const { rawAttributes } = breed;
  const [activeTab, setActiveTab] = useState<TabType>('Overview');

  // 1. FIXED: Safely extract traits from rawAttributes.traits
  const traitsData = rawAttributes.traits || {};
  const traits = useMemo(() => [
    { label: 'Energy', score: traitsData.energy },
    { label: 'Barking', score: traitsData.barking },
    { label: 'Drooling', score: traitsData.drooling },
    { label: 'Grooming', score: traitsData.grooming },
    { label: 'Shedding', score: traitsData.shedding },
    { label: 'Trainability', score: traitsData.trainability },
    { label: 'Good with Dogs', score: traitsData.good_with_dogs },
    { label: 'Good with Children', score: traitsData.good_with_children },
    { label: 'Good with Strangers', score: traitsData.good_with_strangers },
    { label: `Exercise Minutes (${traitsData.exercise_minutes ?? 'n/a'})`, score: traitsData.exercise_minutes === undefined ? undefined : Math.max(1, Math.min(5, Math.ceil(traitsData.exercise_minutes / 20))) },
    { label: 'Apartment Friendly', score: traitsData.apartment_friendly },
  ].filter(t => t.score !== undefined), [traitsData]); // Filter out any missing traits

  // 2. FIXED: Images are directly on rawAttributes.images
  const images = rawAttributes?.images || [];

  const renderOverview = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.scrollContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
      <Text style={[styles.bodyText, { color: colors.secondaryText }]}>{rawAttributes.description}</Text>

      <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.statsTitle, { color: colors.text }]}>Vital Stats</Text>
        <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedText }]}>Life Span:</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{rawAttributes.life?.min} - {rawAttributes.life?.max} years</Text>
        </View>
        <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedText }]}>Male Height:</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{rawAttributes.male_height?.min ?? 'n/a'} - {rawAttributes.male_height?.max ?? 'n/a'} cm</Text>
        </View>
        <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedText }]}>Female Height:</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{rawAttributes.female_height?.min ?? 'n/a'} - {rawAttributes.female_height?.max ?? 'n/a'} cm</Text>
        </View>
        <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedText }]}>Origin:</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{[rawAttributes.origin?.country, rawAttributes.origin?.region, rawAttributes.origin?.era].filter(Boolean).join(' / ') || 'n/a'}</Text>
        </View>
        <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedText }]}>Coat:</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{[rawAttributes.coat?.type, rawAttributes.coat?.length].filter(Boolean).join(' / ') || 'n/a'}</Text>
        </View>
        <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedText }]}>Other Names:</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{rawAttributes.other_names?.join(', ') || 'n/a'}</Text>
        </View>
        <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedText }]}>Recognized By:</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{rawAttributes.recognized_by?.join(', ') || 'n/a'}</Text>
        </View>
        <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedText }]}>Male Weight:</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{rawAttributes.male_weight?.min} - {rawAttributes.male_weight?.max} kg</Text>
        </View>
        <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedText }]}>Female Weight:</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{rawAttributes.female_weight?.min} - {rawAttributes.female_weight?.max} kg</Text>
        </View>
        <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedText }]}>Hypoallergenic:</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{breed.hypoallergenic ? 'Yes' : 'No'}</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderTraits = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.scrollContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Temperament & Traits</Text>
      {traitsData.temperament && (
        <Text style={[styles.bodyText, { color: colors.secondaryText }]}>
          {traitsData.temperament.join(', ')}
        </Text>
      )}
      
      <View style={[styles.traitsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {traits.map((trait, index) => (
          <TraitBar 
            key={`${trait.label}-${index}`} 
            label={trait.label} 
            score={trait.score as number} 
          />
        ))}
      </View>
    </ScrollView>
  );

  const renderGallery = () => {
    if (!images || images.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={[styles.bodyText, { color: colors.secondaryText }]}>No images available for this breed.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            {/* 3. FIXED: Using item.medium based on your JSON structure */}
            <CachedImage
              uri={item.medium || item.url || item.large}
              cacheKey={item.id}
              testID="gallery-image"
              style={styles.galleryImage}
              contentFit="contain"
            />
            <View style={[styles.attributionBadge, { backgroundColor: colors.overlay }]}>
              <Text style={styles.attributionText}>
                {/* 4. FIXED: Safely extracting nested attribution data */}
                © {item.attribution?.author || 'Unknown'} | {item.attribution?.license || 'Standard'}
              </Text>
            </View>
          </View>
        )}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {(['Overview', 'Traits', 'Gallery'] as TabType[]).map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: colors.accent }]}
            accessibilityRole="button"
            accessibilityState={{ selected: activeTab === tab }}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: colors.mutedText }, activeTab === tab && { color: colors.accent }] }>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentContainer}>
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Traits' && renderTraits()}
        {activeTab === 'Gallery' && renderGallery()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  statsCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  traitsContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  attributionBadge: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  attributionText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default BreedDetailsScreen;