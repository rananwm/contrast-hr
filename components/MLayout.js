import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import MHeader from "./MComponents/MHeader";
import { MIcon, MText, MTouchable, MView } from "./MComponents";
import { useNavigation } from "@react-navigation/native";
import { COLORS, ROUTES } from "../constants";
import { getAuthData, getItems } from "../src/store";
import { profile_get } from "../src/api";

const MLayout = forwardRef(
  (
    {
      children,
      statusBarColor = COLORS.PRIMARY,
      containerStyle = {},
      headerTitle = "",
      headerProps = {},
      isHeader = true,
      isProfileHeader = false,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      profile,
    }));
    const navigation = useNavigation();
    const [profile, setProfile] = React.useState({});
    React.useEffect(() => {
      getAuthData().then(async (auth) => {
        // setAuth(auth);
        if (auth && auth.data) {
          await getItems(auth, [
            { key: "profile", stateHook: setProfile, apiFallback: profile_get },
          ]);
        } else {
          console.log("auth failed!!!", auth);
          alert("Your session has expired. Please log in again.");
          removeData("auth");
          navigation.navigate(ROUTES.LOGIN);
        }
      });
    }, []);
    const profileImage = useMemo(() => {
      return `https://app.myexectras.com/${
        profile?.profile_image
      }?${new Date().getTime()}`;
    }, [profile?.profile_image]);
    return (
      <MView
        style={{
          backgroundColor: statusBarColor,
          flex: 1,
        }}
      >
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={
            Platform.OS === "android" ? COLORS.PRIMARY : statusBarColor
          }
        />
        <SafeAreaView style={{ ...styles.flex_1, ...containerStyle }}>
          {isProfileHeader ? (
            <MHeader
              leftIcon={"chevron-left"}
              containerStyle={{
                paddingBottom: 10,
                paddingHorizontal: 20,
              }}
              renderLeftIcon={
                <MView style={styles.profileContainer}>
                  <Image
                    style={styles.profileIcon}
                    source={
                      profile?.profile_image
                        ? { uri: profileImage }
                        : require("./../assets/profile.jpg")
                    }
                  />
                  <MText
                    style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}
                  >
                    {profile?.name || ""} {profile?.surname || ""}
                  </MText>
                </MView>
              }
              renderRightIcon={
                <MTouchable
                  onPress={() => {
                    navigation.openDrawer();
                  }}
                >
                  <MIcon
                    source="menu"
                    color={"#fff"}
                    size={35}
                    style={{ marginRight: 20 }}
                  />
                </MTouchable>
              }
            />
          ) : isHeader ? (
            <MHeader title={headerTitle} {...headerProps} />
          ) : null}
          <View style={styles.flex_1}>{children}</View>
        </SafeAreaView>
      </MView>
    );
  }
);

const styles = StyleSheet.create({
  flex_1: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    height: 50,
    width: 50,
    marginRight: 10,
    borderRadius: 100,
    resizeMode: "cover",
  },
});

export default MLayout;
