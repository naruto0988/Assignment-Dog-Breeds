import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BreedItem } from '../types/dog';

interface BreedCardProps {
  breed: BreedItem;
  onPress: (breed: BreedItem) => void;
}

const BreedCard: React.FC<BreedCardProps> = ({ breed, onPress }) => {
  // Grab the thumbnail of the first image safely
  const thumbnailUri = breed.rawAttributes.images?.[0]?.thumb;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(breed)}
      activeOpacity={0.7}
    >
      {/* Thumbnail Image */}
      {thumbnailUri ? (
        <Image 
          source={{ uri: thumbnailUri }} 
          style={styles.thumbnail} 
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.thumbnail, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      {/* Text Content */}
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{breed.name}</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {breed.description || 'No description available for this breed.'}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Lifespan: {breed.rawAttributes.life?.min} - {breed.rawAttributes.life?.max} yrs
          </Text>
          {breed.hypoallergenic && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Hypo</Text>
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
    backgroundColor: '#fff',
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
    backgroundColor: '#f1f3f4',
    marginRight: 12,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: '#9aa0a6',
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
    color: '#1a1a1a',
    flex: 1,
  },
  badge: {
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#137333',
    fontSize: 10,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    color: '#5f6368',
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
    color: '#80868b',
    fontWeight: '500',
  },
});