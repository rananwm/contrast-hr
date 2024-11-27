import { View, Text, SafeAreaView, Image } from "react-native";
import React from "react";
import { MIcon, MText, MTouchable, MView } from "./MComponents";
import { COLORS, ROUTES } from "../constants";
import { CommonActions } from "@react-navigation/native";
import { profile_signout } from "../src/api";
import { clearAll, getAuthData } from "../src/store";
import { t } from "i18next";

const DrawerContent = ({ navigation }) => {
  const [auth, setAuth] = React.useState("");

  const menuList = [
    {
      name: "profile.label",
      icon: "account",
      route: ROUTES.PROFILE,
    },
    {
      name: "timeoff.request_time_off",
      icon: "timer-off",
      route: ROUTES.REQUEST_TIME_OFF,
      isProfileStack: false,
    },
    {
      name: "Events",
      icon: "calendar",
      route: ROUTES.EVENT_STACK,
      isProfileStack: false,
    },
    {
      name: "bottom_navigation.notifications",
      icon: "bell",
      route: ROUTES.NOTIFICATIONS_STACK,
      isProfileStack: false,
    },
    {
      name: "profile.summary.employment_summary",
      icon: "briefcase",
      route: ROUTES.EMPLOYMENT_SUMMARY,
    },
    {
      name: "profile.summary.compensation_summary",
      icon: "credit-card-outline",
      route: ROUTES.COMPENSATION_SUMMARY,
    },
    {
      name: "profile.summary.profile_assets",
      icon: "card-text-outline",
      route: ROUTES.ASSETS_SUMMARY,
    },
    {
      name: "profile.qualification.label",
      icon: "school",
      route: ROUTES.QUALIFICATIONS_SUMMARY,
    },
    {
      name: "Documents",
      icon: "file-document-multiple",
      route: ROUTES.DOCUMENTS,
    },
  ];
  const signOut = async () => {
    profile_signout(auth.data.profile_auth, auth.cookie).then((response) => {
      if (response && response.status == "success") {
        clearAll();
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.LOGIN }],
        });
      } else {
        alert("There was an error signing out.");
      }
    });
  };
  React.useEffect(() => {
    getAuthData(setAuth).then(async (auth) => {
      setAuth(auth);
      if (auth && auth.data) {
      } else {
        console.log("auth failed!!!", auth);
        alert("Your session has expired. Please log in again.");
        removeData("auth");
        navigation.navigate(ROUTES.LOGIN);
      }
    });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        resizeMode={"contain"}
        style={{
          height: 50,
          width: "90%",
          alignSelf: "center",
        }}
        source={require("../assets/logo.png")}
      />

      <MView style={{ flex: 1, marginTop: 12 }}>
        {menuList?.map((item, index) => {
          const isActive = false;
          const isProfileStack = item.isProfileStack === false ? false : true;
          return (
            <MTouchable
              key={index}
              onPress={() => {
                if (isProfileStack) {
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: ROUTES.PROFILE_STACK,
                      params: {
                        screen: item.route,
                      },
                    })
                  );
                } else {
                  navigation.navigate(item.route);
                }
              }}
              style={{
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: isActive ? COLORS.PRIMARY : COLORS.WHITE,
              }}
            >
              <MIcon
                source={item.icon}
                size={24}
                color={isActive ? COLORS.WHITE : COLORS.PRIMARY}
              />
              <MText
                style={{
                  color: isActive ? COLORS.WHITE : COLORS.PRIMARY,
                  fontWeight: "600",
                  fontSize: 15,
                }}
              >
                {t(item?.name)}
              </MText>
            </MTouchable>
          );
        })}
      </MView>
      <MTouchable
        onPress={signOut}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 12,
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
          backgroundColor: COLORS.PRIMARY,
        }}
      >
        <MIcon source="logout" size={30} color={COLORS.WHITE} />
        <MText
          style={{
            color: COLORS.WHITE,
          }}
        >
          {t("profile.logout")}
        </MText>
      </MTouchable>
    </SafeAreaView>
  );
};

export default DrawerContent;
