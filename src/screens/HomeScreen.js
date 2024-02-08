import React from 'react'
import { Alert, View, ActivityIndicator, Modal, TextInput, ToastAndroid } from 'react-native'
import { RectButton, ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons, MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import Image from 'react-native-scalable-image'
import * as Animatable from 'react-native-animatable'
import * as FileSystem from 'expo-file-system'
// import Slider from 'react-native-slider'
import AsyncStorage from '@react-native-async-storage/async-storage'

import ADVService from '../services/adv'
import CPanelService from '../services/cpanel'
import { changeAdv, signOut } from '../store/modules/auth/actions'
import getUserInfo from '../utils/getUserInfo'

import { clearLastReceived } from '../store/modules/notification/actions'
import { loadPesquisasAction } from '../store/modules/auth/actions'
import { applyMoneyMask } from '../utils/masks'
import { refreshLogoAfter30Days } from '../utils/logo'

// components
import NajContainer from '../components/NajContainer'
import NajText from '../components/NajText'
import NajButton from '../components/NajButton'
import HomeCard from '../components/HomeCard'
import EmptyList from '../components/EmptyList'

//styles
import styles from './styles/home'
import { colors, getWidthPerCent } from '../globals'

const defaultAdvLogo = require('../assets/images/advlogo.png')

export default function HomeScreen() {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const auth = useSelector((state) => state.auth)
  const lastNotification = useSelector((state) => state.notification)
  const isFocused = useIsFocused()

  const [modalPesquisaVisibleNps, setModalPesquisaVisibleNps] = React.useState(false)
  const [loadingPergunta, setLoadingPergunta] = React.useState(false)
  const [valuePesquisaNps, setValuePesquisaNps] = React.useState(0)
  const [valueMotivoPesquisaNps, setValueMotivoPesquisaNps] = React.useState('')
  const [pesquisas, setPesquisas] = React.useState([])
  const [currentPesquisa, setCurrentPesquisa] = React.useState({
    id: -1,
    pergunta: '',
    range_max: 10,
    range_min_info: '',
    range_max_info: ''
  })
  const [advLogo, setAdvLogo] = React.useState(false)
  const [allLogos, setAllLogos] = React.useState([])
  const [logoFile, setLogoFile] = React.useState({ exists: false, file: null, loading: true })
  const [toPayValue, setToPayValue] = React.useState(0)
  const [toPayValueFinished, setToPayValueFinished] = React.useState(0)
  const [toReceiveValue, setToReceiveValue] = React.useState(0)
  const [homeInfo, setHomeInfo] = React.useState({})
  const [toReceiveValueFinished, setToReceiveValueFinished] = React.useState(0)
  const [isSelectedAdv, setIsSelectedAdv] = React.useState(false)
  const [loadChatAnimation, setLoadChatAnimation] = React.useState(false)
  const [isFistTimeLoadingThis, setIsFistTimeLoadingThis] = React.useState(true)
  const [loading, setLoading] = React.useState(true)
  const [hasChangedAdvByNotification, setHasChangedAdvByNotification] = React.useState(false)

  // badges
  const [notReadMessages, setNotReadMessages] = React.useState(0)
  const [readMessages, setReadMessages] = React.useState(0)
  const [totalAtivities, setTotalAtivities] = React.useState(0)
  const [monthAtivities, setMonthAtivities] = React.useState(0)
  const [totalProcess, setTotalProcess] = React.useState(0)
  const [totalProcess30Days, setTotalProcess30Days] = React.useState(0)
  const [totalEvents, setTotalEvents] = React.useState(0)

  async function monitora(rotina) {
    try {
      await ADVService.get(`/api/v1/app/${rotina}/monitora`)
    } catch (err) {}
  }

  function handleNavigateAdvChoice() {
    navigation.navigate('AdvChoiceScreen')
  }

  function handleNavigateChat() {
    monitora('chat')

    navigation.navigate('Chat')
  }

  function handleNavigateFinance(screenName) {
    monitora('financeiro')

    const values = {
      toPayValue,
      toPayValueFinished,
      toReceiveValue,
      toReceiveValueFinished
    }

    navigation.navigate('Finance', { screen: screenName, values })
  }

  function handleNavigateAgenda() {
    monitora('agenda')

    navigation.navigate('Agenda')
  }

  function handleNavigateActivities() {
    monitora('atividades')

    navigation.navigate('Activities')
  }

  function handleNavigateAttendance() {
    monitora('chat')

    setNotReadMessages(0)
    navigation.navigate('Chat')
  }

  function handleNavigateProcess() {
    monitora('processos')

    navigation.navigate('Process')
  }

  function getUserName() {
    if (auth.user?.apelido && auth.user.apelido) {
      return auth.user.apelido
    }

    return auth.user.nome
  }

  function getUrlBase() {
    if (__DEV__) return 'http://192.168.0.107:8000/'

    const url = String(auth.adv.url_base).replace(/\/+$/, '')
    let ext = '/naj-adv-web/public/'

    if (url.indexOf('naj-adv-web/public') > -1) {
      ext = '/'
    }

    return url + ext
  }

  async function loadDashboard(useDefault = true) {
    let hasError = false
    let errorMessage = ''
    let ext = ''

    try {
      const _urlBase = useDefault ? '' : getUrlBase()
      const deviceData = await getUserInfo()

      const res = await ADVService.post(`${_urlBase}api/v1/app/home`, {
        chat_id: auth.dashboard.chat_info.id_chat,
        device: deviceData
      }).catch(err => console.log({...err}))

      const { data } = res

      if (String(data.status_code) !== '200') {
        errorMessage = data?.naj?.mensagem || ''
        hasError = true
      } else {
        const primeiro_acesso = String(data.naj.primeiro_acesso) === '1'

        // mensagens
        setNotReadMessages(data.naj.mensagens.nao_lidas)
        setReadMessages(data.naj.mensagens.total)

        // atividades
        setTotalAtivities(data.naj.atividades.total)
        setMonthAtivities(data.naj.atividades.mes_atual)

        // processos
        setTotalProcess(data.naj.processos.total)
        setTotalProcess30Days(data.naj.processos?.trinta_dias || 0)

        // eventos
        setTotalEvents(data.naj.eventos.total)

        // a pagor
        setToPayValue(data.naj.valor_pagar.finalizado)
        setToPayValueFinished(data.naj.valor_pagar.aberto)

        // a receber
        setToReceiveValue(data.naj.valor_receber.finalizado)
        setToReceiveValueFinished(data.naj.valor_receber.aberto)

        // resto
        setHomeInfo({ ...homeInfo, primeiro_acesso })

        // animação...
        if (data.naj.mensagens.total == 0 && data.naj.atividades.total == 0 && data.naj.processos.total == 0) {
          setLoadChatAnimation(true)
        } else {
          setLoadChatAnimation(false)
        }
      }
    } catch (err) {
      hasError = true

      if (__DEV__) {
        ext = err.message
      }
    }

    if (hasError) {
      if (errorMessage != 'desativado') {
        ToastAndroid.show('Ops, não foi possível buscar os dados!', ToastAndroid.SHORT)
        // Alert.alert('Atenção', 'Houve um erro ao executar a requisição.');
      } else {
        Alert.alert('Atenção', 'Esse dispositivo está desativado.', [
          { text: 'OK', onPress: () => dispatch(signOut()) }
        ])
      }
    }

    setLoading(false)
  }

  function getAdvLogo() {
    // if (logoFile.exists) {
    //   const currentLogo = allLogos.find((_logo) => _logo.advCodigo == auth.adv.codigo)

    //   let path = currentLogo.path.replace('//', '/')

    //   if (currentLogo) {
    //     return (
    //       <View style={styles.advLogoContainer}>
    //         <Image source={{ uri: currentLogo.path.replace('//', '/') }} style={styles.advLogo} width={getWidthPerCent(50)} />
    //       </View>
    //     )
    //   }
    // }

    return (
      <View style={styles.advLogoContainer}>
        <Image source={defaultAdvLogo} style={styles.advLogo} width={getWidthPerCent(50)} />
      </View>
    )
  }

  async function loadAllLogoFiles() {
    const advFolders = await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}/logos`)
    const advLogoFiles = []

    for (let i = 0; i < advFolders.length; i++) {
      const advLogoFolder = await FileSystem.readDirectoryAsync(
        `${FileSystem.documentDirectory}/logos/${advFolders[i]}`
      )

      if (advLogoFolder.length > 0)
        advLogoFiles.push({
          advCodigo: advFolders[i],
          path: `${FileSystem.documentDirectory}/logos/${advFolders[i]}/${advLogoFolder[0]}`
        })
    }

    setAllLogos(advLogoFiles)

    return advLogoFiles
  }

  async function loadLogoFile(data = false) {
    let _allLogos = allLogos

    if (_allLogos == 0) _allLogos = await loadAllLogoFiles()

    const _adv = data ? data : auth.adv

    if (!_adv) {
      setLogoFile({ exists: false, loading: true })
      return
    }

    const existe = _allLogos.find((_logo) => _logo.advCodigo == _adv.codigo)

    if (!existe) {
      setLogoFile({ exists: false, loading: false })
      return
    }

    setLogoFile({ exists: true })
  }

  function handleNavigateToPay() {
    handleNavigateFinance('ToPay')
  }

  function handleNavigateToReceive() {
    handleNavigateFinance('ToReceive')
  }

  function handleNavigateProcessActivities(processId) {
    monitora('processos')

    navigation.navigate('ProcessActivitiesList', { id: processId })
  }

  async function refreshVisualizacaoPesquisa() {
    try {
      await ADVService.get(`/api/v1/app/pesquisas/refresh/${currentPesquisa.id}`)
    } catch (er) {}
  }

  React.useEffect(() => {
    setTimeout(() => {
      if (auth.pesquisas.length > 0) {
        setCurrentPesquisa(auth.pesquisas[0])
        setModalPesquisaVisibleNps(true)
      } else {
        setModalPesquisaVisibleNps(false)
      }
    }, 3500)
  }, [auth.pesquisas])

  React.useEffect(() => {
    if (currentPesquisa.id != -1) {
      refreshVisualizacaoPesquisa()
    }
  }, [currentPesquisa])

  React.useEffect(() => {
    if (isFocused && isSelectedAdv && auth?.dashboard?.chat_info?.id_chat) {
      loadAllLogoFiles()
      loadDashboard()
      loadLogoFile()
    } else {
      setLoading(false)
    }
  }, [isFocused])

  React.useEffect(() => {
    if (isFocused && isSelectedAdv && auth?.dashboard?.chat_info?.id_chat) loadDashboard()
  }, [auth.dashboard])

  React.useEffect(() => {
    // recarregar a logo
    if (auth.adv?.codigo && logoFile.advCodigo !== auth.adv.codigo) {
      loadAllLogoFiles()
      loadLogoFile()
    }

    // veio da notificação
    if (auth.adv?.codigo && hasChangedAdvByNotification) {
      setHasChangedAdvByNotification(false)
      handleNavigateChat()
    }
  }, [auth.adv])

  React.useEffect(() => {
    if (auth.adv) {
      setIsSelectedAdv(true)

      if (auth?.dashboard?.chat_info?.id_chat) {
        loadDashboard(false)
      }
    }
  }, [auth])

  React.useEffect(() => {
    dispatch(clearLastReceived())

    let isSameAdv = false

    if (lastNotification?.lastReceived?.message?.id_cliente)
      isSameAdv = auth?.adv?.codigo == lastNotification.lastReceived.message.id_cliente

    // é o mesmo usuário
    let isSameUser = false

    if (lastNotification?.lastReceived?.message?.id_usuario_receber)
      isSameUser = auth?.user?.id == lastNotification.lastReceived.message.id_usuario_receber

    let processId = lastNotification?.lastReceived?.message?.id_processo

    if (lastNotification?.lastAction === '@ACT/open_to_pay' && isSameAdv && isSameUser) {
      // abre a tabela do financeiro 'A PAGAR'
      handleNavigateToPay()
    } else if (lastNotification?.lastAction === '@ACT/open_to_receive' && isSameAdv && isSameUser) {
      // abre a tabela do financeiro 'A RECEBER'
      handleNavigateToReceive()
    } else if (
      lastNotification?.lastAction === '@ACT/open_process_activities' &&
      isSameAdv &&
      isSameUser &&
      processId
    ) {
      // abre a tabela de 'ATIVIDADES DO PROCESSO'
      handleNavigateProcessActivities(processId)
    } else if (lastNotification?.lastAction === '@ACT/open_activities' && isSameAdv && isSameUser) {
      // abre a tabela de 'ATIVIDADES'
      handleNavigateActivities()
    } else if (lastNotification?.lastAction === '@ACT/open_events' && isSameAdv && isSameUser) {
      // abre a tabela de 'AGENDAMENTOS'
      handleNavigateAgenda()
    } else if (lastNotification?.lastAction === '@ACT/release_adv' && isSameUser) {
      handleNavigateAdvChoice()
    } else if (lastNotification?.lastAction === '@ACT/new_message' && isSameAdv && isSameUser) {
      setNotReadMessages(notReadMessages + 1)
      setReadMessages(readMessages + 1)
    } else if (lastNotification?.lastAction === '@ACT/reload_messages' && isSameAdv && isSameUser) {
      setNotReadMessages(notReadMessages + 1)
      setReadMessages(readMessages + 1)
    } else if (lastNotification?.lastAction === '@ACT/open_chat' && auth?.adv?.codigo && isSameUser) {
      const { message } = lastNotification.lastReceived

      if (message.id_cliente == auth.adv.codigo) handleNavigateChat()
      else if (message.id_cliente) tryLoadAnAdv(message.id_cliente)
    }

    const acts = ['@ACT/open_chat']

    if (
      lastNotification?.lastAction &&
      auth?.user?.id &&
      acts.indexOf(lastNotification.lastAction) > -1 &&
      !isSameUser
    ) {
      const { message } = lastNotification.lastReceived
      //Alert.alert('Atenção', `Esta mensagem foi enviada para: ${message.apelido || message.nome}.`);
      ToastAndroid.show(
        'Esta mensagem foi enviada para outra pessoa que utiliza este mesmo dispositivo!',
        ToastAndroid.SHORT
      )
    }
  }, [lastNotification])

  React.useEffect(() => {
    loadAllLogoFiles()
    loadLogoFile()

    const initialRoute = auth.adv ? 'AuthTab' : 'AdvChoiceScreen'

    if (initialRoute === 'AuthTab') {
      refreshLogoAfter30Days(auth.adv)
      setIsSelectedAdv(true)
      loadDashboard(false)
    } else {
      setLoading(false)
    }
  }, [])

  function getBadgeMessageContainer() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <NajText
          style={{
            fontSize: 12,
            color: '#000',
            paddingHorizontal: 6,
            paddingVertical: 2,
            fontWeight: 'bold',
            paddingRight: 15
          }}
        >
          {readMessages}
        </NajText>
        {notReadMessages > 0 && (
          <NajText
            style={{
              backgroundColor: '#d00',
              fontSize: 12,
              color: '#fff',
              textAlign: 'center',
              paddingVertical: 2,
              fontWeight: 'bold',
              paddingHorizontal: 6,
              borderRadius: 50
            }}
          >
            {notReadMessages}
          </NajText>
        )}
      </View>
    )
  }

  function getBadgeProcessContainer() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <NajText
          style={{
            fontSize: 12,
            color: '#000',
            paddingHorizontal: 6,
            paddingVertical: 2,
            fontWeight: 'bold',
            paddingRight: 15
          }}
        >
          {totalProcess}
        </NajText>
        {totalProcess30Days > 0 && (
          <NajText
            style={{
              backgroundColor: '#d00',
              fontSize: 12,
              color: '#fff',
              textAlign: 'center',
              paddingVertical: 2,
              paddingHorizontal: 6,
              borderRadius: 50,
              fontWeight: 'bold'
            }}
          >
            {totalProcess30Days}
          </NajText>
        )}
      </View>
    )
  }

  function getBadgeEventContainer() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <NajText
          style={{
            backgroundColor: '#fff',
            fontSize: 12,
            color: '#000',
            textAlign: 'center',
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 50,
            fontWeight: 'bold'
          }}
        >
          {totalEvents}
        </NajText>
      </View>
    )
  }

  function getBadgeActivitiesContainer() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <NajText
          style={{
            fontSize: 12,
            color: '#000',
            paddingHorizontal: 6,
            paddingVertical: 2,
            fontWeight: 'bold',
            paddingRight: 15
          }}
        >
          {totalAtivities}
        </NajText>
        {monthAtivities > 0 && (
          <NajText
            style={{
              backgroundColor: '#d00',
              fontSize: 12,
              color: '#fff',
              textAlign: 'center',
              paddingVertical: 2,
              paddingHorizontal: 6,
              borderRadius: 50,
              fontWeight: 'bold'
            }}
          >
            {monthAtivities}
          </NajText>
        )}
      </View>
    )
  }

  function getBadgeContainer(text) {
    return <NajText style={{ fontSize: 12, color: '#000', fontWeight: 'bold' }}>{text}</NajText>
  }

  function getModalPesquisaNps() {
    let notas = []

    for (let i = 0; i <= currentPesquisa.range_max; i++) notas.push(` ${i} `)

    const _pergunta = currentPesquisa.pergunta
      .replace(/{(apelido|APELIDO|Apelido)}/, auth.user.apelido)
      .replace(/{(nome|NOME|Nome)}/, auth.user.nome)

    return (
      <Modal animationType="slide" visible={modalPesquisaVisibleNps}>
        <ScrollView>
          <View style={{ padding: 15, paddingTop: 50, backgroundColor: '#2F323E' }}>
            <NajText style={{ color: '#fff', fontSize: 16 }}>{_pergunta}</NajText>
          </View>
          <View style={{ padding: 15, marginTop: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {notas.map((nota) => (
                <NajText key={String(nota)}>{nota}</NajText>
              ))}
              {}
            </View>
            {/* <Slider
              value={valuePesquisaNps}
              onValueChange={(_valuePesquisaNps) => setValuePesquisaNps(_valuePesquisaNps)}
              minimumValue={0}
              maximumValue={currentPesquisa.range_max}
              trackStyle={{ backgroundColor: 'rgba(0, 0, 0, .15)' }}
              minimumTrackTintColor="#2F9FD1"
              thumbStyle={{ backgroundColor: '#2F9FD1', width: 25, height: 25, borderRadius: 25, elevation: 10 }}
              step={1}
            /> */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <NajText style={{ color: 'rgba(0, 0, 0, .8)' }}>
                {currentPesquisa.range_min_info || 'Muito Improvável'}
              </NajText>
              <NajText style={{ color: 'rgba(0, 0, 0, .8)' }}>
                {currentPesquisa.range_max_info || 'Muito Provável'}
              </NajText>
            </View>

            <View>
              <TextInput
                value={valueMotivoPesquisaNps}
                onChangeText={(_valueMotivoPesquisaNps) => setValueMotivoPesquisaNps(_valueMotivoPesquisaNps)}
                style={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, .5)', borderRadius: 3, marginTop: 20 }}
                multiline
                numberOfLines={4}
                editable
                placeholder="Qual o principal motivo para a sua nota?"
              />
            </View>
          </View>

          <View style={{ flex: 1 }} />
        </ScrollView>
        <View style={{ flexDirection: 'row', padding: 15, justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <NajButton
              inModal={true}
              onPress={async () => {
                // o cara não respondeu
                if (loadingPergunta) return

                setLoadingPergunta(true)

                let _pesquisas = []
                let newPesquisas = []

                try {
                  _pesquisas = await AsyncStorage.getItem(`@NAJ_AC/pesquisa_${auth.adv.codigo}`)
                  _pesquisas = JSON.parse(_pesquisas)

                  if (_pesquisas && _pesquisas.find(({ id: pId }) => String(currentPesquisa.id) == String(pId))) {
                    _pesquisas.forEach((pn) => {
                      if (String(currentPesquisa.id) == String(pn.id)) {
                        newPesquisas.push({ ...pn, respondido: 'N', count: pn.count + 1 })
                      } else {
                        newPesquisas.push(pn)
                      }
                    })
                  } else {
                    if (_pesquisas && _pesquisas.length > 0) {
                      newPesquisas = _pesquisas
                    }

                    newPesquisas.push({ ...currentPesquisa, respondido: 'N', count: 1 })
                  }

                  await AsyncStorage.setItem(`@NAJ_AC/pesquisa_${auth.adv.codigo}`, JSON.stringify(newPesquisas))
                } catch (_e) {}

                // requisição
                try {
                  await ADVService.post(`/api/v1/app/pesquisas/recusado/${currentPesquisa.id}`, {
                    count: currentPesquisa.count + 1
                  })
                } catch (_err) {}

                if (auth.pesquisas.length == 1) {
                  setModalPesquisaVisibleNps(false)
                  setLoadingPergunta(false)
                  loadNextPesquisa()
                  return
                }

                loadNextPesquisa()
                setLoadingPergunta(false)
              }}
            >
              Não Responder
            </NajButton>
          </View>
          <View style={{ width: 15 }} />
          <View style={{ flex: 1 }}>
            <NajButton
              inModal={true}
              onPress={async () => {
                // o cara respondeu
                if (loadingPergunta) return

                setLoadingPergunta(true)

                let _pesquisas = []
                let newPesquisas = []

                try {
                  _pesquisas = await AsyncStorage.getItem(`@NAJ_AC/pesquisa_${auth.adv.codigo}`)
                  _pesquisas = JSON.parse(_pesquisas)

                  if (_pesquisas && _pesquisas.find(({ id: pId }) => String(currentPesquisa.id) == String(pId))) {
                    _pesquisas.forEach((p) => {
                      if (String(currentPesquisa.id) == String(p.id)) {
                        newPesquisas.push({ ...p, respondido: 'S' })
                      } else {
                        newPesquisas.push(p)
                      }
                    })
                  } else {
                    if (_pesquisas && _pesquisas.length > 0) {
                      newPesquisas = _pesquisas
                    }

                    _pesquisas.push({ ...currentPesquisa, respondido: 'S' })
                  }

                  await AsyncStorage.setItem(`@NAJ_AC/pesquisa_${auth.adv.codigo}`, JSON.stringify(newPesquisas))

                  // requisição
                  try {
                    await ADVService.post(`/api/v1/app/pesquisas/aceito/${currentPesquisa.id}`, {
                      motivo: valueMotivoPesquisaNps,
                      nota: valuePesquisaNps
                    })
                  } catch (_err) {}
                } catch (_e) {}

                if (auth.pesquisas.length == 1) {
                  setModalPesquisaVisibleNps(false)
                  setLoadingPergunta(false)
                  loadNextPesquisa()
                  return
                }

                loadNextPesquisa()
                setLoadingPergunta(false)
              }}
            >
              Confirmar
            </NajButton>
          </View>
        </View>
      </Modal>
    )
  }

  function loadNextPesquisa() {
    setValueMotivoPesquisaNps('')
    setValuePesquisaNps(0)

    let newPesquisas = []

    auth.pesquisas.forEach((p) => {
      if (p.id != currentPesquisa.id) newPesquisas.push(p)
    })

    dispatch(loadPesquisasAction(newPesquisas))
  }

  function getLoadingComponent() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.secundary} animating size="large" />
      </View>
    )
  }

  async function checkAdvFolderExists(advCode) {
    // const folderPath = `${RNFS.DocumentDirectoryPath}/${advCode}`;

    const folderPath = `${FileSystem.documentDirectory}/${advCode}`
    const dirInfo = await FileSystem.getInfoAsync(folderPath)

    // const folderExists = await RNFS.exists(folderPath);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true })
      await FileSystem.makeDirectoryAsync(`${folderPath}/temp`, { intermediates: true })
      // await RNFS.mkdir(folderPath);
      // await RNFS.mkdir(`${folderPath}/temp`);
    }
  }

  async function tryLoadAnAdv(advCodigo = -1) {
    let newData = []

    try {
      const UserInfo = await getUserInfo()
      const { data } = await CPanelService.get(`pessoa/allFromUser?deviceId=${UserInfo.deviceId}`)

      newData = data.naj.pessoas.map((pessoa) => {
        const url = String(pessoa.url_base).replace(/\/+$/, '')
        let ext = '/naj-adv-web/public'

        // if (__DEV__)
        //ext = '';

        //const newUrl = url + ext;

        let newUrl = url

        if (url.indexOf(ext) == -1) newUrl = url + ext

        let _liberado = true

        if (String(data.naj.liberado) === '0') _liberado = false

        return {
          ...pessoa,
          liberado: _liberado,
          url_base: newUrl,
          url_base_original: pessoa.url_base
        }
      })
    } catch (err) {
      ToastAndroid.show('Houve um erro ao carregar a listagem de prestadores de serviço', ToastAndroid.SHORT)
    }

    setIsFistTimeLoadingThis(false)

    let advIndex = -1

    for (let i = 0; i < newData.length; i++) {
      if (advCodigo > -1 && newData[i].codigo == advCodigo) advIndex = i

      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}/logos/${newData[i].codigo}`, {
        intermediates: true
      })

      let filePath = `${FileSystem.documentDirectory}/logos/${newData[i].codigo}/logo.png`
      const dirInfo = await FileSystem.getInfoAsync(filePath)

      if (!dirInfo.exists) {
        let _fromUrl = `${newData[i].url_base_original}naj-cliente/public/imagens/logo_escritorio/logo_escritorio.png`

        FileSystem.downloadAsync(_fromUrl, filePath)
          .then(({ uri }) => {
            loadAllLogoFiles()
          })
          .catch((error) => {
            console.error(error)
          })
      }
    }

    if (advIndex > -1) {
      dispatch(changeAdv(newData[advIndex]))
      loadLogoFile(newData[advIndex])

      setHasChangedAdvByNotification(true)

      return
    }

    if (newData.length === 1) {
      await checkAdvFolderExists(newData[0].codigo)

      dispatch(changeAdv(newData[0]))
      loadLogoFile(newData[0])
    } else if (newData.length > 1) {
      handleNavigateAdvChoice()
    }
  }

  function getNonSelectedComponent() {
    if (isFistTimeLoadingThis) {
      tryLoadAnAdv()
      return getLoadingComponent()
    }

    return (
      <>
        <View style={styles.headerTop}>
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <Ionicons name="add" size={28} color="#fff" />
            <NajText style={styles.advName}>{getUserName()}</NajText>
          </View>
        </View>

        <View style={styles.emptyMessageContainer}>
          <EmptyList text="Você ainda não selecionou um prestador de serviço. Clique no ícone ao lado do seu nome para visualizar os prestadores de serviço disponíveis." />
        </View>

        <View style={{ display: 'none' }}>
          {allLogos.map((_adv) => (
            <View key={_adv.advCodigo}>
              <NajText>
                {_adv.advCodigo} | {_adv.path}
              </NajText>
            </View>
          ))}
        </View>
      </>
    )
  }

  function getMainComponent() {
    return (
      <>
        {getModalPesquisaNps()}

        <View style={styles.headerTop}>
          <View style={{ flex: 1, marginHorizontal: 15 }}>
            <NajText style={styles.advName}>
              <Entypo name="briefcase" style={styles.headerIcon} size={20} color="#fff" /> {auth.adv.nome}
            </NajText>
            <NajText style={styles.userName}>
              <MaterialCommunityIcons name="account" size={22} color="#fff" /> {getUserName()}
            </NajText>
          </View>
        </View>

        {getAdvLogo()}

        <View style={styles.headerBottom} />

        <ScrollView style={styles.content}>
          <View style={{ display: 'none' }}>
            {allLogos.map((_adv) => (
              <View key={_adv.advCodigo}>
                <NajText>
                  {_adv.advCodigo} | {_adv.path}
                </NajText>
              </View>
            ))}
          </View>

          <View style={[styles.cardRow, { paddingTop: 0 }]}>
            <HomeCard
              title="Minhas Mensagens"
              icon="chat"
              onPress={handleNavigateAttendance}
              badges={[getBadgeMessageContainer]}
              renderContainer={(content) => {
                //if (homeInfo.primeiro_acesso) {
                if (loadChatAnimation) {
                  return (
                    <Animatable.View
                      animation="shake"
                      iterationCount="infinite"
                      duration={3000}
                      style={{ flex: 1 }}
                      iterationDelay={3000}
                      direction="alternate"
                    >
                      {content}
                    </Animatable.View>
                  )
                }

                return content
              }}
            />
            <View style={{ width: 15 }} />
            <HomeCard
              title="Atividades"
              icon="playlist-add-check"
              badges={[getBadgeActivitiesContainer]}
              onPress={handleNavigateActivities}
            />
          </View>

          <View style={styles.cardRow}>
            <HomeCard
              title="Processos"
              icon="gavel"
              onPress={handleNavigateProcess}
              badges={[getBadgeProcessContainer]}
            />
            <View style={{ width: 15 }} />
            <HomeCard
              title="Agendamentos"
              icon="calendar"
              onPress={handleNavigateAgenda}
              badges={[getBadgeEventContainer]}
            />
          </View>

          <View style={[styles.financeContainer, { marginTop: 15 }]}>
            <RectButton style={styles.financeButton} onPress={() => handleNavigateFinance('ToPay')}>
              <NajText style={styles.cardTitle}>Financeiro</NajText>
            </RectButton>

            <View style={styles.financeRow}>
              <RectButton
                style={[
                  styles.financeButton,
                  {
                    padding: 0,
                    flex: 1,
                    alignItems: 'flex-end'
                  }
                ]}
                onPress={() => handleNavigateFinance('ToReceive')}
              >
                <View style={styles.financeCol}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <MaterialIcons name="attach-money" size={25} color="#0c0" />
                    <NajText style={styles.textFinance}>A RECEBER</NajText>
                  </View>
                  <NajText style={styles.textFinanceToReceive}>{applyMoneyMask(toReceiveValue)}</NajText>
                  <NajText style={styles.textFinanceToReceive}>{applyMoneyMask(toReceiveValueFinished)}</NajText>
                </View>
              </RectButton>

              <View style={{ backgroundColor: '#fff', paddingBottom: 15 }}>
                <View style={styles.financeCol}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <NajText style={[styles.textFinance, { color: 'rgba(0, 0, 0, 0)' }]}>.</NajText>
                  </View>
                  <NajText style={styles.textFinanceMiddle}>recebido / pago</NajText>
                  <NajText style={styles.textFinanceMiddle}>em aberto</NajText>
                </View>
              </View>

              <RectButton
                style={[
                  styles.financeButton,
                  {
                    padding: 0,
                    flex: 1,
                    alignItems: 'flex-start'
                  }
                ]}
                onPress={() => handleNavigateFinance('ToPay')}
              >
                <View style={styles.financeCol}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <MaterialIcons name="money-off" size={28} color={colors.red} />
                    <NajText style={styles.textFinance}>A PAGAR</NajText>
                  </View>
                  <NajText style={styles.textFinanceToPay}>{applyMoneyMask(toPayValue)}</NajText>
                  <NajText style={styles.textFinanceToPay}>{applyMoneyMask(toPayValueFinished)}</NajText>
                </View>
              </RectButton>
            </View>
          </View>

          <View style={{ padding: 2 }} />
        </ScrollView>
      </>
    )
  }

  function renderContent() {
    if (loading) return getLoadingComponent()

    if (isSelectedAdv) return getMainComponent()

    return getNonSelectedComponent()
  }

  return <NajContainer style={styles.container}>{renderContent()}</NajContainer>
}
