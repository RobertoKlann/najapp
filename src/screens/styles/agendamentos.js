import { StyleSheet } from 'react-native';

import { colors, metrics } from '../../globals';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9,
    backgroundColor: '#fff',
    width: metrics.screen.width,
    height: metrics.screen.height,
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 15,
    paddingBottom: 30,
    paddingHorizontal: 15,
    //textAlign: 'center',
  },
  buttonWrapper: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
});

export default styles;
