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

const BreedListScreen: React.FC<BreedListScreenProps> = ({ navigation }) => {
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing Database...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Network Sync Indicators */}
      {isFetching && !isLoading && (
        <View style={styles.syncBanner}>
          <Text style={styles.syncText}>Syncing fresh data...</Text>
        </View>
      )}
      {isError && !isFetching && (
        <View style={[styles.syncBanner, styles.errorBanner]}>
          <Text style={styles.errorText}>Offline mode. Showing cached data.</Text>
        </View>
      )}

      {/* Search Header */}
   <View style={styles.header}>
  <View style={styles.searchRow}>
    <TextInput
      style={styles.searchInput}
      placeholder="Search 283 dog breeds..."
      placeholderTextColor="#80868b"
      value={searchQuery}
      onChangeText={setSearchQuery}
      clearButtonMode="while-editing"
    />
    <TouchableOpacity 
      style={styles.filterButton} 
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
              <Text style={styles.emptyText}>No breeds found matching your criteria.</Text>
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
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#5f6368' },
  emptyText: { color: '#5f6368', fontSize: 16 },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  
  listContent: { paddingTop: 16, paddingBottom: 40 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Adds space between the input and button
  },
  searchInput: {
    flex: 1, // Takes up remaining horizontal space
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#202124',
  },
  filterButton: {
    backgroundColor: '#007AFF',
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
    backgroundColor: '#e8f0fe',
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncText: { fontSize: 12, color: '#1967d2', fontWeight: '500' },
  errorBanner: { backgroundColor: '#fce8e6' },
  errorText: { fontSize: 12, color: '#c5221f', fontWeight: '500' },
});

export default BreedListScreen;