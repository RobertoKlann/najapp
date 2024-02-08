import {StyleSheet} from 'react-native';

import {colors, getWidthPerCent} from '../../globals';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  datetimeContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSideContainer: {
    flex: 1,
  },
  datetimeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.title,
  },
  datetimeValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  blancLine: {
    height: 15,
  },
  floatButtonContainer: {
    justifyContent: 'center',
    width: getWidthPerCent(100),
    flexDirection: 'row',
    paddingBottom: 5,
  },
  floatButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    padding: 15,
    backgroundColor: '#2F9FD1',
    borderRadius: 50,
    elevation: 2,
  },
  floatButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 10,
  },
  loadingCotainer: {
    padding: 15,
  },
});

export default styles;
