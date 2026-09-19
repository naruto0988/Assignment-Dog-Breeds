# Performance Guide

## Performance Goals

The app is designed for a dataset of roughly 283 dog breeds and should provide:

- Fast initial display from the local cache.
- Responsive search while the user types.
- Smooth scrolling through breed cards.
- A complete offline browsing experience after the first successful sync.
- Predictable memory use by rendering only the visible list rows.

Performance should be measured on a physical or low-end device as well as a development simulator. Development builds can hide startup and rendering costs.

## Current Optimizations

### Concurrent API synchronization

`src/api/dogApi.ts` requests the first page, reads the API's final page number, and requests the remaining pages concurrently with `Promise.all`. This reduces total network wait time compared with fetching every page serially.

The Axios client has a 10-second timeout so an unavailable server does not leave synchronization pending indefinitely.

### Offline-first SQLite cache

`src/hooks/useSyncBreeds.ts` initializes the SQLite database, attempts a network refresh, and then reads from the local database. A network failure falls back to cached data instead of blocking the list screen.

`src/db/database.ts` uses a transaction and one prepared statement when saving the complete dataset. The commonly displayed fields are stored in columns, while the full nested API response is retained as JSON for the details screen.

### Virtualized list rendering

`BreedListScreen` uses Shopify FlashList so only the rows near the viewport need to be mounted. This is important because each row can contain an image, description, and several nested layout elements.

Each row has a stable `keyExtractor` based on the breed ID. `BreedCard` is wrapped with `React.memo` and compares breed IDs to avoid repainting unchanged rows.

### Memoized filtering and callbacks

The filtered breed array is derived with `useMemo`, recalculating only when the breed data, search text, or hypoallergenic filter changes. The list item renderer uses `useCallback` so the list does not receive a new renderer function on every render.

### Debounced search

`useDebounce` waits 300 milliseconds after the last keystroke before updating the value used for filtering. This avoids repeatedly scanning all breed names during rapid typing while keeping the result responsive.

### Detail-screen rendering

The details screen renders only one tab at a time. Trait rows are created only for values present in the API response, and gallery images are rendered through a horizontal `FlatList` rather than mounting every image in a static view.

## Performance Tradeoffs

The app intentionally loads the complete breed dataset during synchronization because the dataset is small and local search should work offline. This keeps filtering simple, but the approach should be revisited if the API grows substantially.

SQLite currently uses synchronous Expo APIs. This keeps the persistence flow simple and transactional, but large future datasets could block the JavaScript thread during initialization, reads, or writes. If the dataset becomes much larger, move expensive operations to asynchronous APIs and query only the records needed by the current view.

The complete API record is stored as a JSON blob for simplicity and details-screen completeness. If filtering expands to traits, groups, sizes, or coats, promote those fields into indexed SQLite columns instead of repeatedly parsing JSON in the UI.

## Image Performance

- Use the API thumbnail URL for list cards and reserve larger URLs for the details gallery.
- `expo-image` uses disk caching with stable cache keys; iOS is configured with a 50 MB disk and 20 MB memory budget.
- Keep fixed image dimensions so row layout does not shift while images load.
- Preserve the no-image placeholder so missing media does not cause layout changes.
- Avoid loading gallery images until the Gallery tab is selected.
- Consider an image caching library if repeated navigation causes visible image reloads.

## Measurement Checklist

Measure these flows on a release build:

1. Cold launch with an empty database.
2. Warm launch with 283 cached breeds.
3. First network synchronization time.
4. Search latency while entering a common breed name.
5. Scroll smoothness from the first to the last list row.
6. Detail-screen transition time.
7. Gallery image load time and memory use.

Useful indicators include JavaScript thread frame time, dropped frames, time to first list row, database write duration, database read duration, and peak memory. Record the device model, OS version, build type, dataset size, and network condition with each measurement.

## Regression Rules

- Keep list rows stable in height where possible.
- Do not move full-dataset filtering into render functions.
- Do not add network requests directly to list or card components.
- Keep database writes inside a transaction.
- Keep stable keys for all virtualized rows.
- Run the Jest screen tests after changing list filtering, synchronization, or navigation behavior.
