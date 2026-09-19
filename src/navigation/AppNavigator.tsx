import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BreedListScreen from '../screens/BreedListScreen';
// We will build BreedDetailsScreen next
import BreedDetailsScreen from '../screens/BreedDetailsScreen'; 
import { RootStackParamList } from '../types/navigation';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../theme/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="BreedList"
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600', color: colors.text },
          headerRight: () => <ThemeToggle />,
        }}
      >
        <Stack.Screen 
          name="BreedList" 
          component={BreedListScreen} 
          options={{ title: 'Dog Breeds Explorer' }}
        />
        <Stack.Screen 
          name="BreedDetails" 
          component={BreedDetailsScreen as any} // Cast temporarily until component is created
          options={({ route }) => ({ 
            title: route.params.breed.name,
            headerBackTitle: 'Back' 
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}