import { View, Text, StyleSheet, Image, Linking } from "react-native";
import React from "react";
import { MButton, MText, MTouchable, MView } from "../MComponents";
import MLayout from "../MLayout";
import MScrollView from "../MComponents/MScrollView";
import { t } from "i18next";
import { handleCall } from "../../utils";
import { COLORS } from "../../constants";

const AutoHomeInsurance = ({ navigation }) => {
  const points = t("perks.auto_home_insurance.details.points", {
    returnObjects: true,
  });
  const workPoints = t("perks.auto_home_insurance.details.work_points", {
    returnObjects: true,
  });
  return (
    <MLayout
      headerTitle={t("perks.auto_home_insurance.details.title")}
      headerProps={{
        leftIcon: "chevron-left",
        leftIconOnPress: () => navigation.goBack(),
      }}
    >
      <MScrollView style={styles.scrollContainer}>
        <MText style={styles.title}>
          {t("perks.auto_home_insurance.details.save_time")}
        </MText>
        <MText style={styles.mt_10}>
          {t("perks.auto_home_insurance.details.save_time1")}
        </MText>
        <MView style={styles.cardContainer}>
          <Image
            source={require("../../assets/perk_images/autoHome/member-options.png")}
            style={{ ...styles.images, borderWidth: 0, marginBottom: 20 }}
          />
          <MText style={styles.title}>
            {t("perks.auto_home_insurance.details.make_it_easy")}
          </MText>
          {workPoints.map((item, index) => (
            <MText key={index} style={{ marginTop: 10 }}>
              {index + 1}. {item}
            </MText>
          ))}
          <MButton
            mode="outlined"
            style={styles.callBtn}
            textStyle={styles.callBtnTxt}
          >
            Call (833) 378-8224
          </MButton>
          <MButton
            mode="contained"
            style={styles.button}
            onPress={() =>
              Linking.openURL("https://member-options.com/exectras")
            }
          >
            {t("perks.auto_home_insurance.details.go_online")}
          </MButton>
        </MView>
        <Image
          source={require("../../assets/perk_images/autoHome/auto-options.png")}
          style={styles.images}
        />
        <MText style={styles.title}>
          {" "}
          {t("perks.auto_home_insurance.details.switch_carries")}
        </MText>
        <MText style={styles.mt_10}>
          {t("perks.auto_home_insurance.details.help_switch")}
        </MText>
        <MText style={{ ...styles.mt_10, marginBottom: 10 }}>
          {t("perks.auto_home_insurance.details.lets_help")}
        </MText>
        {points.map((item, index) => (
          <MView key={index} style={styles.listContainer}>
            <MView style={styles.bulletPoint} />
            <MText>{item}</MText>
          </MView>
        ))}
        <MText
          style={{ textAlign: "center", marginVertical: 12 }}
          onPress={() => Linking.openURL("mailto:support@exectras.com")}
        >
          {t("perks.prescription_savings.details.contact")}{" "}
          <MText style={styles.link}>support@exectras.com</MText>
        </MText>
        <MView style={{ height: 30 }} />
      </MScrollView>
    </MLayout>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  mt_10: {
    marginTop: 10,
  },
  images: {
    width: "100%",
    resizeMode: "contain",
    height: 110,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    borderRadius: 6,
    marginVertical: 10,
  },

  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 10,
  },
  bulletPoint: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: "#000",
  },
  cardContainer: {
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderTopColor: COLORS.PRIMARY,
    borderTopWidth: 3,
    borderWidth: 1,
    borderRadius: 6,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 2,
  },
  callBtnTxt: {
    color: COLORS.PRIMARY,
    fontSize: 16,
  },
  callBtn: {
    borderRadius: 8,
    marginTop: 12,
  },
  link: {
    color: COLORS.PRIMARY,
  },
});

export default AutoHomeInsurance;
