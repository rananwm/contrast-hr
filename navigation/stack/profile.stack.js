import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../../constants";
import { PerksScreen, ProfileScreen } from "../../screens";
import PerkDetail from "../../screens/perk.detail.screen";
import ChallengesScreen from "../../screens/challenges.screen";
import ChallengeScreen from "../../screens/challenge.screen";
import EmploymentSummary from "../../components/EmploymentSummary";
import CompensationSummary from "../../components/CompensationSummary";
import ProfileAssets from "../../components/ProfileAssets";
import QualificationSummary from "../../components/QualificationSummary";
import RequestTimeOff from "../../components/RequestTimeOff";
import DocumentScreen from "../../screens/document.screen";
import DocumentDetailScreen from "../../screens/document-detail.screen";
const ProfileStackNavigation = createNativeStackNavigator();

const ProfileStack = () => {
  const routes = [
    {
      name: ROUTES.PROFILE,
      component: ProfileScreen,
    },
    {
      name: ROUTES.EMPLOYMENT_SUMMARY,
      component: EmploymentSummary,
    },
    {
      name: ROUTES.COMPENSATION_SUMMARY,
      component: CompensationSummary,
    },
    {
      name: ROUTES.ASSETS_SUMMARY,
      component: ProfileAssets,
    },
    {
      name: ROUTES.QUALIFICATIONS_SUMMARY,
      component: QualificationSummary,
    },
    {
      name: ROUTES.CHALLENGES,
      component: ChallengesScreen,
    },
    {
      name: ROUTES.CHALLENGE_DETAIL,
      component: ChallengeScreen,
    },
    {
      name: ROUTES.DOCUMENTS,
      component: DocumentScreen,
    },
    {
      name: ROUTES.DOCUMENT_DETAIL,
      component: DocumentDetailScreen,
    },
  ];
  return (
    <ProfileStackNavigation.Navigator
      initialRouteName={ROUTES.PROFILE}
      screenOptions={{
        headerShown: false,
      }}
    >
      {routes.map((route, index) => {
        return (
          <ProfileStackNavigation.Screen
            key={index}
            name={route.name}
            component={route.component}
            options={route.options}
          />
        );
      })}
    </ProfileStackNavigation.Navigator>
  );
};

export default ProfileStack;
