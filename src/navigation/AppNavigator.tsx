import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BreedListScreen from '../screens/BreedListScreen';
// We will build BreedDetailsScreen next
import BreedDetailsScreen from '../screens/BreedDetailsScreen'; 
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="BreedList"
        screenOptions={{
          headerStyle: { backgroundColor: '#f8f9fa' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: '600' },
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