import {Dimensions} from 'react-native';

export const metrics = {
  screen: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
};

export const colors = {
  primary: '#2F323E',
  secundary: '#2F9FD1',
  background: '#edf3f3',
  yellow: '#F9B300',
  red: '#fe5051',

  // text
  title: '#666',
  subTitle: '#999',

  // list
  listSeparator: '#e1e1e1',

  // #F0F1F5

  // primary button
  pButton: '#2F9FD1',
  pButtonDark: '#00608b',
  pButtonText: '#edf3f3',

  // secundary button
  sButton: '#2F9FD1',
  sButtonText: '#edf3f3',
};

export function getHeightPerCent(perCent) {
  return (perCent / 100) * metrics.screen.height;
}

export function getWidthPerCent(perCent) {
  return (perCent / 100) * metrics.screen.width;
}