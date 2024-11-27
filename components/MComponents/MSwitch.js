import * as React from "react";
import { Switch } from "react-native-paper";
import { StyleSheet } from "react-native";
import MText from "./MText";
import MView from "./MView";

// const MSwitch = (props) => {
//   {containerStyle, label, value, onValueChange} = props,  // destructure props
//  return (

// )};
const MSwitch = (props) => {
  const { containerStyle, label, value, onValueChange } = props;
  return (
    <MView style={[styles.switchContainer, containerStyle]}>
      <Switch
        style={styles.switchLabel}
        value={value}
        onValueChange={onValueChange}
      />
      <MText>{label}</MText>
    </MView>
  );
};
const styles = StyleSheet.create({
  switchContainer: {},
  switchLabel: {
    marginRight: 10,
  },
  switchControl: {
    // flex: 1,
  },
});

export default MSwitch;
