import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { getAuthData, getItems, removeData } from "../src/store";
import { events_get } from "../src/api";
import { MDivider, MCard, MText, MView } from "../components/MComponents";
import { useTheme } from "react-native-paper";
import { LoadingNotification } from "../components/Loading";
import { EventCard } from "../components/EventCard";
import { LogoBar } from "../components/LogoBar";
import { ROUTES } from "../constants";

export default ({ props }) => {
  // get props.navigation
  const { navigation } = props;

  const theme = useTheme();
  const [auth, setAuth] = React.useState({});
  const [events, setEvents] = React.useState({});

  const navigateEvent = (event_id) => {
    navigation.navigate("Event", { event_id: event_id });
  };

  React.useEffect(() => {
    getAuthData(setAuth).then(async (auth) => {
      setAuth(auth);
      if (auth && auth.data) {
        await getItems(auth, [
          { key: "events", stateHook: setEvents, apiFallback: events_get },
        ]);
      } else {
        console.log("auth failed!!!", auth);
        alert("Your session has expired. Please log in again.");
        removeData("auth");
        navigation.navigate(ROUTES.LOGIN);
      }
    });
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <MDivider />
      <MView style={styles.body}>
        <LogoBar />

        <MText style={styles.headingH3}>Recent events</MText>
        {
          // limit to 5 events
          events && events.length > 0 ? (
            events
              .slice(0, 5)
              .map((event) => (
                <EventCard
                  key={"event_" + event.id}
                  event={event}
                  action={() => console.log(event)}
                  style={styles.event}
                />
              ))
          ) : (
            <LoadingNotification />
          )
        }
      </MView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: "#f0f0f0",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLogos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -20,
  },
  event: {
    flex: 1,
    flexGrow: 1,
    margin: 10,
    maxWidth: "95%",
    minWidth: "95%",
  },
  eventTitle: {
    color: "#E85100",
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventDescription: {},
  eventMetadata: {
    marginTop: 10,
    marginLeft: -2,
  },
  eventInfo: {
    backgroundColor: "#009dce",
    borderColor: "#009dce",
    marginTop: 5,
  },
  heading: {
    marginBottom: 15,
    fontWeight: "bold",
    fontSize: 24,
  },
  headingH3: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 18,
  },
  action: {
    backgroundColor: "#009dce",
    borderColor: "#009dce",
    padding: 0,
    lineHeight: 0,
  },
  compact: {
    padding: 0,
    lineHeight: 0,
  },
});
