import React from "react";
import { getData, getJSONData } from "../src/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  LoginScreen,
  SplashScreen,
  PerkScreen,
  RegisterScreen,
  ProfileScreen,
  SkillsScreen,
  AccountScreen,
} from "../screens";
import { HomeNavigator } from "./home.navigation.component";
import { ROUTES } from "../constants";
import DrawerNavigation from "./drawer.navigation.component";

const { Navigator, Screen } = createNativeStackNavigator();

const AuthNavigator = (auth) => {
  console.log("data", auth?.data);
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={ROUTES.SPLASH}
    >
      <Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Screen name={ROUTES.REGISTER} component={RegisterScreen} />
      <Screen name={ROUTES.HOME} component={DrawerNavigation} />
      <Screen name={ROUTES.JOB} component={PerkScreen} />
      <Screen name={ROUTES.SKILLS} component={SkillsScreen} />
    </Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
};
