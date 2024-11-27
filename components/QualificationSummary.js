import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { MText, MView } from "./MComponents";
import { COLORS } from "../constants";
import { t } from "i18next";
import { get_profile_qualification } from "../src/api";
import { getAuthData, getItems, removeData } from "../src/store";
import MLayout from "./MLayout";
import { ActivityIndicator } from "react-native-paper";

const QualificationSummary = ({ navigation }) => {
  const [auth, setAuth] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [data, setData] = useState({});
  useEffect(() => {
    getAuthData(setAuth).then(async (auth) => {
      setAuth(auth);
      if (auth && auth.data) {
        await getItems(auth, [
          {
            key: "profile_qualifications_get",
            stateHook: setData,
            apiFallback: get_profile_qualification,
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
              {t("profile.qualification.label")}
            </MText>

            <MView style={styles.container}>
              <MText style={{ fontSize: 12 }}>
                {t("profile.qualification.desc")}
              </MText>
              <MText style={styles.type}>
                {t("profile.qualification.active")}
              </MText>
              <MView style={styles.tableContainer}>
                <MView style={styles.primaryCareHeader}>
                  <MText style={styles.primaryCareLabel}>
                    {t("profile.qualification.name")}
                  </MText>
                  <MText style={styles.primaryCareLabel}>
                    {t("profile.qualification.completed")}
                  </MText>
                  <MText style={{ ...styles.primaryCareLabel, marginLeft: 10 }}>
                    {t("profile.qualification.expires")}
                  </MText>
                  <MText style={{ ...styles.primaryCareLabel, marginLeft: 10 }}>
                    {t("profile.qualification.cost")}
                  </MText>
                </MView>

                {data?.active?.length > 0 ? (
                  data?.active?.map((item, index) => {
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
                          {item?.name || "N/A"}
                        </MText>
                        <MText style={styles.primaryCareValue}>
                          {item?.acquired || "N/A"}
                        </MText>
                        <MText style={styles.primaryCareValue}>
                          {item?.expires || "N/A"}
                        </MText>
                        <MText style={styles.primaryCareValue}>
                          {item?.cost || 0}
                        </MText>
                      </MView>
                    );
                  })
                ) : (
                  <MText style={styles.emptyQualifications}>
                    {t("profile.qualification.no_active_qualification")}
                  </MText>
                )}
              </MView>
              <MText style={{ ...styles.type, marginTop: 0 }}>
                {t("profile.qualification.expired")}
              </MText>
              <MView style={styles.tableContainer}>
                <MView style={styles.primaryCareHeader}>
                  <MText style={styles.primaryCareLabel}>
                    {t("profile.qualification.name")}
                  </MText>
                  <MText style={styles.primaryCareLabel}>
                    {t("profile.qualification.completed")}
                  </MText>
                  <MText style={{ ...styles.primaryCareLabel, marginLeft: 10 }}>
                    {t("profile.qualification.expires")}
                  </MText>
                  <MText style={{ ...styles.primaryCareLabel, marginLeft: 10 }}>
                    {t("profile.qualification.cost")}
                  </MText>
                </MView>

                {data?.expired?.length > 0 ? (
                  data?.expired?.map((item, index) => {
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
                          {item?.name || "N/A"}
                        </MText>
                        <MText style={styles.primaryCareValue}>
                          {item?.acquired || "N/A"}
                        </MText>
                        <MText style={styles.primaryCareValue}>
                          {item?.expires || "N/A"}
                        </MText>
                        <MText style={styles.primaryCareValue}>
                          {item?.cost || 0}
                        </MText>
                      </MView>
                    );
                  })
                ) : (
                  <MText style={styles.emptyQualifications}>
                    {t("profile.qualification.no_expired_qualification")}
                  </MText>
                )}
              </MView>
            </MView>
          </>
        )}
      </ScrollView>
    </MLayout>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
    marginTop: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
    borderTopWidth: 2,
    borderTopColor: COLORS.PRIMARY,
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
    maxWidth: "25%", // Limit
  },
  primaryCareValue: {
    color: COLORS.BLACK,
    fontSize: 10,
    textAlign: "left",
    flex: 1,
    maxWidth: "25%", // Limit
  },
  tableContainer: {
    marginVertical: 20,
  },
  emptyQualifications: {
    textAlign: "center",
    color: COLORS.GREY,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
    textAlign: "center",
    marginBottom: 20,
  },
  textCenter: {
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
});
export default QualificationSummary;
