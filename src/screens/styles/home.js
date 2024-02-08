import { StyleSheet } from 'react-native';

// globals
import {
  colors,
  metrics,
  getHeightPerCent,
  getWidthPerCent,
} from '../../globals';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  emptyMessageContainer: {
    padding: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 15,
  },
  headerTop: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 15,
  },
  headerBottom: {
    zIndex: 5,
    height: getHeightPerCent(20),
    width: metrics.screen.width,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: 0,
    left: 0,
    borderBottomColor: colors.secundary,
    borderBottomWidth: 10,
  },
  content: {
    zIndex: 10,
    marginTop: 15,
  },
  headerIcon: {
    padding: 15,
    paddingRight: 10,
    borderRadius: 10,
    marginTop: -7
  },
  advName: {
    color: '#fff',
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingTop: 10,
  },
  userName: {
    color: '#e1e1e1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  financeContainer: {
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 3,
    elevation: 1,
  },
  financeIconLeft: {
    backgroundColor: colors.red,
    flexDirection: 'row',
    padding: 10,
    borderRadius: 3,
    elevation: 2,
  },
  financeIconCenter: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  financeIconRight: {
    backgroundColor: colors.secundary,
    flexDirection: 'row',
    padding: 10,
    borderRadius: 3,
    elevation: 2,
  },
  financeRow: {
    flexDirection: 'row',
  },
  financeButton: {
    flex: 1,
    padding: 15,
  },
  financeCol: {
    //alignItems: 'center',
    paddingHorizontal: 10,
  },
  textFinance: {
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold',
  },
  textFinanceCenter: {
    paddingTop: 10,
    paddingBottom: 10,
    color: 'rgba(0, 0, 0, 0)',
  },
  textFinanceToPay: {
    paddingTop: 2,
    paddingBottom: 5,
    paddingLeft: 5,
    color: colors.red,
    fontWeight: 'bold',
    fontSize: 12,
  },
  textFinanceMiddle: {
    paddingTop: 2,
    paddingBottom: 5,
    color: 'rgba(0, 0, 0, .5)',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  textFinanceCenterText: {
    paddingTop: 2,
    paddingBottom: 5,
    color: 'rgba(0, 0, 0, .5)',
    fontSize: 12,
    fontStyle: 'italic',
  },
  textFinanceToReceive: {
    paddingTop: 2,
    paddingBottom: 5,
    color: '#0c0',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'right',
  },
  cardTitle: {
    color: colors.primary,
    fontSize: 16,
  },
  cardRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  advLogoContainer: {
    zIndex: 9999,
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    paddingTop: 15,
  },
  advLogo: {
    width: 250,
  },
});

export default styles;
