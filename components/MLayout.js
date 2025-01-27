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
import { COLORS, ROUTES, WEB_URL } from "../constants";
import { getAuthData, getItems } from "../src/store";
import { profile_get } from "../src/api";
import { useAuth } from "../context/AuthContext";

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
    const { user, profile: profile_image } = useAuth();
    const [profile, setProfile] = React.useState({});
    React.useEffect(() => {
      // console.log("user", user);
      // getAuthData().then(async (user) => {
      //   console.log("user", user);
      // setAuth(auth);
      //   if (user && user.data) {
      //     const resp = await getItems(user, [
      //       { key: "profile", stateHook: setProfile, apiFallback: profile_get },
      //     ]);
      //     console.log("resp", profile);
      //   } else {
      //     console.log("auth failed!!!", user);
      //     alert("Your session has expired. Please log in again.");
      //     removeData("auth");
      //     navigation.navigate(ROUTES.LOGIN);
      //   }
      // });
      if (user) {
        setProfile(user?.data);
      }
      if (profile_image) {
        setProfile({
          ...user?.data,
          profile_image: profile_image?.profile_image,
        });
      }
    }, []);
    const profileImage = useMemo(() => {
      return `${WEB_URL}/${profile?.profile_image}`;
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
