import {StyleSheet} from 'react-native';

// globals
import {colors} from '../../globals';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  warningContainer: {
    padding: 10,
    backgroundColor: colors.secundary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  listItem: {
    paddingHorizontal: 15,
    paddingVertical: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  listItemDisable: {
    backgroundColor: 'rgba(0, 0, 0, .05)',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.title,
  },
  emptyList: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyIcon: {
    paddingRight: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.title,
    textAlign: 'center',
    flex: 1,
  },
  listText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.subTitle,
  },
  listSeparator: {
    height: 1,
    marginHorizontal: 15,
    backgroundColor: colors.listSeparator,
  },
  icon: {
    color: colors.title,
  },
});

export default styles;
