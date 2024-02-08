import React, {useState, useRef} from 'react';
import {ScrollView, View} from 'react-native';
import {useDispatch} from 'react-redux';
import * as Yup from 'yup';
import {Form} from '@unform/mobile';

import {applyCpfMask} from '../utils/masks';
import getUserInfo from '../utils/getUserInfo';
import CPanelService from '../services/cpanel';
import {signInSuccess} from '../store/modules/auth/actions';

// components
import NajButton from '../components/NajButton';
import NajInput from '../components/NajInput';
import NajText from '../components/NajText';
import NajContainer from '../components/NajContainer';
import NajLoadingWrapper from '../components/NajLoadingWrapper';

// styles
import styles from './styles/signup';

export default function SignUpFormScreen({route}) {
  const {cpf} = route.params;
  const formRef = useRef(null);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apelido, setApelido] = useState('');

  // ##
  async function makeFinalSignUpData(data) {
    if (data.apelido.trim() === '') {
      data.apelido = data.nome;
    }

    const UserInfo = await getUserInfo();

    const dispositivo = {
      dispositivo_id: UserInfo.deviceId,
      pusher_id: UserInfo.pusherId,
      modelo: UserInfo.deviceModel,
      versao_so: UserInfo.deviceOSVersion,
    };

    return {
      login: cpf,
      password: data.senha,
      nome: data.nome,
      apelido,
      email: data.email,
      usuario_tipo_id: 3,
      dispositivo,
    };
  }

  // ##
  async function sendRequest(_data) {
    const finalData = await makeFinalSignUpData(_data);

    try {
      const {data} = await CPanelService.post('app/auth/signup', finalData);

      if (String(data.status_code) === '200' && String(data.naj.erro) === '0') {
        const {naj} = data;

        dispatch(signInSuccess(naj.data.token, naj.data.usuario));
      } else {
        setErrors(['Erro ao criar o usuário.']);
      }
    } catch (err) {
      setErrors(['Erro ao criar o usuário.']);
    }
  }

  // ##
  async function handleSubmit(data) {
    setIsLoading(true);

    setErrors([]);

    let nextFunc = () => {};

    try {
      const schema = Yup.object().shape({
        nome: Yup.string()
          .min(6)
          .required()
          .label('Nome'),
        email: Yup.string()
          .email()
          .required()
          .label('E-mail'),
        senha: Yup.string()
          .min(3)
          .required()
          .label('Senha'),
        reSenha: Yup.string()
          .min(3)
          .required()
          .label('Confirma senha'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      // deu boa
      nextFunc = async () => {
        if (data.senha === data.reSenha) {
          await sendRequest(data);

          return;
        }

        setErrors(['Os campos de senha devem conter o mesmo valor']);
      };
    } catch (err) {
      let newErrors = [];

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach(error => newErrors.push(error.message));

        setErrors(newErrors);
      }
    }

    nextFunc();

    setTimeout(() => setIsLoading(false), 250);
  }

  return (
    <>
      <NajLoadingWrapper isLoading={isLoading} />

      <View style={styles.cpfContainer}>
        <NajText>CPF {applyCpfMask(cpf)}</NajText>
      </View>

      <NajContainer style={styles.container}>
        <ScrollView>
          <NajText style={styles.infoText}>
            Os campos que possuem asterisco (*) são obrigatórios.
          </NajText>

          <Form ref={formRef} onSubmit={handleSubmit}>
            <NajInput
              name="nome"
              placeholder="* Nome completo"
              style={styles.input}
              icon="person"
              onChangeText={_nome => {
                if (apelido === '') {
                  let sNome = _nome.split(' ');

                  if (sNome.length > 1) {
                    setApelido(sNome[0]);
                  }
                }
              }}
            />

            <NajInput
              name="apelido"
              placeholder="Apelido (utilizado para exibição)"
              style={styles.input}
              icon="person-pin"
              value={apelido}
              onChangeText={_apelido => setApelido(_apelido)}
            />

            <NajInput
              name="email"
              keyboardType="email-address"
              placeholder="* E-mail"
              style={styles.input}
              icon="email"
            />

            <NajInput
              name="senha"
              placeholder="* Senha"
              style={styles.input}
              icon="vpn-key"
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
            />

            <NajInput
              name="reSenha"
              placeholder="* Confirmar senha"
              style={styles.input}
              icon="vpn-key"
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
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
        </ScrollView>
      </NajContainer>
    </>
  );
}
