import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../../constants";
import { PerksScreen } from "../../screens";
import PerkDetail from "../../screens/perk.detail.screen";
const PerkStackNavigation = createNativeStackNavigator();

const PerkStack = () => {
  return (
    <PerkStackNavigation.Navigator>
      <PerkStackNavigation.Screen
        name={ROUTES.PERK}
        component={PerksScreen}
        options={{ headerShown: false }}
      />
      <PerkStackNavigation.Screen
        name={ROUTES.PERK_DETAIL}
        component={PerkDetail}
        options={{ headerShown: false }}
      />
    </PerkStackNavigation.Navigator>
  );
};

export default PerkStack;
