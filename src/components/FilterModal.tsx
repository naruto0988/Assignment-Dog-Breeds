import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  SafeAreaView 
} from 'react-native';
import { useBreedStore } from '../store/useBreedStore';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

const GROUPS = [
  'Herding', 'Hound', 'Sporting', 'Terrier', 'Toy', 
  'Working', 'Non-Sporting', 'Miscellaneous', 'Foundation Stock Service'
];
const SIZES = ['Small', 'Medium', 'Large', 'Giant'];
const COATS = ['Short', 'Medium', 'Long', 'Wire'];

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose }) => {
  const {
    selectedGroups, toggleGroup,
    selectedSizes, toggleSize,
    selectedCoats, toggleCoat,
    hypoallergenicOnly, setHypoallergenic,
    traitThresholds, setTraitThreshold,
    clearFilters
  } = useBreedStore();

  const renderPills = (
    items: string[], 
    selectedItems: string[], 
    onToggle: (item: string) => void
  ) => (
    <View style={styles.pillContainer}>
      {items.map((item) => {
        const isSelected = selectedItems.includes(item);
        return (
          <TouchableOpacity
            key={item}
            style={[styles.pill, isSelected && styles.pillActive]}
            onPress={() => onToggle(item)}
          >
            <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderTraitThreshold = (label: string, traitKey: string) => {
    const currentValue = traitThresholds[traitKey] || 0;
    
    return (
      <View style={styles.traitRow}>
        <Text style={styles.sectionSubtitle}>{label} (Min Score)</Text>
        <View style={styles.thresholdContainer}>
          {[1, 2, 3, 4, 5].map((score) => (
            <TouchableOpacity
              key={score}
              style={[
                styles.thresholdButton,
                currentValue >= score && styles.thresholdButtonActive
              ]}
              onPress={() => setTraitThreshold(traitKey, currentValue === score ? 0 : score)}
            >
              <Text style={[
                styles.thresholdText,
                currentValue >= score && styles.thresholdTextActive
              ]}>
                {score}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Breed Group</Text>
          {renderPills(GROUPS, selectedGroups, toggleGroup)}

          <Text style={styles.sectionTitle}>Size</Text>
          {renderPills(SIZES, selectedSizes, toggleSize)}

          <Text style={styles.sectionTitle}>Coat Length</Text>
          {renderPills(COATS, selectedCoats, toggleCoat)}

          <View style={styles.switchRow}>
            <Text style={styles.sectionTitle}>Hypoallergenic Only</Text>
            <Switch 
              value={hypoallergenicOnly} 
              onValueChange={setHypoallergenic}
              trackColor={{ true: '#007AFF', false: '#e0e0e0' }}
            />
          </View>

          <Text style={styles.sectionTitle}>Trait Minimums</Text>
          {renderTraitThreshold('Good with Children', 'good_with_children')}
          {renderTraitThreshold('Good with Dogs', 'good_with_other_dogs')}
          {renderTraitThreshold('Trainability', 'trainability')}
          
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  clearText: { fontSize: 16, color: '#ff3b30' },
  doneText: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginTop: 24, marginBottom: 12 },
  sectionSubtitle: { fontSize: 14, color: '#5f6368', marginBottom: 8 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillActive: { backgroundColor: '#e8f0fe', borderColor: '#aecbfa' },
  pillText: { fontSize: 14, color: '#3c4043', fontWeight: '500' },
  pillTextActive: { color: '#1967d2' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  traitRow: { marginBottom: 16 },
  thresholdContainer: { flexDirection: 'row', gap: 8 },
  thresholdButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    alignItems: 'center',
  },
  thresholdButtonActive: { backgroundColor: '#007AFF' },
  thresholdText: { fontSize: 14, color: '#5f6368', fontWeight: '600' },
  thresholdTextActive: { color: '#fff' },
});

export default FilterModal;