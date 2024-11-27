import React from "react";
import { Modal, Portal } from "react-native-paper";

export const MModal = (props) => {
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    minHeight: 400,
  };

  return (
    <Portal>
      <Modal contentContainerStyle={containerStyle} {...props}>
        {props.children}
      </Modal>
    </Portal>
  );
};
