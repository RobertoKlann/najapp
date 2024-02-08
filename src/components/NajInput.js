/* eslint-disable no-unused-vars */
import React, {useRef, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useField} from '@unform/core';

import {colors} from '../globals';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#d1d1d1',
    color: colors.primary,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginLeft: 5,
    paddingVertical: 6,
  },
});

export default function NajInput({name, icon, label, style, ...rest}) {
  const inputRef = useRef(null);
  const {fieldName, registerField, defaultValue = '', error} = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: '_lastNativeText',
      getValue(ref) {
        return ref._lastNativeText || '';
      },
      setValue(ref, value) {
        ref.setNativeProps({text: value});
        ref._lastNativeText = value;
      },
      clearValue(ref) {
        ref.setNativeProps({text: ''});
        ref._lastNativeText = '';
      },
    });
  }, [fieldName, registerField]);

  return (
    <>
      {label && <Text>{label}</Text>}

      <View style={[styles.container, style]}>
        {icon && <MaterialIcon name={icon} size={20} color="#d1d1d1" />}

        <TextInput
          style={styles.input}
          ref={inputRef}
          defaultValue={defaultValue}
          {...rest}
        />
      </View>
    </>
  );
}
