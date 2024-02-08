import {StyleSheet} from 'react-native';

import {getWidthPerCent, colors} from '../../globals';

const WIDTH_HEIGHT = getWidthPerCent(33);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  imageContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  image: {
    width: WIDTH_HEIGHT,
    height: WIDTH_HEIGHT,
  },
  middleText: {
    padding: 10,
    textAlign: 'center',
  },
  bottomContainer: {
    padding: 15,
  },
  headerText: {
    paddingTop: 20,
    color: colors.pButtonText,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;
