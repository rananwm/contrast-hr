import * as React from 'react';
import { Text } from 'react-native-paper';

const MText = (props) => (
  <Text {...props}>
    {props.children}
  </Text>
);

export default MText;