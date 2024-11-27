import React from "react";
import { Image, Linking, StyleSheet } from "react-native";
import { MButton, MText, MTouchable, MView } from "../MComponents";
import MLayout from "../MLayout";
import MScrollView from "../MComponents/MScrollView";
import { t } from "i18next";
import { COLORS, ROUTES } from "../../constants";

const EmployeeWellness = ({ navigation }) => {
  const wellnessImages = [
    require("../../assets/perk_images/onlineWellness/Program1.jpg"),
    require("../../assets/perk_images/onlineWellness/Program2.jpg"),
    require("../../assets/perk_images/onlineWellness/Program3.jpg"),
    require("../../assets/perk_images/onlineWellness/Program4.jpg"),
    require("../../assets/perk_images/onlineWellness/Program5.jpg"),
    require("../../assets/perk_images/onlineWellness/Program6.jpg"),
    require("../../assets/perk_images/onlineWellness/Program7.jpg"),
    require("../../assets/perk_images/onlineWellness/Program8.jpg"),
    require("../../assets/perk_images/onlineWellness/Program9.jpg"),
    require("../../assets/perk_images/onlineWellness/Program10.jpg"),
    require("../../assets/perk_images/onlineWellness/Program11.jpg"),
    require("../../assets/perk_images/onlineWellness/Program12.jpg"),
  ];
  const fitnessPoint = t("perks.employee_wellness.details.points", {
    returnObjects: true,
  });
  return (
    <MLayout
      headerTitle={t("perks.employee_wellness.details.title")}
      headerProps={{
        leftIcon: "chevron-left",
        leftIconOnPress: () => navigation.goBack(),
      }}
    >
      <MScrollView style={styles.scrollContainer}>
        <MText>{t("perks.employee_wellness.details.desc")}</MText>
        <MText style={styles.title}>
          {t("perks.employee_wellness.details.join")}
        </MText>
        <MView style={styles.cardContainer}>
          <Image
            source={require("../../assets/perk_images/onlineWellness/wellness.jpg")}
            style={styles.image}
          />
          <MView style={styles.horizontalRow} />
          <MText style={{ fontSize: 18 }}>
            {" "}
            {t("perks.employee_wellness.details.within")}
          </MText>
          <MText style={{ color: "gray" }}>
            {t("perks.employee_wellness.details.date")}
          </MText>
          <MText>{t("perks.employee_wellness.details.wellness_desc")}</MText>
        </MView>
        <MText style={styles.title}>
          {" "}
          {t("perks.employee_wellness.details.health_well")}
        </MText>
        <MText style={styles.mt_10}>
          {t("perks.employee_wellness.details.health_well_desc")}
        </MText>
        {wellnessImages.map((image, index) => {
          return (
            <MTouchable
              style={{ ...styles.cardContainer, paddingVertical: 0 }}
              key={index}
              onPress={() => navigation.navigate(ROUTES.CHALLENGES_STACK)}
            >
              <Image source={image} style={styles.image} />
            </MTouchable>
          );
        })}
        <MView
          style={{
            ...styles.cardContainer,
            borderTopWidth: 4,
            borderTopColor: COLORS.PRIMARY,
          }}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
          <MText style={styles.mt_10}>
            {t("perks.employee_wellness.details.join_fun")}{" "}
          </MText>
          <MButton
            mode="contained"
            style={styles.button}
            onPress={() =>
              Linking.openURL("https://exectras.totalhealthinteractive.com/")
            }
          >
            {t("perks.employee_wellness.details.access_well")}{" "}
          </MButton>
        </MView>
        <MText style={{ ...styles.mt_10, marginBottom: 12 }}>
          {t("perks.employee_wellness.details.well_member")}
        </MText>
        {fitnessPoint.map((list, index) => (
          <MView style={styles.listContainer} key={index}>
            <MView style={styles.bulletPoint} />
            <MText>{list}</MText>
          </MView>
        ))}

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
    fontWeight: "500",
    fontSize: 20,
    marginTop: 12,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
  },
  horizontalRow: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    height: 1,
    width: "100%",
    marginVertical: 12,
  },
  logo: {
    resizeMode: "contain",
    height: 50,
    width: "80%",
    alignSelf: "center",
  },
  mt_10: {
    marginTop: 10,
  },
  button: {
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY,
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
});

export default EmployeeWellness;
