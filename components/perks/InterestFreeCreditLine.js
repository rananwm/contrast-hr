import React from "react";
import { Image, Linking, StyleSheet } from "react-native";
import { MButton, MText, MView } from "../MComponents";
import MLayout from "../MLayout";
import MScrollView from "../MComponents/MScrollView";
import { t } from "i18next";
import { COLORS } from "../../constants";

const InterestFreeCreditLine = ({ navigation }) => {
  const creditPoints = t(
    "perks.interest_free_credit_line.details.credit_points",
    {
      returnObjects: true,
    }
  );
  const eligibilityPoints = t(
    "perks.interest_free_credit_line.details.points",
    {
      returnObjects: true,
    }
  );
  return (
    <MLayout
      headerTitle={t("perks.interest_free_credit_line.title")}
      headerProps={{
        leftIcon: "chevron-left",
        leftIconOnPress: () => navigation.goBack(),
      }}
    >
      <MScrollView style={styles.scrollContainer}>
        <MText style={styles.title}>
          {t("perks.interest_free_credit_line.details.title")}
        </MText>
        <MView style={styles.cardContainer}>
          <Image
            source={require("../../assets/perk_images/zebit-logo.png")}
            style={styles.image}
          />
          <MText style={styles.subtitle}>
            {t("perks.auto_home_insurance.details.make_it_easy")}
          </MText>

          {creditPoints.map((list, index) => (
            <MView style={styles.listContainer} key={index}>
              <MText style={{ marginVertical: 5 }}>
                {index + 1}: {list}
              </MText>
            </MView>
          ))}
          <MButton
            mode="contained"
            textStyle={{
              fontSize: 16,
            }}
            style={styles.button}
            onPress={() => Linking.openURL("http://zebit.exectras.com/")}
          >
            {t("perks.interest_free_credit_line.details.join_zebit")}
          </MButton>
        </MView>
        <MText style={{ marginTop: 10 }}>
          {t("perks.interest_free_credit_line.details.subtitle")}
        </MText>
        <MText style={[styles.mt_12]}>
          {t("perks.interest_free_credit_line.details.desc1")}
        </MText>
        <MText style={styles.mt_12}>
          {t("perks.interest_free_credit_line.details.desc2")}
          {"\n\n"} {t("perks.interest_free_credit_line.details.desc3")}
        </MText>
        <MText style={[styles.mt_12, styles.subtitle]}>
          {t("perks.interest_free_credit_line.details.eligible")}{" "}
        </MText>
        <MView style={styles.mt_12}>
          {eligibilityPoints.map((list, index) => (
            <MView style={styles.listContainer} key={index}>
              <MText>{index + 1}:</MText>
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
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  mt_12: {
    marginTop: 12,
  },
  boldTxt: {
    fontWeight: "bold",
  },
  listContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 2,
    marginVertical: 1,
  },
  bulletPoint: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: "#000",
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
  image: {
    width: "100%",
    resizeMode: "contain",
    height: 80,
    marginBottom: 10,
  },
  link: {
    color: COLORS.PRIMARY,
  },
});

export default InterestFreeCreditLine;
