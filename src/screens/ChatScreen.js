import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableHighlight,
    Image as RNImage,
    Modal,
    Dimensions,
    ToastAndroid
} from 'react-native';

import Image from 'react-native-scalable-image';
import Autolink from 'react-native-autolink';

// import Sound from 'react-native-sound';
import FileViewer from 'react-native-file-viewer';

// import AudioRecorderPlayer, {
//   AudioEncoderAndroidType,
// } from 'react-native-audio-recorder-player';

import ImageZoom from 'react-native-image-pan-zoom';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { encode } from 'base-64';

import { Camera } from 'expo-camera';
import * as DocumentPicker from 'expo-document-picker';

import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as MediaLibrary from 'expo-media-library'
import HTML from 'react-native-render-html';

import { useSelector, useDispatch } from 'react-redux';
import { clearLastReceived } from '../store/modules/notification/actions';

import ADVService from '../services/adv';

// components
import NajContainer from '../components/NajContainer';
import NajText from '../components/NajText';
import NajButton from '../components/NajButton';
import ChatInput from '../components/ChatInput';
import ListLoading from '../components/ListLoading';

// styles
import styles from './styles/chat';
import { colors, getWidthPerCent } from '../globals';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MessageTypes = {
    TEXT: '0',
    FILE: '1',
};

function EmptyChat({ advName }) {
    return (
        <View style={styles.emptyChatContainer}>
            <NajText style={styles.emptyChatText}>
                <MaterialIcon size={16} name="lock" color="#555" />
                <NajText style={styles.emptyChatTextSpace}>.</NajText>
                OLÁ, Seja bem vindo a área de troca de mensagens de{' '}
                <NajText style={styles.advName}>{advName}</NajText>. Digite a sua
                mensagem ou envie documentos que em breve responderemos!
            </NajText>
        </View>
    );
}

