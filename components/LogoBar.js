// Logo bar component
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import { MView, MText, MIcon } from "./MComponents";
import { COLORS } from "../constants";

export const LogoBar = ({ isProfile = false, onProfilePress = () => {} }) => {
  const theme = useTheme();

  return (
    <MView style={styles.headerLogos}>
      <Image
        resizeMode={"contain"}
        style={{ width: "40%", marginRight: 10, height: 50 }}
        source={require("../assets/exectras_logo.png")}
      />
      {isProfile && (
        <TouchableOpacity onPress={onProfilePress}>
          <MIcon source="menu" size={35} color="#fff" />
        </TouchableOpacity>
      )}

      {/* <Image
        resizeMode={"contain"}
        style={{ width: "40%", height: 100 }}
        source={require("./../assets/sweetgrass_logo.png")}
      /> */}
      {/* <MText style={{marginTop: 60, fontWeight: 'bold', fontSize: 22, width: '40%', height: 100}}>Ka:'yu:'k't'h'/Che:k:tles7et'h' First Nations</MText> */}
    </MView>
  );
};

const styles = StyleSheet.create({
  headerLogos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
    paddingHorizontal: 20,
    width: "100%",
    backgroundColor: COLORS.PRIMARY,
    flex: 1,
    maxHeight: 70,
  },
});
