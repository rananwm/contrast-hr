// simple loading screen
import React from "react";
import { storeData, getData } from "../src/store";
import { SafeAreaView, View, Image, StyleSheet, Platform } from "react-native";
import { COLORS, ROUTES } from "../constants";

export default ({ navigation }) => {
  const [auth, setAuth] = React.useState("");

  React.useEffect(() => {
    const getAuth = async () => {
      const auth = await getData("auth", setAuth);
      if (auth) {
        navigation.reset(
          {
            index: 0,
            routes: [{ name: ROUTES.HOME }],
          },
          0
        );
      } else {
        navigation.reset(
          {
            index: 0,
            routes: [{ name: ROUTES.LOGIN }],
          },
          0
        );
      }
    };
    getAuth();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          resizeMode={"contain"}
          style={{
            width: Platform.OS === "android" ? "38%" : "90%",
            marginTop: -24,
            borderRadius: 10,
            ...(Platform.OS === "android" && {
              height: 150,
            }),
          }}
          source={require("./../assets/icon.jpg")}
        />
      </View>
    </SafeAreaView>
  );
};
