import React from 'react';

// components
import NajContainer from '../components/NajContainer';
import NajText from '../components/NajText';

// styles
import styles from './styles/processList';

export default function ProcessScreen() {
  return (
    <NajContainer style={styles.container}>
      <NajText>ProcessScreen</NajText>
    </NajContainer>
  );
}
