import React from 'react';
import {
  View,
  FlatList,
  Alert,
  RefreshControl,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import { useSelector } from 'react-redux';

import moment from 'moment';

import ADVService from '../services/adv';
import { applyMoneyMask, applyNumberMask } from '../utils/masks';

// components
import NajContainer from '../components/NajContainer';
import NajText from '../components/NajText';
import EmptyList from '../components/EmptyList';

// styles
import styles from './styles/finance';
import { colors } from '../globals';

export default function ToPayScreen({ values }) {
  const financeFilter = useSelector(state => state.auth.financeFilter);
  const toPayValue = values.toPayValue;
  const toPayValueOpened = values.toPayValueFinished;

  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasLoadedAll, setHasLoadedAll] = React.useState(false);
  const [data, setData] = React.useState([]);

  function getItemSeparatorComponent() {
    return <View style={styles.itemSeparator} />;
  }

  function getListHeaderComponent() {
    return (
      <View style={[styles.listItem, styles.listHeader]}>
        <View style={styles.listHeaderCounter}>
          <NajText style={styles.listHeaderTitle}>Pago</NajText>
          <NajText style={[styles.listHeaderValue, { color: '#444' }]}>
            {applyMoneyMask(toPayValue)}
          </NajText>
        </View>
        <View style={styles.listHeaderCounter}>
          <NajText style={styles.listHeaderTitle}>Em Aberto</NajText>
          <NajText style={[styles.listHeaderValue, { color: '#FF5050' }]}>
            {applyMoneyMask(toPayValueOpened)}
          </NajText>
        </View>
      </View>
    );
  }

  function getSituacaoItem(st, dueDate) {
    let text = st;
    let color = 'rgb(17, 168, 73)'; // pago

    switch (String(st).toUpperCase()) {
      case 'P':
        text = 'Pago';
        break;
      case 'A':
        text = 'Em aberto';
        color = 'rgb(46, 159, 209)';

        let parsedDate = parseDate(dueDate);

        if (!parsedDate) {
          text = 'Em aberto';
        } else {
          // verificando a data
          const isAfter = moment().isAfter(parsedDate);

          if (isAfter) {
            text = 'Vencido';
            color = 'rgb(255, 73, 73)';
          }
        }
        break;
      default: {
        break;
      }
    }

    return [text, color];
  }

  function parseDate(date) {
    const arr = String(date).split('/');

    if (arr.length !== 3) {
      return false;
    }

    return `${arr[2]}-${arr[1]}-${arr[0]}`;
  }

  function getItem(item, index) {
    const arrSituacao = getSituacaoItem(item.SITUACAO, item.DATA_VENCIMENTO);

    const itemBgColor = (index + 1) % 2 === 0 ? '#fff' : 'rgb(243, 243, 243)';

    return (
      <View style={[styles.listItem, { backgroundColor: itemBgColor }]}>
        <View style={styles.listRow}>
          <View style={{ flex: 1 }}>
            <NajText style={styles.listTitle}>{item.NOME_CLIENTE}</NajText>
            {item.NOME_ADVERSARIO && <NajText>{item.NOME_ADVERSARIO}</NajText>}
          </View>

          <View style={[styles.listStatus, { backgroundColor: arrSituacao[1] }]}>
            <NajText style={styles.listStatusText}>{arrSituacao[0]}</NajText>
          </View>
        </View>

        {item.DESCRICAO && (
          <View style={styles.listRow}>
            <NajText numberOfLines={2}>{item.DESCRICAO}</NajText>
          </View>
        )}

        <View style={styles.listRow}>
          <View style={styles.listDate}>
            <NajText style={styles.nonInfo}>Vencimento em</NajText>
            <NajText style={styles.listDateText}>
              {item.DATA_VENCIMENTO}
              {/* {formatDate(item.DATA_VENCIMENTO)} */}
            </NajText>
          </View>

          {item.DATA_PAGAMENTO && (
            <View style={{ flex: 1 }}>
              <NajText style={styles.nonInfo}>Pago em</NajText>
              <NajText style={styles.listDateText}>
                {item.DATA_PAGAMENTO}
                {/* {formatDate(item.DATA_PAGAMENTO)} */}
              </NajText>
            </View>
          )}

          {item.VALOR_PAGAMENTO && (
            <View>
              <NajText style={styles.nonInfo}>Valor pago</NajText>
              <NajText style={[styles.listValue, { textAlign: 'right' }]}>
                R$ {applyNumberMask(item.VALOR_PAGAMENTO)}
              </NajText>
            </View>
          )}
        </View>

        {item.VALOR_PAGAMENTO && <View style={{ height: 5 }} />}

        <View style={styles.listRow}>
          <NajText>
            Parcela: {item.PARCELA_ATUAL} de {item.PARCELA_TOTAL}, Conta:{' '}
            {item.CODIGO_CONTA}
          </NajText>

          <NajText style={styles.listValue}>
            R$ {applyNumberMask(item.VALOR_PARCELA)}
          </NajText>
        </View>
      </View>
    );
  }

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
        `/api/v1/app/financeiro/pagar/paginate?page=${currentPage}`,
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
      ToastAndroid.show('Ops, houve um erro ao efetuar a requisição', ToastAndroid.SHORT)
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
      <View style={[styles.loadingCotainer, { paddingTop: 15 }]}>
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
    handleRefresh();
  }, [financeFilter]);

  return (
    <NajContainer style={styles.container}>
      {(!loading && (
        <>
          {getListHeaderComponent()}
          <FlatList
            data={data}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={handleRenderFooter}
            initialNumToRender={10}
            ListEmptyComponent={() => (
              <EmptyList text="Nenhum registro de conta a pagar encontrado" />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            keyExtractor={item =>
              String(item.CODIGO_CONTA) + String(item.ID_PARCELA)
            }
            //ListHeaderComponent={getListHeaderComponent}
            ListHeaderComponent={() => <View style={{ height: 60 }} />}
            ItemSeparatorComponent={getItemSeparatorComponent}
            renderItem={({ item, index }) => getItem(item, index)}
          />
        </>
      )) ||
        handleRenderLoadingIndicator()}
    </NajContainer>
  );
}