export default function ChatScreen({ route, navigator }) {
    const dispatch = useDispatch();
    const flatListRef = React.useRef(null);

    const lastNotification = useSelector(state => state.notification);
    const auth = useSelector(state => state.auth);

    let beepTrack = null;

    const [chatFiles, setChatFiles] = React.useState([]);
    const [attachPick, setAttachPick] = React.useState({
        picked: false,
        response: null,
        loading: false,
    });
    const [messages, setMessages] = React.useState([]);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [openModalDialogAttach, setOpenModalDialogAttach] = React.useState(
        false,
    );

    // audio--
    // const [openModalExecuteAudio, setOpenModalExecuteAudio] = React.useState(
    //     false,
    // );
    // const [audioUploadLoading, setAudioUploadLoading] = React.useState(false);
    // const [recordingAudio, setRecordingAudio] = React.useState(false);
    // const [playing, setPlaying] = React.useState(false);
    // const [openModalDialogAudio, setOpenModalDialogAudio] = React.useState(false);
    const [currentFile, setCurrentFile] = React.useState({
        id: null,
        name: null,
        path: null,
    });
    // const [recordTime, setRecordTime] = React.useState('00:00');
    // const [currentTime, setCurrentTime] = React.useState('00:00');
    // const [currentTimeSeconds, setCurrentTimeSeconds] = React.useState(0);
    // const [duration, setDuration] = React.useState('00:00');
    // const [currentSound, setCurrentSound] = React.useState(null);
    // const [recordTimeSeconds, setRecordTimeSeconds] = React.useState(0);
    // const [audioInterval, setAudioInterval] = React.useState(null);
    // !--audio

    const [downloadInfo, setDownloadInfo] = React.useState({
        loading: false,
        name: '',
    });
    
    const [uploadInfo, setUploadInfo] = React.useState({
        loading: false,
        name: '',
    });

    const [currentUriImage, setCurrentUriImage] = React.useState(null);
    const [openedImageModal, setOpenedImageModal] = React.useState(false);
    const [hasLoadedAll, setHasLoadedAll] = React.useState(false);
    const [currentImageWidth, setCurrentImageWidth] = React.useState(null);
    const [currentImageHeight, setCurrentImageHeight] = React.useState(null);
    const [currentMessage, setCurrentMessage] = React.useState('');
    const [enableSendButton, setEnableSendButton] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    // const [audioRecorderPlayer, setAudioRecorderPlayer] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [imageFileResponse, setImageFileResponse] = React.useState({});
    const [key, setKey] = React.useState();
    /*const [key, setKey] = React.useState(
        encode(JSON.stringify({id: chatIdParent})),
    );*/

    const [sendingMessage, setSendingMessage] = React.useState(false);
    const [permissionCamera, requestPermissionCamera] = Camera.useCameraPermissions();
    const camRef = React.useRef(null)

    async function handleSendMessageImage(res) {
        setUploadInfo({
            loading: true,
            name: '',
        })

        let err = false
        let persistedMessage = {}

        // res.fileName = `aasdasda.jpeg`
        res.fileName = `${new Date().getTime()}.jpeg`
        res.fileSize = 1024
        
        try {
            const response = await ADVService.post('/api/v1/app/chat/mensagens', {
                conteudo: res.fileName,
                chat_id: auth.dashboard.chat_info.id_chat,
                tipo: '1',
                file_type: '0',
                file_data: res.base64,
                file_size: res.fileSize,
                file_name: res.fileName,
                adv_id: auth.adv.codigo,
            })

            if (String(response.data.status_code) !== '200')
                err = true

            persistedMessage = response.data.naj.persisted

            persistedMessage.file_origin_name = persistedMessage.conteudo
            persistedMessage.conteudo = persistedMessage.id
        } catch (errMsg) {
            err = true
            setUploadInfo({
                loading: false
            })
        }

        if (err)
            return ToastAndroid.show("Ops, houve um erro ao enviar a imagem!", ToastAndroid.SHORT)

        // const _fileName = `${persistedMessage.id}_${persistedMessage.file_origin_name}`;
        // const filePath = `${FileSystem.documentDirectory}/${auth.adv.codigo}/${_fileName}`.replace(/:/g, '-');

        // await FileSystem.copyAsync({ from: res.uri, to: filePath });

        closeImageModal()
        loadFiles()

        const newMessage = {
            lido: 'N',
            original_id: persistedMessage.id,
            ...persistedMessage,
            id: getRandomId(),
            is_owner: 1,
            is_auto: false,
        };

        setUploadInfo({ loading: false });
        setMessages([newMessage, ...messages]);
    }

    /**
     * Mensagem de texto
     */
    async function handleSendMessageText() {
        let err = false;
        let persisted = {};

        setSendingMessage(true);

        try {
            const response = await ADVService.post('/api/v1/app/chat/mensagens', {
                conteudo: currentMessage,
                chat_id: auth.dashboard.chat_info.id_chat,
                tipo: '0',
                file_type: '0',
            });

            if (String(response.data.status_code) !== '200')
                err = true;

            persisted = response.data.naj.persisted;
        } catch (errMsg) {
            err = true;
        }

        if (err)
            return ToastAndroid.show("Ops, houve um erro ao enviar a mensagem!", ToastAndroid.SHORT)

        const newMessage = {
            lido: 'N',
            original_id: persisted.id,
            ...persisted,
            id: getRandomId(),
            is_owner: 1,
            is_auto: false,
        };

        setMessages([newMessage, ...messages]);
        handleChangeText('');
        setSendingMessage(false);
    }

    /**
     * Anexo
     */
    async function sendAttachFile() {
        if (!attachPick.picked && !attachPick.loading) return;

        const sizeMb = (attachPick.response.size / 1024 / 1024).toFixed(1) * 1;

        if (sizeMb > 20)
            return ToastAndroid.show("No momento não possível efetuar o envio de arquivos maiores que 20MB.", ToastAndroid.SHORT)

        setAttachPick({ ...attachPick, loading: true });

        let err = false;
        let err413 = false;
        let persistedMessage = {};
        let msg = 'ok';

        try {
            const encodedFile = await FileSystem.readAsStringAsync(attachPick.response.uri, { encoding: 'base64'});

            const response = await ADVService.post('/api/v1/app/chat/mensagens', {
                conteudo: attachPick.response.name,
                chat_id: auth.dashboard.chat_info.id_chat,
                tipo: '1',
                file_type: '1',
                file_data: encodedFile,
                file_size: attachPick.response.size,
                file_name: attachPick.response.name,
                adv_id: auth.adv.codigo,
            });

            if (String(response.data.status_code) !== '200')
                err = true

            persistedMessage = response.data.naj.persisted;

            persistedMessage.file_origin_name = persistedMessage.conteudo;
            persistedMessage.conteudo = persistedMessage.id;
        } catch (errMsg) {
            err413 = errMsg.message.indexOf('413') > -1
            err = true
            msg = errMsg.message
        }

        if (err) {
            cancelAttachPicker()

            let message = 'Ocorreu um erro ao obter os dados do arquivo'

            if (err413)
                message = 'O arquivo selecionado é muito grande'

            return ToastAndroid.show(message, ToastAndroid.SHORT)
        }

        loadFiles();

        const newMessage = {
            original_id: persistedMessage.id,
            lido: 'N',
            ...persistedMessage,
            id: getRandomId(),
            is_owner: 1,
            is_auto: false,
        };

        setMessages([newMessage, ...messages]);
        cancelAttachPicker();
    }

    /**
     * send
     */
    function handlePressSend() {
        if (!enableSendButton) return;

        handleSendMessageText();
    }

    function getRandomId() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
    }

    function handleChangeText(text) {
        setCurrentMessage(text);

        setEnableSendButton(text.trim() !== '');
    }

    function getFiltro() {
        const filter = {
            val: auth.dashboard.chat_info.id_chat,
            op: 'I',
            col: 'chat.id',
        };

        const base64Filter = encode(JSON.stringify(filter));

        return base64Filter;
    }

    async function handleCheckReadMessages() {
        try {
            await ADVService.post('/api/v1/app/chat/mensagens/check', {
                chat_id: auth.dashboard.chat_info.id_chat,
            });
        } catch (err) {
            ToastAndroid.show("Ops, houve um erro ao efetuar a requisição!", ToastAndroid.SHORT)
        }
    }

    function checkMessageIsAuto(message) {
        let is = false;

        ['- Iniciou', '- Encerrou', '- Transferiu'].forEach(statusMessage => {
            if (message.search(statusMessage) > -1)
                is = true;
        });

        return is;
    }

    async function handleLoadData(refresh = false) {
        let currentPage = page;

        if (refresh)
            currentPage = 1;

        const filter = getFiltro();

        try {
            const response = await ADVService.get(
                `/api/v1/app/chat/mensagens/paginate?page=${currentPage}&f=${filter}`,
            );

            const newMessages = response.data.resultado.map(newMessage => {
                let newItem = {
                original_id: newMessage.id,
                is_auto: false,
                ...newMessage,
                id: getRandomId(),
                };

                // a msg não é do usuário, verifica se é uma msg automática
                if (String(newMessage.is_owner) !== '1')
                    newItem.is_auto = checkMessageIsAuto(String(newMessage.conteudo));

                return newItem;
            });

            if (currentPage === 1)
                setMessages(newMessages);
            else
                setMessages([...messages, ...newMessages]);

            if (response.data.resultado.length === 0)
                setHasLoadedAll(true);
        } catch (err) {
            ToastAndroid.show("Ops, houve um erro ao efetuar a requisição!", ToastAndroid.SHORT)
        }

        setLoading(false);
        setPage(currentPage + 1);
    }

    function openAttachModal() {
        setOpenModalDialogAttach(true);
    }

    function closeAttachModal() {
        setOpenModalDialogAttach(false);
    }

    function cancelAttachPicker() {
        closeAttachModal();
        setAttachPick({
            picked: false,
            response: null,
            loading: false,
        });
    }

    async function loadFiles() {
        // try {
        //     console.log(`${FileSystem.documentDirectory}/${auth.adv.codigo}`)
        //     const files = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${auth.adv.codigo}`, { encoding: FileSystem.EncodingType.Base64 });
        //     // const files = await RNFS.readDir(`${RNFS.DocumentDirectoryPath}/${auth.adv.codigo}`);

        //     setChatFiles(files);
        // } catch (err) {
        //     console.log({...err})
        //     ToastAndroid.show("Não foi possível acessar os arquivos do dispositivo", ToastAndroid.SHORT)
        // }
    }

    async function checkPermissions() {
        const permission = await MediaLibrary.requestPermissionsAsync()

        if (!permission.granted)
            return ToastAndroid.show("O app não possui permissão para armazenamento de arquivos.", ToastAndroid.SHORT)

        if (permissionCamera && !permissionCamera.granted)
            ToastAndroid.show("O app não possui permissão para acessar a camera.", ToastAndroid.SHORT)

        // granted = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        //     {
        //         title: 'Permissão para acesso a gravação de áudio',
        //         message: 'Dê permissão para gravação de áudio',
        //         buttonPositive: 'Ok',
        //     },
        // );

        // if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        //     ToastAndroid.show("O app não possui permissão para gravação de áudio", ToastAndroid.SHORT)
        //     return false;
        // }

        return true;
    }

    // function setIntervalAudio() {
    //     if (currentSound /*&& playing*/) {
    //         currentSound.getCurrentTime((seconds, _) => {
    //             setCurrentTimeSeconds(seconds);
    //         });
    //     }
    // }

    useEffect(() => {
        if (attachPick.picked)
            openAttachModal();
    }, [attachPick]);

    useEffect(() => {
        setKey(encode(JSON.stringify({ id: auth.dashboard.chat_info.id_chat })));
        handleCheckReadMessages();
        handleLoadData();
        loadFiles();

        // const _audioRecorderPlayer = new AudioRecorderPlayer();
        // _audioRecorderPlayer.setSubscriptionDuration(1);
        // setAudioRecorderPlayer(_audioRecorderPlayer);

        // Sound.setCategory('Playback', true);

        checkPermissions();

        // return () => {
        //     if (beepTrack)
        //         beepTrack.release();

        //     clearInterval(audioInterval);
        // };
    }, []);

    // useEffect(() => {
    //     return () => {
    //         if (currentSound) {
    //             currentSound.release();
    //         }
    //     };
    // }, [currentSound]);

    useEffect(() => {
        let isSameAdv = false;

        if (lastNotification?.lastReceived?.message?.id_cliente) {
            isSameAdv = auth.adv.codigo == lastNotification.lastReceived.message.id_cliente;
        }

        // é o mesmo usuário
        let isSameUser = false;

        if (lastNotification?.lastReceived?.message?.id_usuario_receber) {
            isSameUser = auth?.user?.id == lastNotification.lastReceived.message.id_usuario_receber;
        }

        if (lastNotification?.lastAction === '@ACT/new_message' && isSameAdv && isSameUser) {
            const { message: newMessage } = lastNotification.lastReceived;
            const newMessages = messages.map(message => ({ ...message, lido: 'S' }));

            setMessages([
                {
                    original_id: newMessage.id,
                    id: getRandomId(),
                    ...newMessage,
                    is_owner: '0',
                },
                ...newMessages,
            ]);

            handleCheckReadMessages();
            dispatch(clearLastReceived());
        } else if (lastNotification?.lastAction === '@ACT/reload_messages' && isSameAdv) {
            handleLoadData(true);
            dispatch(clearLastReceived());
        } else if (lastNotification?.lastAction === '@ACT/read_all_messages' && isSameAdv) {
            setMessages(messages.map(message => ({ ...message, lido: 'S' })));
            dispatch(clearLastReceived());
        }
    }, [lastNotification]);

    function getContentFromItem(item) {
        const isOwner = String(item.is_owner) === '1';

        // mensagem de texto
        if (String(item.tipo) === '0') {
            if (item.conteudo.indexOf('<') > -1 && item.conteudo.indexOf('>') > -1) {
                let newHtml = item.conteudo;
                const regex = new RegExp(/font-size:\s.?[0-9]{0,}.?[0-9]{1,}rem/g, 'ig');
                const arr = Array.from(String(newHtml).match(regex) || []);

                arr.forEach(match => {
                    newHtml = newHtml.replace(match, match.replace(/rem/, 'em'));
                });
                return (
                    <HTML html={newHtml} />
                );
            }

            return (
                <Autolink
                text={item.conteudo}
                component={View}
                renderLink={link => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcon size={20} name="link" color="#666" />
                    <NajText>{' '}</NajText>
                    <Autolink text={link} />
                    </View>
                )}
                renderText={text => <NajText>{text}</NajText>}
                />
            );
        }

        const _fileName =
        String(item.file_type) === '2'
            ? `${item.original_id}_audio.mp3`
            : `${item.original_id}_${item.file_origin_name}`;
        const itemFile = chatFiles.find(fl => fl.name === _fileName);

        // imagem
        if (String(item.file_type) === '0') {
            if (!itemFile) {
                // imagem não existe, tem fazer download

                return (
                    <TouchableOpacity
                        style={styles.attachContainer}
                        activeOpacity={0.7}
                        onPress={() => downloadFile(item)}>
                        <View style={styles.attachWrapper}>
                        <MaterialIcon size={28} name="image" color="#999" />
                        <NajText style={styles.attachText} numberOfLines={3}>
                            {item.file_origin_name}
                        </NajText>

                        {(item.loading && <NajText>carregando</NajText>) || (
                            <MaterialIcon size={28} name="file-download" color="#999" />
                        )}
                        </View>
                    </TouchableOpacity>
                );
            }

            const fileUri = `file://${itemFile.path}`;

            return (
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.imageContainer}
                    onPress={() => openImageModal(fileUri)}>
                    <Image
                        source={{ uri: fileUri }}
                        style={styles.fileImage}
                        width={getWidthPerCent(50)}
                    />
                </TouchableOpacity>
            );
        }

        // documento
        if (item?.file_type && String(item.file_type) === '1') {
            if (!itemFile) {
                // documento não existe, tem fazer download
                return (
                    <TouchableOpacity
                        style={[styles.audioContainer, { minWidth: getWidthPerCent(50) }]}
                        activeOpacity={0.7}
                        onPress={() => downloadFile(item)}>
                        <View style={styles.attachWrapper}>
                        <MaterialIcon size={28} name="insert-drive-file" color="#999" />
                        <NajText
                            style={styles.attachText}
                            numberOfLines={3}
                            ellipsizeMode="middle">
                            {item.file_origin_name}
                        </NajText>
                        <MaterialIcon size={28} name="file-download" color="#999" />
                        </View>
                    </TouchableOpacity>
                );
            }

            return (
                <TouchableOpacity
                    style={styles.attachContainer}
                    activeOpacity={0.7}
                    onPress={() => openDoc(item)}>
                    <View style={styles.attachWrapper}>
                        <MaterialIcon size={28} name="insert-drive-file" color="#999" />
                        <NajText
                        style={styles.attachText}
                        numberOfLines={3}
                        ellipsizeMode="middle">
                        {item.file_origin_name}
                        </NajText>
                    </View>
                </TouchableOpacity>
            );
        }

        // if (!itemFile) {
        //     // áudio não existe, tem que fazer download
        //     return (
        //         <TouchableOpacity
        //         style={styles.audioContainer}
        //         onPress={() =>
        //             //downloadFile({...item, file_origin_name: `audio-${item.id}.mp3`})
        //             downloadFile(item)
        //         }>
        //         <View style={styles.audioWrapper}>
        //             <View style={styles.audioButton}>
        //             <MaterialIcon size={28} name="audiotrack" color="#999" />
        //             </View>
        //             <NajText numberOfLines={3} ellipsizeMode="middle" style={styles.fileName}>
        //             {item.file_origin_name}
        //             </NajText>
        //             <View style={styles.audioButton}>
        //             <MaterialIcon size={28} name="file-download" color="#999" />
        //             </View>
        //         </View>
        //         </TouchableOpacity>
        //     );
        // }

        // áudio
        // return (
        //     <View style={styles.audioContainer}>
        //         <View style={styles.audioWrapper}>
        //         <TouchableOpacity
        //             onPress={() => openAudio(item, itemFile)}
        //             style={styles.audioButton}>
        //             <MaterialIcon size={32} name="play-circle-filled" color="#999" />
        //         </TouchableOpacity>
        //         <NajText numberOfLines={3} ellipsizeMode="middle" style={styles.fileName}>
        //             {item.file_origin_name}
        //         </NajText>
        //         </View>
        //     </View>
        // );
    }

    // function openAudioComplete() {
    //     setPlaying(false);
    //     setCurrentSound(null);
    //     setOpenModalExecuteAudio(false);
    //     setCurrentTime('00:00');
    // }

    // function openAudio(item, { path: filePath }) {
    //     if (playing) return;

    //     setPlaying(true);

    //     if (currentSound) {
    //         currentSound.play(openAudioComplete);
    //         return;
    //     }

    //     //setRecordTime(item.audio_time);
    //     const _name = item.file_origin_name.replace('.mp3', '').split('_');
    //     if (_name.length === 3) {
    //         setRecordTime(_name[2]);
    //     } else {
    //         setRecordTime('Tempo total não encontrado');
    //     }
    //     //setAudioUploadLoading(true);
    //     setOpenModalExecuteAudio(true);

    //     const sound = new Sound(filePath, null, error => {
    //         if (error) {
    //             ToastAndroid.show("Ocorreu um erro ao executar o áudio", ToastAndroid.SHORT)
    //             return;
    //         }

    //         // sound.play(openAudioComplete);
    //     });

    //     // setCurrentSound(sound);

    //     // const _interval = setInterval(() => {
    //     //     sound.getCurrentTime(seconds => {
    //     //         setCurrentTime(audioRecorderPlayer.mmss(Math.floor(seconds)));
    //     //     });
    //     // }, 500);

    //     // setAudioInterval(_interval);
    // }

    async function downloadFile(item) {
        if (downloadInfo.loading) {
            ToastAndroid.show("Não é possível efeutar o download de multiplos arquivos ao mesmo tempo", ToastAndroid.SHORT)
            return;
        }

        setDownloadInfo({ loading: true, name: item.file_origin_name });

        let err = false;
        let alertMessage = 'Houve um erro ao efetuar o download do arquivo';

        const permission = await MediaLibrary.requestPermissionsAsync()

        if (permission.granted) {
          try {
            const res = await ADVService.post('/api/v1/app/chat/mensagens/getFile', {
              adv_id: auth.adv.codigo,
              message_id: item.original_id,
              fileName: item.file_origin_name
            });

            if (String(res.data.status_code) !== '200')
                err = true;

            if (String(res.data.naj.existe) === '0')
                alertMessage = 'Arquivo não encontrado no servidor';
    
            const { link, erro } = res.data.naj

            if (erro) {
                err = true
                alertMessage = 'Arquivo não encontrado em nosso servidor.'
            }

            const downloadResumable = FileSystem.createDownloadResumable(
              link,
              FileSystem.documentDirectory + item.file_origin_name,
              {},
            //   callback
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

        if (err)
          ToastAndroid.show(alertMessage, ToastAndroid.SHORT)

        setDownloadInfo({ loading: false, name: '' });
    }

    async function openDoc(item) {
        const _fileName = `${item.original_id}_${item.file_origin_name}`;
        const file = chatFiles.find(it => it.name === _fileName);

        if (!file) {
            ToastAndroid.show('Arquivo não encontrado', ToastAndroid.SHORT)
            return;
        }

        await FileViewer.open(file.path, { showOpenWithDialog: true });
    }

    function openImageModal(fileUri) {
        RNImage.getSize(fileUri, (width, height) => {
            setCurrentImageWidth(width);
            setCurrentImageHeight(height);
        });

        setCurrentUriImage(fileUri);
        setOpenedImageModal(true);
    }

    function closeImageModal() {
        setOpenedImageModal(false);
        // setCurrentUriImage(null);
        // setCurrentImageWidth(null);
        // setCurrentImageHeight(null);
    }

    async function takePicture() {
        if (!camRef) return

        const res = await camRef.current.takePictureAsync({ base64: true, exif: true })

        handleSendMessageImage(res);
    }

    function renderMessage(item) {
        // mensagem do usuário
        if (String(item.is_owner) === '1') {
            return (
                <View style={styles.messageWrapper}>
                    <View style={[styles.message, styles.isLoggedMessage]}>
                        {/* <NajText style={[styles.messageName, {color: '#87A172'}]}>
                        Você
                    </NajText> */}
                        {getContentFromItem(item)}
                        <View style={styles.messageDateContainer}>
                        <NajText style={styles.messageDate}>
                            {/* {moment(item.data_hora).format('DD/MM/Y HH:mm')} */}
                            {moment(item.data_hora)
                            .locale('pt-br')
                            .calendar()}
                        </NajText>
                        {(String(item.lido) === 'N' && (
                            <MaterialCommunityIcon size={18} name="check-all" color="#87A172" />
                        )) || (
                            <MaterialCommunityIcon
                                size={18}
                                name="check-all"
                                color={colors.secundary}
                            />
                            )}
                        </View>
                    </View>
                </View>
            );
        }

        // mensagem automática
        if (item.is_auto) {
            let autoMessageColor = '#2cd07e';

            if (String(item.conteudo).search('- Encerrou') > -1)
                autoMessageColor = '#c00';

            return (
                <View style={styles.autoMessage}>
                    <LinearGradient
                        colors={['transparent', '#fff', 'transparent']}
                        style={styles.autoMessageGradient}
                        start={{ x: 0, y: -2 }}
                        end={{ x: 1, y: 2 }}>
                        <NajText style={[styles.autoMessageText, { color: autoMessageColor }]}>{item.conteudo}</NajText>
                        <NajText style={[styles.autoMessageDate, { color: autoMessageColor }]}>
                        {/* {moment(item.data_hora).format('DD/MM/Y HH:mm')} */}
                        {moment(item.data_hora)
                            .locale('pt-br')
                            .calendar()}
                        </NajText>
                    </LinearGradient>
                </View>
            );
        }

        let userName = item.nome;

        if (item.apelido !== null && String(item.apelido).trim() !== '')
            userName = item.apelido;

        // mensagem da advocacia
        return (
            <View style={styles.messageWrapperLeft}>
                <View style={styles.message}>
                <NajText style={[styles.messageName, { color: '#00c' }]}>
                    {userName}
                </NajText>
                {getContentFromItem(item)}
                <NajText style={styles.messageDateAdv}>
                    {/* {moment(item.data_hora).format('DD/MM/Y HH:mm')} */}
                    {moment(item.data_hora)
                    .locale('pt-br')
                    .calendar()}
                </NajText>
                </View>
            </View>
        );
    }

    // function closeCurrentAudioTrack() {
    //     setOpenModalExecuteAudio(false);
    //     setCurrentSound(null);
    //     setPlaying(false);
    //     setCurrentTime('00:00');
    //     clearInterval(audioInterval);
    // }

    function renderFooterComponent() {
        if (!loadingMore) return <View />;

        return (
            <View>
                <ActivityIndicator color={colors.secundary} animating size="large" />
            </View>
        );
    }

    function handleLoadMore() {
        if (loading || hasLoadedAll) return;

        setLoadingMore(true);
        handleLoadData();
        setLoadingMore(false);
    }

    async function launchCamera() {
        if (permissionCamera && !permissionCamera.granted)
            ToastAndroid.show("O app não possui permissão para acessar a camera.", ToastAndroid.SHORT)

        setOpenedImageModal(true)
    }

    // function playBeepTrackSound() {
    //     beepTrack = new Sound(require('../assets/audio/boop.wav'), (error, _) => {
    //         if (error) return;

    //         beepTrack.play(() => beepTrack.release());
    //     });
    // }

    // async function onStartRecord() {
    //     if (recordingAudio) return;

    //     const hasPermissions = checkPermissions();

    //     if (!hasPermissions) return;

    //     try {
    //         setRecordTime('00:00');
    //         setRecordTimeSeconds(0);
    //         setRecordingAudio(true);

    //         const fileId = getRandomId();
    //         const filePath = `${FileSystem.documentDirectory}/${auth.adv.codigo}/temp/`;
    //         // const filePath = `${RNFS.DocumentDirectoryPath}/${auth.adv.codigo}/temp/`;
    //         const fileName = `audio_${fileId}.mp3`;

    //         // const result = await audioRecorderPlayer.startRecorder(filePath + fileName);

    //         // audioRecorderPlayer.addRecordBackListener(e => {
    //         //     const newCurrentTime = audioRecorderPlayer.mmssss(
    //         //         Math.floor(e.current_position),
    //         //     );

    //         //     const arrNewCurrentTime = newCurrentTime.split(':');

    //         //     setRecordTime(`${arrNewCurrentTime[0]}:${arrNewCurrentTime[1]}`);
    //         //     setRecordTimeSeconds(e.current_position);
    //         // });

    //         setCurrentFile({ id: fileId, name: fileName, path: filePath + fileName });
    //     } catch (err) {
    //         setRecordingAudio(false);
    //     }
    // }

    // async function onStopRecord() {
    //     if (!recordingAudio) return;

    //     // await audioRecorderPlayer.stopRecorder();
    //     // audioRecorderPlayer.removeRecordBackListener();

    //     setRecordingAudio(false);

    //     if (recordTime === '00:00') {
    //         cancelAudio();
    //         return;
    //     }

    //     setCurrentTime('00:00');
    //     setOpenModalDialogAudio(true);
    // }

    // function openAudioCompleteConfirm() {
    //     setPlaying(false);
    //     setCurrentSound(null);
    //     setCurrentTime(recordTime);
    // }

    // function pauseConfirmAudioFile() {
    //     if (!playing) return;

    //     currentSound.pause();
    //     setPlaying(false);
    // }

    // function playConfirmAudioFile() {
    //     if (playing) return;

    //     setPlaying(true);

    //     if (currentSound) {
    //         currentSound.play(openAudioCompleteConfirm);
    //         return;
    //     }

    //     setCurrentTime('00:00');

    //     const sound = new Sound(currentFile.path, null, error => {
    //         if (error) {
    //             ToastAndroid.show('Ocorreu um erro ao executar o áudio', ToastAndroid.SHORT)
    //             return;
    //         }

    //         sound.play(openAudioCompleteConfirm);
    //     });

    //     setCurrentSound(sound);

    //     // const _interval = setInterval(() => {
    //     //     sound.getCurrentTime(seconds => {
    //     //         setCurrentTime(audioRecorderPlayer.mmss(Math.floor(seconds)));
    //     //     });
    //     // }, 500);

    //     setAudioInterval(_interval);
    // }

    // async function cancelAudio() {
    //     if (!currentFile.path) return;

    //     if (currentSound) {
    //         currentSound.release();
    //         setCurrentSound(null);
    //     }

    //     setRecordTimeSeconds(0);
    //     setAudioUploadLoading(false);
    //     setRecordTime('00:00');
    //     setOpenModalDialogAudio(false);
    //     setPlaying(false);

    //     await FileSystem.deleteAsync(currentFile.path);
    //     // await RNFS.unlink(currentFile.path);

    //     setCurrentFile({
    //         id: null,
    //         name: null,
    //         path: null,
    //     });
    // }

    // async function sendAudioFile() {
    //     setAudioUploadLoading(true);

    //     const audioFile = tempFiles.find(f => f.name === currentFile.name);
    //     const encodedFile = await FileSystem.readAsStringAsync(audioFile.path, { encoding: 'base64'});

    //     let err = false;
    //     let err413 = false;
    //     let persistedMessage = {};

    //     try {
    //         const response = await ADVService.post('/api/v1/app/chat/mensagens', {
    //             conteudo: recordTime,
    //             chat_id: auth.dashboard.chat_info.id_chat,
    //             tipo: '1',
    //             file_type: '2',
    //             file_data: encodedFile,
    //             file_size: audioFile.size,
    //             file_name: audioFile.name,
    //             adv_id: auth.adv.codigo,
    //         });

    //         if (String(response.data.status_code) !== '200')
    //             err = true;

    //         persistedMessage = response.data.naj.persisted;

    //         persistedMessage.audio_time = persistedMessage.conteudo;
    //         //persistedMessage.file_origin_name = `${persistedMessage.id}_audio.mp3`;
    //         persistedMessage.file_origin_name = persistedMessage.conteudo;
    //         persistedMessage.conteudo = persistedMessage.id;
    //     } catch (errMsg) {
    //         err413 = errMsg.message.indexOf('413') > -1;
    //         err = true;
    //     }

    //     if (currentSound) {
    //         currentSound.release();
    //         setCurrentSound(null);
    //     }

    //     if (err) {
    //         cancelAudio();

    //         let message = 'Ocorreu um erro ao obter os dados do arquivo';

    //         if (err413)
    //             message = 'O arquivo de áudio é muito grande';

    //         ToastAndroid.show(message, ToastAndroid.SHORT)

    //         return;
    //     }

    //     const _fileName = `${persistedMessage.id}_audio.mp3`;
    //     const filePath = `${FileSystem.documentDirectory}/${auth.adv.codigo}/${_fileName}`.replace(/:/g, '-');

    //     await FileSystem.copyAsync({ from: audioFile.path, to: filePath });
    //     // await RNFS.copyFile(audioFile.path, filePath);

    //     loadFiles();

    //     const newMessage = {
    //         original_id: persistedMessage.id,
    //         lido: 'N',
    //         ...persistedMessage,
    //         id: getRandomId(),
    //         is_owner: 1,
    //         is_auto: false,
    //     };

    //     setMessages([newMessage, ...messages]);

    //     cancelAudio();
    // }

    // function handlePressMic() {
    //     if (playing)
    //         return ToastAndroid.show('Enquanto um áudio estiver sendo executado não é possível inciar essa ação', ToastAndroid.SHORT)

    //     playBeepTrackSound();

    //     onStartRecord();
    // }

    // function handlePressOutMic() {
    //     onStopRecord();
    // }

    async function handlePressPickAttach() {
        // if (playing)
        //     return ToastAndroid.show('Enquanto um áudio estiver sendo executado não é possível inciar essa ação', ToastAndroid.SHORT)

        try {
            const res = await DocumentPicker.getDocumentAsync()

            if (res.type === "success") {
                setAttachPick({
                    picked: true,
                    response: res,
                    loading: false,
                })

                const base64 = await FileSystem.readAsStringAsync(res.uri, { encoding: 'base64' });

                return base64
            }

            return ToastAndroid.show('Ops, não foi possível enviar o anexo, tente novamente mais tarde!', ToastAndroid.SHORT)
        } catch (err) {
            setAttachPick({
                picked: false,
                response: null,
                loading: false,
            })

            return ToastAndroid.show('Ops, não foi possível enviar o anexo, tente novamente mais tarde!', ToastAndroid.SHORT)
        }
    }

    function scrollToDown() {
        if (flatListRef?.current && !loadingMore)
            flatListRef.current.scrollToEnd({ animated: true });
    }

    return (
        <NajContainer style={styles.container}>
        {/* {recordingAudio && (
            <View style={styles.audioCounterContainer}>
                <NajText style={[styles.audioCounterText, { flex: 1 }]}>
                    Gravando áudio
                </NajText>
                <NajText style={styles.audioCounterText}>{recordTime}</NajText>
            </View>
        )} */}

        {downloadInfo.loading && (
            <View style={styles.audioCounterContainer}>
                <View style={{ flex: 1, paddingRight: 15 }}>
                    <NajText
                    style={{ color: '#fafafa' }}
                    numberOfLines={1}
                    ellipsizeMode="middle">
                    Efetuando download do arquivo:
                    </NajText>
                    <NajText
                    style={{ color: '#fafafa', fontWeight: 'bold' }}
                    numberOfLines={1}
                    ellipsizeMode="middle">
                    {downloadInfo.name || 'Nome do arquivo não encontrado'}
                    </NajText>
                </View>
                <ActivityIndicator color="#fafafa" animating size="large" />
            </View>
        )}

        {uploadInfo.loading && (
            <View style={styles.audioCounterContainer}>
                <View style={{ flex: 1, paddingRight: 15 }}>
                    <NajText
                        style={{ color: '#fafafa' }}
                        numberOfLines={1}
                        ellipsizeMode="middle">
                        Aguarde...
                    </NajText>
                    <NajText
                        style={{ color: '#fafafa', fontWeight: 'bold' }}
                        numberOfLines={1}
                        ellipsizeMode="middle">
                        {'Aguarde, estamos efetuando o upload da imagem'}
                    </NajText>
                </View>
                <ActivityIndicator color="#fafafa" animating size="large" />
            </View>
        )}

        {(loading && <ListLoading />) || (
            <>
            <FlatList
                ref={flatListRef}
                data={messages}
                style={styles.chatList}
                inverted={messages.length > 0}
                //onContentSizeChange={scrollToDown}
                keyExtractor={({ id }) => String(id)}
                ListEmptyComponent={() => <EmptyChat advName={auth.adv.nome} />}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                ListFooterComponent={renderFooterComponent}
                renderItem={({ item }) => renderMessage(item)}
            />

            <ChatInput
                enable={enableSendButton}
                sendingMessage={sendingMessage}
                onChangeText={handleChangeText}
                onPress={handlePressSend}
                value={currentMessage}
                handlePressPickImage={launchCamera}
                // handlePressMic={handlePressMic}
                // handlePressOutMic={handlePressOutMic}
                handlePressPickAttach={handlePressPickAttach}
            />
            </>
        )}

        {/* MODAL DE ZOOM NA IMAGEM */}
        <Modal
            presentationStyle="overFullScreen"
            visible={openedImageModal}
            animationType="slide"
            transparent={true}>
            {/* <View style={styles.fileImageFullClose}> */}
            <TouchableHighlight
                onPress={closeImageModal}
                style={styles.fileImageFullCloseButton}>
                <MaterialIcon size={44} name="close" color="#f1f1f1" />
            </TouchableHighlight>
            {/* </View> */}

            <View style={styles.fileImageFullContainer}>
            <View style={styles.fileImageFull}>
                {(currentUriImage && currentImageHeight && currentImageWidth && (
                <ImageZoom
                    cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').height}
                    imageWidth={getWidthPerCent(100)}
                    imageHeight={getWidthPerCent(120)}>
                    <Image
                    source={{ uri: currentUriImage }}
                    width={getWidthPerCent(100)}
                    />
                </ImageZoom>
                )) || (
                    <ActivityIndicator
                    color={colors.secundary}
                    animating
                    size="large"
                    />
                )}
            </View>
            </View>
        </Modal>

        {/* MODAL DE CONFIRMAÇÃO DO ANEXO */}
        <Modal
            presentationStyle="fullScreen"
            visible={openModalDialogAttach}
            animationType="slide">
            <View style={styles.attachModalHeader}>
            <NajText style={styles.attachModalHeaderText}>
                Envio de arquivo
            </NajText>
            </View>

            {attachPick.response?.name && (
            <>
                <View style={styles.attachDescribeContainer}>
                <View style={styles.attachDescribeRow}>
                    <NajText style={styles.attachDescribeLeft}>Nome:</NajText>
                    <NajText style={styles.attachDescribeRight}>
                    {attachPick.response.name}
                    </NajText>
                </View>
                <View style={styles.attachDescribeRow}>
                    <NajText style={styles.attachDescribeLeft}>Tipo:</NajText>
                    <NajText style={styles.attachDescribeRight}>
                    {attachPick.response.mimeType}
                    </NajText>
                </View>
                </View>

                <View style={styles.attachButtonBottomContainer}>
                {(attachPick.loading && (
                    <View style={styles.attachButtonWrapperLoading}>
                    <ActivityIndicator
                        color={colors.secundary}
                        animating
                        size="large"
                    />
                    </View>
                )) || (
                    <View style={styles.attachButtonWrapperContainer}>
                        <View style={styles.attachButtonWrapper}>
                        <NajButton
                            inModal={true}
                            onPress={cancelAttachPicker}
                            icon="cancel"
                            backgroundColor={colors.primary}>
                            <NajText>Cancelar</NajText>
                        </NajButton>
                        </View>

                        <View style={styles.attachButtonWrapper}>
                        <NajButton
                            inModal={true}
                            onPress={sendAttachFile}
                            icon="send">
                            <NajText>Enviar</NajText>
                        </NajButton>
                        </View>
                    </View>
                    )}
                </View>
            </>
            )}
        </Modal>

        <Modal
            presentationStyle="overFullScreen"
            visible={openedImageModal}
            animationType="slide"
            transparent={true}>

            <TouchableHighlight
                onPress={closeImageModal}
                style={styles.fileImageFullCloseButton}>
                <MaterialIcon size={44} name="close" color="#f1f1f1" />
            </TouchableHighlight>

            <View style={styles.fileCamera}>
                <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={camRef} />
            </View>

            <TouchableHighlight
                onPress={takePicture}>
                <View>
                    <MaterialIcon name="photo-camera" size={40} color="#fff" style={{ textAlign: 'center' }} />
                    <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 20 }}>Capturar</Text>
                </View>
            </TouchableHighlight>
        </Modal>

        {/* MODAL DE CONFIRMAÇÃO DO ÁUDIO */}
        {/* <Modal
            presentationStyle="fullScreen"
            visible={openModalDialogAudio}
            animationType="slide">
            <View style={styles.attachModalHeader}>
            <NajText style={styles.attachModalHeaderText}>Envio de áudio</NajText>
            </View>

            <View style={styles.audioDescContainer}>
            <View style={styles.audioDescRow}>
                <View style={styles.audioDescButtonWrapper}>
                <NajButton
                    inModal={true}
                    activeOpacity={0.7}
                    onPress={() => {
                    if (playing) {
                        pauseConfirmAudioFile();
                    } else {
                        playConfirmAudioFile();
                    }
                    }}
                    backgroundColor="rgba(0, 0, 0, 0)">
                    <MaterialIcon
                    size={58}
                    name={playing ? 'pause-circle-filled' : 'play-circle-filled'}
                    color="#666"
                    />
                </NajButton>
                </View>
                <NajText style={{ fontSize: 16 }}>
                {currentTime} / {recordTime}
                </NajText>
            </View>
            </View>

            <View style={styles.attachButtonBottomContainer}>
            {(audioUploadLoading && (
                <View style={styles.attachButtonWrapperLoading}>
                <ActivityIndicator
                    color={colors.secundary}
                    animating
                    size="large"
                />
                </View>
            )) || (
                <View style={styles.attachButtonWrapperContainer}>
                    <View style={styles.attachButtonWrapper}>
                    <NajButton
                        inModal={true}
                        onPress={cancelAudio}
                        icon="cancel"
                        backgroundColor={colors.primary}>
                        <NajText>Cancelar</NajText>
                    </NajButton>
                    </View>

                    <View style={styles.attachButtonWrapper}>
                    <NajButton inModal={true} onPress={sendAudioFile} icon="send">
                        <NajText>Enviar</NajText>
                    </NajButton>
                    </View>
                </View>
                )}
            </View>
        </Modal> */}

        {/* MODAL DE ÁUDIO */}
        {/* {openModalExecuteAudio && (
            <View style={styles.audioModalContainer}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                if (currentSound && playing) {
                    setPlaying(false);
                    currentSound.pause();
                    return;
                }

                openAudio(null, { path: null });
                }}
                style={styles.audioModalPlayPauseButton}>
                <MaterialIcon
                size={38}
                name={playing ? 'pause-circle-filled' : 'play-circle-filled'}
                color="#999"
                />
            </TouchableOpacity>

            <NajText style={styles.audioModalText}>
                {currentTime} / {recordTime}
            </NajText>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={closeCurrentAudioTrack}
                style={styles.audioModalCloseButton}>
                <MaterialIcon size={32} name="close" color="#999" />
            </TouchableOpacity>
            </View>
        )} */}
        </NajContainer>
    );
}
