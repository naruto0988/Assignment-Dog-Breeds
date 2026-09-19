import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import BreedListScreen from '../screens/BreedListScreen';
import { useSyncBreeds } from '../hooks/useSyncBreeds';
import { useBreedStore } from '../store/useBreedStore';
import { BreedItem } from '../types/dog';

jest.mock('../hooks/useSyncBreeds', () => ({
	useSyncBreeds: jest.fn(),
}));

jest.mock('../hooks/useDebounce', () => ({
	useDebounce: <T,>(value: T) => value,
}));

jest.mock('../components/FilterModal', () => {
	const { Text } = require('react-native');
	return ({ visible }: { visible: boolean }) => (
		visible ? <Text>Filter modal</Text> : null
	);
});

jest.mock('@shopify/flash-list', () => {
	const React = require('react');
	const { View } = require('react-native');
	return {
		FlashList: ({ data, renderItem, ListEmptyComponent }: any) => (
			<View>
				{data.length > 0
					? data.map((item: unknown, index: number) => (
							<React.Fragment key={index}>{renderItem({ item, index })}</React.Fragment>
						))
					: ListEmptyComponent}
			</View>
		),
	};
});

const mockedUseSyncBreeds = jest.mocked(useSyncBreeds);

const breeds: BreedItem[] = [
	{
		id: '1',
		name: 'Labrador Retriever',
		description: 'Friendly family dog',
		groupId: null,
		hypoallergenic: false,
		rawAttributes: {
			name: 'Labrador Retriever',
			description: 'Friendly family dog',
			hypoallergenic: false,
			life: { min: 10, max: 12 },
		},
	},
	{
		id: '2',
		name: 'Poodle',
		description: 'Intelligent and hypoallergenic',
		groupId: null,
		hypoallergenic: true,
		rawAttributes: {
			name: 'Poodle',
			description: 'Intelligent and hypoallergenic',
			hypoallergenic: true,
			life: { min: 12, max: 15 },
		},
	},
];

const navigation = { navigate: jest.fn() };

const renderScreen = async (state = {}) => {
	mockedUseSyncBreeds.mockReturnValue({
		data: breeds,
		isLoading: false,
		isFetching: false,
		isError: false,
		refetch: jest.fn(),
		...state,
	} as unknown as ReturnType<typeof useSyncBreeds>);

	return render(<BreedListScreen navigation={navigation as never} route={{} as never} />);
};

beforeEach(() => {
	useBreedStore.getState().clearFilters();
});

describe('BreedListScreen', () => {
	it('shows the loading state while the first sync is loading', async () => {
		const view = await renderScreen({ data: [], isLoading: true });

		expect(view.getByText('Initializing Database...')).toBeTruthy();
	});

	it('renders breeds returned by the sync hook', async () => {
		const view = await renderScreen();

		expect(view.getByText('Labrador Retriever')).toBeTruthy();
		expect(view.getByText('Poodle')).toBeTruthy();
	});

	it('filters breeds by the debounced search query', async () => {
		const view = await renderScreen();

		fireEvent.changeText(view.getByPlaceholderText('Search 283 dog breeds...'), 'poodle');
		await waitFor(() => {
			expect(view.getByText('Poodle')).toBeTruthy();
			expect(view.queryByText('Labrador Retriever')).toBeNull();
		});
	});

	it('shows only hypoallergenic breeds when the store filter is enabled', async () => {
		useBreedStore.getState().setHypoallergenic(true);
		const view = await renderScreen();

		expect(view.getByText('Poodle')).toBeTruthy();
		expect(view.queryByText('Labrador Retriever')).toBeNull();
	});

	it('shows an empty state when no breeds match', async () => {
		const view = await renderScreen({ data: [] });

		expect(view.getByText('No breeds found matching your criteria.')).toBeTruthy();
	});

	it('opens the filter modal when Filter is pressed', async () => {
		const view = await renderScreen();

		fireEvent.press(view.getByText('Filter'));
		await waitFor(() => {
			expect(view.getByText('Filter modal')).toBeTruthy();
		});
	});

	it('navigates to breed details when a breed is pressed', async () => {
		const view = await renderScreen();

		fireEvent.press(view.getByText('Poodle'));

		expect(navigation.navigate).toHaveBeenCalledWith('BreedDetails', { breed: breeds[1] });
	});
});
