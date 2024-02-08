import React from 'react';
import {
  Alert,
  ActivityIndicator,
  View,
  FlatList,
  StyleSheet,
  ToastAndroid
} from 'react-native';
import { encode } from 'base-64';
import moment from 'moment';

import ADVService from '../services/adv';

// components
import NajContainer from '../components/NajContainer';
import NajText from '../components/NajText';
import { colors } from '../globals';

// styles
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    //flexDirection: 'row',
    //alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f1f1',
  },
  date: {
    fontWeight: 'bold',
    paddingRight: 10,
    fontSize: 12,
    //textAlign: 'right',
  },
  description: {
    flex: 1,
  },
  loadingMore: {
    padding: 20,
    backgroundColor: 'red',
  },
  loadingCotainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
});

export default function ProgressOfTheProcessListScreen({ route }) {
  const { id } = route.params;

  const [progress, setProgress] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasLoadedAll, setHasLoadedAll] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);

  function handleLoadingMore() {
    if (hasLoadedAll) {
      return;
    }

    setLoadingMore(true);

    handleLoadData();

    setLoadingMore(false);
  }

  async function handleLoadData() {
    const key = encode(JSON.stringify({ CODIGO: id }));

    try {
      const { data } = await ADVService.get(
        `/api/v1/app/processos/${key}/movimentacao?page=${page}`,
      );

      if (page === 1) {
        setProgress(data.resultado);
      } else {
        setProgress([...progress, ...data.resultado]);
      }

      if (data.resultado.length < 50) {
        setHasLoadedAll(true);
      }
    } catch (err) {
      ToastAndroid.show('Ops, houve um erro ao efetuar a requisição', ToastAndroid.SHORT)
    }

    setLoading(false);

    setPage(page + 1);
  }

  function dbDateToMoment(dbDate) {
    if (!dbDate) {
      return false;
    }

    const arr = String(dbDate).split('/');

    if (arr.length != 3) {
      return false;
    }

    return `${arr[2]}-${arr[1]}-${arr[0]} 00:00:00`;
  }

  function handleRenderItem({ DATA, DESCRICAO_ANDAMENTO }) {
    let spendedTimeText = false;
    let itemDate = dbDateToMoment(DATA);

    if (itemDate) {
      const totalDiff = moment().diff(moment(itemDate), 'days');

      if (totalDiff == 0) {
        spendedTimeText = 'Hoje';
      } else if (totalDiff == 1) {
        spendedTimeText = 'Há 1 dia';
      } else if (totalDiff >= 2 && totalDiff <= 30) {
        spendedTimeText = `Há ${totalDiff} dias`;
      }
    }

    return (
      <View style={styles.item}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <NajText style={styles.date}>{DATA}</NajText>

          {spendedTimeText && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F9B300',
              paddingVertical: 2,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}>
              <NajText style={{ fontWeight: 'bold', fontSize: 12 }}>{spendedTimeText}</NajText>
            </View>
          )}
        </View>
        <NajText style={styles.description}>
          {String(DESCRICAO_ANDAMENTO).trim()}
        </NajText>
      </View>
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

  React.useEffect(() => {
    handleLoadData();
  }, []);

  return (
    <NajContainer style={styles.container}>
      {(!loading && (
        <FlatList
          data={progress}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={({ ID }) => String(ID)}
          renderItem={({ item }) => handleRenderItem(item)}
          onEndReached={handleLoadingMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={handleRenderFooter}
          initialNumToRender={10}
        />
      )) ||
        handleRenderLoadingIndicator()}
    </NajContainer>
  );
}
