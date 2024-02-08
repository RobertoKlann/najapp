import React from 'react';
import { View, Modal, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import Autolink from 'react-native-autolink';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ..
import CPanelService from '../services/cpanel';
import ADVService from '../services/adv';

// .
import NajButton from '../components/NajButton';
import NajText from '../components/NajText';

// screens
import AuthStackNavigator from './AuthStackNavigator';
import SignOutStackNavigator from './SignOutStackNavigator';

// themes
import Themes from '../themes';

export default function Router() {
    const isLogged = useSelector(state => state.auth.signed);
    const token = useSelector(state => state.auth.token);
    const [modalVisible, setModalVisible] = React.useState(false);

    if (isLogged && token) {
        CPanelService.defaults.headers.common.Authorization = `Bearer ${token}`;

        ADVService.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    async function handleAcceptTerms() {
        setModalVisible(false);
        AsyncStorage.setItem('@NAJ_AC/accepted_terms', '1');
    }

    function getTerms() {
        const linkText = 'https://www.najsistemas.com.br/termosdeuso/termos_naj_desk_maio_2021.pdf';

        return (
            <Modal animationType="slide" visible={modalVisible}>
                <View style={{ flex: 1 }}>
                <View style={{ padding: 15 }}>
                    <NajText style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>AVISO LEGAL</NajText>
                </View>
                <View style={{ padding: 15, flex: 1, backgroundColor: 'rgba(0, 0, 0, .1)' }}>
                    <ScrollView>
                    <NajText style={{ paddingBottom: 10, }}>O USUÁRIO possui o direito de acesso e utilização do APLICATIVO NAJ DESK durante a vigência do vínculo existente com o prestador de serviços (LICENCIADO) e nos termos e condições definidos pelo mesmo.</NajText>
                    <NajText style={{ paddingBottom: 10, }}>Favor entrar em contato com o seu prestador de serviços para obtenção do Login e da senha de acesso.</NajText>
                    <NajText style={{ paddingBottom: 10, }}>A interrupção do acesso do USUÁRIO ao APLICATIVO NAJ DESK pode ocorrer na discricionariedade do prestador de serviços (LICENCIADO).</NajText>
                    <NajText style={{ paddingBottom: 10, }}>A NAJ SISTEMAS EM INFORMÁTICA LTDA ME. informa que durante a utilização do APLICATIVO NAJ DESK serão coletadas as seguintes informações: Características do dispositivo de acesso (marca, modelo e sistema operacional), informações do navegador, IP de acesso, tempo de navegabilidade, geolocalização, data e hora de cada acesso, login e senha, acesso a utilização da câmara e microfone do dispositivo.</NajText>
                    <NajText style={{ paddingBottom: 10, }}>
                        Leia na íntegra em: <Autolink text={linkText} />
                    </NajText>
                    <NajText style={{ fontWeight: 'bold', marginTop: 15 }}>Contato do fabricante:</NajText>
                    <NajText style={{ fontWeight: 'bold' }}>NAJ SISTEMAS EM INFORMÁTICA LTDA ME.</NajText>
                    <NajText style={{ fontWeight: 'bold' }}>suporte@najsistemas.com.br</NajText>
                    </ScrollView>
                </View>
                <View style={{ padding: 15 }}>
                    <NajButton inModal={true} onPress={handleAcceptTerms}>Ok, Entendido</NajButton>
                </View>
                </View>
            </Modal>
        );
    }

    async function verify() {
        const acceptedTerms = await AsyncStorage.getItem('@NAJ_AC/accepted_terms');

        if (acceptedTerms !== '1')
            setModalVisible(true);
    }

    React.useEffect(() => {
        verify();
    }, []);

    return (
        <NavigationContainer theme={Themes.light}>
            {getTerms()}
            {isLogged ? <AuthStackNavigator /> : <SignOutStackNavigator />}
        </NavigationContainer>
    );
}
