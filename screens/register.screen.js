import React from 'react';
import {storeData} from '../src/store';
import {register_account} from '../src/api';
import { Image, StyleSheet, ScrollView, Keyboard } from 'react-native';
import { MButton, MText, MView } from '../components/MComponents';
import { useTheme } from 'react-native-paper';
import { ROUTES } from '../constants';
import { registration_config } from '../config/registration';
import { DynamicInputList } from '../components/DynamicInputList';
import { Appbar } from 'react-native-paper';

export default ({ navigation }) => {
  const [profile, setProfile] = React.useState({});
  const [updatedProfile, setUpdatedProfile] = React.useState({});
  const theme = useTheme();

  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

 React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const registerAccount = async () => {
    // const auth = login(username, password).then((authResult) => {    
    //   if (authResult) {
    //     storeData("auth", JSON.stringify(authResult));
    //     navigation.navigate(ROUTES.HOME);
    //   } else {
    //     alert('Invalid username or password');
    //   }
    // })
  };

  const tryRegisterAccount = () => {
    // // check if passwords match, if not, alert
    // if (password !== passwordConfirm) {
    //   alert('Passwords do not match');
    //   return;
    
    // // check if username is valid email
    // }
    
    // //username must be a valid email address via regex match
    // const emailRegex = /\S+@\S+\.\S+/;
    // if (!emailRegex.test(username)) { 
    //   alert('Email must be a valid email address');
    //   return;
    // }

    register_account(profile).then((authResult) => {
      // console.log("authResult", authResult);
      if (authResult && authResult.status == 'success') {
        storeData("auth", JSON.stringify(authResult));
        alert('Account created successfully');
        navigation.navigate(ROUTES.LOGIN);
      } else {
        alert('Error creating account');
      }
    });
  }

  const navigateLogin = () => {
    navigation.navigate(ROUTES.LOGIN);
  };

  let secureTextEntry = true;

  const handleChange = (id, newValue) => {
    //set profile prop by id to newValue
    let deepCopy = JSON.parse(JSON.stringify(profile))
    updatedProfile[id] = newValue

    // for each key in updatedProfile, set profile[key] = updatedProfile[key]
    for (const key in updatedProfile) {
      deepCopy[key] = updatedProfile[key]
    }

    // profile[id] = newValue
    // console.log("handleChange", id, "oldValue", profile[id], newValue, "profile", profile, "updatedProfile", updatedProfile)
    setProfile(deepCopy)
  }

  return (
    <MView style={{flex: 1, alignItems: 'center'}}>
    <ScrollView style={{ flex: 1, flexBasis: '80%' }}>
      <MView style={styles.body}>
        <Image resizeMode={'contain'} style={{width: '60%', height: 100, marginTop: 20, marginBottom: 20}} source={require('./../assets/logo_export-indigenous-network.png')} />

        {/* {console.log(registration_config.sections[0])} */}
        <MView style={{display: 'flex', width: '90%'}}>
        <MText style={{fontSize: 24, fontWeight: 'bold'}}>
          Register
        </MText>
        <MText style={{fontSize: 18, marginBottom: 20}}>
          Complete the Skills Inventory and have our system automatically create you a profile.
          If you already have already provided the system with this information
          before, <MText onPress={navigateLogin} style={{color: 'blue', textDecorationLine: 'underline'}}>please sign in</MText>.
        </MText>

          <MView style={{width: '100%', marginBottom: 100}}>
          <DynamicInputList
              index={0}
              section={registration_config.sections[0]}
              values={profile}
              handleChange={handleChange}
            />
          </MView>
        </MView>


      </MView>
    </ScrollView>
    {/* <MView style={{display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 50}}>
    <MButton onPress={tryRegisterAccount}>Register</MButton>
    <MButton style={{backgroundColor: 'none'}} onPress={navigateLogin}>Cancel</MButton>
    </MView> */}
    <Appbar style={!isKeyboardVisible?styles.bottom:styles.hidden}>
      <MButton onPress={tryRegisterAccount}>Register</MButton>
      <MButton style={{backgroundColor: 'none'}} onPress={navigateLogin}>Cancel</MButton>
    </Appbar>

    </MView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  hidden: {
    display: 'none'
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
})