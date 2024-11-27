import * as React from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { en, registerTranslation } from "react-native-paper-dates";

import moment from "moment";

registerTranslation("en", en);

const MDatePicker = (props) => {
  const { setDate, value, format, ...rest } = props;
  // const [open, setOpen] = React.useState(false);

  const dateValue = value ? moment(value).toDate() : null;

  const onConfirmSingle = React.useCallback(
    (newValue) => {
      //   setOpen(false);
      const dateString = moment(newValue).format(format);
      setDate(newValue);
    },
    [setDate]
  );

  return (
    //   <SafeAreaProvider>
    <View
      style={{
        justifyContent: "center",
        flex: 1,
        alignItems: "center",
      }}
    >
      {/* <TextInput style={{width: '100%', marginTop: 10}} onTouchStart={() => setOpen(true)} uppercase={false} placeholder="Pick date">
            {value}
            </TextInput> */}
      <DatePickerInput
        style={{ width: "100%", marginTop: 10, backgroundColor: "#fff" }}
        locale="en"
        // mode="single"
        // visible={open}
        // onDismiss={onDismissSingle}
        value={dateValue}
        onChange={onConfirmSingle}
        // onConfirm={onConfirmSingle}
        {...rest}
      />
    </View>
    //   </SafeAreaProvider>
  );
};

export default MDatePicker;
