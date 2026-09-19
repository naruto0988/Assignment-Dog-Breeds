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
  apartment_friendly?: number;
  exercise_minutes?: number;
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
    license_url?: string;
    source?: string;
    source_url?: string;
  };
}

export interface BreedRange {
  min?: number;
  max?: number;
}

export interface BreedOrigin {
  country?: string;
  region?: string;
  era?: string;
}

export interface BreedCoat {
  type?: string;
  length?: string;
  colors?: string[];
}

export interface BreedSource {
  url?: string;
  title?: string;
}

export interface DogApiBreedAttributes {
  traits?: DogBreedTraits;
  images?: DogBreedImage[];
  name: string;
  description: string;
  life?: BreedRange;
  male_weight?: BreedRange;
  female_weight?: BreedRange;
  male_height?: BreedRange;
  female_height?: BreedRange;
  origin?: BreedOrigin;
  coat?: BreedCoat;
  other_names?: string[];
  recognized_by?: string[];
  sources?: BreedSource[];
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

export interface GroupItem {
  id: string;
  name: string;
}