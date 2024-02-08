import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

// components
import {colors} from '../globals';

// styles
const styles = StyleSheet.create({
  loadingCotainer: {
    padding: 15,
  },
});

export default function ListLoading() {
  return (
    <View style={styles.loadingCotainer}>
      <ActivityIndicator color={colors.secundary} animating size="large" />
    </View>
  );
}
