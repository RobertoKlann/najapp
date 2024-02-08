import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { colors } from '../globals'
import NajText from './NajText'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    elevation: 2,
    backgroundColor: '#fff'
  },
  wrapper: {
    alignItems: 'center'
  },
  text: {
    fontSize: 12,
    color: '#a1a1a1',
    textAlign: 'center'
  },
  textSelected: {
    color: colors.primary
  },
  button: {
    flex: 1,
    paddingVertical: 5
  }
})

export default function TabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          })
        }

        const iconColor = isFocused ? colors.primary : '#aaa'

        return (
          <RectButton
            key={String(index)}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.button}
          >
            <View style={styles.wrapper}>
              <MaterialIcon name={options.icon} size={26} color={iconColor} />
              <Text style={isFocused ? [styles.text, styles.textSelected] : styles.text}>{label}</Text>
            </View>
          </RectButton>
        )
      })}
    </View>
  )
}
