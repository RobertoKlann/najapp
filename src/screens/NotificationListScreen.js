import React from 'react';

// components
import NajContainer from '../components/NajContainer';
import NajText from '../components/NajText';

// styles
import styles from './styles/notificationList';

export default function NotificationListScreen() {
  return (
    <NajContainer style={styles.container}>
      <NajText>NotificationListScreen</NajText>
    </NajContainer>
  );
}
