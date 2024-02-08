import {StyleSheet} from 'react-native';

import {colors, getWidthPerCent} from '../../globals';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  list: {},
  listItem: {
    padding: 10,
    //backgroundColor: '#fff',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#eaeaea',
  },
  listHeaderCounter: {
    flex: 1,
  },
  listHeaderTitle: {
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listHeaderValue: {
    fontWeight: 'bold',
  },
  listHeader: {
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 9,
    width: getWidthPerCent(100),
    height: 60,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  listTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  listDate: {
    flex: 1,
  },
  listDateText: {
    //fontWeight: 'bold',
  },
  nonInfo: {
    color: '#777',
  },
  listValue: {
    fontWeight: 'bold',
  },
  listStatus: {
    paddingHorizontal: 5,
    backgroundColor: '#777981',
    padding: 3,
    borderRadius: 5,
  },
  listStatusText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default styles;
