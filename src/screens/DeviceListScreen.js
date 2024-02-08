import React from 'react';

// components
import NajContainer from '../components/NajContainer';
import NajText from '../components/NajText';

// styles
import styles from './styles/deviceList';

export default function DeviceListScreen() {
  return (
    <NajContainer style={styles.container}>
      <NajText>DeviceListScreen</NajText>
    </NajContainer>
  );
}
