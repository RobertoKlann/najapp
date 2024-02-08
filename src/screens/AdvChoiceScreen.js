import React, { useEffect, useState } from 'react';
import { FlatList, View, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import * as FileSystem from 'expo-file-system';

import CPanelService from '../services/cpanel';
import { changeAdv } from '../store/modules/auth/actions';
import getUserInfo from '../utils/getUserInfo';

// components
import NajContainer from '../components/NajContainer';
import NajText from '../components/NajText';

// styles
import styles from './styles/advChoice';

export default function AdvChoiceScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const currentAdvId = useSelector(state => state.auth?.adv?.codigo || false);
    const lastAction = useSelector(state => state.notification.lastAction);

    const [advs, setAdvs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    async function loadAdvs() {
        if (isLoading) return;

        setIsLoading(true);

        let toSet = false;
        let newData = [];

        try {
            const UserInfo = await getUserInfo();


            const { data } = await CPanelService.get(`pessoa/allFromUser?deviceId=${UserInfo.deviceId}`);

            //Advocacia utilizada para testes

            // data.naj.pessoas = [{
            //     url_base: 'https://naj999999999.najsistemas.com.br/',
            //     nome: 'ADVOCACIA XPTO NAJ999999999',
            //     cnpj: '05.596.509/0001-62',
            //     status: 'A',
            //     codigo: 999999999,
            // }]

            newData = data.naj.pessoas.map(pessoa => {
                const url = String(pessoa.url_base).replace(/\/+$/, '');
                let ext = '/naj-adv-web/public';

                let newUrl = url;

                if (__DEV__)
                    newUrl = 'http://192.168.0.107:8000/'

                if (url.indexOf(ext) == -1)
                    newUrl = url + ext;

                let _liberado = true;

                if (String(data.naj.liberado) === '0')
                    _liberado = false;

                return {
                    ...pessoa,
                    liberado: _liberado,
                    url_base: newUrl,
                    url_base_original: pessoa.url_base,
                };
            });

            setAdvs(newData);
        } catch (err) {
            Alert.alert('Atenção', 'Houve um erro ao carregar a listagem de prestadores de serviço');
        }

        for (let i = 0; i < newData.length; i++) {
            await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}logos/${newData[i].codigo}`, { intermediates: true });

            let filePath = `${FileSystem.documentDirectory}logos/${newData[i].codigo}/logo.png`;
            const dirInfo = await FileSystem.getInfoAsync(filePath);

            if (!dirInfo.exists) {
                let _fromUrl = `${newData[i].url_base_original}naj-cliente/public/imagens/logo_escritorio/logo_escritorio.png`;

                FileSystem.downloadAsync(
                    _fromUrl,
                    filePath
                ).catch(error => {
                    console.error(error);
                });
            }
        }

        setIsLoading(false);

        if (toSet)
            handlePressAdv(toSet);
    }

    async function handlePressAdv(data) {
        const filePath = `${FileSystem.documentDirectory}logos/${data.codigo}/logo.png`;
        const dirInfo = await FileSystem.getInfoAsync(filePath);

        // se a logo não existe, a gente cria pai
        if (!dirInfo.exists) {
            FileSystem.downloadAsync(
                `${data.url_base_original}naj-cliente/public/imagens/logo_escritorio/logo_escritorio.png`,
                filePath
            ).then(({ uri }) => {
                // loadAllLogoFiles();
            }).catch(error => {
                console.error(error);
            });
        }

        if (currentAdvId && data.codigo === currentAdvId)
            return;

        if (!data.liberado) {
            Alert.alert('Atenção', 'Você não possui acesso liberado à essa advocacia, solicite ao prestador de serviços a liberação do seu acesso para este dispositivo');
            return;
        }

        dispatch(changeAdv(data));

        navigation.navigate('AuthTab');
    }

    useEffect(() => {
      loadAdvs();
    }, [lastAction]);

    return (
        <NajContainer style={styles.container}>
            <View style={styles.warningContainer}>
                <MaterialCommunityIcons name="account-question" size={28} style={[styles.icon, styles.emptyIcon, { color: '#f5f5f5' }]} />
                <NajText style={styles.warningText}>
                    Clique sobre um dos prestadores de serviço abaixo para se conectar e
                    ter acesso ao seus dados.
                </NajText>
            </View>

            <FlatList
            data={advs}
            refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={loadAdvs} />
            }
            keyExtractor={item => String(item.codigo)}
            ListEmptyComponent={() =>
                (isLoading && <View />) || (
                <View style={styles.emptyList}>
                    <MaterialIcons name="grid-off" size={28} style={[styles.icon, styles.emptyIcon]} />

                    <NajText style={styles.emptyText}>
                    Você ainda não está vinculado à uma advocacia
                    </NajText>
                </View>
                )
            }
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            renderItem={({ item }) => (
                <RectButton onPress={() => handlePressAdv(item)}>
                <View
                    style={
                    currentAdvId === item.codigo
                        ? [styles.listItem, styles.listItemDisable]
                        : styles.listItem
                    }>
                    <View style={{ flex: 1 }}>
                        <NajText style={styles.listTitle}>{item.nome}</NajText>
                        <NajText style={styles.listText}>{item.cnpj}</NajText>
                    </View>

                    <View>
                        <Ionicons name="arrow-forward" size={22} style={styles.icon} />
                    </View>
                </View>
                </RectButton>
            )}
            />
        </NajContainer>
    );
}
