import React from 'react';
import { getJSONData } from '../src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountScreen, SkillsScreen, ProfileScreen } from '../screens';
import { ROUTES } from '../constants';

const {Navigator, Screen} = createNativeStackNavigator();

export const ProfileNavigator = () => (
  <Navigator screenOptions={{headerShown: true}}>
    <Screen name={ROUTES.ACCOUNT} component={AccountScreen}/>
    {/* <Screen name={ROUTES.PROFILE} component={ProfileScreen}/>
    <Screen name={ROUTES.SKILLS} component={SkillsScreen}/> */}
  </Navigator>
);

export const AppNavigator = () => {
  const [auth, setAuth] = React.useState('');

  React.useEffect(() => {
    const getAuth = async () => {
      const authJson = await getJSONData("auth", setAuth)
    }

    getAuth()
      .catch(console.error)
  }, [])

  return(
  <NavigationContainer>
    <AuthNavigator />
  </NavigationContainer>
)};