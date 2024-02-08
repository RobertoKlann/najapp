import React, { useState } from 'react';
import { View, Alert, ActivityIndicator, ScrollView, Modal, SafeAreaView } from 'react-native';

// components
import NajContainer from '../components/NajContainer';
import EventCard from '../components/EventCard';

// styles
import styles from './styles/agendamentos';

export default function AgendamentosScreen() {

  const [loading, setLoading] = React.useState(false);

  return (
	<EventCard></EventCard>
  );
}
