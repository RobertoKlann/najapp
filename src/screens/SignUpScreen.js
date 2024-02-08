import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { Form } from '@unform/mobile';

import CPanelService from '../services/cpanel';
import { applyCpfMask } from '../utils/masks';

// components
import NajButton from '../components/NajButton';
import NajInput from '../components/NajInput';
import NajText from '../components/NajText';
import NajLoadingWrapper from '../components/NajLoadingWrapper';
import NajContainer from '../components/NajContainer';

// styles
import styles from './styles/signup';

export default function SignUpScreen({ navigation }) {
  const formRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [enabledSubmit, setEnabledSubmit] = useState(false);
  const [errors, setErrors] = useState([]);

  async function verifyUser(cpf) {
    let exists = true;

    setIsLoading(true);

    try {
      const { data } = await CPanelService.post('app/auth/verifyUserExists', {
        cpf,
      });

      if (String(data.naj.existe) === '0') {
        exists = false;
      }
    } catch (err) {
      setErrors(['Erro ao verificar o CPF informado.']);
    }

    setTimeout(() => setIsLoading(false), 250);

    if (!exists) {
      navigation.navigate('SignUpForm', { cpf });
    } else {
      setErrors(['O CPF informado já está cadastrado.']);
    }
  }

  function handleSubmit(data) {
    setErrors([]);

    if (!isLoading && enabledSubmit) {
      verifyUser(clearInputText(data.cpf));
    }

    if (!enabledSubmit) {
      setErrors(['Campo CPF inválido.']);
    }
  }

  function clearInputText(text) {
    if (text === '') {
      return text;
    }

    const numberPattern = /\d+/g;

    return text.match(numberPattern).join('');
  }

  function handleChangeText(text) {
    let cleanText = String(clearInputText(text)).trim();

    if (cleanText.length === 11) {
      setEnabledSubmit(true);
    } else {
      setEnabledSubmit(false);
    }

    formRef.current.setFieldValue('cpf', applyCpfMask(cleanText));
  }

  return (
    <>
      <NajLoadingWrapper isLoading={isLoading} />

      <NajContainer style={styles.container}>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <NajInput
            autoFocus={true}
            name="cpf"
            maxLength={14}
            keyboardType="number-pad"
            placeholder="CPF"
            style={[styles.input, { marginTop: 15 }]}
            onChangeText={handleChangeText}
            icon="person"
          />

          <NajButton
            icon="arrow-forward"
            onPress={() => formRef.current.submitForm()}>
            Próximo
          </NajButton>
        </Form>

        {errors.length > 0 && (
          <View style={styles.errorList}>
            {errors.map((error, index) => (
              <View key={String(index)} style={styles.errorContainer}>
                <NajText style={styles.error}>- {error}</NajText>
              </View>
            ))}
          </View>
        )}
      </NajContainer>
    </>
  );
}
