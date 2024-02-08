import React from 'react';
import {View, StyleSheet} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// components
import NajText from '../components/NajText';
import {colors} from '../globals';

// styles
const styles = StyleSheet.create({
  emptyList: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingRight: 10,
    color: colors.title,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.title,
    textAlign: 'center',
    flex: 1,
  },
});

export default function EmptyList({text}) {
  return (
    <View style={styles.emptyList}>
      <MaterialIcon name="grid-off" size={28} style={styles.icon} />

      <NajText style={styles.emptyText}>{text}</NajText>
    </View>
  );
}
