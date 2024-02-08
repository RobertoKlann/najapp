import React from 'react';
import {
  Alert,
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  ToastAndroid
} from 'react-native';
import {encode} from 'base-64';

import ADVService from '../services/adv';

// components
import NajContainer from '../components/NajContainer';
import NajText from '../components/NajText';
import EmptyList from '../components/EmptyList';
import {colors} from '../globals';

// styles
const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f1f1',
  },
  title: {
    fontWeight: 'bold',
  },
  loadingCotainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
});

export default function PartsOfTheProcessListScreen({route}) {
  const {id} = route.params;

  const [parts, setParts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  async function handleLoadData() {
    const key = encode(JSON.stringify({CODIGO: id}));

    try {
      const {data} = await ADVService.get(
        `/api/v1/app/processos/${key}/partes`,
      );

      setParts(data.naj);
    } catch (err) {
      ToastAndroid.show('Ops, houve um erro ao efetuar a requisição', ToastAndroid.SHORT)
    }

    setLoading(false);
  }

  function generateListKey() {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }

  function handleRenderItem({NOME, QUALIFICACAO}) {
    return (
      <View style={styles.item}>
        <NajText style={styles.title}>{QUALIFICACAO}</NajText>
        <NajText>{NOME}</NajText>
      </View>
    );
  }

  function handleRenderLoadingIndicator() {
    return (
      <View style={styles.loadingCotainer}>
        <ActivityIndicator color={colors.secundary} animating size="large" />
      </View>
    );
  }

  React.useEffect(() => {
    handleLoadData();
  }, []);

  return (
    <NajContainer style={styles.container}>
      {(!loading && (
        <FlatList
          data={parts}
          keyExtractor={generateListKey}
          ListEmptyComponent={() => (
            <EmptyList text="Nenhum registro encontrado" />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({item}) => handleRenderItem(item)}
        />
      )) ||
        handleRenderLoadingIndicator()}
    </NajContainer>
  );
}
