import React from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ToastAndroid
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

// components
import NajContainer from '../components/NajContainer';
import NajText from '../components/NajText';
import EmptyList from '../components/EmptyList';

import ADVService from '../services/adv';

// styles
import styles from './styles/activities';
import financeStyles from './styles/finance';
import { colors } from '../globals';
import { TouchableOpacity } from 'react-native-gesture-handler';

/*const devItems = [
  {
    'NOME_CLIENTE': 'Cliente Teste 1',
    'QUALIFICA_CLIENTE': 'Qual. Teste',
    'NOME_ADVERSARIO': 'Adversario Teste',
    'QUALIFICA_ADVERSARIO': 'Qual. Teste',
    'NOME_USUARIO': 'Usuario Teste',
    'CODIGO': '1',
    'DESCRICAO': 'Sem passeios dir penetrou dissesse arrojado absoluta sao. Frioleiras nao das recordarei excellente sao iii. Ate bom ares alli brio caso com meus acha. Ahi exposta escapar sem acoitar meu. Dou impossivel doidivanas competente vir uns. Sua tez isto qual rico moem nao. Ha tu mysterio chegueis ii obrigada ameacado quarenta exprimir ve. Viveremos de do sustentar horriveis apertando symbolica me. Sacrifical ostentacao as ou applicacao. Ja da ou haviam vindes contar',
    'DATA_ATIVIDADE': '2021/01/27',
    'HORA_ATIVIDADE': '04:50',
    'NUMERO_PROCESSO': '7',
    'TEMPO': '01:00:00',
    'CARTORIO': 'Cartório Teste',
    'COMARCA': 'Mirim Doce',
    'COMARCA_UF': 'SC',
    'CLASSE': 'Classe Teste',
    'isLongText': false,
    'opened': false,
  },
  {
    'NOME_CLIENTE': 'Cliente Teste 2',
    'QUALIFICA_CLIENTE': 'Qual. Teste',
    'NOME_ADVERSARIO': 'Adversario Teste',
    'QUALIFICA_ADVERSARIO': 'Qual. Teste',
    'NOME_USUARIO': 'Usuario Teste',
    'CODIGO': '2',
    'DESCRICAO': 'Sem passeios dir penetrou dissesse arrojado absoluta sao. Frioleiras nao das recordarei excellente sao iii.',
    'DATA_ATIVIDADE': '2021/01/27',
    'HORA_ATIVIDADE': '04:50',
    'NUMERO_PROCESSO': '7',
    'TEMPO': '01:00:00',
    'CARTORIO': 'Cartório Teste',
    'COMARCA': 'Mirim Doce',
    'COMARCA_UF': 'SC',
    'CLASSE': 'Classe Teste',
    'isLongText': false,
    'opened': false,
  },
  {
    'NOME_CLIENTE': 'Cliente Teste 3',
    'QUALIFICA_CLIENTE': 'Qual. Teste',
    'NOME_ADVERSARIO': 'Adversario Teste',
    'QUALIFICA_ADVERSARIO': 'Qual. Teste',
    'NOME_USUARIO': 'Usuario Teste',
    'CODIGO': '3',
    'DESCRICAO': 'Sem passeios dir penetrou dissesse arrojado absoluta sao. Frioleiras nao das recordarei excellente sao iii. Ate bom ares alli brio caso com meus acha. Ahi exposta escapar sem acoitar meu. Dou impossivel doidivanas competente vir uns. Sua tez isto qual rico moem nao. Ha tu mysterio chegueis ii obrigada ameacado quarenta exprimir ve. Viveremos de do sustentar horriveis apertando symbolica me. Sacrifical ostentacao as ou applicacao. Ja da ou haviam vindes contar',
    'DATA_ATIVIDADE': '2021/01/27',
    'HORA_ATIVIDADE': '04:50',
    'NUMERO_PROCESSO': '8',
    'TEMPO': '01:00:00',
    'CARTORIO': 'Cartório Teste',
    'COMARCA': 'Mirim Doce',
    'COMARCA_UF': 'SC',
    'CLASSE': 'Classe Teste',
    'isLongText': false,
    'opened': false,
  }
];*/

