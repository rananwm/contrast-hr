import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {getAuthData, getItems, removeData} from '../src/store';
import {trainings_get} from '../src/api';
import { MDivider, MText, MView } from '../components/MComponents';
import { useTheme } from 'react-native-paper';
import { LoadingNotification } from '../components/Loading';
import { TrainingCard } from '../components/TrainingCard';
import { LogoBar } from '../components/LogoBar';
import { ROUTES } from '../constants';

export default ({props}) => {
  // get props.navigation
  const { navigation } = props;

  const theme = useTheme();
  const [auth, setAuth] = React.useState({});
  const [trainings, setTrainings] = React.useState({});

  const navigateTraining = (training_id) => {
    navigation.navigate('Training', {training_id: training_id});
  };

  React.useEffect(() => {
    getAuthData(setAuth).then(async (auth) => {
      setAuth(auth)
      if (auth && auth.data) {
        await getItems(auth, [
          {key: "trainings", stateHook: setTrainings, apiFallback: trainings_get}
        ])

      } else {
        console.log("auth failed!!!", auth)
        alert("Your session has expired. Please log in again.")
        removeData("auth")
        navigation.navigate(ROUTES.LOGIN);
      }
    })
  }, [])

  return (
    <ScrollView style={{ flex: 1 }}>
      <MDivider/>
      <MView style={styles.body}>
        <LogoBar />

        <MText style={styles.headingH3}>Recent Training Opportunities</MText>
        {
        // limit to 5 trainings
        trainings && trainings.length > 0? 
          trainings.slice(0, 5).map((training) => <TrainingCard key={"training_"+ training.id} training={training} action={() => console.log(training)} style={styles.training} />)
          :<LoadingNotification />
        }
      </MView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#f0f0f0'
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLogos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -20
  },
  training: {
    flex: 1,
    flexGrow: 1,
    margin: 10,
    maxWidth: '95%',
    minWidth: '95%'
  },
  trainingTitle: {
    color: '#E85100',
    fontWeight: 'bold',
    marginBottom: 5
  },
  trainingDescription: {
  },
  trainingMetadata: {
    marginTop: 10,
    marginLeft: -2
  },
  trainingInfo: {
    backgroundColor: '#009dce',
    borderColor: '#009dce',
    marginTop: 5
  },
  heading: {
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 24
  },
  headingH3: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 18
  },
  action: {
    backgroundColor: '#009dce',
    borderColor: '#009dce',
    padding: 0,
    lineHeight: 0,
  },
  compact: {
    padding: 0,
    lineHeight: 0,
    
  }
})