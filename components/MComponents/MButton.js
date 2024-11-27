import * as React from "react";
import { Button } from "react-native-paper";
import MText from "./MText";

const MButton = (props) => (
  <Button mode="contained" {...props}>
    <MText
      style={{
        color: "white",
        fontSize: 12,
        ...(props?.textStyle ? { ...props.textStyle } : {}),
      }}
    >
      {props.children}
    </MText>
  </Button>
);

export default MButton;
