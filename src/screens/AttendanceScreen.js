import React from 'react';
import {
  FlatList,
  View,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {RectButton} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {Form} from '@unform/mobile';

import ADVService from '../services/adv';

// components
import NajContainer from '../components/NajContainer';
import NajText from '../components/NajText';
import NajInput from '../components/NajInput';
import NajButton from '../components/NajButton';
import EmptyList from '../components/EmptyList';

// styles
import styles from './styles/attendance';
import advStyles from './styles/advChoice';
import modalStyles from './styles/modal';
import {colors} from '../globals';

export default function AttendanceScreen() {
  const navigation = useNavigation();
  const formRef = React.useRef(null);

  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasLoadedAll, setHasLoadedAll] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [enabledSubmit, setEnabledSubmit] = React.useState(false);
  const [errors, setErrors] = React.useState([]);

  function handleLoadMore() {
    if (hasLoadedAll) {
      return;
    }

    setLoadingMore(true);

    handleLoadData();

    setLoadingMore(false);
  }

  async function handleLoadData(refresh = false) {
    let currentPage = refresh ? 1 : page;

    try {
      const response = await ADVService.get(
        `/api/v1/app/chat/atendimentos/paginate?page=${currentPage}`,
      );

      if (currentPage === 1) {
        setData(response.data.resultado);
      } else {
        setData([...data, ...response.data.resultado]);
      }

      let length = response.data.resultado.length;

      if (length < 50) {
        setHasLoadedAll(true);
      }
    } catch (err) {
      ToastAndroid.show("Ops, não foi possível buscar os dados!", ToastAndroid.SHORT)
    }

    setLoading(false);

    setPage(currentPage + 1);
  }

  function datetimeFormat(datetime) {
    return moment(datetime).format('DD/MM/Y HH:mm');
  }

  function handleNavigateChat(id, id_chat) {
    navigation.navigate('Chat', {id, id_chat});
  }

  function renderListEmptyComponent() {
    if (loading) {
      return <View />;
    }

    return <EmptyList text="Você ainda não abriu um atendimento" />;
  }

  function handleRefresh(call) {
    setRefreshing(true);

    handleLoadData(true);

    setHasLoadedAll(false);

    setRefreshing(false);

    if (typeof call === 'function') {
      call();
    }
  }

  function renderItem(item) {
    return (
      <RectButton onPress={() => handleNavigateChat(item.id, item.id_chat)}>
        <View style={advStyles.listItem}>
          <View style={styles.leftSideContainer}>
            <NajText style={advStyles.listTitle}>{item.nome}</NajText>
            <NajText style={advStyles.listText}>
              Código do Atendimento: {item.id}
            </NajText>

            <View style={styles.blancLine} />

            <View style={styles.datetimeContainer}>
              <NajText style={styles.datetimeText}>Data/Hora Início</NajText>
              <NajText style={styles.datetimeText}>Data/Hora Termino</NajText>
            </View>

            <View style={styles.datetimeContainer}>
              <NajText style={styles.datetimeValue}>
                {(item.data_hora_inicio &&
                  datetimeFormat(item.data_hora_inicio)) ||
                  'Não iniciado'}
              </NajText>
              <NajText style={styles.datetimeValue}>
                {(item.data_hora_fim && datetimeFormat(item.data_hora_fim)) ||
                  'Não finalizado'}
              </NajText>
            </View>
          </View>

          <View>
            <MaterialIcon
              name="arrow-forward"
              size={22}
              style={advStyles.icon}
            />
          </View>
        </View>
      </RectButton>
    );
  }

  function handleRenderFooter() {
    if (!loadingMore) {
      return null;
    }

    return handleRenderLoadingIndicator();
  }

  function handleRenderLoadingIndicator() {
    return (
      <View style={styles.loadingCotainer}>
        <ActivityIndicator color={colors.secundary} animating size="large" />
      </View>
    );
  }

  function handlePressAdd() {
    //formRef.current.setFieldValue('name', '');
    setModalVisible(true);
  }

  function handlePressCloseAdd() {
    setErrors([]);
    setEnabledSubmit(false);
    setModalVisible(false);
  }

  function handleChangeChatName(text) {
    let cleanText = String(text).trim();

    if (cleanText.length >= 3) {
      setEnabledSubmit(true);
    } else {
      setEnabledSubmit(false);
    }

    formRef.current.setFieldValue('name', cleanText);
  }

  function handleSubmitForm() {
    if (!enabledSubmit) {
      setErrors(['Nome do atendimento deve possuir no mínimo 3 caracteres.']);

      return;
    }

    formRef.current.submitForm();
  }

  // eslint-disable-next-line no-shadow
  async function handleSubmit(data) {
    handlePressCloseAdd();

    let hasError = false;
    let errorMessage = null;
    let id = null;
    let idParent = null;

    setLoading(true);

    try {
      const {data: res} = await ADVService.post(
        '/api/v1/app/chat/atendimentos',
        data,
      );

      if (res?.status_code && String(res.status_code) !== '200') {
        errorMessage = res.naj.mensagem;

        hasError(true);
      }

      id = res.naj.persisted.id;
      idParent = res.naj.persisted.id_chat;
    } catch (err) {
      errorMessage = 'Falha de comunicação com o servidor.';

      hasError(true);
    }

    setLoading(false);

    if (!hasError) {
      handleRefresh(() => handleNavigateChat(id, idParent));

      return;
    }

    ToastAndroid.show(errorMessage, ToastAndroid.SHORT)
  }

  React.useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <NajContainer style={styles.container}>
      {(!loading && (
        <>
          <FlatList
            data={data}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            keyExtractor={item => String(item.id)}
            ItemSeparatorComponent={() => (
              <View style={advStyles.listSeparator} />
            )}
            ListEmptyComponent={renderListEmptyComponent}
            ListFooterComponent={handleRenderFooter}
            renderItem={({item}) => renderItem(item)}
          />

          <RectButton style={styles.floatButton} onPress={handlePressAdd}>
            <View style={styles.floatButtonWrapper}>
              <MaterialIcon name="add" size={40} color="#fff" />
            </View>
          </RectButton>
        </>
      )) ||
        handleRenderLoadingIndicator()}

      <Modal visible={modalVisible} animationType="slide">
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <TouchableOpacity
              style={modalStyles.closeButton}
              onPress={handlePressCloseAdd}>
              <MaterialIcon name="close" size={32} color="#333" />
            </TouchableOpacity>

            <NajText style={modalStyles.title}>Novo Atendimento</NajText>
          </View>

          <View style={modalStyles.body}>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <NajInput
                name="nome"
                keyboardType="default"
                placeholder="Nome do atendimento"
                style={styles.input}
                maxLength={14}
                icon="short-text"
                onChangeText={handleChangeChatName}
              />
            </Form>

            {errors.length > 0 && (
              <View style={modalStyles.errorList}>
                {errors.map((error, index) => (
                  <View key={String(index)} style={modalStyles.errorContainer}>
                    <NajText style={modalStyles.error}>- {error}</NajText>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={modalStyles.footer}>
            <NajButton
              inModal={true}
              icon="arrow-forward"
              onPress={handleSubmitForm}>
              Confirmar novo atendimento
            </NajButton>
          </View>
        </View>
      </Modal>
    </NajContainer>
  );
}
