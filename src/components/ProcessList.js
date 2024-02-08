import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import NajText from './NajText';

const styles = StyleSheet.create({
  itemContainer: {
    //backgroundColor: '#fff',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
  },
  leftSideMainRow: {
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 15,
    flex: 1,
    alignItems: 'center',
  },
  mainIcon: {
    paddingRight: 10,
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    flex: 1,
  },
  subTitle: {
    color: '#666',
    textTransform: 'capitalize',
    flex: 1,
  },
  button: {
    padding: 15,
  },
  row: {
    paddingVertical: 10,
    paddingLeft: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
  withFlex: {
    flex: 1,
  },
  itemSeparator: {
    height: 5,
    backgroundColor: '#f1f1f1',
  },
  line: {
    height: 1,
    backgroundColor: '#f1f1f1',
    marginVertical: 10,
    marginRight: 15,
  },
  lastRow: {
    flexDirection: 'row',
    marginRight: 15,
  },
  lastRowItem: {
    flex: 1,
  },
  name: {
    textTransform: 'capitalize',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDescription: {
    flexDirection: 'row',
  },
  nonInfoText: {
    color: '#777',
  },
  statusText: {
    paddingLeft: 10,
    flex: 1,
  },
  withMarginRight: {
    marginRight: 15,
  },
  iconAttachment: {
	marginRight: 10,
	marginTop: 10,
  },
});

export default function ProcessList({ data, ...rest }) {
	const navigation = useNavigation();

	function navigatePartsOfTheProcess(id) {
		navigation.navigate('PartsOfTheProcessList', { id });
	}

	function navigateProgressOfTheProcessList(id) {
		navigation.navigate('ProgressOfTheProcessList', { id });
	}

	function navigateProcessActivitiesList(id) {
		navigation.navigate('ProcessActivitiesList', { id });
	}

	function navigateAttachmentProcessList(id) {
		navigation.navigate('AttachmentProcessList', { id });
	}

	function dbDateToMoment(dbDate) {
		if (!dbDate)
			return false;

		const arr = String(dbDate).split('/');

		if (arr.length != 3)
			return false;

		return `${arr[2]}-${arr[1]}-${arr[0]} 00:00:00`;
	}

	function handleRenderItem(item, index) {
		const itemBgColor = (index + 2) % 2 === 0 ? '#fff' : 'rgb(243, 243, 243)';

		// atividade
		let spendedTimeActivityText = false;
		let itemActivityDate = dbDateToMoment(item.ULTIMA_ATIVIDADE_DATA);

		if (itemActivityDate) {
			const totalDiffActivity = moment().diff(moment(itemActivityDate), 'days');

			if (totalDiffActivity == 0) {
				spendedTimeActivityText = 'Hoje';
			} else if (totalDiffActivity == 1) {
				spendedTimeActivityText = 'Há 1 dia';
			} else if (totalDiffActivity >= 2 && totalDiffActivity <= 30) {
				spendedTimeActivityText = `Há ${totalDiffActivity} dias`;
			}
		}

		// andamento
		let spendedTimeAndamentoText = false;
		let itemAndamentoDate = dbDateToMoment(item.ULTIMO_ANDAMENTO_DATA);

		if (itemAndamentoDate) {
			const totalDiffAndamento = moment().diff(moment(itemAndamentoDate), 'days');

			if (totalDiffAndamento == 0) {
				spendedTimeAndamentoText = 'Hoje';
			} else if (totalDiffAndamento == 1) {
				spendedTimeAndamentoText = 'Há 1 dia';
			} else if (totalDiffAndamento >= 2 && totalDiffAndamento <= 30) {
				spendedTimeAndamentoText = `Há ${totalDiffAndamento} dias`;
			}
		}

		return (
			<View style={[styles.itemContainer, { backgroundColor: itemBgColor }]}>
				<View style={styles.mainRow}>
				<View style={styles.leftSideMainRow}>
					<MaterialCommunityIcon
					size={24}
					color="#000"
					name="scale-balance"
					style={styles.mainIcon}
					/>

					<View style={styles.titleContainer}>
						<NajText style={styles.title} numberOfLines={1}>
							{item.NOME_CLIENTE}
						</NajText>
						<NajText style={styles.subTitle} numberOfLines={1}>
							x {item.NOME_ADVERSARIO}
						</NajText>
					</View>
				</View>

				<RectButton
					style={styles.button}
					onPress={() => navigatePartsOfTheProcess(item.CODIGO_PROCESSO)}>
					<MaterialIcon size={24} color="#000" name="arrow-forward" />
				</RectButton>
				</View>

				<View style={styles.row}>
				{/* cartório */}
				<View style={styles.withMarginRight}>
					<NajText numberOfLines={1}>
					{item.CARTORIO} - {item.COMARCA} / {item.COMARCA_UF}
					</NajText>
					<NajText style={styles.withFlex} numberOfLines={1}>
					{item.NUMERO_PROCESSO_NEW}
					</NajText>
					{item.CLASSE && (
					<NajText style={styles.withFlex} numberOfLines={1}>
						{item.CLASSE}
					</NajText>
					)}
					<NajText style={styles.withFlex} numberOfLines={1}>
					Código: {item.CODIGO_PROCESSO}
					</NajText>
				</View>

				<View style={styles.line} />

				{/* último andamento */}
				{item.ULTIMO_ANDAMENTO_DATA && (
					<>
					<View style={styles.statusContainer}>
						<View style={styles.withFlex}>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
							<NajText style={styles.nonInfoText}>Último andamento</NajText>

							{spendedTimeAndamentoText && (
							<View style={{
								flexDirection: 'row',
								alignItems: 'center',
								backgroundColor: '#F9B300',
								marginLeft: 5,
								paddingVertical: 2,
								paddingHorizontal: 10,
								borderRadius: 10,
							}}>
								<NajText style={{ fontWeight: 'bold', fontSize: 12 }}>{spendedTimeAndamentoText}</NajText>
							</View>
							)}
						</View>

						<View style={styles.statusDescription}>
							<NajText>{item.ULTIMO_ANDAMENTO_DATA}</NajText>

							<NajText numberOfLines={1} style={styles.statusText}>
							{item.ULTIMO_ANDAMENTO_DESCRICAO}
							</NajText>
						</View>
						</View>

						<RectButton
						style={styles.button}
						onPress={() =>
							navigateProgressOfTheProcessList(item.CODIGO_PROCESSO)
						}>
						<MaterialIcon size={24} color="#000" name="arrow-forward" />
						</RectButton>
					</View>

					<View style={styles.line} />
					</>
				)}

				{/* última atividade */}
				{item.ULTIMA_ATIVIDADE_DATA && (
					<>
					<View style={styles.statusContainer}>
						<View style={styles.withFlex}>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
							<NajText style={styles.nonInfoText}>
							Última atividade
							</NajText>
							{spendedTimeActivityText && (
							<View style={{
								flexDirection: 'row',
								alignItems: 'center',
								backgroundColor: '#F9B300',
								marginLeft: 5,
								paddingVertical: 2,
								paddingHorizontal: 10,
								borderRadius: 10,
							}}>
								<NajText style={{ fontWeight: 'bold', fontSize: 12 }}>{spendedTimeActivityText}</NajText>
							</View>
							)}
						</View>

						<View style={styles.statusDescription}>
							<NajText>{item.ULTIMA_ATIVIDADE_DATA}</NajText>

							<NajText numberOfLines={1} style={styles.statusText}>
							{item.ULTIMA_ATIVIDADE_DESCRICAO}
							</NajText>
						</View>
						</View>

						<RectButton
						style={styles.button}
						onPress={() =>
							navigateProcessActivitiesList(item.CODIGO_PROCESSO)
						}>
						<MaterialIcon size={24} color="#000" name="arrow-forward" />
						</RectButton>
					</View>

					<View style={styles.line} />
					</>
				)}

				{/* advogado/responsável */}
				<View style={styles.lastRow}>
					<View style={styles.lastRowItem}>
						<NajText style={styles.nonInfoText}>Advogado</NajText>
						<NajText
							numberOfLines={1}
							style={[styles.name, { paddingRight: 10 }]}>
							{item.NOME_ADVOGADO}
						</NajText>
					</View>

					<View style={styles.lastRowItem}>
						<NajText style={styles.nonInfoText}>Responsável</NajText>
						<NajText numberOfLines={1} style={styles.name}>
							{(item.NOME_RESPONSAVEL && item.NOME_RESPONSAVEL) || '-'}
						</NajText>
					</View>
				</View>
				<View style={styles.line} />

				{/* anexos */}
				{item.QTD_ANEXOS > 0 && (
					<>
					<View style={styles.statusContainer}>
						<MaterialCommunityIcon style={styles.iconAttachment} size={24} color="#000" name="paperclip" />
						<View style={styles.withFlex}>
							
							<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
								<NajText style={styles.nonInfoText}>Anexos do Processo</NajText>
							</View>

							<View style={styles.statusDescription}>
								<NajText>Quantidade: {item.QTD_ANEXOS}</NajText>
							</View>
						</View>

						<RectButton
							style={styles.button}
							onPress={() =>
								navigateAttachmentProcessList(item.CODIGO_PROCESSO)
							}
						>
						<MaterialIcon size={24} color="#000" name="arrow-forward" />
						</RectButton>
					</View>
				</>
				)}
				<View />
			</View>
		</View>
		);
	}

	function getItemSeparatorComponent() {
		return <View style={styles.itemSeparator} />;
	}

	return (
		<>
			<FlatList
				{...rest}
				data={data}
				keyExtractor={({ CODIGO_PROCESSO }) => String(CODIGO_PROCESSO)}
				renderItem={({ item, index }) => handleRenderItem(item, index)}
				ItemSeparatorComponent={getItemSeparatorComponent}
			/>
		</>
	);
}
