import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../../constants";
import { PerksScreen } from "../../screens";
import PerkDetail from "../../screens/perk.detail.screen";
import ChallengesScreen from "../../screens/challenges.screen";
import ChallengeScreen from "../../screens/challenge.screen";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from "@react-navigation/native";
const ChallengesStackNavigation = createNativeStackNavigator();

const ChallengesStack = () => {
  const navigation = useNavigation();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      const focusedRouteName =
        getFocusedRouteNameFromRoute(
          navigation
            .getState()
            .routes.find((r) => r.name === ROUTES.CHALLENGES_STACK)
        ) || ROUTES.CHALLENGES;
      if (focusedRouteName !== ROUTES.CHALLENGES) {
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.CHALLENGES }],
        });
      }
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <ChallengesStackNavigation.Navigator
      initialRouteName={ROUTES.CHALLENGES}
      screenOptions={{
        unmountOnBlur: true,
      }}
    >
      <ChallengesStackNavigation.Screen
        name={ROUTES.CHALLENGES}
        component={ChallengesScreen}
        options={{ headerShown: false }}
      />
      <ChallengesStackNavigation.Screen
        name={ROUTES.CHALLENGE_DETAIL}
        component={ChallengeScreen}
        options={{ headerShown: false }}
      />
    </ChallengesStackNavigation.Navigator>
  );
};

export default ChallengesStack;
