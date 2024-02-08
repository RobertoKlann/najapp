import React from 'react';
import {
  View,
  PermissionsAndroid,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';

// components
import NajButton from '../components/NajButton';
import NajText from '../components/NajText';
import NajContainer from '../components/NajContainer';

import LoginScreen from './LoginScreen';

// styles
import styles from './styles/initial';
import { colors } from '../globals';

export default function InitialScreen({ navigation }) {
  const [loading, setLoading] = React.useState(true);

  function goLogin() {
    navigation.navigate('Login');
  }

  function goSignUp() {
    //navigation.navigate('SignUp');
    Alert.alert('Atenção', 'Se você não tem um LOGIN e SENHA, solicite ao seu prestador de serviços que lhe forneça estes dados para entrar no Aplicativo!');
  }

  function getContent() {
    if (loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.secundary} animating size="large" />
        </View>
      );
    }

    return (
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.image}
          />

          <NajText style={styles.headerText}>Área do Cliente</NajText>
        </View>

        <View style={styles.bottomContainer}>
          <NajText style={[styles.middleText, { fontSize: 16 }]}>Informe os seus dados para entrar no aplicativo</NajText>

          <LoginScreen />

          <NajText style={styles.middleText}>ou</NajText>

          <NajButton icon="person-add" onPress={goSignUp}>
            Novo usuário
          </NajButton>
        </View>
      </ScrollView>
    );
  }

  React.useEffect(() => {
    //checkPermissions();
    setLoading(false);
  }, []);

  return <NajContainer style={styles.container}>{getContent()}</NajContainer>;
}
