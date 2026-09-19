import { useQuery } from '@tanstack/react-query';
import { fetchAllBreeds } from '../api/dogApi';
import { saveBreedsToDb, getBreedsFromDb, initDatabase } from '../db/database';
import { BreedItem } from '../types/dog';

export const useSyncBreeds = () => {
  return useQuery<BreedItem[], Error>({
    queryKey: ['breeds'],
    queryFn: async () => {
      // STEP 1: Database Initialization
      try {
        initDatabase();
      } catch (dbInitError) {
        console.error('❌ DATABASE INIT FAILED:', dbInitError);
        throw dbInitError; // Stop execution
      }
      
      // STEP 2: Network Fetch & Save
      try {
        const freshData = await fetchAllBreeds();
        
        saveBreedsToDb(freshData);
      } catch (networkError) {
        console.warn('⚠️ NETWORK/SAVE FAILED (Falling back to cache):', networkError);
      }

      // STEP 4: Read from Database
      try {
        const cachedBreeds = getBreedsFromDb();
        
        if (!cachedBreeds || cachedBreeds.length === 0) {
          throw new Error('Database is empty and network sync failed.');
        }

        return cachedBreeds;
      } catch (dbReadError) {
        console.error('❌ DATABASE READ FAILED:', dbReadError);
        throw dbReadError;
      }
    },
    staleTime: 1000 * 60 * 60 * 24, 
    retry: false, // Turned off temporarily for debugging
  });
};