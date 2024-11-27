// simple loading screen
import React from 'react';
import {storeData, getData, removeData} from '../src/store';
import { SafeAreaView, Image, StyleSheet } from 'react-native';
import { Button, Divider, Layout, TopNavigation, Input, Text } from '@ui-kitten/components';

export const TestScreen = ({ navigation }) => {
      const [loggedOut, setLoggedOut] = React.useState(false);
      const [auth, setAuth] = React.useState('');

      const navigateHome = () => {
            const logout = async () => {
                  await removeData('auth');
                  setLoggedOut(true);
                  navigation.navigate('Home');
            }
            logout()
      };

      return (
      <SafeAreaView style={{ flex: 1 }}>
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Button onPress={navigateHome}>Logout</Button>
            </Layout>
      </SafeAreaView>
      );
}