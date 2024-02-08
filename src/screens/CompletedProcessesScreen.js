import React from 'react';
import {Alert, RefreshControl, View, ActivityIndicator, ToastAndroid} from 'react-native';

import ADVService from '../services/adv';

// components
import NajContainer from '../components/NajContainer';
import ProcessList from '../components/ProcessList';
import EmptyList from '../components/EmptyList';

// styles
import styles from './styles/processList';
import {colors} from '../globals';

export default function CompletedProcessesScreen() {
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasLoadedAll, setHasLoadedAll] = React.useState(false);
  const [data, setData] = React.useState([]);

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
        `/api/v1/app/processos/encerrados/paginate?page=${currentPage}`,
      );

      if (currentPage === 1) {
        setData(response.data.resultado);
      } else {
        setData([...data, ...response.data.resultado]);
      }

      if (response.data.resultado.length === 0) {
        setHasLoadedAll(true);
      }
    } catch (err) {
      ToastAndroid.show('Ops, houve um erro ao efetuar a requisição.', ToastAndroid.SHORT)
    }

    setLoading(false);

    setPage(currentPage + 1);
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

  function handleRefresh() {
    setRefreshing(true);

    handleLoadData(true);

    setHasLoadedAll(false);

    setRefreshing(false);
  }

  React.useEffect(() => {
    handleLoadData();
  }, []);

  return (
    <NajContainer style={styles.container}>
      {(!loading && (
        <ProcessList
          data={data}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={handleRenderFooter}
          ListEmptyComponent={() => (
            <EmptyList text="Nenhum registro de processo encerrado encontrado" />
          )}
          initialNumToRender={10}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )) ||
        handleRenderLoadingIndicator()}
    </NajContainer>
  );
}
