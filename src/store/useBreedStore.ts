import { create } from 'zustand';

interface FilterState {
  searchQuery: string;
  selectedGroups: string[];
  selectedSizes: string[];
  selectedCoats: string[];
  hypoallergenicOnly: boolean;
  traitThresholds: Record<string, number>; // e.g., { good_with_children: 4 }
  setGroups: (groups: string[]) => void;
  
  setSearchQuery: (query: string) => void;
  toggleGroup: (groupId: string) => void;
  toggleSize: (size: string) => void;
  toggleCoat: (coat: string) => void;
  setHypoallergenic: (value: boolean) => void;
  setTraitThreshold: (trait: string, value: number) => void;
  clearFilters: () => void;
}

export const useBreedStore = create<FilterState>((set) => ({
  searchQuery: '',
  selectedGroups: [],
  selectedSizes: [],
  selectedCoats: [],
  hypoallergenicOnly: false,
  traitThresholds: {},

  setSearchQuery: (query) => set({ searchQuery: query }),
  setGroups: (groups) => set({ selectedGroups: groups }),
  
  toggleGroup: (groupId) => set((state) => ({
    selectedGroups: state.selectedGroups.includes(groupId)
      ? state.selectedGroups.filter((id) => id !== groupId)
      : [...state.selectedGroups, groupId]
  })),

  toggleSize: (size) => set((state) => ({
    selectedSizes: state.selectedSizes.includes(size)
      ? state.selectedSizes.filter((s) => s !== size)
      : [...state.selectedSizes, size]
  })),

  toggleCoat: (coat) => set((state) => ({
    selectedCoats: state.selectedCoats.includes(coat)
      ? state.selectedCoats.filter((c) => c !== coat)
      : [...state.selectedCoats, coat]
  })),

  setHypoallergenic: (value) => set({ hypoallergenicOnly: value }),
  
  setTraitThreshold: (trait, value) => set((state) => ({
    traitThresholds: { ...state.traitThresholds, [trait]: value }
  })),

  clearFilters: () => set({ 
    searchQuery: '', 
    selectedGroups: [], 
    selectedSizes: [], 
    selectedCoats: [], 
    hypoallergenicOnly: false, 
    traitThresholds: {} 
  }),
}));