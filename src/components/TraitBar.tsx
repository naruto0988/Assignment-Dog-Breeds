import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TraitBarProps {
  label: string;
  score: number; // 1 to 5
}

const TraitBar: React.FC<TraitBarProps> = ({ label, score }) => {
  // Ensure score is safely bounded between 1 and 5
  const normalizedScore = Math.max(1, Math.min(5, Math.round(score || 0)));
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.scale}>
        {[1, 2, 3, 4, 5].map((index) => (
          <View
            key={index}
            style={[
              styles.block,
              index <= normalizedScore ? styles.blockFilled : styles.blockEmpty,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default memo(TraitBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textTransform: 'capitalize',
  },
  scale: {
    flexDirection: 'row',
    gap: 4,
  },
  block: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  blockFilled: {
    backgroundColor: '#007AFF', // Active trait color
  },
  blockEmpty: {
    backgroundColor: '#e0e0e0',
  },
});