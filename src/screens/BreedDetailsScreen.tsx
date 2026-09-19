import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Dimensions 
} from 'react-native';
import { BreedDetailsScreenProps } from '../types/navigation';
import TraitBar from '../components/TraitBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TabType = 'Overview' | 'Traits' | 'Gallery';

const BreedDetailsScreen: React.FC<BreedDetailsScreenProps> = ({ route }) => {
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
    { label: 'Good with Strangers', score: traitsData.good_with_strangers }
  ].filter(t => t.score !== undefined), [traitsData]); // Filter out any missing traits

  // 2. FIXED: Images are directly on rawAttributes.images
  const images = rawAttributes?.images || [];

  const renderOverview = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.bodyText}>{rawAttributes.description}</Text>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Vital Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Life Span:</Text>
          <Text style={styles.statValue}>{rawAttributes.life?.min} - {rawAttributes.life?.max} years</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Male Weight:</Text>
          <Text style={styles.statValue}>{rawAttributes.male_weight?.min} - {rawAttributes.male_weight?.max} kg</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Female Weight:</Text>
          <Text style={styles.statValue}>{rawAttributes.female_weight?.min} - {rawAttributes.female_weight?.max} kg</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Hypoallergenic:</Text>
          <Text style={styles.statValue}>{breed.hypoallergenic ? 'Yes' : 'No'}</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderTraits = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Temperament & Traits</Text>
      {traitsData.temperament && (
        <Text style={styles.bodyText}>
          {traitsData.temperament.join(', ')}
        </Text>
      )}
      
      <View style={styles.traitsContainer}>
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
          <Text style={styles.bodyText}>No images available for this breed.</Text>
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
            <Image 
              source={{ uri: item.medium || item.url || item.large }} 
              testID="gallery-image"
              style={styles.galleryImage}
              resizeMode="contain"
            />
            <View style={styles.attributionBadge}>
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
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {(['Overview', 'Traits', 'Gallery'] as TabType[]).map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            accessibilityRole="button"
            accessibilityState={{ selected: activeTab === tab }}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
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
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5f6368',
  },
  activeTabText: {
    color: '#007AFF',
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
    color: '#1a1a1a',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3c4043',
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  traitsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  attributionText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default BreedDetailsScreen;