export default function ActivitiesScreen() {
    const [page, setPage] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [hasLoadedAll, setHasLoadedAll] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [longTextItems, setLongTextItems] = React.useState([]);
    const [totalHoras, setTotalHoras] = React.useState('00:00:00');

    const navigation = useNavigation();

    function navigateAttachmentActivitiesList(id) {
      	navigation.navigate('AttachmentActivitiesList', { id });
    }

    const onTextLayoutDesc = React.useCallback((e, item, _data) => {
		if (_data.length === 0) {
			return;
		}

		const exists = longTextItems.find(CODIGO => CODIGO === item.CODIGO);

		let newData = longTextItems;

		if (!exists && e.nativeEvent.lines.length > 5) {
			newData.push(item.CODIGO);
			setLongTextItems(newData);

			let newDescricao = item.DESCRICAO.split(e.nativeEvent.lines[4].text)[0];

			item.DESCRICAO_ABR = `${newDescricao.slice(0, newDescricao.length - 10)}... `;
			item.isLongText = true;

			newDataItems = _data.map(_item => {
				if (_item.CODIGO === item.CODIGO) {
					return item;
				}

				return _item;
			});

			setData(newDataItems);
		}
    }, []);

    function handleRenderItem({ item, index }) {
		/*item.NUMERO_PROCESSO = '0800882-81.2013.8.24.0113/0002';
		item.CLASSE = 'Indidente de desconsideração de personalidade';
		item.CARTORIO = '2°Vara Cível';
		item.COMARCA = 'Camboriú';
		item.COMARCA_UF = 'SC';*/
		// console.tron.log(item.CODIGO);

		const itemBgColor = (index + 1) % 2 === 0 ? '#fff' : 'rgb(243, 243, 243)';

		let nomeCliente = item.NOME_CLIENTE;

		if (nomeCliente && item.QUALIFICA_CLIENTE) {
			nomeCliente = `${nomeCliente} (${item.QUALIFICA_CLIENTE})`;
		}

		let nomeAdversario = item.NOME_ADVERSARIO;

		if (nomeAdversario && item.QUALIFICA_ADVERSARIO) {
			nomeAdversario = `${nomeAdversario} (${item.QUALIFICA_ADVERSARIO})`;
		}

		let spendedTimeText = false;

		if (item.DATA) {
			const itemDate = moment(item.DATA);
			const totalDiff = moment().diff(itemDate, 'days');

			if (totalDiff == 0) {
				spendedTimeText = 'Hoje';
			} else if (totalDiff == 1) {
				spendedTimeText = 'Há 1 dia';
			} else if (totalDiff >= 2 && totalDiff <= 30) {
				spendedTimeText = `Há ${totalDiff} dias`;
			}
		}

		return (
			<View style={[styles.itemContainer, { backgroundColor: itemBgColor }]}>
				<NajText style={styles.itemTitle}>{item.NOME_USUARIO}</NajText>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => {
					if (!item.isLongText) {
						return;
					}

					const newData = data.map(_item => {
						if (_item.CODIGO === item.CODIGO) {
						return { ..._item, opened: !_item.opened };
						}

						return _item;
					});
					setData(newData);
					}}>
					<NajText numberOfLines={0} style={[styles.itemDesc]} onTextLayout={e => onTextLayoutDesc(e, item, data)}>
					{(item.isLongText && !item.opened) && item.DESCRICAO_ABR || item.DESCRICAO}
					{(longTextItems.indexOf(item.CODIGO) > -1 && !item.opened) && (
						<NajText>
						<MaterialCommunityIcon
							size={18}
							name="arrow-down-circle"
							color="#111"
						/>
						</NajText>
					)}
					</NajText>
				</TouchableOpacity>

				<View style={[styles.itemRow, { paddingVertical: 3 }]}>
					<NajText style={{ flex: 1 }}>
					{item.DATA_ATIVIDADE} {item.HORA_ATIVIDADE}
					</NajText>

					{item.TEMPO && (
					<View
						style={{
						flexDirection: 'row',
						alignItems: 'center',
						flex: 1,
						}}>
						<MaterialIcon
						style={styles.timeIcon}
						size={16}
						name="access-time"
						color="#111"
						/>
						<NajText>{item.TEMPO}</NajText>
					</View>
					)}

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

				{item.NUMERO_PROCESSO && (
					<View>
					<NajText numberOfLines={1} style={styles.processTitle}>
						{item.CARTORIO} - {item.COMARCA} - {item.COMARCA_UF}
					</NajText>
					<NajText numberOfLines={1}>{item.NUMERO_PROCESSO}</NajText>
					<NajText numberOfLines={2}>{item.CLASSE}</NajText>
					</View>
				)}

				{(nomeCliente || nomeCliente) && <View style={{ height: 5 }} />}

				{nomeCliente && (
					<NajText style={{ fontWeight: 'bold' }}>{nomeCliente}</NajText>
				)}

				{nomeAdversario && <NajText>{nomeAdversario}</NajText>}

				{item.quantidade_anexos > 0 && (
				<View style={styles.itemRow}>
					<MaterialCommunityIcon style={{ marginRight: 10, marginTop: 10 }} size={24} color="#000" name="paperclip" />
					<View style={{ flex: 1 }}>
						
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
						<NajText style={{ color: '#777' }}>Anexos da Atividade</NajText>
						</View>

						<View style={{ flexDirection: 'row' }}>
						<NajText>Quantidade: {item.quantidade_anexos}</NajText>
						</View>
					</View>

					<RectButton
						style={{ padding: 15 }}
						onPress={() =>
							navigateAttachmentActivitiesList(item.CODIGO)
						}
					>
					<MaterialIcon size={24} color="#000" name="arrow-forward" />
					</RectButton>
				</View>
				)}
			</View>
		);
    }

    function handleRenderLoadingIndicator() {
      	return (
			<View style={[financeStyles.loadingCotainer, { paddingTop: 15 }]}>
			<ActivityIndicator color={colors.secundary} animating size="large" />
			</View>
		);
    }

    function getItemSeparatorComponent() {
      	return <View style={financeStyles.itemSeparator} />;
    }

    async function handleLoadData(refresh = false) {
		let currentPage = refresh ? 1 : page;

		try {
			const response = await ADVService.get(
				`/api/v1/app/atividades/paginate?page=${currentPage}`,
			);

			let newTotalHoras = '00:00:00';

			if (String(response.data.total_horas).indexOf(':') > -1)
				newTotalHoras = response.data.total_horas;

			setTotalHoras(newTotalHoras);

			const newResultado = response.data.resultado.map(it => ({
				...it,
				numberOfLines: 5,
			}));

			if (currentPage === 1) {
				setData(newResultado);
			} else {
				setData([...data, ...newResultado]);
			}

			let length = newResultado.length;

			if (length < 50)
				setHasLoadedAll(true);
		} catch (err) {
			ToastAndroid.show("Ops, não foi possível buscar as atividades!", ToastAndroid.SHORT)
		}

		setLoading(false);

		setPage(currentPage + 1);
    }

    function handleLoadMore() {
		if (hasLoadedAll)
			return;

		setLoadingMore(true);

		handleLoadData();

		setLoadingMore(false);
    }

    function handleRenderFooter() {
		if (!loadingMore)
			return <View style={{ padding: 25, backgroundColor: 'rgba(0,0,0,0)' }} />;

		return handleRenderLoadingIndicator();
    }

    function handleRefresh() {
		setRefreshing(true);

		handleLoadData(true);

		setHasLoadedAll(false);

		setRefreshing(false);
    }

    React.useEffect(() => {
      	handleRefresh();
    }, []);

    return (
      <NajContainer style={styles.container}>
        {(!loading && (
          <>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderColor: '#f1f1f1',
                backgroundColor: '#fff',
                padding: 15,
              }}>
              <NajText
                style={{
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: 14,
                }}>
                Total de Horas:{' '}
              </NajText>
              <NajText>{totalHoras}</NajText>
            </View>

            <FlatList
              data={data}
              keyExtractor={({ CODIGO }) => String(CODIGO)}
              renderItem={handleRenderItem}
              onEndReached={handleLoadMore}
              ItemSeparatorComponent={getItemSeparatorComponent}
              onEndReachedThreshold={0.5}
              ListFooterComponent={handleRenderFooter}
              initialNumToRender={10}
              ListEmptyComponent={() => (
                <EmptyList text="Nenhuma atividade encontrada" />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            />
          </>
        )) ||
          handleRenderLoadingIndicator()}
      </NajContainer>
    );
}
