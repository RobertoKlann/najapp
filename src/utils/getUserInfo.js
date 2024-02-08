// import DeviceInfo from 'react-native-device-info';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function getUserInfo() {
  const deviceId = Device.osInternalBuildId;
  const deviceModel = Device.modelName;
  const deviceOSVersion = Device.osVersion;

  const pusherId = await AsyncStorage.getItem(
    '@NAJ_AC/pusher_id',
  );

  return {
    deviceId,
    pusherId,
    deviceModel,
    deviceOSVersion,
  };
}
