import {StyleSheet} from 'react-native';

import {colors} from '../../globals';

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  itemDesc: {},
  itemDateWrapper: {
    padding: 5,
    backgroundColor: '#F9B300',
    borderRadius: 5,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRow: {
    marginTop: 5,
    flexDirection: 'row',
  },
  processTitle: {
    fontWeight: 'bold',
    paddingVertical: 3,
  },
  timeIcon: {
    paddingRight: 5,
  },
});

export default styles;
