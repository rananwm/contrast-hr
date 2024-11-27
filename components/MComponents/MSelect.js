import * as React from "react";
import DropDown from "react-native-paper-dropdown";

const MSelect = (props) => {
  const [showDropDown, setShowDropDown] = React.useState(false);
  return (
    <DropDown
      activeColor="#000"
      mode={"flat"}
      visible={showDropDown}
      showDropDown={() => setShowDropDown(true)}
      onDismiss={() => setShowDropDown(false)}
      {...props}
      inputProps={{
        style: {
          backgroundColor: "#fff",
        },
      }}
    />
  );
};

export default MSelect;
