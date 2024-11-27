import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { ROUTES } from "../constants";
import { HomeNavigator } from "./home.navigation.component";
import DrawerContent from "../components/DrawerContent";
const Drawer = createDrawerNavigator();
export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName={ROUTES.BOTTOM_TAB}
      screenOptions={{
        drawerPosition: "right",
        headerShown: false,
        drawerType: "front",
      }}
      drawerContent={(props) => {
        return <DrawerContent {...props} />;
      }}
    >
      <Drawer.Screen name={ROUTES.BOTTOM_TAB} component={HomeNavigator} />
    </Drawer.Navigator>
  );
}
