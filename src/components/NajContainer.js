import React from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'

const styles = StyleSheet.create({
  container: {
    padding: 15
  }
})

export default function NajContainer({ children, ...rest }) {
  return (
    <View style={styles.container} {...rest}>
      {children}
    </View>
  )
}
