import React, { useMemo, useCallback,useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator,TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSyncBreeds } from '../hooks/useSyncBreeds';
import { useBreedStore } from '../store/useBreedStore';
import BreedCard from '../components/BreedCard';
import { BreedListScreenProps } from '../types/navigation';
import { BreedItem } from '../types/dog';
import FilterModal from '../components/FilterModal';
import { useDebounce } from '../hooks/useDebounce';
import { useTheme } from '../theme/ThemeContext';

const BreedListScreen: React.FC<BreedListScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  // Pulling cached data + sync states from React Query custom hook
  const {
    data: breeds = [],
    isLoading, // True ONLY on first ever load when DB is empty
    isFetching, // True during background refetch
    isError, // True if background refetch failed (offline)
    refetch
  } = useSyncBreeds();

  const { searchQuery, setSearchQuery, hypoallergenicOnly } = useBreedStore();

  const [isFilterVisible, setFilterVisible] = useState(false);
const debouncedSearchQuery = useDebounce(searchQuery, 300);
  // Derived state: fast filtering on the local cached DB
const filteredBreeds = useMemo(() => {
    if (!breeds || breeds.length === 0) return [];

    return breeds.filter((breed) => {
      // 2. Safety fallbacks in case a breed has missing data
      const safeQuery = debouncedSearchQuery || '';
      const safeName = breed.name || '';

      const matchesSearch = safeName.toLowerCase().includes(safeQuery.toLowerCase());
      const matchesHypo = hypoallergenicOnly ? breed.hypoallergenic : true;

      return matchesSearch && matchesHypo;
    });
  }, [breeds, debouncedSearchQuery, hypoallergenicOnly]);
  const renderItem = useCallback(({ item }: { item: BreedItem }) => (
    <BreedCard
      breed={item}
      onPress={(selectedBreed) => navigation.navigate('BreedDetails', { breed: selectedBreed })}
    />
  ), [navigation]);

  if (isLoading && breeds.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.mutedText }]}>Initializing Database...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Network Sync Indicators */}
      {isFetching && !isLoading && (
        <View style={[styles.syncBanner, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.syncText, { color: colors.accentText }]}>Syncing fresh data...</Text>
        </View>
      )}
      {isError && !isFetching && (
        <View style={[styles.syncBanner, { backgroundColor: colors.dangerSoft }]}>
          <Text style={[styles.errorText, { color: colors.danger }]}>Offline mode. Showing cached data.</Text>
        </View>
      )}

      {/* Search Header */}
  <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
  <View style={styles.searchRow}>
    <TextInput
      style={[styles.searchInput, { backgroundColor: colors.input, color: colors.text }]}
      placeholder="Search 283 dog breeds..."
      placeholderTextColor={colors.placeholder}
      value={searchQuery}
      onChangeText={setSearchQuery}
      clearButtonMode="while-editing"
    />
    <TouchableOpacity
      style={[styles.filterButton, { backgroundColor: colors.accent }]}
      onPress={() => setFilterVisible(true)}
    >
      <Text style={styles.filterButtonText}>Filter</Text>
    </TouchableOpacity>
  </View>
</View>

      {/* 60fps Virtualized List */}
     <View style={{ flex: 1 }}>
        <FlashList
          data={filteredBreeds}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onRefresh={refetch}
          refreshing={isFetching && !isLoading}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={[styles.emptyText, { color: colors.mutedText }]}>No breeds found matching your criteria.</Text>
            </View>
          }
        />
      </View>
      <FilterModal
  visible={isFilterVisible}
  onClose={() => setFilterVisible(false)}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12 },
  emptyText: { fontSize: 16 },
  header: { padding: 16, borderBottomWidth: 1 },

  listContent: { paddingTop: 16, paddingBottom: 40 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Adds space between the input and button
  },
  searchInput: {
    flex: 1, // Takes up remaining horizontal space
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  syncBanner: {
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncText: { fontSize: 12, fontWeight: '500' },
  errorText: { fontSize: 12, fontWeight: '500' },
});

export default BreedListScreen;
