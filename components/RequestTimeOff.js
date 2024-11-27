import React, { useEffect, useState } from "react";
import {
  MButton,
  MDatePicker,
  MInput,
  MSelect,
  MText,
  MTouchable,
  MView,
} from "./MComponents";
import { ActivityIndicator, Card } from "react-native-paper";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import {
  get_timeoff_requests,
  get_timeoff_settings,
  get_timeoff_summary,
  submit_timeoff_request,
} from "../src/api";
import moment from "moment";
import { t } from "i18next";
import { DatePickerModal } from "react-native-paper-dates";
import { getAuthData, getItems, removeData } from "../src/store";
import MLayout from "./MLayout";

const RequestTimeOff = ({ navigation }) => {
  const [tab, setTab] = React.useState(0);
  const [auth, setAuth] = React.useState({});
  const [timeoffSettings, setTimeSettings] = useState({});
  const [timeoffSummary, setTimeOffSummary] = useState({});
  const [loaded, setLoaded] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [currentYearTime, setCurrentYearTime] = React.useState(null);
  const [requestData, setRequestData] = React.useState({
    timeoff_type: "",
    timeoff_hours: "",
    timeoff_note: "",
    timeoff_dates: [],
  });
  const [open, setOpen] = React.useState(false);
  const onSubmitTimeOffRequest = async () => {
    //  validate data
    if (
      requestData.timeoff_dates?.length === 0 ||
      !requestData.timeoff_type ||
      !requestData.timeoff_hours
    ) {
      Alert.alert(t("validation.error"), t("validation.all_required"));
      return;
    }
    try {
      setIsSubmitLoading(true);
      const data = Object.entries(requestData || {}).map(([key, value]) => ({
        name: key,
        value:
          key === "timeoff_dates"
            ? value?.map((date) => moment(date).format("MM/DD/YYYY"))?.join(",")
            : value,
      }));

      const response = await submit_timeoff_request(
        auth?.data?.profile_auth,
        auth?.cookie,
        data
      );
      if (response?.status === "success") {
        fetchData();
        Alert.alert("Success", "Time off request submitted successfully");
        setRequestData((prev) => ({
          ...prev,
          timeoff_type: "",
          timeoff_note: "",
          timeoff_dates: [],
        }));
      } else {
        Alert.alert("Error", "Time off request failed");
      }
    } catch (error) {
      console.log("🚀 ~ onSubmitTimeOffRequest ~ error:", error);
    } finally {
      setIsSubmitLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      const result = await get_timeoff_requests(
        auth?.data?.profile_auth,
        auth?.cookie
      );
      setCurrentYearTime(result?.data);
    } catch (error) {
      console.log("🚀 ~ fetchData ~ error:", error);
    } finally {
      setLoading(false);
    }
  };
  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback((params) => {
    setOpen(false);
    setRequestData((prev) => ({ ...prev, timeoff_dates: params?.dates }));
  }, []);
  useEffect(() => {
    if (auth) {
      fetchData();
    }
  }, [auth]);
  React.useEffect(() => {
    getAuthData(setAuth)
      .then(async (auth) => {
        setAuth(auth);
        if (auth && auth.data) {
          await getItems(auth, [
            {
              key: "time_off",
              stateHook: setTimeOffSummary,
              apiFallback: get_timeoff_summary,
            },
            {
              key: "time_settings",
              stateHook: setTimeSettings,
              apiFallback: get_timeoff_settings,
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
  const renderTab = () => {
    switch (tab) {
      case 0:
        return (
          <MView>
            <MText style={styles.label}>{t("timeoff.select_dates")}</MText>
            <DatePickerModal
              locale="en"
              mode="multiple"
              visible={open}
              onDismiss={onDismiss}
              dates={requestData?.timeoff_dates}
              onConfirm={onConfirm}
              inputFormat="YYYY-MM-DD"
            />
            <MTouchable
              onPress={() => setOpen(true)}
              style={{
                borderRadius: 6,
                borderWidth: 1,
                paddingVertical: 16,
                paddingHorizontal: 12,
                marginTop: 12,
              }}
              textStyle={{
                color: "black",
              }}
            >
              <MText
                style={{
                  fontSize: 16,
                }}
              >
                {requestData?.timeoff_dates?.length > 0
                  ? requestData?.timeoff_dates
                      ?.map((date) => moment(date)?.format("MM/DD/YYYY"))
                      ?.join(", ")?.length > 20
                    ? `${requestData?.timeoff_dates
                        ?.map((date) => moment(date)?.format("MM/DD/YYYY"))
                        ?.join(", ")
                        ?.slice(0, 40)}...`
                    : requestData?.timeoff_dates
                        ?.map((date) => moment(date)?.format("MM/DD/YYYY"))
                        ?.join(", ")
                  : t("timeoff.select_dates")}
              </MText>
            </MTouchable>

            <MText style={[styles.label, styles.select]}>
              {t("timeoff.type")}
            </MText>
            <MSelect
              value={requestData?.timeoff_type}
              setValue={(value) => {
                setRequestData((prev) => ({ ...prev, timeoff_type: value }));
              }}
              list={Object.entries(timeoffSettings?.days || {}).map(
                ([key, value]) => ({
                  label: value,
                  value: key,
                })
              )}
              mode="outlined"
              placeholder={"Select"}
            />
            <MText style={[styles.label, styles.select]}>
              {t("timeoff.hours")}
            </MText>

            <MSelect
              value={requestData?.timeoff_hours}
              setValue={(value) => {
                setRequestData((prev) => ({ ...prev, timeoff_hours: value }));
              }}
              list={Array(+timeoffSettings?.hours_in_day * 2 + 1 || 0)
                .fill(null)
                .map((_, index) => ({
                  label: (index / 2).toString(),
                  value: (index / 2).toString(),
                }))}
              mode="outlined"
              placeholder={"Select Hours"}
            />
            <MText style={[styles.label, styles.select]}>
              {t("timeoff.notes")}
            </MText>
            <MInput
              multiline
              mode="outlined"
              placeholder="Type Note"
              value={requestData?.timeoff_note}
              onChangeText={(text) => {
                setRequestData((prev) => ({ ...prev, timeoff_note: text }));
              }}
            />
            <MButton
              style={{
                ...styles.btn,
                marginTop: 10,
                backgroundColor: COLORS.PRIMARY,
              }}
              textStyle={styles.btnTxtStyle}
              onPress={isSubmitLoading ? undefined : onSubmitTimeOffRequest}
              loading={isSubmitLoading}
            >
              {t("timeoff.submit_request")}
            </MButton>
          </MView>
        );
      case 1:
        return (
          <MView>
            {timeoffSummary?.slice(1)?.map((item, index) => {
              return (
                <MView key={index}>
                  {item?.map((subIte, i) => {
                    if (i === 0) {
                      return (
                        <MText key={i} style={styles.label}>
                          {subIte}
                        </MText>
                      );
                    } else if (timeoffSummary?.[0]?.[i + 1]?.[1]) {
                      return (
                        <MView
                          key={i}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <MText style={styles.listItem}>
                            {timeoffSummary?.[0]?.[i + 1]?.[1]}:
                          </MText>
                          <MText style={styles.listItem}> {subIte || ""}</MText>
                        </MView>
                      );
                    }
                  })}
                  <MView
                    style={{
                      height: 1,
                      backgroundColor: COLORS.BLACK,
                      width: "80%",
                      marginVertical: 12,
                    }}
                  />
                </MView>
              );
            })}
          </MView>
        );
      case 2:
        return loading ? (
          <MView
            style={{
              marginVertical: 12,
            }}
          >
            <ActivityIndicator />
          </MView>
        ) : (
          <MView>
            {currentYearTime
              ?.sort((a, b) => {
                return moment(a?.timeoff_date, "YYYY-MM-DD")?.isBefore(
                  moment(b?.timeoff_date, "YYYY-MM-DD")
                )
                  ? 1
                  : -1;
              })
              ?.map((item, index) => {
                return (
                  <MView key={index}>
                    <MText style={styles.listItem}>
                      {t("timeoff.date")}: {item?.timeoff_date}
                    </MText>
                    <MText style={styles.listItem}>
                      {t("timeoff.type")}:{" "}
                      {item?.timeoff_type?.charAt(0)?.toUpperCase() +
                        item?.timeoff_type?.slice(1)}
                    </MText>
                    <MText style={styles.listItem}>
                      {t("timeoff.status")}: {item?.status}
                    </MText>
                    <MText style={styles.listItem}>
                      {t("timeoff.hours")}: {item?.timeoff_hours}
                    </MText>
                    <MText style={styles.listItem}>
                      {t("timeoff.notes")}:{" "}
                      {item?.timeoff_note?.trim() || "N/A"}
                    </MText>
                    <MView
                      style={{
                        height: 1,
                        backgroundColor: COLORS.BLACK,
                        width: "80%",
                        marginVertical: 12,
                      }}
                    />
                  </MView>
                );
              })}
          </MView>
        );
      default:
        break;
    }
  };
  let tabs = [
    t("timeoff.request"),
    t("timeoff.summary"),
    moment().year().toString(),
  ];
  return (
    <MLayout statusBarColor={COLORS.WHITE} isProfileHeader>
      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        style={{ flex: 1, paddingVertical: 12 }}
      >
        <MText style={styles.headerTitle}>
          {t("timeoff.request_time_off")}
        </MText>
        {loaded ? (
          <MView style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          </MView>
        ) : (
          <Card style={styles.card}>
            <MView style={styles.btnContainer}>
              {tabs.map((tabName, index) => (
                <MButton
                  key={index}
                  style={{
                    ...styles.btn,
                    backgroundColor:
                      tab === index ? COLORS.SECONDARY : COLORS.PRIMARY,
                  }}
                  onPress={() => setTab(index)}
                >
                  {tabName}
                </MButton>
              ))}
            </MView>
            <MView style={styles.renderTabContainer}>{renderTab()}</MView>
          </Card>
        )}
      </ScrollView>
    </MLayout>
  );
};
const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: "90%",
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 12,
    marginBottom: 30,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    borderRadius: 12,
  },
  renderTabContainer: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  select: {
    marginBottom: 10,
  },
  btnTxtStyle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  listItem: {
    fontSize: 16,
    fontWeight: "500",
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
export default RequestTimeOff;
