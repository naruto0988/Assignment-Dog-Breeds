import axios from 'axios';
import { ApiResponse, DogApiBreed, GroupItem } from '../types/dog';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://dogapi.dog/api/v2',
  timeout: 10000,
});

/**
 * Fetches all 283 breeds by resolving all paginated pages.
 * Handles the 48/page limit by determining total pages from the first request,
 * then firing concurrent requests for the remaining pages.
 */
export const fetchAllBreeds = async (): Promise<DogApiBreed[]> => {
  // 1. Fetch first page to get data and pagination links
  const firstPage = await apiClient.get<ApiResponse>('/breeds?page[number]=1&page[size]=48');
  let allBreeds: DogApiBreed[] = [...firstPage.data.data];

  // 2. Extract total pages from the 'last' link (e.g., "...?page[number]=6")
  const lastUrl = firstPage.data.links?.last;
  let totalPages = 1;
  
  if (lastUrl) {
    const match = lastUrl.match(/page\[number\]=(\d+)/);
    if (match) {
      totalPages = parseInt(match[1], 10);
    }
  }

  if (totalPages > 1) {
    // 3. Build array of promises for remaining pages
    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(apiClient.get<ApiResponse>(`/breeds?page[number]=${i}&page[size]=48`));
    }

    // 4. Fetch concurrently to reduce network time
    const responses = await Promise.all(promises);
    responses.forEach((res) => {
      allBreeds = allBreeds.concat(res.data.data);
    });
  }

  return allBreeds;
};

export const fetchBreed = async (id: string): Promise<DogApiBreed> => {
  const response = await apiClient.get<{ data: DogApiBreed }>(`/breeds/${id}`);
  return response.data.data;
};

export const fetchGroups = async (): Promise<GroupItem[]> => {
  const response = await apiClient.get<{ data: Array<{ id: string; attributes: { name: string } }> }>('/groups?page[size]=1000');
  return response.data.data.map((group) => ({ id: group.id, name: group.attributes.name }));
};