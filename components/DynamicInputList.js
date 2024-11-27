import React, { Component, createContext } from "react";
import { DynamicInput } from "./DynamicInput";
import { StyleSheet } from "react-native";
import { MView, MText } from "./MComponents";

// dynamic input list that load a list of dynamic inputs based on config
export const DynamicInputList = ({
  index,
  section,
  values,
  handleChange,
  containerStyle,
}) => {
  let key = "section_" + index + "_input_" + index;

  const shouldShowInput = (field) => {
    let show = false;
    // if show_if is set, then check if the values listed are set
    if (field.show_if) {
      for (let i = 0; i < field.show_if.length; i++) {
        // show_if is a key value pair
        let showIfKey = Object.keys(field.show_if[i])[0];
        let showIfValue = field.show_if[i][showIfKey];

        // if the key exists in values then lets check for the value
        if (values[showIfKey] == showIfValue) {
          show = true;
          break;
        }
      }
    } else if (field.hide_if) {
      show = true;
      for (let i = 0; i < field.hide_if.length; i++) {
        // show_if is a key value pair
        let showIfKey = Object.keys(field.hide_if[i])[0];
        let showIfValue = field.hide_if[i][showIfKey];

        // if the key exists in values then lets check for the value
        if (values[showIfKey] == showIfValue) {
          show = false;
          break;
        }
      }
    } else {
      show = true;
    }

    return show;
  };
  const getValue = (id, source) => {
    if (!source) return "";

    // Split the id by dots to handle potential nested keys
    const keys = id?.split(".");
    let current = source;

    // Iterate through the keys to access the nested property
    for (let i = 0; i < keys?.length; i++) {
      current = current?.[keys?.[i]];
      if (current === undefined) return ""; // Return empty string if any key is not found
    }

    return current;
  };
  return (
    <MView style={containerStyle} key={key}>
      {section.fields.map((field, index) => {
        if (!shouldShowInput(field)) {
          // skip this field
          return null;
        }

        let fieldKey = key + "_" + field.id;
        let defaultValue = getValue(field?.id, values);
        // if (field.id == 'mailing_address') {
        //       console.log("field 123213", field, values)
        // }

        return (
          <MView style={{ padding: 8 }} key={fieldKey}>
            <MText style={styles.formInputLabel}>
              {field.label}
              {field.required ? (
                <MText style={styles.formInputRequired}> *</MText>
              ) : null}
            </MText>
            {field.prompt ? (
              <MText
                key={fieldKey + "_prompt"}
                style={styles.formInputSubLabel}
              >
                {field.prompt}
              </MText>
            ) : null}
            {/* if DynamicInput is 'toggles' then map through them as toggle types */}
            {field.type == "toggles" ? (
              field.options.map((toggle, index) => {
                // console.log(values[toggle.value])
                // defaultValue = values[toggle.key] == 'yes' ? true : false
                return (
                  <MView
                    key={fieldKey + index + "_layout"}
                    style={styles.formToggles}
                  >
                    <DynamicInput
                      style={styles.formToggles}
                      fieldKey={fieldKey + "_input"}
                      id={toggle.value}
                      label={toggle.label}
                      type="toggle"
                      //     defaultValue={values[0]}
                      options={toggle.label}
                      handleChange={handleChange}
                      required={field.required}
                      valueType={field?.valueType || ""}
                    />
                  </MView>
                );
              })
            ) : (
              // else render the DynamicInput as normal
              <DynamicInput
                fieldKey={fieldKey}
                id={field.id}
                label={field.label}
                type={field.type}
                defaultValue={defaultValue}
                options={field.options}
                handleChange={handleChange}
                required={field.required}
                valueType={field?.valueType || ""}
              />
            )}
            {field.subtext ? (
              <MText
                key={fieldKey + "_subtext"}
                style={styles.formInputSubLabel}
              >
                {field.subtext}
              </MText>
            ) : null}
          </MView>
        );
      })}
    </MView>
  );
};

const styles = StyleSheet.create({
  formInputLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#949FB7",
  },
  formToggles: {
    textAlign: "left",
    // flexDirection: 'row',
    // flex set one per line
    marginTop: 10,
    flexFlow: "row wrap",
    alignItems: "flex-start",
    width: 250,
  },
  formInputSubLabel: {
    marginBottom: 5,
    fontSize: 13,
    fontWeight: "bold",
    color: "#949FB7",
  },
  formInputRequired: {
    color: "red",
    fontSize: 13,
  },
});
