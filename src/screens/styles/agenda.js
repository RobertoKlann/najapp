import {StyleSheet} from 'react-native';

import {colors, metrics} from '../../globals';

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
    paddingTop: 15,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  itemTitle: {
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  processTitle: {
    fontWeight: 'bold',
    paddingVertical: 3,
  },
  timeWrapper: {
    padding: 5,
    backgroundColor: '#F9B300',
    borderRadius: 5,
    marginRight: 5,
  },
  timeIcon: {
    paddingRight: 5,
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
  },
});

export default styles;
