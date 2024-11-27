import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../../constants";
import { PerksScreen } from "../../screens";
import PerkDetail from "../../screens/perk.detail.screen";
import NotificationScreen from "../../screens/notification.screen";
import NotificationDetailsScreen from "../../screens/notification.details.screen";
const PerkStackNavigation = createNativeStackNavigator();

const NotificationsStack = () => {
  return (
    <PerkStackNavigation.Navigator>
      <PerkStackNavigation.Screen
        name={ROUTES.NOTIFICATIONS}
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <PerkStackNavigation.Screen
        name={ROUTES.NOTIFICATIONS_DETAIL}
        component={NotificationDetailsScreen}
        options={{ headerShown: false }}
      />
    </PerkStackNavigation.Navigator>
  );
};

export default NotificationsStack;
