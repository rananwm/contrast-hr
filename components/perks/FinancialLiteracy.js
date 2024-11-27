import React from "react";
import { StyleSheet, Linking, Image } from "react-native";
import MLayout from "../MLayout";
import MScrollView from "../MComponents/MScrollView";
import { MButton, MText, MView } from "../MComponents";
import { t } from "i18next";
import { COLORS } from "../../constants";

const FinancialLiteracy = ({ navigation }) => {
  const points = t("perks.financial_literacy_program.details.points", {
    returnObjects: true,
  });
  const workPoints = t("perks.financial_literacy_program.details.work_points", {
    returnObjects: true,
  });
  return (
    <MLayout
      headerTitle={t("perks.financial_literacy_program.title")}
      headerProps={{
        leftIcon: "chevron-left",
        leftIconOnPress: () => navigation.goBack(),
      }}
    >
      <MScrollView style={styles.scrollContainer}>
        <MText style={{ fontSize: 24, fontWeight: "500" }}>
          {t("perks.financial_literacy_program.details.title")}
        </MText>
        <MText style={[styles.mt_12]}>
          {t("perks.financial_literacy_program.details.subtitle")}
        </MText>
        <MText style={[styles.mt_12]}>
          {t("perks.financial_literacy_program.details.take_advantage")}
        </MText>
        <MText style={[styles.mt_12]}>
          {t("perks.financial_literacy_program.details.desc1")}
          {"\n\n"}
          {t("perks.financial_literacy_program.details.desc2")}
        </MText>
        <MView style={styles.cardContainer}>
          <Image
            source={require("../../assets/perk_images/logo-enrich.png")}
            style={styles.image}
          />
          <MText style={styles.subtitle}>
            {t("perks.auto_home_insurance.details.make_it_easy")}
          </MText>
          {workPoints.map((list, index) => (
            <MView
              style={[
                styles.listContainer,
                { gap: 4, alignItems: "flex-start", marginVertical: 4 },
              ]}
              key={index}
            >
              <MText>{index + 1}:</MText>
              <MText>{list}</MText>
            </MView>
          ))}
          <MButton
            style={styles.button}
            mode="contained"
            onPress={() => Linking.openURL("http://enrich.exectras.com/")}
          >
            {t("perks.financial_literacy_program.details.free_account")}
          </MButton>
        </MView>
        <MText style={[styles.mt_12, styles.subtitle]}>
          {t("perks.financial_literacy_program.details.desc3")}
        </MText>
        <MText>
          {t("perks.financial_literacy_program.details.process_start")}
        </MText>
        <MView style={styles.mt_12}>
          {points.map((list, index) => (
            <MView style={styles.listContainer} key={index}>
              <MView style={styles.bulletPoint} />
              <MText>{list}</MText>
            </MView>
          ))}
        </MView>
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
    padding: 20,
    backgroundColor: "white",
    flex: 1,
  },
  textBold: {
    fontWeight: "bold",
  },
  mt_12: {
    marginTop: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 12,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 6,
    color: "#fff",
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
  image: {
    width: "100%",
    resizeMode: "contain",
    height: 80,
    alignSelf: "center",
  },
  link: {
    color: COLORS.PRIMARY,
  },
});

export default FinancialLiteracy;
