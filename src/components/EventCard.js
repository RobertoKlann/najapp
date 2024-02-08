import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { colors, metrics } from '../globals';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ToastAndroid } from 'react-native';

import * as Animatable from 'react-native-animatable';

import ADVService from '../services/adv';

// components
import NajText from '../components/NajText';
import EmptyList from '../components/EmptyList';

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity)

export default function EventCard() {
	const weekNames = [
		'Segunda',
		'Terça',
		'Quarta',
		'Quinta',
		'Sexta',
		'Sábado',
		'Domingo',
	]
	
	const monthNames = [
		'Janeiro',
		'Fevereiro',
		'Março',
		'Abril',
		'Maio',
		'Junho',
		'Julho',
		'Agosto',
		'Setembro',
		'Outubro',
		'Novembro',
		'Dezembro',
	]
	const [totalEvents, setTotalEvents] = React.useState('0');

	const auth = useSelector(state => state.auth);
	const navigation = useNavigation();
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = React.useState(true);
	const [refreshing, setRefreshing] = React.useState(false);
	const [loadingMore, setLoadingMore] = React.useState(false);
	const [hasLoadedAll, setHasLoadedAll] = React.useState(false);
	const [longTextItems, setLongTextItems] = React.useState([]);
	const [chatId, setChatId] = React.useState(-1);
	const [data, setData] = React.useState([]);

   	const alertButton = [{
     	text: 'Ok',
		onPress: () => navigation.goBack(),
   	}];

    const alertOptions = { cancelable: false };

  	function handleRefresh() {
    	setRefreshing(true);

	    handleLoadData(true);

    	setHasLoadedAll(false);

    	setRefreshing(false);
  	}

	function handleNavigateAgenda() {
		navigation.navigate('NewEvent');
	}

	async function handleLoadData(refresh = false) {
		try {
			const response = await ADVService.get(
				`/api/v1/app/agenda/eventos?filterTypeEvent=true&filterDateEvent=true`,
			);

			// return console.tron.log(response.data.naj.total);

			setTotalEvents(response.data.naj.total);

			const newResultado = response.data.naj.resultado.map(it => ({
				...it,
				numberOfLines: 5,
			}));

			setData(newResultado);
			setHasLoadedAll(true);
		} catch (err) {
			ToastAndroid.show("Ops, não foi possível buscar os eventos, tente novamente mais tarde.", ToastAndroid.SHORT)
		}

		setLoading(false);
	}

	const onTextLayoutDesc = React.useCallback((e, item, _data) => {
		if (_data.length === 0) {
		  	return;
		}
	
		const exists = longTextItems.find(ID_COMPROMISSO => ID_COMPROMISSO === item.ID_COMPROMISSO);
	
		let newData = longTextItems;
	
		if (!exists && e.nativeEvent.lines.length > 5) {
			newData.push(item.ID_COMPROMISSO);
			setLongTextItems(newData);
		
			let newDescricao = item.ASSUNTO.split(e.nativeEvent.lines[4].text)[0];
		
			item.DESCRICAO_ABR = `${newDescricao.slice(0, newDescricao.length - 10)}... `;
			item.isLongText = true;
		
			newDataItems = _data.map(_item => {
				if (_item.ID_COMPROMISSO === item.ID_COMPROMISSO)
					return item;
		
				return _item;
			});
		
			setData(newDataItems);
		}
	}, []);

	function handleRenderItem({ item, index }) {
		const dateFormat = new Date(`${item.DATA.split('/')[2]}/${item.DATA.split('/')[1]}/${item.DATA.split('/')[0]}`)

        let month = dateFormat
        month = monthNames[month.getMonth()]

        let year = getDateProperties(dateFormat).year
        let day = getDateProperties(dateFormat).day

        let dayWeek = dateFormat

        let week = dayWeek.getDay()

        if (week == 0)
            dayWeek = weekNames[week]
        else
            dayWeek = weekNames[week - 1]

        let eventSubTitle = ''

        if (item.NUMERO_PROCESSO)
			eventSubTitle = `${item.NOME_CLIENTE} X ${item.PARTE_CONTRARIA}`

		// console.tron.log(item);
		return (
			<View style={styles.rowStriped}>
				<View style={styles.colDayCalendar}>
					<NajText style={styles.textDayCalendar}>{ day } - { month } / { year }</NajText>
				</View>
				<View style={styles.colInfoCalendar}>					
					<NajText style={styles.titleEvent} numberOfLines={2}>
						<MaterialCommunityIcon size={24} color="#000" name="account" />
						{''} { item.RESPONSAVEL }
					</NajText>
					{(
						item.NUMERO_PROCESSO
						&&
						<NajText style={styles.subTitleEvent} numberOfLines={2}>
							{ eventSubTitle }
						</NajText>
					)}
					<NajText style={styles.itemsData} numberOfLines={2}>
						<MaterialCommunityIcon size={24} color="#000" name="calendar" />
						{''} { dayWeek }

						{'   '}
						<MaterialCommunityIcon size={24} color="#000" name="clock" />
						{''} { item.HORA }

						{'  '}
						<MaterialCommunityIcon size={24} color="#000" name="map-marker" />
						{ item.LOCAL }
					</NajText>
					<View style={styles.itemAssunto}>
						<TouchableOpacity
							activeOpacity={1}
							onPress={() => {
								if (!item.isLongText) {
									return;
								}

								const newData = data.map(_item => {
									if (_item.ID_COMPROMISSO === item.ID_COMPROMISSO) {
										return { ..._item, opened: !_item.opened };
									}

									return _item;
								});
								setData(newData);
							}}>
							<NajText numberOfLines={0} onTextLayout={e => onTextLayoutDesc(e, item, data)}>
								{(item.isLongText && !item.opened) && item.DESCRICAO_ABR || item.ASSUNTO}
								{(longTextItems.indexOf(item.ID_COMPROMISSO) > -1 && !item.opened) && (
								<NajText>
									<MaterialCommunityIcon size={18} name="arrow-down-circle" color="#111" />
								</NajText>
								)}
							</NajText>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}

	function getDateProperties(date = null){
		if(!date)
			date = new Date();

		object = {};
		object.year              = date.getFullYear();
		object.month             = ((date.getMonth() + 1) < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
		object.day               = (date.getDate() < 10) ? '0' + date.getDate(): date.getDate();
		object.fullDate          = `${object.year}-${object.month}-${object.day}`;
		object.milliseconds      = date.getTime();
		object.hour              = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
		object.minutes           = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();
		object.seconds           = (date.getSeconds() < 10) ? `0${date.getSeconds()}` : date.getSeconds();
		object.fullTime          = `${object.hour}:${object.minutes}:${object.seconds}`;
		object.fullDateTimeSlash = object.fullDateSlash + ' ' + object.fullTime;
		object.getYear = function(){
			return this.year;
		};
		object.getMonth = function(){
			return this.month;
		};
		object.getDay = function(){
			return this.day;
		};
		object.getFullDate = function(){
			return this.fullDate;
		};
		object.getHour = function(){
			return this.hour;
		};
		object.getMinutes = function(){
			return this.minutes;
		};
		object.getSeconds = function(){
			return this.seconds;
		};
		
		return object;
	}

	React.useEffect(() => {
		if (auth?.dashboard?.chat_info?.id_chat) {
			setChatId(auth.dashboard.chat_info.id_chat);
		}
	}, [auth]);

	React.useEffect(() => {
		handleRefresh();
	}, []);

	return (
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
						fontSize: 16,
					}}>
					Próximos Eventos ({totalEvents})
				</NajText>
				<AnimatedBtn
					style={styles.fab}
					animation="bounceIn"
					useNativeDriver
					duration={1500}
					onPress={handleNavigateAgenda}>
					<Text style={styles.buttonAdd}>
						<MaterialIcon size={24} color="#fff" name="add" onTextLayout="Novo" />
						
					</Text>
				</AnimatedBtn>
			</View>

			<FlatList
				data={data}
				keyExtractor={({ ID_COMPROMISSO }) => String(ID_COMPROMISSO)}
				renderItem={handleRenderItem}
				// onEndReached={handleLoadMore}
				// ItemSeparatorComponent={getItemSeparatorComponent}
				// onEndReachedThreshold={0.5}
				// ListFooterComponent={handleRenderFooter}
				initialNumToRender={20}
				ListEmptyComponent={() => (
					<EmptyList text="Nenhum evento foi encontrado" />
				)}
			/>
		</>
	);
}

