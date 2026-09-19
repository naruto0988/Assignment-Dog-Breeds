import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface TraitBarProps {
  label: string;
  score: number; // 1 to 5
}

const TraitBar: React.FC<TraitBarProps> = ({ label, score }) => {
  const { colors } = useTheme();
  // Ensure score is safely bounded between 1 and 5
  const normalizedScore = Math.max(1, Math.min(5, Math.round(score || 0)));
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.secondaryText }]}>{label}</Text>
      <View style={styles.scale}>
        {[1, 2, 3, 4, 5].map((index) => (
          <View
            key={index}
            style={[
              styles.block,
              index <= normalizedScore
                ? [styles.blockFilled, { backgroundColor: colors.accent }]
                : [styles.blockEmpty, { backgroundColor: colors.traitEmpty }],
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
  },
  label: {
    fontSize: 14,
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
  },
  blockEmpty: {
  },
});