import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { MView } from "../components/MComponents";
import { job_get } from "../src/api";
import { getJSONData, storeData, removeData } from "../src/store";
import { LoadingNotification } from "../components/Loading";
import { Job } from "../components/Job";
import { Appbar } from "react-native-paper";
import { ROUTES } from "../constants";

const BackIcon = (props) => <Icon {...props} name="log-out" />;

export default ({ route, navigation }) => {
  const [auth, setAuth] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);
  const [job, setJob] = React.useState([]);

  const navigateHome = () => {
    navigation.navigate(ROUTES.HOME);
  };

  const navigateAccount = () => {
    navigation.navigate("Account");
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateHome} />
  );

  const PersonIcon = (props) => <Icon {...props} name="person" />;

  const navigateProfile = () => {
    navigation.navigate("Profile");
  };

  const ProfileAction = () => (
    <TopNavigationAction icon={PersonIcon} onPress={navigateProfile} />
  );

  const HomeAction = () => (
    <TopNavigationAction icon={HomeIcon} onPress={navigateAccount} />
  );

  const ArrowUpIcon = (props) => <Icon {...props} name="arrow-up" />;

  const ArrowDownIcon = (props) => <Icon {...props} name="arrow-down" />;

  const HomeIcon = (props) => <Icon {...props} name="home" />;

  const setActive = (section) => {
    if (section == activeSection) {
      setActiveSection("none");
    } else {
      setActiveSection(section);
    }
  };

  React.useEffect(() => {
    const getAuth = async () => {
      const authJson = await getJSONData("auth", setAuth);

      if (authJson) {
        return authJson;
      } else {
        return false;
      }
    };

    const getJob = async (job_id) => {
      const authJson = await getAuth();

      if (authJson) {
        const job_key = "job_" + job_id;
        var jobJson = await getJSONData(job_key, setJob);

        // if profile is not in the store, get it from the API
        if (!jobJson || jobJson.length > 1 || jobJson["data"]) {
          jobJson = await job_get(
            authJson.data.profile_auth,
            authJson.cookie,
            job_id
          );

          storeData(job_key, JSON.stringify(jobJson["data"]));
        }

        if (!jobJson) {
          alert("Your session has expired. Please log in again.");
          removeData("auth");
          navigation.navigate(ROUTES.LOGIN);
        } else {
          setLoaded(true);
          // if data prop is on jobJson object then setJob to that otherwise to the base object
          jobJson["data"] ? setJob(jobJson["data"]) : setJob(jobJson);
        }
      }
    };
    const job_id = route.params.job_id;
    getJob(job_id);
  }, []);

  return (
    <MView style={{ flex: 1, flexBasis: "100%" }}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigateHome();
          }}
        />
        <Appbar.Content title="Job" />
      </Appbar.Header>
      <ScrollView style={{ flex: 1, flexBasis: "90%" }}>
        {!loaded ? <LoadingNotification /> : <Job job={job} />}
      </ScrollView>
    </MView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  form: {
    width: "90%",
    paddingBottom: 20,
  },
  formInput: {
    marginTop: 10,
  },
  formInputLabel: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "bold",
    color: "#949FB7",
  },
  actions: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
