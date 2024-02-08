import React from 'react'
import {
  ActivityIndicator,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid
} from 'react-native'
import { useSelector } from 'react-redux'
import { encode } from 'base-64'

import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as MediaLibrary from 'expo-media-library'

import ADVService from '../services/adv'

// components
import NajContainer from '../components/NajContainer'
import NajText from '../components/NajText'

export default function AttachmentActivititiesListScreen({ route }) {
  const { id } = route.params

  const auth = useSelector((state) => state.auth)
  const [attachments, setAttachments] = React.useState([])
  const [progress, setProgress] = React.useState(null)
  const [hasLoadedAll, setHasLoadedAll] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const [selectedId, setSelectedId] = React.useState(null)
  const [downloadInfo, setDownloadInfo] = React.useState({
    loading: false,
    name: ''
  })

  const callback = (downloadProgress) => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
    setProgress({ downloadProgress: progress })
  }

  async function handleDownload(item) {
    if (downloadInfo.loading)
      return ToastAndroid.show(
        'Não é possível efeutar o download de multiplos arquivos ao mesmo tempo!',
        ToastAndroid.SHORT
      )

    setDownloadInfo({
      loading: true,
      name: item.NOME_ARQUIVO
    })

    setSelectedId(item.ID)

    let err = false
    let alertMessage = 'Houve um erro ao efetuar o download do arquivo'

    const permission = await MediaLibrary.requestPermissionsAsync()

    if (permission.granted) {
      try {
        const _fileName = `${item.ID}_${item.NOME_ARQUIVO}`

        const res = await ADVService.post('/api/v1/app/atividades/attachment/download', {
          adv_id: auth.adv.codigo,
          anexo_id: item.ID,
          fileName: _fileName
        })

        const { link, erro } = res.data.naj
        if (erro) {
          err = true
          alertMessage = 'Arquivo não encontrado em nosso servidor.'
        }

        const downloadResumable = FileSystem.createDownloadResumable(
          link,
          FileSystem.documentDirectory + _fileName,
          {},
          callback
        )

        try {
          const { uri } = await downloadResumable.downloadAsync()
          const cUri = await FileSystem.getContentUriAsync(uri)
          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: cUri,
            flags: 1
          })
        } catch (e) {
          console.error(e)
        }

        setDownloadInfo({
          loading: false,
          name: ''
        })
      } catch (errMsg) {
        err = true
      }
    }

    if (err) ToastAndroid.show(alertMessage, ToastAndroid.SHORT)

    setDownloadInfo({
      loading: false,
      name: ''
    })
  }

  async function handleLoadData() {
    const key = encode(JSON.stringify({ CODIGO: id }))

    try {
      const { data } = await ADVService.get(`/api/v1/app/atividades/${key}/attachment`)

      setAttachments(data.resultado)

      if (data.resultado.length < 50) setHasLoadedAll(true)
    } catch (err) {
      ToastAndroid.show('Ops, não foi possivel buscar os anexos da atividade!', ToastAndroid.SHORT)
    }

    setLoading(false)
  }

  function handleRenderItem({ item }) {
    let backgroundColor = item.ID === selectedId ? '#f1f1f1' : '#fff'

    return (
      <View
        style={{ backgroundColor: backgroundColor, paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'row' }}
      >
        <View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => handleDownload(item)}>
            <NajText style={styles.attachText} numberOfLines={3} ellipsizeMode="middle">
              {item.file_origin_name}
            </NajText>
            <MaterialIcons name="file-download" size={28} color="#999" />
          </TouchableOpacity>
        </View>
        <View style={styles.rowItem}>
          <NajText style={styles.nonInfoText}>Nome Arquivo</NajText>
          <NajText numberOfLines={1} style={{ paddingVertical: 5 }}>
            {item.NOME_ARQUIVO}
          </NajText>
        </View>

        <View>
          <NajText style={styles.nonInfoText}>Data</NajText>
          <NajText numberOfLines={1} style={[styles.name, { paddingRight: 10 }]}>
            {item.DATA_ARQUIVO}
          </NajText>
        </View>
      </View>
    )
  }

  React.useEffect(() => {
    handleLoadData()
  }, [])

  return (
    <NajContainer style={styles.container}>
      {downloadInfo.loading && (
        <View style={styles.audioCounterContainer}>
          <View style={{ flex: 1, paddingRight: 15 }}>
            <NajText style={{ color: '#fafafa' }} numberOfLines={1} ellipsizeMode="middle">
              Efetuando download do arquivo:
            </NajText>
            <NajText style={{ color: '#fafafa', fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="middle">
              {downloadInfo.name || 'Nome do arquivo não encontrado'}
            </NajText>
          </View>
          <ActivityIndicator color="#fafafa" animating size="large" />
        </View>
      )}

      <FlatList
        data={attachments}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={({ ID }) => String(ID)}
        renderItem={handleRenderItem}
        extraData={selectedId}
        onEndReachedThreshold={0.5}
      />
    </NajContainer>
  )
}

// styles
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row'
  },
  itemSelected: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row'
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f1f1'
  },
  date: {
    fontWeight: 'bold',
    paddingRight: 10,
    fontSize: 14
  },
  description: {
    flex: 1
  },
  loadingMore: {
    padding: 20,
    backgroundColor: 'red'
  },
  loadingCotainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  },
  nonInfoText: {
    color: '#777'
  },
  rowItem: {
    marginLeft: 10,
    flex: 1
  },
  fab: {
    width: 45,
    height: 45,
    backgroundColor: '#eaeaea',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3
    }
  },
  buttonDownload: {
    textAlignVertical: 'center',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff'
  },
  fileImageFullCloseButton: {
    top: 15,
    right: 15,
    zIndex: 9999,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, .91)',
    padding: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10
  },
  fileImageFullContainer: {
    backgroundColor: 'rgba(0, 0, 0, .91)',
    flex: 1
  },
  fileImageFull: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  audioCounterContainer: {
    backgroundColor: '#c00',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  attachText: {
    color: '#666',
    flex: 1
  }
})
