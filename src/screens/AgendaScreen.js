import React from 'react';
import {View, Alert, ActivityIndicator} from 'react-native';
import {Agenda} from 'react-native-calendars';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import ADVService from '../services/adv';

// components
import NajContainer from '../components/NajContainer';
import NajText from '../components/NajText';
import EmptyList from '../components/EmptyList';

// styles
import styles from './styles/agenda';

export default function AgendaScreen() {
  const [loading, setLoading] = React.useState(true);
  const [dates, setDates] = React.useState({});
  const [dayPressed, setDayPressed] = React.useState(moment().format('Y-M-D'));
  const [hasLoadedAll, setHasLoadedAll] = React.useState(false);
  const [selectedDateTitle, setSelectedDateTitle] = React.useState(
    `${moment().format('MMMM')} ${moment().format('YYYY')}`,
  );

  async function makeRequest() {
    let data = [];

    try {
      const {data: res} = await ADVService.get('/api/v1/app/agenda/todos');

      data = res.naj.resultado;
    } catch (err) {
      Alert.alert('Erro', err.message);
    }

    setHasLoadedAll(true);
    setLoading(false);

    return data;
  }

  async function loadItems(day) {
    if (hasLoadedAll) {
      return;
    }

    const reqResult = await makeRequest();

    const _newDates = {};
    const newDates = {};

    // extraindo as datas
    reqResult.forEach(it => (_newDates[it.DATA] = []));

    // extraindo as atividades
    Object.keys(_newDates).forEach(_date => {
      newDates[formatDateToAgenda(_date)] = reqResult.filter(
        it => it.DATA === _date,
      );
    });

    setDates(newDates);
  }

  function formatDateToAgenda(date) {
    const _date = date.split('/');
    return `${_date[2]}-${_date[1]}-${_date[0]}`;
  }

  function formatHour(hour) {
    const _hour = hour.split(':');
    return `${_hour[0]}:${_hour[1]}`;
  }

  function renderItem(item) {
    /*
    item.NUMERO_PROCESSO = '0800882-81.2013.8.24.0113/0002';
    item.CLASSE = 'Indidente de desconsideração de personalidade';
    item.CARTORIO = '2°Vara Cível';
    item.COMARCA = 'Camboriú';
    item.COMARCA_UF = 'SC';
    */
    const itemDate = formatDateToAgenda(item.DATA);

    if (itemDate !== dayPressed) {
      return <View />;
    }

    return (
      <View style={styles.item}>
        <NajText style={styles.itemTitle}>{item.ASSUNTO}</NajText>
        <View style={styles.itemRow}>
          <View style={[styles.itemRow, styles.timeWrapper]}>
            <MaterialIcon
              style={styles.timeIcon}
              size={16}
              name="access-time"
              color="#111"
            />
            <NajText>{formatHour(item.HORA)}</NajText>
          </View>
          <NajText style={{flex: 1}}>{item.LOCAL}</NajText>
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
      </View>
    );
  }

  function onDayPress({dateString}) {
    const date = moment(dateString);
    const month = date.format('MMMM');
    const year = date.format('Y');

    setSelectedDateTitle(`${month} ${year}`);
    setDayPressed(dateString);
  }

  function renderEmptyDate() {
    return <EmptyList text="Nenhum registro encontrado" />;
  }

  function rowHasChanged(r1, r2) {
    return r1.ID_COMPROMISSO !== r2.ID_COMPROMISSO;
  }

  return (
    <NajContainer style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#2F9FD1" animating size="large" />
        </View>
      )}
      <View style={{padding: 10, backgroundColor: '#fff'}}>
        <NajText
          style={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
          {selectedDateTitle}
        </NajText>
      </View>
      <Agenda
        //testID={testIDs.agenda.CONTAINER}
        items={dates}
        loadItemsForMonth={loadItems}
        selected={moment().format('YYYY-MM-DD')}
        renderItem={renderItem}
        renderDay={() => <View />}
        renderEmptyDate={renderEmptyDate}
        renderEmptyData={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        refreshing={false}
        refreshControl={null}
        onDayPress={onDayPress}
        theme={{agendaKnobColor: '#2F9FD1'}}
      />
    </NajContainer>
  );
}
