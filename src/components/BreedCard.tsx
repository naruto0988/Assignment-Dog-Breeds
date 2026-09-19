import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BreedItem } from '../types/dog';
import { useTheme } from '../theme/ThemeContext';
import CachedImage from './CachedImage';

interface BreedCardProps {
  breed: BreedItem;
  onPress: (breed: BreedItem) => void;
}

const BreedCard: React.FC<BreedCardProps> = ({ breed, onPress }) => {
  const { colors } = useTheme();
  // Grab the thumbnail of the first image safely
  const thumbnailUri = breed.rawAttributes.images?.[0]?.thumb;

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.text }]}
      onPress={() => onPress(breed)}
      activeOpacity={0.7}
    >
      {/* Thumbnail Image */}
      {thumbnailUri ? (
        <CachedImage
          uri={thumbnailUri}
          style={styles.thumbnail} 
          contentFit="cover"
          recyclingKey={breed.id}
        />
      ) : (
        <View style={[styles.thumbnail, styles.placeholder, { backgroundColor: colors.input }]}>
          <Text style={[styles.placeholderText, { color: colors.placeholder }]}>No Image</Text>
        </View>
      )}

      {/* Text Content */}
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{breed.name}</Text>
        </View>
        
        <Text style={[styles.description, { color: colors.mutedText }]} numberOfLines={2}>
          {breed.description || 'No description available for this breed.'}
        </Text>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.placeholder }]}>
            Lifespan: {breed.rawAttributes.life?.min} - {breed.rawAttributes.life?.max} yrs
          </Text>
          {breed.hypoallergenic && (
            <View style={[styles.badge, { backgroundColor: colors.successSoft }]}>
              <Text style={[styles.badgeText, { color: colors.success }]}>Hypo</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(BreedCard, (prevProps, nextProps) => {
  return prevProps.breed.id === nextProps.breed.id;
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // Aligns image and text side-by-side
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
  },
  contentContainer: {
    flex: 1, // Takes up the rest of the space
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});