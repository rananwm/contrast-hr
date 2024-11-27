import { ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../constants";
import { MIcon, MText, MView } from "./MComponents";
import { t } from "i18next";
import { BarChart } from "react-native-gifted-charts";
import { get_compensation_summary } from "../src/api";
import { getAuthData, getItems, removeData } from "../src/store";
import MLayout from "./MLayout";
import { ActivityIndicator } from "react-native-paper";

const CompensationSummary = ({ navigation }) => {
  const [auth, setAuth] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [data, setData] = useState({});
  useEffect(() => {
    getAuthData(setAuth).then(async (auth) => {
      setAuth(auth);
      if (auth && auth.data) {
        await getItems(auth, [
          {
            key: "profile_compensation_get",
            stateHook: setData,
            apiFallback: get_compensation_summary,
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
  const { width } = useWindowDimensions();

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
              {t("profile.summary.compensation_summary")}
            </MText>

            <MText style={styles.title}>
              {t("profile.summary.annual_salary")}
            </MText>

            {data?.compensation_summary?.years ? (
              <BarChart
                isAnimated
                barStyle={{
                  paddingTop: 10,
                }}
                data={Object.entries(
                  data?.compensation_summary?.years || {}
                ).map(([key, value]) => {
                  return {
                    value,
                    label: key,
                  };
                })}
                barWidth={
                  (width * 0.5) /
                  Object.entries(data?.compensation_summary?.years || {})
                    ?.length
                }
                frontColor={COLORS.PRIMARY}
                backColor={COLORS.SECONDARY}
                yAxisTextStyle={{
                  fontSize: 8,
                }}
              />
            ) : (
              <MText style={styles.textCenter}>N/A</MText>
            )}
            <MText style={styles.title}>
              {t("profile.summary.earning_to_date")}
            </MText>
            {data?.compensation_summary?.years ? (
              <BarChart
                isAnimated
                barStyle={{
                  paddingTop: 10,
                }}
                data={Object.entries(data?.compensation_summary?.years || {})
                  .reduce((acc, [year, value]) => {
                    const previousSum =
                      acc?.length > 0 ? acc?.[acc?.length - 1]?.value : 0;
                    acc?.push({
                      label: year,
                      value: previousSum + +value,
                    });
                    return acc;
                  }, [])
                  .map((item) => {
                    return {
                      value: item?.value,
                      label: item?.label,
                      topLabelComponentHeight: 20,
                    };
                  })}
                barWidth={
                  (width * 0.5) /
                  Object.entries(data?.compensation_summary?.years || {})
                    ?.length
                }
                frontColor={COLORS.PRIMARY}
                backColor={COLORS.SECONDARY}
                yAxisTextStyle={{
                  fontSize: 8,
                }}
              />
            ) : (
              <MText style={styles.textCenter}>N/A</MText>
            )}
            <MView style={styles.tableContainer}>
              <MView style={styles.primaryCareHeader}>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.year")}
                </MText>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.salary")}
                </MText>
                <MText style={{ ...styles.primaryCareLabel, marginLeft: 10 }}>
                  <MIcon source="triangle-outline" color={COLORS.WHITE} />
                </MText>
                <MText style={{ ...styles.primaryCareLabel, marginLeft: 10 }}>
                  <MIcon source="triangle-outline" color={COLORS.WHITE} />%
                </MText>
                <MText style={styles.primaryCareLabel}>
                  {t("profile.summary.earnings")}
                </MText>
              </MView>

              {Object.entries(data?.compensation_summary?.years || {})
                ?.reduce((acc, [year, value]) => {
                  const previousSum =
                    acc?.length > 0 ? acc?.[acc?.length - 1]?.value : 0;
                  const previousTotal =
                    acc?.length > 0 ? acc?.[acc?.length - 1]?.total : 0;
                  acc?.push({
                    label: year,
                    value: +value,
                    total: previousTotal + +value,
                    improvement_in_percent: previousSum
                      ? ((+value - previousSum) / previousSum) * 100
                      : 0,
                    difference_from_previous: previousSum
                      ? +value - previousSum
                      : 0,
                  });
                  return acc;
                }, [])
                .map((item, index) => {
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
                        {item?.label}
                      </MText>
                      <MText style={styles.primaryCareValue}>
                        ${item?.value?.toFixed(1) || "N/A"}
                      </MText>
                      <MText style={styles.primaryCareValue}>
                        ${item?.difference_from_previous?.toFixed(1) || "N/A"}
                      </MText>
                      <MText style={styles.primaryCareValue}>
                        {item?.improvement_in_percent?.toFixed(1) || "N/A"}%
                      </MText>
                      <MText style={styles.primaryCareValue}>
                        ${item?.total?.toFixed(1) || "N/A"}
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
    marginVertical: 20,
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
export default CompensationSummary;
