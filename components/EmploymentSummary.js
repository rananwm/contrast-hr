import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import React, { useState } from "react";
import { COLORS } from "../constants";
import { MText, MView } from "./MComponents";
import { t } from "i18next";
import moment from "moment";
import { getAuthData, getItems, removeData } from "../src/store";
import { get_employment_summary } from "../src/api";
import MLayout from "./MLayout";
import { ActivityIndicator } from "react-native-paper";

const EmploymentSummary = ({ navigation }) => {
  const [auth, setAuth] = React.useState("");
  const [loaded, setLoaded] = useState(true);
  const [data, setData] = useState({});
  React.useEffect(() => {
    getAuthData(setAuth).then(async (auth) => {
      setAuth(auth);
      if (auth && auth.data) {
        await getItems(auth, [
          {
            key: "profile_employment_get",
            stateHook: setData,
            apiFallback: get_employment_summary,
          },
        ]);

        setLoaded(false);
      } else {
        console.log("auth failed!!!", auth);
        alert("Your session has expired. Please log in again.");
        removeData("auth");
        navigation.navigate(ROUTES.LOGIN);
      }
    });
  }, []);
  return (
    <MLayout statusBarColor={COLORS.WHITE} isProfileHeader>
      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        style={{ flex: 1, padding: 20 }}
      >
        {loaded ? (
          <MView style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          </MView>
        ) : (
          <>
            <MText style={styles.headerTitle}>
              {t("profile.summary.employment_summary")}
            </MText>
            <MText style={styles.title}>{t("profile.summary.salary")}</MText>
            <MView style={styles.tableContainer}>
              <MView style={styles.primaryCareHeader}>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.date")}
                </MText>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.hour_week")}
                </MText>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.period")}
                </MText>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.salary")}
                </MText>
              </MView>

              {Object.entries(data?.salary || {})?.map(
                ([key, value], index) => {
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
                        {key ? moment(key, "YYYY-MM-DD").format("ll") : "N/A"}
                      </MText>
                      <MText style={styles.primaryCareValue}>
                        {value?.hours_per_week || "N/A"}
                      </MText>
                      <MText style={styles.primaryCareValue}>
                        {value?.period || "N/A"}
                      </MText>
                      <MText style={styles.primaryCareValue}>
                        {value?.salary || "N/A"}
                      </MText>
                    </MView>
                  );
                }
              )}
            </MView>
            <MText style={styles.title}>{t("profile.summary.time_off")}</MText>

            <MView style={styles.tableContainer}>
              <MView style={styles.primaryCareHeader}>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.date")}
                </MText>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.vacation")}
                </MText>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.wellness_sick")}
                </MText>
              </MView>

              {Object.entries(data?.timeoff || {})?.map(
                ([key, value], index) => {
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
                        {key ? moment(key, "YYYY-MM-DD").format("ll") : "N/A"}
                      </MText>
                      <MText style={styles.primaryCareValue}>
                        {value?.Vacation || "N/A"}
                      </MText>
                      <MText style={styles.primaryCareValue}>
                        {value?.["Wellness/Sick"] || "N/A"}
                      </MText>
                    </MView>
                  );
                }
              )}
            </MView>
            <MText style={styles.title}>{t("profile.summary.bonus")}</MText>

            <MView style={styles.tableContainer}>
              <MView style={styles.primaryCareHeader}>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.date")}
                </MText>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.bonus_reason")}
                </MText>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.bonus_amount")}
                </MText>
              </MView>

              {Object.entries(data?.bonus || {})?.map(([key, value], index) => {
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
                      {key ? moment(key, "YYYY-MM-DD").format("ll") : "N/A"}
                    </MText>
                    <MText style={styles.primaryCareValue}>
                      {value?.bonus_reason || "N/A"}
                    </MText>
                    <MText style={styles.primaryCareValue}>
                      {value?.bonus_amount || "N/A"}
                    </MText>
                  </MView>
                );
              })}
            </MView>
          </>
        )}
      </ScrollView>
    </MLayout>
  );
};
const styles = StyleSheet.create({
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
    maxWidth: "20%", // Limit
  },
  primaryCareValue: {
    color: COLORS.BLACK,
    fontSize: 10,
    textAlign: "left",
    flex: 1,
    maxWidth: "16.6%", // Limit
  },
  tableContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
    textAlign: "center",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
});
export default EmploymentSummary;
