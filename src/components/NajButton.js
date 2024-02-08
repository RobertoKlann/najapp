import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {RectButton} from 'react-native-gesture-handler';

// components
import NajText from './NajText';

// globals
import {colors} from '../globals';

// styles
const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 3,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: colors.pButtonText,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  icon: {
    paddingRight: 5,
  },
});

export default function NajButton({
  children,
  icon,
  inModal,
  backgroundColor,
  ...rest
}) {
  let bgColor = colors.pButton;

  if (backgroundColor) {
    bgColor = backgroundColor;
  }

  if (inModal) {
    return (
      <TouchableOpacity
        style={[styles.container, {backgroundColor: bgColor}]}
        {...rest}>
        <View style={styles.wrapper}>
          {icon && (
            <MaterialIcon
              style={styles.icon}
              size={22}
              name={icon}
              color={colors.pButtonText}
            />
          )}

          <NajText style={styles.text}>{children}</NajText>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <RectButton
      style={[styles.container, {backgroundColor: bgColor}]}
      {...rest}>
      <View style={styles.wrapper}>
        {icon && (
          <MaterialIcon
            style={styles.icon}
            size={22}
            name={icon}
            color={colors.pButtonText}
          />
        )}

        <NajText style={styles.text}>{children}</NajText>
      </View>
    </RectButton>
  );
}
