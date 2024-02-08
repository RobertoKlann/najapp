import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export function getLogoPath(advCode) {
    return `${FileSystem.documentDirectory}/logos/${advCode}/logo.png`;
}

export function setLastAtt(advCode) {
    const now = moment().format();

    AsyncStorage.setItem(`@NAJ_AC/last_att_logo_${advCode}`, now);
}

export async function getLastAtt(advCode) {
    const lastAtt = await AsyncStorage.getItem(`@NAJ_AC/last_att_logo_${advCode}`);

    return lastAtt;
}

export async function refreshLogoAfter30Days(adv, force) {
    const filePath = getLogoPath(adv.codigo);
    const dirInfo = await FileSystem.getInfoAsync(filePath);
    const fileExists = dirInfo.exists;
    
    const lastAtt = await getLastAtt(adv.codigo);
    const finalUrl = adv.url_base_original.replace('/naj-adv-web/public', '');
    const duration = moment.duration(moment().diff(lastAtt));
    const diffDays = Math.floor(duration.asDays());

    let fromUrl = `${finalUrl}naj-cliente/public/imagens/logo_escritorio/logo_escritorio.png`;
    let exit = true;

    if (__DEV__)
        fromUrl = 'http://192.168.0.107:8002/imagens/logo_escritorio/logo_escritorio.png';

    if (__DEV__ && adv.codigo == 136)
        fromUrl = 'http://192.168.0.107:8003/imagens/logo_escritorio/logo_escritorio.png';

    // se o arquivo não existe
    if (!fileExists || !lastAtt)
        exit = false;

    // se a diferença é maior ou igual a 29 dias
    if (lastAtt && diffDays >= 29)
        exit = false;

    if (exit && force !== 'FORCE') return;

    setLastAtt(adv.codigo);

    // se o arquivo existe ele é excluido
    if (fileExists)
        await FileSystem.deleteAsync(filePath);

    FileSystem.downloadAsync(
        fromUrl,
        filePath
    ).catch(error => {
        console.error(error);
    });
}
