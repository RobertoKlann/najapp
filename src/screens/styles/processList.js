import {StyleSheet} from 'react-native';

import {colors} from '../../globals';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  loadingCotainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
});

export default styles;
