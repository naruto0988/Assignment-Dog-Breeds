import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BreedItem } from './dog';

export type RootStackParamList = {
  BreedList: undefined;
  BreedDetails: { breed: BreedItem };
};

export type BreedListScreenProps = NativeStackScreenProps<RootStackParamList, 'BreedList'>;
export type BreedDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'BreedDetails'>;