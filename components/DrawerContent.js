import { View, Text, SafeAreaView, Image } from "react-native";
import React, { useMemo, useState } from "react";
import { MIcon, MText, MTouchable, MView } from "./MComponents";
import { COLORS, ROUTES } from "../constants";
import { CommonActions } from "@react-navigation/native";
import {
  get_features,
  get_timeoff_settings,
  get_timeoff_summary,
  profile_signout,
} from "../src/api";
import { clearAll, getAuthData, getItems } from "../src/store";
import { t } from "i18next";
import { useAuth } from "../context/AuthContext";

const DrawerContent = ({ navigation }) => {
  const [auth, setAuth] = React.useState("");

  const [timeOffSummary, setTimeOffSummary] = useState(null);
  const [timeOffSettings, setTimeSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = React.useState(null);
  const { darkLogo } = useAuth();
  const menuList = [
    {
      name: "profile.label",
      icon: "account",
      route: ROUTES.PROFILE,
      key: "profile",
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
      key: "events",
    },
    {
      name: "bottom_navigation.notifications",
      icon: "bell",
      route: ROUTES.NOTIFICATIONS_STACK,
      isProfileStack: false,
      key: "notification",
    },
    {
      name: "profile.summary.employment_summary",
      icon: "briefcase",
      route: ROUTES.EMPLOYMENT_SUMMARY,
      key: "people_summary",
    },
    {
      name: "profile.summary.compensation_summary",
      icon: "credit-card-outline",
      route: ROUTES.COMPENSATION_SUMMARY,
      key: "people_total_rewards",
    },
    {
      name: "profile.summary.profile_assets",
      icon: "card-text-outline",
      route: ROUTES.ASSETS_SUMMARY,
      key: "people_assets",
    },
    {
      name: "profile.qualification.label",
      icon: "school",
      route: ROUTES.QUALIFICATIONS_SUMMARY,
      key: "people_qualifications",
    },
    {
      name: "Documents",
      icon: "file-document-multiple",
      route: ROUTES.DOCUMENTS,
      key: "documents",
    },
  ];
  const signOut = async () => {
    profile_signout(auth.data.profile_auth, auth.cookie)
      .then((response) => {
        clearAll();
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.LOGIN }],
        });
      })
      .catch((error) => {
        console.log("error while sign out", error);
      });
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const authData = await getAuthData();
      setAuth(authData);

      if (!authData || !authData?.data) {
        alert("Your session has expired. Please log in again.");
        navigation.navigate(ROUTES.LOGIN);
        return;
      }

      const [featuresData, timeOffSummaryData, timeOffSettingsData] =
        await Promise.all([
          get_features(authData.data.profile_auth, authData.cookie),
          get_timeoff_summary(authData.data.profile_auth, authData.cookie),
          get_timeoff_settings(authData.data.profile_auth, authData.cookie),
        ]);

      setFeatures(featuresData);
      setTimeOffSummary(timeOffSummaryData);
      setTimeSettings(timeOffSettingsData);
    } catch (error) {
      console.log("🚀 ~ fetchTimeOffData ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  const sideBarItems = useMemo(() => {
    const alwaysVisibleItems = menuList.filter(
      (item) => item?.key === "profile" || item?.key === "notification"
    );
    const featureBasedItems = menuList.filter(
      (item) => item?.key && features?.data?.[item?.key]
    );
    const combinedItems = [...alwaysVisibleItems, ...featureBasedItems];
    if (!timeOffSettings || !timeOffSummary) {
      return combinedItems.filter(
        (item) => item?.route !== ROUTES.REQUEST_TIME_OFF
      );
    }
    return combinedItems;
  }, [features, timeOffSettings, timeOffSummary]);

  React.useEffect(() => {
    fetchData();
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
        source={darkLogo}
      />

      <MView style={{ flex: 1, marginTop: 12 }}>
        {sideBarItems?.map((item, index) => {
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
