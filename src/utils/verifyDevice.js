import CPanelService from '../services/cpanel';
import getUserInfo from './getUserInfo';

async function verifyDevice() {
  const deviceData = await getUserInfo();
  // console.tron.log('asdasd');
  // console.tron.log(deviceData);

  try {
    const response = await CPanelService.post('/api/v1/app/auth/device/permission', { device: deviceData });
  } catch (err) {
    // console.tron.log(err);
  }
  // console.tron.log('**************');
}

export default verifyDevice;