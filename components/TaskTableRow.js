import React from "react";
import { StyleSheet, View } from "react-native";
import { MIcon, MText, MView } from "./MComponents";

const TaskTableRow = ({ index = 0, name = "", task = 0 }) => {
  return (
    <MView
      style={{
        ...styles.row,
        backgroundColor: index % 2 === 0 ? "#fff" : "#f1f1f1",
      }}
      key={index}
    >
      <MText style={{ width: "50%" }}>{name}</MText>
      <MText style={styles.rowVal}>{task}</MText>
      <MText style={styles.rowVal}>
        {index < 3 ? (
          <MIcon
            source="trophy-variant"
            color={index === 0 ? "#F9DA02" : index === 1 ? "gray" : ""}
          />
        ) : (
          index + 1 + "th"
        )}
      </MText>
    </MView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  rowVal: {
    width: "25%",
    textAlign: "center",
  },
});

export default TaskTableRow;
