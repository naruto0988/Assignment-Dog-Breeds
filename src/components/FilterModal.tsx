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
import { useTheme } from '../theme/ThemeContext';
import { useSyncBreeds } from '../hooks/useSyncBreeds';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

const FALLBACK_GROUPS = [
  'Herding', 'Hound', 'Sporting', 'Terrier', 'Toy', 
  'Working', 'Non-Sporting', 'Miscellaneous', 'Foundation Stock Service'
];
const SIZES = ['Small', 'Medium', 'Large', 'Giant'];
const COATS = ['Short', 'Medium', 'Long', 'Wire'];
const TRAITS = [
  ['Energy', 'energy'],
  ['Barking', 'barking'],
  ['Drooling', 'drooling'],
  ['Grooming', 'grooming'],
  ['Shedding', 'shedding'],
  ['Trainability', 'trainability'],
  ['Good with Dogs', 'good_with_dogs'],
  ['Good with Children', 'good_with_children'],
  ['Good with Strangers', 'good_with_strangers'],
  ['Apartment Friendly', 'apartment_friendly'],
];

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const { groups } = useSyncBreeds();
  const {
    selectedGroups, toggleGroup,
    selectedSizes, toggleSize,
    selectedCoats, toggleCoat,
    hypoallergenicOnly, setHypoallergenic,
    traitThresholds, setTraitThreshold,
    clearFilters,
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
            style={[styles.pill, { backgroundColor: colors.input }, isSelected && { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}
            onPress={() => onToggle(item)}
          >
            <Text style={[styles.pillText, { color: colors.secondaryText }, isSelected && { color: colors.accentText }]}>
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
        <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>{label} (Min Score)</Text>
        <View style={styles.thresholdContainer}>
          {[1, 2, 3, 4, 5].map((score) => (
            <TouchableOpacity
              key={score}
              style={[
                styles.thresholdButton,
                { backgroundColor: colors.input },
                currentValue >= score && { backgroundColor: colors.accent }
              ]}
              onPress={() => setTraitThreshold(traitKey, currentValue === score ? 0 : score)}
            >
              <Text style={[
                styles.thresholdText,
                { color: colors.mutedText },
                currentValue >= score && { color: colors.surface }
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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={[styles.clearText, { color: colors.danger }]}>Clear All</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.doneText, { color: colors.accent }]}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Breed Group</Text>
          {renderPills(groups.length > 0 ? groups.map((group) => group.name) : FALLBACK_GROUPS, selectedGroups, toggleGroup)}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Size</Text>
          {renderPills(SIZES, selectedSizes, toggleSize)}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Coat Length</Text>
          {renderPills(COATS, selectedCoats, toggleCoat)}

          <View style={styles.switchRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Hypoallergenic Only</Text>
            <Switch 
              value={hypoallergenicOnly} 
              onValueChange={setHypoallergenic}
              trackColor={{ true: colors.accent, false: colors.border }}
            />
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trait Minimums</Text>
          {TRAITS.map(([label, key]) => renderTraitThreshold(label, key))}
          
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: '700' },
  clearText: { fontSize: 16 },
  doneText: { fontSize: 16, fontWeight: '600' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  sectionSubtitle: { fontSize: 14, marginBottom: 8 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillText: { fontSize: 14, fontWeight: '500' },
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
    borderRadius: 8,
    alignItems: 'center',
  },
  thresholdText: { fontSize: 14, fontWeight: '600' },
});

export default FilterModal;