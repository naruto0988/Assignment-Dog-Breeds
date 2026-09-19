export interface DogBreedTraits {
  energy?: number;
  barking?: number;
  drooling?: number;
  grooming?: number;
  shedding?: number;
  trainability?: number;
  good_with_dogs?: number;
  good_with_children?: number;
  good_with_strangers?: number;
  temperament?: string[];
}

export interface DogBreedImage {
  id?: string;
  thumb?: string;
  medium?: string;
  large?: string;
  url?: string;
  attribution?: {
    author?: string;
    license?: string;
  };
}

export interface DogApiBreedAttributes {
  traits?: DogBreedTraits;
  images?: DogBreedImage[];
  name: string;
  description: string;
  life?: { min?: number; max?: number };
  male_weight?: { min?: number; max?: number };
  female_weight?: { min?: number; max?: number };
  hypoallergenic: boolean;
}

export interface DogApiBreed {
  id: string;
  type: string;
  attributes: DogApiBreedAttributes;
  relationships?: {
    group?: { data: { id: string; type: string } };
  };
}

export interface BreedItem {
  id: string;
  name: string;
  description: string;
  groupId: string | null;
  hypoallergenic: boolean;
  // Normalized raw data for the detail screen
  rawAttributes: DogApiBreedAttributes;
}

export interface ApiResponse {
  data: DogApiBreed[];
  links: { next?: string; last?: string };
  meta: { total: number };
}