import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-community/picker';

import {changeFinanceFilter} from '../store/modules/auth/actions';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
  },
  pickerBoxInner: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  picker: {
    width: '150%',
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

export default function FinanceFilterButton({selected, onChangeSelectedItem}) {
  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = React.useState(1);

  const options = [
    {label: 'Todos', value: 1},
    {label: 'Em aberto', value: 2},
    {label: 'Pago/Recebido', value: 3},
  ];

  function onChangeSelected(value) {
    setSelectedItem(value);
  }

  function handleRenderItem({label, value}) {
    return <Picker.Item key={String(value)} label={label} value={value} />;
  }

  React.useEffect(() => {
    dispatch(changeFinanceFilter(selectedItem));
  }, [selectedItem]);

  return <View />;
  /*
  return (
    <View style={styles.container}>
      <View style={styles.pickerBoxInner}>
        <Picker
          selectedValue={selectedItem}
          style={styles.picker}
          mode="dropdown"
          onValueChange={onChangeSelected}>
          {options.map(item => handleRenderItem(item))}
        </Picker>

        <MaterialIcon name="more-vert" size={24} color="#f1f1f1" />
      </View>
    </View>
  );*/
}
