import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { getAuthData, removeData, clearAll } from "../src/store";
import {
  MButton,
  MView,
  MDivider,
  MText,
  MProgressBar,
} from "../components/MComponents";
import { COLORS, ROUTES } from "../constants";
import { LoadingNotification } from "../components/Loading";
import * as linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";

export default (props) => {
  const [auth, setAuth] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);

  const openLink = (link) => {
    linking.openURL(link).catch((err) => alert("unable to open link"));
  };

  const navProps = props.props;
  // const { navigation } = navProps;
  const navigation = useNavigation();

  // logout function
  const logout = () => {
    clearAll();
    navigation.navigate(ROUTES.LOGIN);
  };

  const gotoProfile = (section) => {
    navigation.navigate(ROUTES.PROFILE, { section: section });
  };

  const gotoSkills = (section) => {
    navigation.navigate(ROUTES.SKILLS, { section: section });
  };

  React.useEffect(() => {
    getAuthData(setAuth).then(async (auth) => {
      setAuth(auth);
      if (auth && auth.data) {
        setLoaded(true);
      } else {
        console.log("auth failed!!!", auth);
        alert("Your session has expired. Please log in again.");
        removeData("auth");
        navigation.navigate(ROUTES.LOGIN);
      }
    });
  }, []);

  const [activeSection, setActiveSection] = React.useState("personal");

  const setActive = (section) => {
    if (section == activeSection) {
      setActiveSection("none");
    } else {
      setActiveSection(section);
    }
  };

  const accountActions = () => {
    return (
      <MView style={styles.accountActions}>
        <MButton style={styles.action} onPress={() => gotoProfile("personal")}>
          Personal Information
        </MButton>
        {/* <MButton style={styles.action} onPress={() => gotoProfile("contact")}>
        Contact Information
      </MButton>
      <MButton style={styles.action} onPress={() => gotoProfile("selfidentification")}>
        Workforce Self-Identification
      </MButton>
      <MButton style={styles.action} onPress={() => gotoSkills("skills-experience")}>
        Skills, Trades & Experience
      </MButton>
      <MButton style={styles.action} onPress={() => gotoSkills("education-training")}>
        Education & Training
      </MButton>
      <MButton style={styles.action} onPress={() => gotoSkills("employment-status")}>
        Employment Status
      </MButton>
      <MButton style={styles.action} onPress={() => gotoSkills("designate-tickets")}>
        Tickets & Working Conditions
      </MButton>
      <MButton style={styles.action} onPress={() => gotoSkills("employment-experience")}>
        Employment Experience
      </MButton>
      <MButton style={styles.action} onPress={() => gotoSkills("interests-hobbies")}>
        Activities & Interests
      </MButton> */}
        <MView style={{ display: "flex", flexDirection: "row" }}>
          <MText
            onPress={() => {
              openLink("https://exportdata.ca/privacy");
            }}
            style={{ marginTop: 30 }}
          >
            <MText
              style={{
                color: "white",
                textDecorationLine: "underline",
                textAlign: "center",
              }}
            >
              Privacy Policy
            </MText>
            &nbsp;&nbsp;
          </MText>
          <MText
            onPress={() => {
              openLink("https://exportdata.ca/contact");
            }}
            style={{ marginTop: 30 }}
          >
            <MText
              style={{
                color: "white",
                textDecorationLine: "underline",
                textAlign: "center",
              }}
            >
              Contact Us
            </MText>
          </MText>
        </MView>
      </MView>
    );
  };

  const handleChange = (id, newValue) => {
    //set profile prop by id to newValue
    // console.log("handleChange", id, newValue)
    profile[id] = newValue;
  };

  return (
    <MView
      style={{ flex: 1, flexBasis: "100%", backgroundColor: COLORS.PRIMARY }}
    >
      <ScrollView style={{ flex: 1, flexBasis: "80%", marginTop: 60 }}>
        <MView style={styles.body}>
          <MView style={styles.actions}>
            <MText style={styles.heading}>Your Account</MText>
            <MButton
              style={styles.logout}
              labelStyle={{ fontSize: 16, marginTop: 7 }}
              compact={true}
              onPress={logout}
            >
              Logout
            </MButton>
          </MView>

          <MProgressBar
            style={{
              backgroundColor: "#000000",
              height: 20,
              width: 40,
              flex: 1,
            }}
            progress={"0.5"}
            color={"#e85100"}
          />

          {loaded ? accountActions() : <LoadingNotification />}

          <MDivider />
        </MView>
      </ScrollView>
    </MView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY,
  },
  accountActions: {
    flexGrow: 1,
    marginTop: 30,
    height: 500,
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  heading: {
    justifyContent: "flex-start",
    fontWeight: "bold",
    fontSize: 24,
    alignItems: "flex-start",
    color: "#ffffff",
  },
  action: {
    marginBottom: 15,
    justifyContent: "center",
    // backgroundColor: '#e85100',
    // color: '#ffffff',
    borderColor: "#009dce",
  },
  actions: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  logout: {
    marginTop: 0,
    marginLeft: 15,
    // marginTop: 150,
    // move this to the bottom of the flexbox
  },
});
