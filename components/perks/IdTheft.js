import React from "react";
import { Image, Linking, StyleSheet } from "react-native";
import { MButton, MIcon, MText, MView } from "../MComponents";
import MLayout from "../MLayout";
import MScrollView from "../MComponents/MScrollView";
import { t } from "i18next";
import { handleCall } from "../../utils";
import { COLORS } from "../../constants";

const IdTheft = ({ navigation }) => {
  const points = t("perks.id_theft_resolution.details.points", {
    returnObjects: true,
  });
  const identityPoints = t("perks.id_theft_resolution.details.identityPoints", {
    returnObjects: true,
  });
  const workPoints = t("perks.id_theft_resolution.details.works_points", {
    returnObjects: true,
  });
  return (
    <MLayout
      headerTitle={t("perks.id_theft_resolution.title")}
      headerProps={{
        leftIcon: "chevron-left",
        leftIconOnPress: () => navigation.goBack(),
      }}
    >
      <MScrollView style={styles.scrollContainer}>
        <MText>
          {t("perks.id_theft_resolution.details.desc1")}
          {`\n\n`}
          {t("perks.id_theft_resolution.details.desc2")}
          {`\n\n`}
          {t("perks.id_theft_resolution.details.desc3")}
          {`\n\n`}
          {t("perks.id_theft_resolution.details.desc4")}
          {`\n\n`}
          {t("perks.id_theft_resolution.details.desc5")}
          {`\n\n`}
          {t("perks.id_theft_resolution.details.desc6")}

          {`\n`}
        </MText>
        {points.map((list, index) => (
          <MView style={styles.listContainer} key={index}>
            <MView style={styles.bulletPoint} />
            <MText>{list}</MText>
          </MView>
        ))}
        <MView style={styles.cardContainer}>
          <Image
            source={require("../../assets/perk_images/resolution.jpg")}
            style={styles.image}
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
            Call (877) 308-9169
          </MButton>
          <MButton
            mode="contained"
            style={styles.button}
            textStyle={{ ...styles.callBtnTxt, color: COLORS.WHITE }}
            onPress={() =>
              Linking.openURL(
                "https://v2.myexectras.com/docs/id-theft-resolution.pdf"
              )
            }
          >
            {t("perks.id_theft_resolution.details.program_detail")}
          </MButton>
        </MView>
        <MText style={styles.title}>
          {" "}
          {t("perks.id_theft_resolution.details.identity")}
        </MText>
        {identityPoints.map((list, index) => (
          <MView style={styles.listContainer} key={index}>
            <MView style={styles.bulletPoint} />
            <MText>{list}</MText>
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
  contactUsContainer: {
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  contactUs: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  image: {
    width: "100%",
    resizeMode: "contain",
    height: 80,
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
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 12,
  },
  horizontalRow: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    marginVertical: 12,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 6,
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

export default IdTheft;
