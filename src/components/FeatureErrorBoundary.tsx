import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

interface FeatureErrorBoundaryProps {
  children: React.ReactNode;
}

interface FeatureErrorBoundaryState {
  hasError: boolean;
}

export default class FeatureErrorBoundary extends React.Component<FeatureErrorBoundaryProps, FeatureErrorBoundaryState> {
  state: FeatureErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): FeatureErrorBoundaryState {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong.</Text>
          <Text style={styles.message}>The breed explorer could not render this screen.</Text>
          <Button title="Try again" onPress={this.handleRetry} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  message: { textAlign: 'center', marginBottom: 16 },
});
