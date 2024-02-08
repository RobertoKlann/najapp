import React, { useEffect } from 'react'
import { Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system'
import ADVService from '../src/services/adv'
import Router from '../src/routes'

import { loadPesquisasAction } from '../src/store/modules/auth/actions'
import { setLastReceived } from './store/modules/notification/actions';

import '../src/utils/setYup'
import '../src/utils/calendar'

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

export default function App() {
	const dispatch = useDispatch()
	const adv = useSelector((state) => state.auth.adv)
	const user = useSelector((state) => state.auth.user)

	const [expoPushToken, setExpoPushToken] = React.useState('')
	const [notification, setNotification] = React.useState(false)
	const notificationListener = React.useRef()
	const responseListener = React.useRef()

	useEffect(() => {
		registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
			setNotification({...notification.request});

			dispatch(setLastReceived({...notification.request}));
		});

		responseListener.current = Notifications.addNotificationResponseReceivedListener(notification => {
			const res = notification.notification.request.content.data;
			const dataAction = res?.action;

			if (dataAction && dataAction == '@ACT/new_message') {
				dispatch(setLastReceived({ ...res, action: '@ACT/open_chat' }));
				return;
			}

			const actions = [
				'@ACT/open_to_pay',
				'@ACT/open_to_receive',
				'@ACT/open_process_activities',
				'@ACT/open_activities',
				'@ACT/open_events',
			];

			if (dataAction && actions.indexOf(dataAction) > -1) {
				dispatch(setLastReceived({ ...res }));
			}
		});

		return () => {
			Notifications.removeNotificationSubscription(notificationListener.current);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
  }, [])


	async function monitora() {
		try {
			await ADVService.get(`/api/v1/app/monitoraHome`)
		} catch (err) {
		/* console.tron.log(err); */
		}
	}

  async function checkFolderExists() {
    const folderPath = `${FileSystem.documentDirectory}/logos`
    const dirInfo = await FileSystem.getInfoAsync(folderPath)

    if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true })
  }

  async function loadPesquisas() {
    let _pesquisas = []
    let newPesquisas = []

    try {
      _pesquisas = await AsyncStorage.getItem(`@NAJ_AC/pesquisa_${adv.codigo}`)
      _pesquisas = JSON.parse(_pesquisas)
    } catch (_e) {
      _pesquisas = []
    }

    if (!_pesquisas) {
      _pesquisas = []
    }

    try {
      const res = await ADVService.get('api/v1/app/pesquisas')

      const { data } = res

      data.resultado.forEach((p) => {
        let pesq = _pesquisas.find((_p) => String(_p.id) == String(p.id))
        if (pesq && String(pesq.respondido) == 'N') {
          let _item = {
            ...p,
            count: pesq.count
          }
          newPesquisas.push(_item)
        }

        // se não existe, a gente cadastra
        if (!pesq) {
          let newP = { ...p, respondido: 'N', count: 0 }
          newPesquisas.push(newP)
          _pesquisas.push(newP)
        }
      })

      await AsyncStorage.setItem(`@NAJ_AC/pesquisa_${adv.codigo}`, JSON.stringify(_pesquisas))
    } catch (err) {}

    dispatch(loadPesquisasAction(newPesquisas))
  }

  useEffect(() => {
    setTimeout(() => {
      if (adv?.url_base) {
        ADVService.defaults.baseURL = adv.url_base

        if (user) monitora()

        loadPesquisas()
      }
    }, 2000)

    checkFolderExists()

    return () => {}
  }, [])

  return <Router />
}

async function registerForPushNotificationsAsync() {
  let token

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted')
    return alert('Ops, ocorreu uma falha ao criar o token para notificações pusher!');

  token = (await Notifications.getExpoPushTokenAsync()).data;

  let pusherId = await AsyncStorage.getItem('@NAJ_AC/pusher_id')

  if (!pusherId)
    AsyncStorage.setItem('@NAJ_AC/pusher_id', token)

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
