import React from 'react';
import {Text} from 'react-native';

export default function NajText({children, ...rest}) {
  return (
    <>
      <Text {...rest}>{children}</Text>
    </>
  );
}
