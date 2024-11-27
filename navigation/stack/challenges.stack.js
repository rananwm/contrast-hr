import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../../constants";
import { PerksScreen } from "../../screens";
import PerkDetail from "../../screens/perk.detail.screen";
import ChallengesScreen from "../../screens/challenges.screen";
import ChallengeScreen from "../../screens/challenge.screen";
const ChallengesStackNavigation = createNativeStackNavigator();

const ChallengesStack = () => {
  return (
    <ChallengesStackNavigation.Navigator>
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
