import React, { useEffect, useState } from "react";
import { MText, MView } from "../components/MComponents";
import { HomeScreen, AccountScreen } from "../screens";
import { COLORS, ROUTES } from "../constants";
import HomeIcon from "../assets/navigation/home.png";
import ChallengesIcon from "../assets/navigation/challenges.png";
import TimeOffIcon from "../assets/navigation/time-out.png";
import NotificationIcon from "../assets/navigation/notifications.png";
import PerkIcon from "../assets/navigation/perks.png";
import { Image, Platform, SafeAreaView, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PerkStack from "./stack/perk.stack";
import { useNavigation } from "@react-navigation/native";
import ChallengesStack from "./stack/challenges.stack";
import { t } from "i18next";
import NotificationsStack from "./stack/notifications.stack";
import ProfileStack from "./stack/profile.stack";
import EventStack from "./stack/event.stack";
import RequestTimeOff from "../components/RequestTimeOff";
import { getAuthData, getItems } from "../src/store";
import { get_timeoff_settings, get_timeoff_summary } from "../src/api";
import { ActivityIndicator } from "react-native-paper";
const Tab = createBottomTabNavigator();

export const HomeNavigator = (props) => {
  const bottomTabs = [
    {
      name: ROUTES.HOMESCREEN,
      component: HomeScreen,
      icon: HomeIcon,
      title: t("bottom_navigation.home"),
      options: {},
    },
    // {
    //   name: ROUTES.JOBS,
    //   component: PerkStack,
    //   icon: PerkIcon,
    //   title: t("bottom_navigation.perks"),
    //   options: {},
    // },
    {
      name: ROUTES.NOTIFICATIONS_STACK,
      component: NotificationsStack,
      icon: NotificationIcon,
      title: t("bottom_navigation.notifications"),
      options: {},
    },
    {
      name: ROUTES.REQUEST_TIME_OFF,
      component: RequestTimeOff,
      icon: TimeOffIcon,
      title: "Time Off",
      isHidden: false,
      options: {},
    },
    {
      name: ROUTES.CHALLENGES_STACK,
      component: ChallengesStack,
      icon: ChallengesIcon,
      title: t("bottom_navigation.challenges"),
      options: {},
    },

    {
      name: ROUTES.ACCOUNT,
      component: AccountScreen,
      icon: null,
      title: "",
      isHidden: true,
      options: {},
    },
    {
      name: ROUTES.PROFILE_STACK,
      component: ProfileStack,
      icon: null,
      title: "",
      isHidden: true,
      options: {},
    },
    {
      name: ROUTES.EVENT_STACK,
      component: EventStack,
      icon: null,
      title: "",
      isHidden: true,
      options: {},
    },
  ];
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);
  const [timeOffSummary, setTimeOffSummary] = useState(null);
  const [timeOffSettings, setTimeSettings] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    // setLoading(true);
    getAuthData()
      .then(async (auth) => {
        setAuth(auth);
        if (auth && auth?.data) {
          await getItems(auth, [
            {
              key: "time_off",
              stateHook: setTimeOffSummary,
              apiFallback: get_timeoff_summary,
            },
            {
              key: "time_settings",
              stateHook: setTimeSettings,
              apiFallback: get_timeoff_settings,
            },
          ]);
        } else {
          console.log("auth failed!!!", auth);
          alert("Your session has expired. Please log in again.");
          removeData("auth");
          navigation.reset({
            index: 0,
            routes: [{ name: ROUTES.LOGIN }],
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  // if (loading) {
  //   return (
  //     <MView style={styles.loadingContainer}>
  //       <ActivityIndicator color={COLORS.SECONDARY} />
  //     </MView>
  //   );
  // }
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          unmountOnBlur: true,
        }}
      >
        {timeOffSettings && timeOffSummary
          ? bottomTabs.map((tab, index) => {
              return (
                <Tab.Screen
                  key={index}
                  name={tab.name}
                  component={tab.component}
                  options={{
                    gestureEnabled: false,
                    gestureDirection: "horizontal",
                    headerShown: false,
                    unmountOnBlur: true,
                    tabBarIcon: ({ focused }) => (
                      <Image
                        source={tab.icon}
                        style={styles.tabIcon(focused)}
                      />
                    ),
                    tabBarLabel: ({ focused }) => (
                      <MText style={styles.tabLabel(focused)}>
                        {tab.title}
                      </MText>
                    ),
                    tabBarStyle: {
                      backgroundColor: COLORS.PRIMARY,
                      height: 70,
                      paddingBottom: 5,
                    },
                    tabBarItemStyle: {
                      display: tab.isHidden ? "none" : "flex",
                    },
                    ...tab?.options,
                  }}
                />
              );
            })
          : bottomTabs
              .filter((item) => item?.name !== ROUTES.REQUEST_TIME_OFF)
              .map((tab, index) => {
                return (
                  <Tab.Screen
                    key={index}
                    name={tab.name}
                    component={tab.component}
                    options={{
                      gestureEnabled: false,
                      gestureDirection: "horizontal",
                      headerShown: false,
                      unmountOnBlur: true,
                      tabBarIcon: ({ focused }) => (
                        <Image
                          source={tab.icon}
                          style={styles.tabIcon(focused)}
                        />
                      ),
                      tabBarLabel: ({ focused }) => (
                        <MText style={styles.tabLabel(focused)}>
                          {tab.title}
                        </MText>
                      ),
                      tabBarStyle: {
                        backgroundColor: COLORS.PRIMARY,
                        height: 70,
                        paddingBottom: 5,
                      },
                      tabBarItemStyle: {
                        display: tab.isHidden ? "none" : "flex",
                      },
                      ...tab?.options,
                    }}
                  />
                );
              })}
      </Tab.Navigator>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  tabIcon: (focused) => ({
    width: 35,
    height: 35,
    tintColor: focused ? COLORS.SECONDARY : "#f0f0f0",
  }),
  tabLabel: (focused) => ({
    color: focused ? COLORS.SECONDARY : "#f0f0f0",
    fontSize: 12,
  }),
  tabLableContainer: {},
  tabBar: {
    backgroundColor: COLORS.PRIMARY,
    height: 70,
    paddingBottom: 5,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
