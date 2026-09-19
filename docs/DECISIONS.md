# Technical Decisions & Rationale

This record captures implementation decisions that affect architecture, performance, and maintainability. It should be updated when a decision changes rather than treated as a list of planned work.

## 1. Framework: Expo SDK 57

**Decision:** Use Expo SDK 57 with React Native 0.86 and React 19.

**Rationale:** Expo provides the project runtime, native module integration, development tooling, and a consistent versioned dependency set. New Expo-specific APIs and configuration should follow the SDK 57 documentation.

## 2. Language and Type Contracts: TypeScript

**Decision:** Keep API records, normalized breed records, and navigation parameters explicitly typed.

**Rationale:** The application passes nested API data from synchronization through SQLite and navigation into multiple screens. Shared interfaces in `src/types` catch mismatches at compile time and make screen contracts clear.

## 3. State Management: Zustand

**Decision:** Use Zustand for global UI state such as search text and active filters.

**Rationale:** Zustand provides a small, boilerplate-free API for state shared by list controls and derived filtering. Server data remains outside the store, avoiding duplication between query results and UI state.

## 4. Data Persistence: Expo SQLite

**Decision:** Use `expo-sqlite` for the offline-first persistence layer.

**Rationale:** The app stores roughly 283 nested records containing traits, images, and descriptions. SQLite provides durable local storage and transactional writes. Frequently displayed fields are stored in columns, while the complete API record is retained in the `data` JSON column for the details screen. The current schema does not add secondary indexes because the dataset is small; indexes can be added when query volume or dataset size justifies them.

## 5. API and Synchronization: TanStack Query

**Decision:** Use TanStack Query for server-state lifecycle management.

**Rationale:** TanStack Query owns the asynchronous loading, fetching, and error states exposed to the list screen. `useSyncBreeds` writes fresh records to SQLite and then reads the local database, so the UI has one consistent local source. The hook currently sets `retry: false`; network failures are handled by falling back to cached records rather than retrying automatically.

## 6. List Rendering: FlashList

**Decision:** Use Shopify FlashList for the breed list.

**Rationale:** The 283 breed rows include images and nested layout elements. FlashList virtualizes and recycles rows, reducing the mounted view count and helping maintain smooth scrolling. Stable breed IDs are used as row keys, and `BreedCard` is memoized to avoid unnecessary renders.

## 7. Fetch Strategy: Aggregated Pre-fetch

**Decision:** Fetch all API pages concurrently and merge them before local persistence.

**Rationale:** The API is small enough that paginating local database reads is unnecessary overhead. Fetching the pages with `Promise.all` ensures the local SQLite cache is fully populated quickly, allowing the user to search the complete dataset offline.

## 8. Navigation: Typed Native Stack

**Decision:** Use React Navigation's native stack with a shared `RootStackParamList`.

**Rationale:** The app has a small flow from the breed list to breed details. A native stack provides platform navigation behavior, while typed route parameters ensure the details screen receives a `BreedItem`.

## 9. Search Responsiveness: Local Filtering with Debounce

**Decision:** Filter the cached list locally and debounce search input by 300 milliseconds.

**Rationale:** Searching 283 records locally is faster and more reliable offline than issuing a request for every query. Debouncing avoids repeated scans while the user is typing, while `useMemo` recalculates the filtered result only when its inputs change.

## 10. Testing: Screen-Level Behavioral Tests

**Decision:** Use Jest with `jest-expo` and React Native Testing Library for screen behavior tests.

**Rationale:** The important contracts are user-visible: loading, filtering, empty states, navigation, tabs, and gallery rendering. Tests mock network synchronization and list virtualization at the boundary so they remain deterministic and do not require SQLite or a device runtime.