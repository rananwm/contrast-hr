import React from "react";
import { MView, MText, MButton } from "../MComponents";
import MLayout from "../MLayout";
import { t } from "i18next";
import { Image, Linking, StyleSheet } from "react-native";
import MScrollView from "../MComponents/MScrollView";
import { COLORS } from "../../constants";

const VoluntaryBenefits = ({ navigation }) => {
  const solutions = t("perks.voluntary_benefits.details.solutions", {
    returnObjects: true,
  });
  const points = t("perks.voluntary_benefits.details.points", {
    returnObjects: true,
  });
  return (
    <MLayout
      headerTitle={t("perks.voluntary_benefits.title")}
      headerProps={{
        leftIcon: "chevron-left",
        leftIconOnPress: () => navigation.goBack(),
      }}
    >
      <MScrollView style={styles.scrollContainer}>
        <MText>{t("perks.voluntary_benefits.details.desc")}</MText>
        <MView style={styles.cardContainer}>
          <Image
            source={require("../../assets/perk_images/volunteer/koru-logo.jpg")}
            style={styles.img}
          />
          <MText style={styles.subtitle}>
            {t("perks.auto_home_insurance.details.make_it_easy")}
          </MText>
          {points.map((list, index) => (
            <MView style={styles.listContainer} key={index}>
              <MText>{index + 1}:</MText>
              <MText>{list}</MText>
            </MView>
          ))}
          <MButton
            mode="outlined"
            style={styles.callBtn}
            textStyle={styles.callBtnTxt}
          >
            Call (949) 538-5161
          </MButton>
          <MButton
            mode="contained"
            style={styles.button}
            textStyle={{ ...styles.callBtnTxt, color: COLORS.WHITE }}
            onPress={() =>
              Linking.openURL(
                "https://www.korurm.com/exectras-voluntary-benefits"
              )
            }
          >
            {t("perks.voluntary_benefits.details.button")}{" "}
          </MButton>
        </MView>
        <MText style={styles.title}>
          {t("perks.voluntary_benefits.details.solution_title")}:
        </MText>
        {solutions.map((solution, index) => (
          <MView key={index}>
            <MText style={styles.solutionLabel}>
              {solution.title}:{" "}
              <MText style={styles.solutionDesc}>{solution.desc}</MText>
            </MText>
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
    padding: 20,
    backgroundColor: "white",
    flex: 1,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 6,
    color: "#fff",
  },
  title: {
    fontSize: 22,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  solutionLabel: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
  solutionDesc: {
    fontSize: 14,
  },
  imgContainer: {
    borderWidth: 1,
    borderColor: "#c2c1c2",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  img: {
    width: "100%",
    resizeMode: "contain",
  },
  buttonTxt: {
    fontSize: 16,
    fontWeight: "600",
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
    alignSelf: "flex-start",
    gap: 2,
    marginVertical: 1,
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

export default VoluntaryBenefits;
