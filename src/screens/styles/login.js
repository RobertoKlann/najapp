import {StyleSheet} from 'react-native';

// globals
import {colors} from '../../globals';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 15,
  },
  input: {
    marginBottom: 15,
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
