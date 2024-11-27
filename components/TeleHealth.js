import { View, Text, Alert, Linking, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { MButton, MText, MTouchable, MView } from "./MComponents";
import { COLORS, TELE_HEALTH_PLAN_NAME } from "../constants";
import { getAuthData } from "../src/store";
import {
  get_telehealth_status,
  start_telehealth,
  start_telehealth_session,
} from "../src/api";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import moment from "moment";
import { ActivityIndicator } from "react-native-paper";

const TeleHealth = () => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [telehealthResult, setTelehealthResult] = useState(null);
  const getTeleHealthStatus = async () => {
    try {
      setLoading(true);
      const auth = await getAuthData(setAuth);
      setAuth(auth);
      if (auth) {
        const result = await get_telehealth_status(
          auth.data.profile_auth,
          auth.cookie
        );
        setTelehealthResult(result);
      }
    } catch (error) {
      console.log("🚀 ~ getTeleHealthStatus ~ error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getTeleHealthStatus();
  }, []);
  const startTeleHealthSession = async () => {
    try {
      const response = await start_telehealth_session(
        auth.data.profile_auth,
        auth.cookie
      );
      if (response?.data) {
        Linking.openURL(response?.data);
      }
    } catch (error) {}
  };
  const getStarted = async () => {
    try {
      if (telehealthResult?.status === "missing") {
        Alert.alert(
          "Missing",
          `Missing the requried fields ${telehealthResult?.data.join(", ")}.` +
            " Please update your profile",
          [
            {
              text: "Later",
              onPress: () => console.log("Cancel Pressed"),
              style: "destructive",
            },
            {
              text: "Update Profile",
              onPress: () => navigation.navigate(ROUTES.PROFILE),
              style: "default",
            },
          ]
        );
        return;
      }
      const response = await start_telehealth(
        auth.data.profile_auth,
        auth.cookie
      );
      if (response?.status === "success") {
        Alert.alert(
          "Success",
          "You have successfully started the telehealth service.",
          [
            {
              text: "OK",
              onPress: () => console.log("Cancel Pressed"),
              style: "default",
            },
          ]
        );
        getTeleHealthStatus();
      } else {
        Alert.alert(
          "Error",
          "There was an error starting the telehealth service. Please try again later.",
          [
            {
              text: "OK",
              onPress: () => console.log("Cancel Pressed"),
              style: "default",
            },
          ]
        );
      }
    } catch (error) {
      console.log("🚀 ~ getStarted ~ error:", error);
    }
  };
  const points = t("telehealth.points", {
    returnObjects: true,
  });
  console.log("telehealthResult?.status", telehealthResult?.status);
  return loading ? (
    <MView style={{ ...styles.tableContainer, justifyContent: "center" }}>
      <ActivityIndicator size="small" color={COLORS.PRIMARY} />
    </MView>
  ) : (
    <View style={styles.cardContainer}>
      <Image
        style={styles.image}
        source={require("../assets/perk_images/virtualCare/telehealth-walmart.png")}
      />
      {telehealthResult?.status === "missing" ||
      telehealthResult?.status === "ready" ? (
        <MView style={styles.tableContainer}>
          <MText style={{ fontWeight: "bold", marginBottom: 10 }}>
            {t("telehealth.pre_enrolled")}
          </MText>
          {points.map((point, index) => (
            <MView key={index} style={{ flexDirection: "row", gap: 2 }}>
              <MText>{index + 1}:</MText>
              <MText> {point}</MText>
            </MView>
          ))}
          <MButton
            mode="contained"
            style={{
              width: "100%",
              borderRadius: 5,
              backgroundColor: COLORS.PRIMARY,
              marginVertical: 10,
            }}
            onPress={getStarted}
          >
            {t("telehealth.get_started")}
          </MButton>
          <MText
            style={{
              fontSize: 12,
            }}
          >
            {t("telehealth.by_clicking_started")}{" "}
            <MText style={{ color: COLORS.PRIMARY }}>
              {t("telehealth.terms")}
            </MText>{" "}
            {t("telehealth.and")}
            <MText style={{ color: COLORS.PRIMARY }}>
              {t("telehealth.privacy_policy")}.
            </MText>
          </MText>
        </MView>
      ) : telehealthResult?.status === "subscriber" &&
        telehealthResult?.data?.message ? (
        <MView style={styles.tableContainer}>
          <MText style={{ fontSize: 20, marginBottom: 12 }}>
            {t("telehealth.whvc")}
          </MText>
          <MText>{t("telehealth.listed_below")}</MText>
          <MView
            style={{
              width: "100%",
              height: 1,
              backgroundColor: COLORS.DARK_GREY,
              marginVertical: 10,
            }}
          />
          <MText style={{ fontWeight: "bold" }}>
            {t("telehealth.look_like_already_account")}
          </MText>
          <MText>{t("telehealth.account_under_exectras")}</MText>
          <MButton
            onPress={() => Linking.openURL("https://patient.memd.me/auth")}
            textStyle={{
              color: COLORS.BLACK,
            }}
            style={[styles.button, { backgroundColor: COLORS.LIGHTER_GREY }]}
          >
            {t("telehealth.login_whvc")}
          </MButton>
        </MView>
      ) : telehealthResult?.status === "subscriber" ? (
        <MView>
          <MText style={{ fontSize: 20, marginBottom: 12 }}>
            {t("telehealth.whvc")}
          </MText>
          <MText>
            <MText>{t("telehealth.listed_below")}</MText>
          </MText>
          <MView style={styles.tableContainer}>
            <MView style={styles.primaryCareHeader}>
              <MText style={styles.primaryCareLabel}>
                {t("telehealth.plan")}
              </MText>
              <MText style={styles.primaryCareLabel}>
                {t("telehealth.benefit_start")}
              </MText>
              <MText style={styles.primaryCareLabel}>
                {t("telehealth.benefit_end")}
              </MText>
              <MText style={styles.primaryCareLabel}>
                {t("telehealth.active")}
              </MText>
              <MText style={styles.primaryCareLabel}>
                {t("telehealth.visit_fee")}
              </MText>
              <MText style={styles.primaryCareLabel}></MText>
            </MView>

            {telehealthResult?.data?.policies?.map((policy, index) => {
              return (
                <MView style={styles.primaryCareHeader} key={index}>
                  <MText style={styles.primaryCareValue}>
                    {TELE_HEALTH_PLAN_NAME?.[policy?.plancode] || "N/A"}
                  </MText>
                  <MText style={styles.primaryCareValue}>
                    {policy?.benefitstart
                      ? moment(policy?.benefitstart).format("ll")
                      : "N/A"}
                  </MText>
                  <MText style={styles.primaryCareValue}>
                    {policy?.benefitend
                      ? moment(policy?.benefitend).format("ll")
                      : "N/A"}
                  </MText>
                  <MText style={styles.primaryCareValue}>
                    {policy?.isactive
                      ? t("telehealth.yes")
                      : t("telehealth.no")}
                  </MText>
                  <MText style={styles.primaryCareValue}>
                    {policy?.copay || "N/A"}
                  </MText>
                  {policy?.isactive ? (
                    <MTouchable style={styles.btn}>
                      <MText style={styles.btnTxt}>
                        {t("telehealth.cancel_plan")}
                      </MText>
                    </MTouchable>
                  ) : (
                    <MView style={{ width: 45 }} />
                  )}
                </MView>
              );
            })}
            <MButton
              style={styles.teleHealthBtn}
              onPress={startTeleHealthSession}
            >
              {t("telehealth.start_telehealth")}
            </MButton>
          </MView>
        </MView>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  primaryCareHeader: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between", // Ensures even spacing between columns
  },
  primaryCareLabel: {
    color: COLORS.BLACK,
    fontWeight: "bold",
    fontSize: 12,
    flex: 1,
    maxWidth: "16.6%", // Limit
  },
  primaryCareValue: {
    color: COLORS.BLACK,
    fontSize: 12,
    textAlign: "left",
    flex: 1,
    maxWidth: "16.6%", // Limit
  },
  btn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    width: 45,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 2,
  },
  btnTxt: {
    fontSize: 10,
    color: COLORS.WHITE,
    textAlign: "center",
  },
  tableContainer: {},
  teleHealthBtn: {
    backgroundColor: COLORS.LIGHT_RED,
    borderRadius: 6,
    marginTop: 12,
  },
  cardContainer: {
    borderWidth: 1,
    borderTopColor: COLORS.PRIMARY,
    borderTopWidth: 2,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    backgroundColor: COLORS.WHITE,
  },
  image: {
    width: "100%",
    resizeMode: "contain",
    height: 80,
    marginVertical: 10,
    alignSelf: "center",
  },
});
export default TeleHealth;
