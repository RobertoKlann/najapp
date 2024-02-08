import React from 'react';
import { View, Alert, ActivityIndicator, ScrollView, ToastAndroid } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import ADVService from '../services/adv';

// components
import NajContainer from '../components/NajContainer';
import NajText from '../components/NajText';
import NajButton from '../components/NajButton';

// styles
import styles from './styles/agendamentos';

export default function NewEventScreen() {
    const auth = useSelector(state => state.auth);
    const navigation = useNavigation();

    const [loading, setLoading] = React.useState(false);
    const [chatId, setChatId] = React.useState(-1);

    const alertButton = [{
        text: 'Ok',
        onPress: () => navigation.goBack(),
    }];
    const alertOptions = { cancelable: false };

    async function monitora(rotina) {
        try {
            await ADVService.get(`/api/v1/app/agenda/${rotina}/monitora`);
        } catch (err) { }
    }

    async function handlePressConsulta() {
        const res = await sendMessageText('SOLICITAÇÃO DE AGENDAMENTO: "Agendamento de Consulta", aguardando datas disponíveis.');

        monitora('consulta');

        if (res) {
            Alert.alert(
                'Atenção',
                'Recebemos o seu pedido de "Agendamento de Consulta" e em breve retornaremos com as datas disponíveis, Muito Obrigado!',
                alertButton,
                alertOptions,
            );
        }
    }

    async function handlePressReuniao() {
        const res = await sendMessageText('SOLICITAÇÃO DE AGENDAMENTO: "Agendamento de Reunião", aguardando datas disponíveis.');

        monitora('reuniao');

        if (res) {
            Alert.alert(
                'Atenção',
                'Recebemos o seu pedido de "Agendamento de Reunião" e em breve retornaremos com as datas disponíveis, Muito Obrigado!',
                alertButton,
                alertOptions,
            );
        }
    }

    async function handlePressVisita() {
        const res = await sendMessageText('SOLICITAÇÃO DE AGENDAMENTO: "Agendamento de Visita", aguardando datas disponíveis.');

        monitora('visita');

        if (res) {
            Alert.alert(
                'Atenção',
                'Recebemos o seu pedido de "Agendamento de Visita" e em breve retornaremos com as datas disponíveis, Muito Obrigado!',
                alertButton,
                alertOptions,
            );
        }
    }

    async function handlePressOutro() {
        const res = await sendMessageText('SOLICITAÇÃO DE AGENDAMENTO: "Outro tipo de Agendamento", aguardando integração para maiores informações.');

        monitora('outro');

        if (res) {
            Alert.alert(
                'Atenção',
                'Recebemos o seu pedido de "Agendamento" e em breve retornaremos solicitando mais informações, Muito Obrigado!',
                alertButton,
                alertOptions,
            );
        }
    }

    async function sendMessageText(message) {
        if (!chatId || chatId < 0) {
            ToastAndroid.show('Chat não encontrado', ToastAndroid.SHORT)

            return false;
        }

        let err = false;
        let persisted = {};

        setLoading(true);

        try {
            const response = await ADVService.post('/api/v1/app/chat/mensagens', {
                conteudo: message,
                chat_id: chatId,
                tipo: '0',
                file_type: '0',
            });

            if (String(response.data.status_code) !== '200') {
                err = true;
            }

            persisted = response.data.naj.persisted;
            } catch (errMsg) {
            err = true;
        }

        setLoading(false);

        if (err) {
            ToastAndroid.show('Ops, houve um erro ao enviar a mensagem', ToastAndroid.SHORT)

            return false;
        }

        return true;
    }

    React.useEffect(() => {
        if (auth?.dashboard?.chat_info?.id_chat) {
        setChatId(auth.dashboard.chat_info.id_chat);
        }
    }, [auth]);

    return (
        <NajContainer style={styles.container}>
        {loading && (
            <View style={styles.loadingContainer}>
            <ActivityIndicator color="#2F9FD1" animating size="large" />
            </View>
        )}
        <ScrollView>
            <NajText style={styles.title}>Escolha uma das opções de AGENDAMENTOS abaixo:</NajText>

            {/** consulta */}
            <View style={styles.buttonWrapper}>
            <NajButton backgroundColor="#707cd2" onPress={handlePressConsulta}>
                Agendar uma Consulta
            </NajButton>
            </View>

            {/** reunião */}
            <View style={styles.buttonWrapper}>
            <NajButton onPress={handlePressReuniao}>
                Agendar uma Reunião
            </NajButton>
            </View>

            {/** visita */}
            <View style={styles.buttonWrapper}>
            <NajButton backgroundColor="#da9533" onPress={handlePressVisita}>
                Agendar uma Visita
            </NajButton>
            </View>

            {/** outro */}
            <View style={styles.buttonWrapper}>
            <NajButton backgroundColor="#8898aa" onPress={handlePressOutro}>
                Outro tipo de Agendamento
            </NajButton>
            </View>
        </ScrollView>
        </NajContainer>
    );
}