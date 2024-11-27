import * as React from 'react';
import { Badge } from 'react-native-paper';

const MBadge = (props) => (
  <Badge {...props}>
    {props.children}
  </Badge>
);

export default MBadge;