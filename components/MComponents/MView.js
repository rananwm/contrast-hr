import * as React from "react";
import { View } from "react-native";

const MView = (props) => <View {...props}>{props.children}</View>;

export default MView;
