/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {
  View,
  Alert,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    height: 65,
  },

  input: {
    flex: 1,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
    height: 50,
    flex: 1,
    marginRight: 5,
    backgroundColor: '#fff',
  },

  rightButton: {
    padding: 5,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },

  button: {
    padding: 15,
    backgroundColor: '#2F9FD1',
    borderRadius: 50,
    elevation: 2,
  },
});

export default function ChatInput({
  onChangeText,
  onPress,
  enable,
  value,
  sendingMessage,
  handlePressPickImage,
  handlePressMic,
  handlePressPickAttach,
  handlePressOutMic,
}) {
  function _handlePressMic() {
    handlePressMic();
  }

  function _handlePressOutMic() {
    handlePressOutMic();
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Digite uma mensagem"
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
        />
        <TouchableOpacity
          style={styles.rightButton}
          onPress={handlePressPickAttach}>
          <EntypoIcon name="attachment" size={24} color="#555" />
        </TouchableOpacity>
        <View style={{paddingHorizontal: 5}} />
        <TouchableOpacity
          style={styles.rightButton}
          onPress={handlePressPickImage}>
          <MaterialIcon name="photo-camera" size={26} color="#555" />
        </TouchableOpacity>
        <View style={{paddingRight: 5}} />
      </View>

      {(enable && (
        <RectButton onPress={onPress} style={styles.button}>
          {(sendingMessage && (
            <ActivityIndicator color="#fff" animating size={26} />
          )) || <MaterialIcon name="send" size={26} color="#fff" />}
        </RectButton>
      ))
      // || (
      //   <TouchableHighlight
      //     style={styles.button}
      //     onLongPress={_handlePressMic}
      //     onPressOut={_handlePressOutMic}
      //     underlayColor="#1d6b8e">
      //     <MaterialIcon name="mic" size={26} color="#fff" />
      //   </TouchableHighlight>
      // )
      }
    </View>
  );
}
