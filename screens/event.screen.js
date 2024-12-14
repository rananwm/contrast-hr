import React from "react";
import { Linking, Platform, ScrollView, StyleSheet } from "react-native";
import { MButton, MText, MView } from "../components/MComponents";
import {
  get_event_calendar,
  get_event_subscription,
  get_events,
} from "../src/api";
import { removeData, getItems, getAuthData } from "../src/store";
import { Event, LoadingNotification } from "../components";
import { ActivityIndicator, Appbar } from "react-native-paper";
import { COLORS, ROUTES } from "../constants";
import MLayout from "../components/MLayout";
import { t } from "i18next";
import moment from "moment";

export default ({ navigation }) => {
  const [auth, setAuth] = React.useState("");
  const [loaded, setLoaded] = React.useState(true);
  const [events, setEvents] = React.useState([]);
  const [eventsCalendar, setEventsCalendar] = React.useState([]);
  const [eventSubscription, setEventSubscription] = React.useState({});

  React.useEffect(() => {
    getAuthData(setAuth)
      .then(async (auth) => {
        setAuth(auth);
        if (auth && auth.data) {
          await getItems(auth, [
            {
              key: "events_get",
              stateHook: setEvents,
              apiFallback: get_events,
            },
            {
              key: "events_calendar_get",
              stateHook: setEventsCalendar,
              apiFallback: get_event_calendar,
            },
            {
              key: "event_subscription",
              stateHook: setEventSubscription,
              apiFallback: get_event_subscription,
            },
          ]);
        } else {
          console.log("auth failed!!!", auth);
          alert("Your session has expired. Please log in again.");
          removeData("auth");
          navigation.navigate(ROUTES.LOGIN);
        }
      })
      .finally(() => {
        setLoaded(false);
      });
  }, []);
  console.log("eventSubscription?.events", eventSubscription?.events);
  return (
    <MLayout statusBarColor={COLORS.WHITE} isProfileHeader>
      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <MText style={styles.header}>{t("events.title")}</MText>
        {loaded ? (
          <MView style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          </MView>
        ) : (
          <>
            <MText style={styles.title}>{t("events.calendar_events")}</MText>

            <MView style={styles.btnContainer}>
              {eventSubscription?.events && (
                <MButton
                  style={styles.btn}
                  onPress={() => {
                    let url = eventSubscription?.events;
                    if (
                      url.includes("webcal://" && Platform.OS === "android")
                    ) {
                      url = url.replace("webcal://", "https://");
                    }
                    Linking.openURL(url);
                  }}
                >
                  {t("events.event_calendar")}
                </MButton>
              )}

              {eventSubscription?.timeoff && (
                <MButton
                  style={styles.btn}
                  onPress={() => {
                    let url = eventSubscription?.timeoff;
                    if (
                      url.includes("webcal://" && Platform.OS === "android")
                    ) {
                      url = url.replace("webcal://", "https://");
                    }
                    Linking.openURL(eventSubscription?.timeoff);
                  }}
                >
                  {t("events.time_off_calendar")}
                </MButton>
              )}
            </MView>
            <MText style={styles.title}>{t("events.upcoming_events")}</MText>

            <MView style={styles.tableContainer}>
              <MView style={styles.primaryCareHeader}>
                <MText style={styles.primaryCareLabel}>
                  {t("events.date")}
                </MText>
                <MText style={{ ...styles.primaryCareLabel }}>
                  {t("events.event_detail")}
                </MText>
                <MText style={styles.primaryCareLabel}>
                  {t("events.event_type")}
                </MText>
              </MView>

              {events?.length > 0 ? (
                events?.map((item, index) => {
                  return (
                    <MView
                      style={{
                        ...styles.primaryCareHeader,
                        backgroundColor:
                          index % 2 ? COLORS.LIGHTER_GREY : COLORS.WHITE,
                      }}
                      key={index}
                    >
                      <MText style={styles.primaryCareValue}>
                        {moment(item?.event_date).format("lll")}
                      </MText>
                      <MText style={{ ...styles.primaryCareValue }}>
                        {item?.event_name || "N/A"}
                      </MText>
                      <MText style={styles.primaryCareValue}>
                        {item?.event_type || "N/A"}
                      </MText>
                    </MView>
                  );
                })
              ) : (
                <MText style={{ textAlign: "center" }}>
                  {t("events.no_event_found")}
                </MText>
              )}
            </MView>
          </>
        )}
      </ScrollView>
    </MLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  primaryCareHeader: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    justifyContent: "space-between", // Ensures even spacing between columns
  },
  primaryCareLabel: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    fontSize: 12,
    flex: 1,
    maxWidth: "30%", // Limit
  },
  primaryCareValue: {
    color: COLORS.BLACK,
    fontSize: 10,
    textAlign: "left",
    flex: 1,
    maxWidth: "30%", // Limit
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  btn: {
    borderRadius: 8,
    width: "48%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
});
