import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React from "react";
import MLayout from "../MLayout";
import MScrollView from "../MComponents/MScrollView";
import { MButton, MText, MView } from "../MComponents";
import { t } from "i18next";
import { formattedText } from "../../utils";
import i18n from "../../localization/localization";
import { COLORS } from "../../constants";

const PerceptionSaving = ({ navigation }) => {
  const workPoints = t("perks.prescription_savings.details.work_points", {
    returnObjects: true,
  });
  return (
    <MLayout
      headerTitle={t("perks.prescription_savings.title")}
      headerProps={{
        leftIcon: "chevron-left",
        leftIconOnPress: () => navigation.goBack(),
      }}
    >
      <MScrollView style={styles.container}>
        <MText style={styles.description}>
          {t("perks.prescription_savings.details.desc2")}{" "}
        </MText>
        <MText>
          {formattedText(t("perks.prescription_savings.details.desc3"))}
        </MText>
        <MView style={styles.cardContainer}>
          <Image
            source={require("../../assets/perk_images/percriptionSavings/rxless.png")}
            style={styles.image}
          />
          <MText style={styles.listTitle}>
            {t("perks.prescription_savings.details.how_works")}
          </MText>
          {workPoints.map((item, index) => (
            <MText key={index} style={{ marginTop: 10 }}>
              {index + 1}. {item}
            </MText>
          ))}
          <MText style={styles.listTitle}>
            {t("perks.prescription_savings.details.ready_to_start")}
          </MText>
          <MButton style={{ ...styles.button, width: "90%" }}>
            {t("perks.prescription_savings.details.get_started")}
          </MButton>
        </MView>

        <MView>
          <Image
            source={require("../../assets/perk_images/percriptionSavings/step1.png")}
            style={styles.stepImage}
          />
          <MText style={styles.stepTitle}>
            {t("perks.prescription_savings.details.step1_title")}
          </MText>
          <MText style={styles.stepDesc}>
            {t("perks.prescription_savings.details.step1_desc")}
          </MText>
          <Image
            source={require("../../assets/perk_images/percriptionSavings/step2.png")}
            style={styles.stepImage}
          />
          <MText style={styles.stepTitle}>
            {t("perks.prescription_savings.details.step2_title")}
          </MText>
          <MText style={styles.stepDesc}>
            {t("perks.prescription_savings.details.step2_desc")}
          </MText>
          <Image
            source={require("../../assets/perk_images/percriptionSavings/step3.png")}
            style={styles.stepImage}
          />
          <MText style={styles.stepTitle}>
            {t("perks.prescription_savings.details.step3_title")}
          </MText>
          <MText style={styles.stepDesc}>
            {t("perks.prescription_savings.details.step3_desc")}
          </MText>
        </MView>
        <MView style={styles.separator} />
        <MText>
          {formattedText(t("perks.prescription_savings.details.desc4"))}
          {"\n"}
          {"\n"} {formattedText(t("perks.prescription_savings.details.desc5"))}
          {"\n"}
          {"\n"} {formattedText(t("perks.prescription_savings.details.desc6"))}
          <MView
            style={{
              paddingTop: 10,
            }}
          >
            <MButton
              style={styles.button}
              onPress={() =>
                Linking.openURL("https://www.rxless.com/terms-conditions")
              }
            >
              <MText
                style={{
                  color: COLORS.WHITE,
                }}
              >
                {t("perks.prescription_savings.details.full_terms")}
              </MText>
            </MButton>
          </MView>
        </MText>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  description: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 12,
  },
  bold: {
    fontWeight: "800",
  },
  image: {
    width: "80%",
    resizeMode: "contain",
    alignSelf: "center",
    height: 80,
  },
  stepImage: {
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center",
    height: 160,
    marginTop: 20,
  },
  link: {
    color: "#232C65",
  },
  qrCode: {
    alignSelf: "center",
    marginTop: 20,
  },
  stepsLabel: {
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 12,
  },
  button: {
    alignSelf: "center",
    width: Dimensions.get("window").width - 40,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
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
  listTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 10,
  },
  stepTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  stepDesc: {
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.GREY,
    marginVertical: 10,
  },
});
export default PerceptionSaving;
