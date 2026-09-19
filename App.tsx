import React, { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as Network from 'expo-network';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import FeatureErrorBoundary from './src/components/FeatureErrorBoundary';

// Initialize the TanStack Query client for our offline-first data layer
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent aggressive refetching since our dataset changes rarely
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { isDark } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Image.configureCache({ maxDiskSize: 50 * 1024 * 1024, maxMemoryCost: 20 * 1024 * 1024, maxMemoryCount: 100 });
    }

    const lastRefreshAt = { current: 0 };
    const previousAppState = { current: AppState.currentState };
    const previousConnected = { current: undefined as boolean | undefined };
    const refresh = () => {
      const now = Date.now();
      if (now - lastRefreshAt.current < 1000 * 60 * 5) return;
      lastRefreshAt.current = now;
      void queryClient.refetchQueries({ queryKey: ['breeds'], type: 'active' });
    };
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      const wasBackgrounded = previousAppState.current !== 'active';
      previousAppState.current = state;
      if (state === 'active' && wasBackgrounded) refresh();
    });
    const networkSubscription = Network.addNetworkStateListener(({ isConnected, isInternetReachable }) => {
      const connected = isConnected === true && isInternetReachable !== false;
      const cameOnline = previousConnected.current === false && connected;
      previousConnected.current = connected;
      if (cameOnline) refresh();
    });

    refresh();

    return () => {
      appStateSubscription.remove();
      networkSubscription.remove();
    };
  }, []);

  return (
    <>
      <FeatureErrorBoundary>
        <AppNavigator />
      </FeatureErrorBoundary>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
