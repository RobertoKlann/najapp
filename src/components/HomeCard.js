import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import NajText from './NajText';

import { colors } from '../globals';

const styles = StyleSheet.create({
  container: {
    //padding: 15,
    backgroundColor: '#fff',
    elevation: 3,
    borderRadius: 3,
    flex: 1,
  },
  iconWrapper: {
    borderRadius: 3,
    elevation: 2,
    padding: 7,
    backgroundColor: colors.secundary,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 20,
  },
  badgeCounterContainer: {
    //backgroundColor: '#0cc',
    position: 'absolute',
    //padding: 3,
    bottom: 15,
    left: 15,
    //borderRadius: 50,
  },
  badgeCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default function HomeCard({
  icon,
  title,
  badges,
  onPress,
  renderContainer,
}) {
  if (badges && badges.length > 0) {
    if (renderContainer) {
      return renderContainer(
        <RectButton style={styles.container} onPress={onPress}>
          <View style={{ padding: 15 }}>
            <View style={styles.badgeCounterContainer}>
              {badges.map((badge, index) => (
                <View key={String(index)}>{badge()}</View>
              ))}
            </View>

            <NajText>{title}</NajText>

            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                {(title === 'Agendamentos' && (
                  <MaterialCommunityIcon
                    name="calendar"
                    size={22}
                    color="#fff"
                  />
                )) || <MaterialIcon name={icon} size={22} color="#fff" />}
              </View>
            </View>
          </View>
        </RectButton>,
      );
    }

    return (
      <RectButton style={styles.container} onPress={onPress}>
        <View style={{ padding: 15 }}>
          <View style={styles.badgeCounterContainer}>
            {badges.map((badge, index) => (
              <View key={String(index)}>{badge()}</View>
            ))}
          </View>

          <NajText>{title}</NajText>

          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              {(title === 'Agendamentos' && (
                <MaterialCommunityIcon name="calendar" size={22} color="#fff" />
              )) || <MaterialIcon name={icon} size={22} color="#fff" />}
            </View>
          </View>
        </View>
      </RectButton>
    );
  }

  if (renderContainer) {
    return renderContainer(
      <RectButton style={styles.container} onPress={onPress}>
        <View style={{ padding: 15 }}>
          <NajText>{title}</NajText>

          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              {(title === 'Agendamentos' && (
                <MaterialCommunityIcon name="calendar" size={22} color="#fff" />
              )) || <MaterialIcon name={icon} size={22} color="#fff" />}
            </View>
          </View>
        </View>
      </RectButton>,
    );
  }

  return (
    <RectButton style={styles.container} onPress={onPress}>
      <View style={{ padding: 15 }}>
        <NajText>{title}</NajText>

        <View style={styles.iconContainer}>
          <View style={styles.iconWrapper}>
            {(title === 'Agendamentos' && (
              <MaterialCommunityIcon name="calendar" size={22} color="#fff" />
            )) || <MaterialIcon name={icon} size={22} color="#fff" />}
          </View>
        </View>
      </View>
    </RectButton>
  );
}
