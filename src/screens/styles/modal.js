import {StyleSheet} from 'react-native';

// globals
import {colors} from '../../globals';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footer: {
    padding: 10,
  },
  confirmButton: {
    backgroundColor: colors.pButton,
    padding: 10,
    borderRadius: 3,
  },
  confirmButtonText: {
    color: colors.pButtonText,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  errorList: {
    marginTop: 15,
    backgroundColor: '#f73434',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 3,
  },
  errorContainer: {
    paddingVertical: 5,
    justifyContent: 'center',
  },
  error: {
    color: '#fff',
  },
});

export default styles;