// styles
const styles = StyleSheet.create({
    row: {
        width: '100%',
    },
    card: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    columnDayInfoCalendar: {
        width: '100%',
        backgroundColor: '#fff',
        marginTop: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    textDay: {
        fontSize: 28,
        paddingTop: 5,
        width: '100%',
        backgroundColor: '#1e87f0',
        color: '#fff',
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    buttonAdd: {
        textAlignVertical: 'center',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
    },
    btnVoltar: {
        color: '#fff',
		fontSize: 20,
    },
    fabVoltar: {
        width: 200,
        height: 45,
        backgroundColor: '#1e87f0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        left: '25%',
        color: '#fff',
        elevation: 2,
        zIndex: 9,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
        	width: 1,
          	height: 3
        },
		position: 'absolute',
		bottom: 50
    },
    fab: {
        marginVertical: 5,
        position: 'absolute',
        width: 45,
        height: 45,
        backgroundColor: '#1e87f0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        right: 25,
        color: '#fff',
        elevation: 2,
        zIndex: 9,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
        	width: 1,
          	height: 3
        }
	},
	container: {
		backgroundColor: colors.background,
		flex: 1,
	},
	loadingContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 9,
		backgroundColor: '#fff',
		width: metrics.screen.width,
		height: metrics.screen.height,
		alignItems: 'center',
		paddingTop: 50,
	},
	buttonWrapper: {
		paddingHorizontal: 15,
		paddingBottom: 30,
	},
	modal: {
		flex: 1,
		backgroundColor: '#fff',
		marginVertical: 20,
	},
	modalHeader: {
		fontSize: 16,
		fontWeight: 'bold',
		paddingTop: 15,
		paddingBottom: 30,
		paddingHorizontal: 15,
	},
	rowStriped: {
		marginVertical: 5,
		paddingHorizontal: 10,
	},
	colDayCalendar: {
		paddingHorizontal: 15,
		backgroundColor: '#1e87f0',
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	textDayCalendar: {
		textAlign: 'center',
		fontSize: 24,
		color: '#fff',
	},
	colInfoCalendar: {
		fontSize: 16,
		paddingHorizontal: 5,
		paddingVertical: 10,
		backgroundColor: '#fff',
	},
	subTitleEvent: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	titleEvent: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	itemResponsavel: {
		marginLeft: 50,
	},
	itemsData: {
		fontSize: 14,
		marginTop: 5,
		lineHeight: 24,
	},
	itemsLocal: {
		marginTop: 5,
	},
	itemAssunto: {
		marginTop: 5,
		borderTopWidth: 1,
		borderTopColor: '#c1c1c1',
		padding: 10
	}
});