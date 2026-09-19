import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, colors, toggleMode } = useTheme();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onPress={toggleMode}
      style={[styles.button, { backgroundColor: colors.input }]}
    >
      <Text style={[styles.text, { color: colors.text }]}>{isDark ? 'Light' : 'Dark'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 56,
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default ThemeToggle;
