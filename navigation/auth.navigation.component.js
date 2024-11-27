import React from "react";
import { getJSONData } from "../src/store";
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

const AuthNavigator = () => (
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

export const AppNavigator = () => {
  const [auth, setAuth] = React.useState("");

  React.useEffect(() => {
    const getAuth = async () => {
      const authJson = await getJSONData("auth", setAuth);
    };

    getAuth().catch(console.error);
  }, []);

  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
};
