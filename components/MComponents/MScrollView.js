import { ScrollView, ScrollViewProps } from "react-native";
import React from "react";

const MScrollView = (props) => {
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {props.children}
    </ScrollView>
  );
};

export default MScrollView;
