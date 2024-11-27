import React, { Component, createContext } from "react";
import { StyleSheet } from "react-native";
import { DynamicInputList } from "./DynamicInputList";
import {
  MButton,
  MIcon,
  MText,
  MTouchable,
  MView,
} from "../components/MComponents";

// dynamic section list that loads a list of dynamic input lists based on config
export const DynamicSectionList = ({
  config,
  values,
  handleChange,
  setActive,
  defaultSection,
}) => {
  const [activeSection, setActiveSection] = React.useState(defaultSection);

  const ArrowUpIcon = (props) => <Icon {...props} name="arrow-up" />;

  const ArrowDownIcon = (props) => <Icon {...props} name="arrow-down" />;

  const setLocalActive = (section) => {
    if (section == activeSection) {
      setActiveSection("none");
    } else {
      setActiveSection(section);
    }
    setActive(section);
  };

  let key_template = "section_";

  // console.log("config", config)

  return (
    <MView style={styles.body}>
      {config.sections.map((section, index) => (
        <MView key={key_template + index} style={styles.form}>
          <MTouchable
            onPress={() => setLocalActive(section.id)}
            style={{
              width: "100%",
              backgroundColor: "#fff",
              height: 60,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomLeftRadius: activeSection === section.id ? 0 : 10,
              borderBottomRightRadius: activeSection === section.id ? 0 : 10,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 10,
            }}
          >
            <MText style={{ fontSize: 16 }}> {section.title}</MText>
            <MIcon
              source={activeSection === section.id ? "minus" : "plus"}
              color={"#000"}
              size={30}
            />
          </MTouchable>
          {activeSection == section.group || activeSection == section.id ? (
            <DynamicInputList
              containerStyle={{
                backgroundColor: "#fff",
                borderBottomRightRadius: 8,
                borderBottomLeftRadius: 8,
              }}
              index={index}
              section={section}
              values={values}
              handleChange={handleChange}
            />
          ) : (
            <></>
          )}
        </MView>
      ))}
    </MView>
  );
};

const styles = StyleSheet.create({
  body: {
    width: "100%",
    marginTop: 30,
    // marginBottom: 30,
  },
  form: {
    // paddingBottom: 20,
  },
  formInput: {
    marginTop: 10,
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
});
