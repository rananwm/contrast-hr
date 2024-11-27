import React from 'react';
import { ScrollView, StyleSheet, Keyboard } from 'react-native';
import {clearAll, getAuthData, getItems, removeData} from '../src/store';
import { skills_get, skills_save } from '../src/api';
import { MButton, MView, MDivider, MText} from '../components/MComponents'
import { DynamicSectionList } from '../components/DynamicSectionList';
import { skills_config } from '../config/skills';
import { LoadingNotification } from '../components/Loading';
import { Appbar } from 'react-native-paper';
import { ROUTES } from '../constants';

export default ({ route, navigation }) => {

  const [auth, setAuth] = React.useState('');
  const [loaded, setLoaded] = React.useState(false);
  const [skills, setSkills] = React.useState({});
  const [updatedSkills, setUpdatedSkills] = React.useState({});

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

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateHome}/>
  );

  React.useEffect(() => {
    getAuthData(setAuth).then(async (auth) => {
      setAuth(auth)
      if (auth && auth.data) {
        await getItems(auth, [
          {key: "skills", stateHook: setSkills, apiFallback: skills_get}
        ])
        setLoaded(true)
      } else {
        console.log("auth failed!!!", auth)
        alert("Your session has expired. Please log in again.")
        removeData("auth")
        navigation.navigate(ROUTES.LOGIN);
      }
    })
  }, [])

  let routeSection = ''
  if (route && route.params && route.params.section) {
    routeSection = route.params.section
  }
  const [activeSection, setActiveSection] = React.useState(routeSection)

  const setActive = (section) => {
    if (section == activeSection) {
        setActiveSection('none')
    } else {
        setActiveSection(section)
    }
  };

  const forceReloadSkills = () => {
    removeData("skills")
    getItems(auth, [
      {key: "skills", stateHook: setSkills, apiFallback: skills_get}
    ])
  }

  const handleSave = () => {
    skills_save(auth.data.profile_auth, auth.cookie, updatedSkills).then((response) => {
      // console.log("skills_save response", response)
      if (response && response.status == 'success') {
        forceReloadSkills()
        // reset updatedSkills to empty object so we don't post more changes each save
        setUpdatedSkills({})
        alert("Your skills have been updated.")
      } else {
        alert("There was an error updating your profile.")
      }
    })
  }

  const handleChange = (id, newValue) => {
    //set profile prop by id to newValue
    let deepCopy = JSON.parse(JSON.stringify(skills))
    updatedSkills[id] = newValue

    // for each key in updatedSkills, set profile[key] = updatedSkills[key]
    for (const key in updatedSkills) {
      deepCopy[key] = updatedSkills[key]
    }

    // profile[id] = newValue
    // console.log("handleChange", id, "oldValue", profile[id], newValue, "profile", profile, "updatedProfile", updatedProfile)
    setSkills(deepCopy)
  }

  let config = JSON.parse(JSON.stringify(skills_config))
  // if (config && routeSection != '') {
  //   config.sections = config.sections.filter((section) => {
  //     return (section.id == route.params.section)
  //   })
  // }

  return (
    <MView style={{flex: 1, flexBasis: '100%'}}>
    <Appbar.Header>
      <Appbar.BackAction onPress={() => {navigation.goBack()}} />
      <Appbar.Content title="Update Your Skills" />
    </Appbar.Header>
    <ScrollView style={{ flex: 1, flexBasis: '80%' }}>

      <MView style={styles.body}>

        <MView style={styles.form}>
          {/* if loaded then show the dynamic section list */}
          {loaded?  
          <DynamicSectionList
            config={config}
            values={skills}
            handleChange={handleChange}
            setActive={setActive}
            defaultSection={routeSection} /* no active section */
            />:<LoadingNotification />
            }
        </MView>
      </MView>
    </ScrollView>
    <Appbar style={!isKeyboardVisible?styles.bottom:styles.hidden}>
      <MButton style={styles.action} onPress={handleSave}>
        Save Profile
      </MButton>
      <MButton style={{backgroundColor: 'none'}} onPress={
        navigation.goBack
      }>Cancel</MButton>
    </Appbar>

    {/* <MView style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 50}}>
      <MButton style={styles.action} onPress={handleSave}>
        Save Skills
      </MButton>
      <MButton style={{backgroundColor: 'none'}} onPress={
        navigation.goBack
      }>Cancel</MButton>
    </MView> */}
    </MView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 200
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
  form: {
    width: '90%',
    paddingBottom: 20
  },
  formInput: {
    marginTop: 10
  },
  formInputLabel: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#949FB7'
  },
  actions: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    marginTop: 15,
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    fontSize: 24
  },
  action: {
    marginRight: 5,
    backgroundColor: '#009dce',
    borderColor: '#009dce'
  },
  logout: {
    marginTop: 15,
    marginLeft: 5
  }
})