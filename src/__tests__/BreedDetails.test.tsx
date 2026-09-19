import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';
import BreedDetailsScreen from '../screens/BreedDetailsScreen';
import { BreedItem } from '../types/dog';

const breed: BreedItem = {
	id: '1',
	name: 'Poodle',
	description: 'An intelligent companion dog.',
	groupId: null,
	hypoallergenic: true,
	rawAttributes: {
		name: 'Poodle',
		description: 'An intelligent companion dog.',
		hypoallergenic: true,
		life: { min: 12, max: 15 },
		male_weight: { min: 20, max: 32 },
		female_weight: { min: 18, max: 30 },
		traits: {
			energy: 4,
			trainability: 5,
			temperament: ['Active', 'Intelligent'],
		},
		images: [
			{
				id: 'image-1',
				medium: 'https://example.com/poodle.jpg',
				attribution: { author: 'Photo Author', license: 'CC BY' },
			},
		],
	},
};

const renderScreen = (selectedBreed: BreedItem = breed) =>
	render(
		<BreedDetailsScreen
			route={{ params: { breed: selectedBreed } } as never}
			navigation={{} as never}
		/>,
	);

describe('BreedDetailsScreen', () => {
	it('renders the overview description and vital stats by default', async () => {
		const view = await renderScreen();

		expect(view.getByText('Description')).toBeTruthy();
		expect(view.getByText('An intelligent companion dog.')).toBeTruthy();
		expect(view.getByText('12 - 15 years')).toBeTruthy();
		expect(view.getByText('20 - 32 kg')).toBeTruthy();
		expect(view.getByText('18 - 30 kg')).toBeTruthy();
		expect(view.getByText('Yes')).toBeTruthy();
	});

	it('renders temperament and only the available traits', async () => {
		const view = await renderScreen();

		fireEvent.press(view.getByRole('button', { name: 'Traits' }));

		await waitFor(() => {
			expect(view.getByText('Temperament & Traits')).toBeTruthy();
			expect(view.getByText('Active, Intelligent')).toBeTruthy();
			expect(view.getByText('Energy')).toBeTruthy();
			expect(view.getByText('Trainability')).toBeTruthy();
			expect(view.queryByText('Barking')).toBeNull();
		});
	});

	it('shows the empty state when the breed has no gallery images', async () => {
		const breedWithoutImages = {
			...breed,
			rawAttributes: { ...breed.rawAttributes, images: [] },
		};
		const view = await renderScreen(breedWithoutImages);

		fireEvent.press(view.getByRole('button', { name: 'Gallery' }));

		await waitFor(() => {
			expect(view.getByText('No images available for this breed.')).toBeTruthy();
		});
	});

	it('renders gallery image attribution when an image is available', async () => {
		const view = await renderScreen();

		fireEvent.press(view.getByRole('button', { name: 'Gallery' }));

		await waitFor(() => {
			expect(view.getByText(/Photo Author/)).toBeTruthy();
			expect(view.getByText(/CC BY/)).toBeTruthy();
			expect(view.getByTestId('gallery-image')).toBeTruthy();
		});
	});
});
