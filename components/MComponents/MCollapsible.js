import * as React from "react";
import { TouchableOpacity } from "react-native";

const MTouchable = (props) => (
  <TouchableOpacity activeOpacity={0.9} {...props}>
    {props.children}
  </TouchableOpacity>
);

export default MTouchable;
