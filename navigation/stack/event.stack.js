import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../../constants";
import { EventScreen, PerksScreen } from "../../screens";
const EventStackNavigation = createNativeStackNavigator();

const EventStack = () => {
  return (
    <EventStackNavigation.Navigator>
      <EventStackNavigation.Screen
        name={ROUTES.EVENTS}
        component={EventScreen}
        options={{ headerShown: false }}
      />
    </EventStackNavigation.Navigator>
  );
};

export default EventStack;
