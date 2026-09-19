import { useQuery } from '@tanstack/react-query';
import { fetchAllBreeds, fetchGroups } from '../api/dogApi';
import { saveBreedsToDb, saveGroupsToDb, getBreedsFromDb, getGroupsFromDb, getSyncTimestamp, initDatabase, setSyncTimestamp } from '../db/database';
import { BreedItem } from '../types/dog';

initDatabase();

export const useSyncBreeds = () => {
  const cachedBreeds = getBreedsFromDb();
  const cachedGroups = getGroupsFromDb();

  const breedsQuery = useQuery<BreedItem[], Error>({
    queryKey: ['breeds'],
    queryFn: async () => {
      const freshData = await fetchAllBreeds();
      saveBreedsToDb(freshData);
      setSyncTimestamp(new Date().toISOString());
      return getBreedsFromDb();
    },
    initialData: cachedBreeds.length > 0 ? cachedBreeds : undefined,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
  });

  const groupsQuery = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const freshGroups = await fetchGroups();
      saveGroupsToDb(freshGroups);
      return freshGroups;
    },
    initialData: cachedGroups.length > 0 ? cachedGroups : undefined,
    staleTime: 1000 * 60 * 60 * 24,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
  });

  return {
    ...breedsQuery,
    groups: groupsQuery.data ?? [],
    lastSyncedAt: getSyncTimestamp(),
    groupsError: groupsQuery.error,
  };
};