import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';

// actions
import { signInRequest, loginMessage } from '../store/modules/auth/actions';

// components
import NajButton from '../components/NajButton';
import NajInput from '../components/NajInput';
import NajText from '../components/NajText';

import { applyCpfMask } from '../utils/masks';
import getUserInfo from '../utils/getUserInfo';

// styles
import styles from './styles/login';
import { colors } from '../globals';

const loadingStyles = StyleSheet.create({
    container: {
        padding: 15,
    },
});

function LoadingComponent() {
    return (
        <View style={loadingStyles.container}>
            <ActivityIndicator color={colors.secundary} animating size="large" />
        </View>
    );
}

export default function LoginScreen() {
    const { loading } = useSelector(state => state.auth);
    const { login } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const formRef = useRef(null);

    const [errors, setErrors] = useState([]);
    const [enabledSubmit, setEnabledSubmit] = useState(false);
    const [userName, setUserName] = useState('');
    const [userPass, setUserPass] = useState('');

    function clearInputText(text) {
        if (text === '')
            return text;

        const numberPattern = /\d+/g;

        return text.match(numberPattern).join('');
    }

    function handleChangePass(pass) {
        let cleanText = String(clearInputText(userName)).trim();

        if (cleanText.length === 11 && pass.length >= 3) {
            setEnabledSubmit(true);
        } else {
            setEnabledSubmit(false);
        }

        setUserPass(pass);
    }

    function handleChangeText(text) {
        let cleanText = String(clearInputText(text)).trim();

        if (cleanText.length === 11 && userPass.length >= 3) {
            setEnabledSubmit(true);
        } else {
            setEnabledSubmit(false);
        }

        const cleanedWithMask = applyCpfMask(cleanText);

        formRef.current.setFieldValue('cpf', cleanedWithMask);

        setUserName(cleanedWithMask);
    }

    async function handleSubmit(data) {
        if (!enabledSubmit) {
            if (!data.cpf && !data.senha) {
                setErrors(['Campo CPF inválido.']);
                setErrors(['Campo senha inválido.']);
            } else if (!data.cpf) {
                setErrors(['Campo CPF inválido.']);
            } else if (!data.senha) {
                setErrors(['Campo senha inválido.']);
            }

            return;
        }

        setErrors([]);

        try {
            const schema = Yup.object().shape({
                cpf: Yup.string()
                .min(14)
                .required()
                .label('CPF'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            let clearLogin = data.cpf;

            const UserInfo = await getUserInfo();

            const device = {
                dispositivo_id: UserInfo.deviceId,
                pusher_id: UserInfo.pusherId,
                modelo: UserInfo.deviceModel,
                versao_so: UserInfo.deviceOSVersion,
            };

            dispatch(signInRequest(clearLogin, userPass, device));
        } catch (err) {
            let newErrors = [];

            if (err instanceof Yup.ValidationError) {
                err.inner.forEach(error => newErrors.push(error.message));

                setErrors(newErrors);
            }
        }
    }

    function getButtonName() {
        if (loading)
            return 'Verificando login';

        return 'Entrar';
    }

    function getButtonColor() {
        if (enabledSubmit)
            return colors.pButton;

        return colors.pButtonDark;
    }

    React.useEffect(() => {
        // console.tron.log(login);
    }, []);

    return (
        <>
        <Form ref={formRef} onSubmit={handleSubmit}>
            <NajInput
            name="cpf"
            keyboardType="number-pad"
            placeholder="CPF"
            style={styles.input}
            maxLength={14}
            icon="person"
            onChangeText={handleChangeText}
            />

            <NajInput
            name="senha"
            placeholder="Senha"
            style={styles.input}
            icon="vpn-key"
            onChangeText={handleChangePass}
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize="none"
            />

            <NajButton
            icon="arrow-forward"
            backgroundColor={getButtonColor()}
            onPress={() => formRef.current.submitForm()}>
            {getButtonName()}
            </NajButton>
        </Form>

        {loading && <LoadingComponent />}

        {login?.message}

        {errors.length > 0 && (
            <View style={styles.errorList}>
                {errors.map((error, index) => (
                    <View key={String(index)} style={styles.errorContainer}>
                    <NajText style={styles.error}>- {error}</NajText>
                    </View>
                ))}
            </View>
        )}
        </>
    );
}
