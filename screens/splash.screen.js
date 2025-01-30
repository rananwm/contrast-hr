// simple loading screen
import React from "react";
import { storeData, getData } from "../src/store";
import { SafeAreaView, View, Image, StyleSheet, Platform } from "react-native";
import { APP_LOGO, COLORS, ROUTES } from "../constants";
import { ActivityIndicator } from "react-native-paper";

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
        <View
          style={{
            backgroundColor: COLORS.BLACK,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Image
            source={APP_LOGO.WORKPLAY_STACKED}
            style={{ height: 100, width: 100, resizeMode: "contain" }}
          />
        </View>
        {/* <ActivityIndicator /> */}
      </View>
    </SafeAreaView>
  );
};
