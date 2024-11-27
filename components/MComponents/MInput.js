import * as React from "react";
import { TextInput, HelperText } from "react-native-paper";
import MView from "./MView";
import {} from "react-native-paper";

const MInput = (props) => {
  const {
    value,
    style,
    label,
    multiline,
    placeholder,
    secureTextEntry,
    required,
    ...rest
  } = props;
  const [dirty, setDirty] = React.useState(false);

  const onLocalChangeText = (newText) => {
    props.onChangeText(newText);
    setDirty(true);
  };

  const hasErrors = () => {
    return dirty && required && value == "";
  };

  return (
    <MView>
      <TextInput
        label={label}
        multiline={multiline}
        value={value}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={style}
        onChangeText={onLocalChangeText}
        {...rest}
      />
      <HelperText
        style={{ display: hasErrors() ? "flex" : "none" }}
        padding="none"
        type="error"
      >
        {label} is required.
      </HelperText>
    </MView>
  );
};

export default MInput;
