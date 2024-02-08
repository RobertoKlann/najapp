import React from 'react';
import {View, StyleSheet} from 'react-native';

import NajText from './NajText';

import {metrics} from '../globals';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, .4)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'absolute',
    top: -55,
    left: 0,
    zIndex: 50,
    width: metrics.screen.width,
    height: metrics.screen.height + 55,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});

export default function NajLoadingWrapper({isLoading}) {
  return (
    <>
      {(isLoading && (
        <View style={styles.container}>
          <NajText style={styles.text}>Carregando...</NajText>
        </View>
      )) || <View />}
    </>
  );
}
