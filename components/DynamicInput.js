import React, { Component, createContext } from "react";
import { Image, StyleSheet } from "react-native";
import {
  MView,
  MText,
  MInput,
  MSwitch,
  MSelect,
  MRadio,
  MLargeSelect,
  MDatePicker,
  MButton,
} from "./MComponents";
import { COLORS } from "../constants";
import * as ImagePicker from "expo-image-picker";
import { t } from "i18next";

// dynamic input component that takes in props and becomes a text or dropdown component
export const DynamicInput = ({
  fieldKey,
  id,
  label,
  type,
  defaultValue,
  options,
  required,
  handleChange,
  valueType = "",
}) => {
  const [value, setValue] = React.useState("");
  const [isValid, setIsValid] = React.useState(true);

  let key = fieldKey;

  // set value for first load
  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const localHandleChange = (id, newValue) => {
    setValue(newValue);
    handleChange(id, newValue);
  };

  // available types: text, select, display, password-update
  if (type == "text") {
    return (
      <MInput
        key={key}
        label={label}
        style={styles.formInput}
        placeholder=""
        value={value}
        required={required}
        onChangeText={(nextValue) => localHandleChange(id, nextValue)}
      />
    );
  } else if (type == "textarea") {
    return (
      <MInput
        key={key}
        multiline={true}
        textStyle={{ minHeight: 64 }}
        placeholder=""
        value={value}
        required={required}
        onChangeText={(nextValue) => localHandleChange(id, nextValue)}
      />
    );
  } else if (type == "select") {
    // get index of value in options array
    // console.log("test", options, "my value", defaultValue)
    // console.log(JSON.stringify(Object.entries(options)))

    const handleSelectChange = (value) => {
      // let curValue = options[index-1]

      // if (typeof curValue == 'object') {
      //       curValue = curValue.value
      // }

      localHandleChange(id, value);
    };

    return (
      <MView key={key}>
        <MSelect
          style={styles.inlineRadio}
          value={value}
          setValue={(index) => {
            handleSelectChange(index);
          }}
          list={options}
          placeholder={"Select"}
          required={required}
        />
        {/* {(options).map((option, index) => (
                              renderOption(option, index)
                        ))}
                  </MSelect> */}
      </MView>
    );
  } else if (type == "large-select") {
    // get index of value in options array
    // console.log("test", options, "my value", defaultValue)
    // console.log(JSON.stringify(Object.entries(options)))

    const handleSelectChange = (value) => {
      // let curValue = options[index-1]

      // if (typeof curValue == 'object') {
      //       curValue = curValue.value
      // }

      localHandleChange(id, value);
    };

    return (
      <MView key={key}>
        <MLargeSelect
          style={styles.inlineRadio}
          value={value}
          setValue={(index) => {
            handleSelectChange(index);
          }}
          list={options}
          required={required}
          placeholder={"Search"}
        />
        {/* {(options).map((option, index) => (
                              renderOption(option, index)
                        ))}
                  </MSelect> */}
      </MView>
    );
  } else if (type == "radiogroup") {
    const handleRadioChange = (value) => {
      localHandleChange(id, value);
    };

    return (
      <MView key={key}>
        <MRadio
          style={styles.inlineRadio}
          position={"leading"}
          value={value}
          onValueChange={(value) => {
            handleRadioChange(value);
          }}
          list={options}
        />
      </MView>
    );
  } else if (type == "display") {
    return (
      <MView key={key}>
        <MText style={styles.formInputLabel}>{defaultValue}</MText>
      </MView>
    );
  } else if (type == "password-update") {
    const [altValue, setAltValue] = React.useState("");
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const handlePasswordChange = (id, newValue, isPrimary) => {
      if (isPrimary) {
        localHandleChange(id, newValue);
        setIsValid(newValue == altValue);
      } else {
        setAltValue(newValue);
        setIsValid(value == newValue);
      }
    };

    targetStyles = isValid ? styles.formInput : styles.formInputInvalid;

    return (
      <MView key={key}>
        <MInput
          style={targetStyles}
          label="New Password"
          placeholder=""
          value={value}
          secureTextEntry={secureTextEntry}
          required={required}
          onChangeText={(nextValue) =>
            handlePasswordChange(id, nextValue, true)
          }
        />
        <MInput
          style={targetStyles}
          label="Confirm Password"
          placeholder=""
          value={altValue}
          secureTextEntry={secureTextEntry}
          required={required}
          onChangeText={(nextValue) =>
            handlePasswordChange(-1, nextValue, false)
          }
        />
        <MSwitch
          containerStyle={{ marginTop: 7 }}
          label={"Show Password"}
          value={!secureTextEntry}
          onValueChange={(isChecked) => setSecureTextEntry(!isChecked)}
        />
      </MView>
    );
  } else if (type == "toggle") {
    const handleToggleChange = (id, isChecked) => {
      const newValue =
        valueType === "number"
          ? isChecked
            ? "1"
            : "0"
          : isChecked
          ? "yes"
          : "no";
      localHandleChange(id, newValue);
    };
    // console.log("toggle value", value)
    const toggleValue =
      valueType === "number"
        ? value === "1"
          ? true
          : false
        : value == "yes"
        ? true
        : false;

    return (
      <MSwitch
        containerStyle={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
        label={options}
        key={id}
        value={toggleValue}
        required={required}
        onValueChange={(isChecked) => handleToggleChange(id, isChecked)}
      />
    );
  } else if (type == "aradiogroup") {
    const handleRadioGroupChange = (index) => {
      let curValue = options[index];

      if (typeof curValue == "object") {
        curValue = curValue.key;
      }

      localHandleChange(id, curValue);
    };

    const renderRadioOption = (option, index) => {
      // if the options are an array of strings
      let curTitle = option;

      if (typeof option == "object") {
        curTitle = option.label;
      }

      return (
        <Radio key={index} value={index}>
          {curTitle}
        </Radio>
      );
    };

    const keys = Object.keys(options);

    let selectedIndex = -1;
    let displayValue = "";

    if (value != "" && value) {
      if (typeof options[0] == "object") {
        let curOption = options.find((option) => option.key == value);
        selectedIndex = options.indexOf(curOption);
        displayValue = curOption.label;
      } else {
        selectedIndex = options.indexOf(value);
        displayValue = value;
      }
    }

    return (
      <MView key={key}>
        <MRadio
          style={styles.formRadioGroup}
          selectedIndex={selectedIndex.row}
          value={displayValue}
          onValueChange={(index) => {
            handleRadioGroupChange(index);
          }}
        >
          {options.map((option, index) => renderRadioOption(option, index))}
        </MRadio>
      </MView>
    );
  } else if (type == "datepicker") {
    return (
      <MDatePicker
        value={value}
        format="YYYY-MM-DD"
        setDate={(date) => {
          localHandleChange(id, date);
        }}
        required={required}
      />
    );
  } else if (type === "image-picker") {
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        localHandleChange(id, result.assets[0].uri);
      }
    };
    return (
      <MView key={key}>
        <Image
          source={
            value && value !== "false"
              ? { uri: value }
              : require("../assets/profile.jpg")
          }
          resizeMode="contain"
          style={{
            height: 200,
            width: "100%",
            borderRadius: 20,
            marginTop: 20,
          }}
        />
        <MButton style={styles.btn} onPress={pickImage}>
          {t("profile.select_image")}
        </MButton>
      </MView>
    );
  } else {
    return (
      <MView key={key}>
        <MText style={styles.formInputLabel}>Not implemented</MText>
      </MView>
    );
  }
};

const styles = StyleSheet.create({
  body: {
    width: "95%",
  },
  form: {
    paddingBottom: 20,
  },
  formInput: {
    backgroundColor: "#fff",
  },
  formInputInvalid: {
    borderColor: "red",
    borderWidth: 1,
  },
  formToggles: {
    textAlign: "left",
    // flexDirection: 'row',
    // flex set one per line
    flexFlow: "row wrap",
    alignItems: "flex-start",
  },
  formToggle: {
    textAlign: "left",
    marginTop: 5,
    width: "200",
  },
  formRadioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  formRadioButton: {
    // this doesn't work :(
    textTransform: "capitalize",
  },
  formInputLabel: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "bold",
    color: "#949FB7",
  },
  actions: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    marginTop: 15,
    justifyContent: "flex-start",
  },
  action: {
    marginRight: 5,
    backgroundColor: "#009dce",
    borderColor: "#009dce",
  },
  btn: {
    backgroundColor: COLORS.PRIMARY,
    color: COLORS.WHITE,
    borderRadius: 5,
    marginTop: 10,
    textAlign: "center",
  },
});
